import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '@/lib/api/cart'
import { useCartStore } from '@/lib/stores/cart'
import { cartKeys } from '@/lib/query-keys'
import type { AddToCartInput, Cart, CartResponse } from '@/lib/types'

// ─── Fetch cart ───────────────────────────────────────────────────────────────

export function useCart() {
  const sessionId = useCartStore((s) => s.sessionId)

  return useQuery({
    queryKey: cartKeys.session(sessionId ?? ''),
    queryFn: () => getCart(sessionId!),
    enabled: !!sessionId,
    select: (data) => data.cart,
    retry: false,
  })
}

// ─── Add to cart ──────────────────────────────────────────────────────────────
// First add → POST /cart (server creates session)
// Subsequent adds → PATCH /cart/:sessionId/item/:productId (increment qty)

export function useAddToCart() {
  const queryClient = useQueryClient()
  const sessionId = useCartStore((s) => s.sessionId)
  const setSessionId = useCartStore((s) => s.setSessionId)

  return useMutation({
    mutationFn: async ({ productId, quantity }: AddToCartInput) => {
      if (!sessionId) {
        return addToCart({ productId, quantity })
      }

      // Get current cart from cache to know existing qty
      const cached = queryClient.getQueryData<CartResponse>(
        cartKeys.session(sessionId),
      )
      const existing = cached?.cart?.items?.find(
        (item) => item.product._id === productId,
      )
      const newQty = existing ? existing.quantity + quantity : quantity

      return updateCartItem(sessionId, productId, newQty)
    },
    onSuccess: (data) => {
      // First-time add returns sessionId — persist it
      if (data.sessionId) {
        setSessionId(data.sessionId)
      }
      const id = data.sessionId ?? sessionId
      if (id) {
        queryClient.setQueryData(cartKeys.session(id), data)
      }
    },
  })
}

// ─── Update item quantity ─────────────────────────────────────────────────────

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  const sessionId = useCartStore((s) => s.sessionId)

  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string
      quantity: number
    }) => updateCartItem(sessionId!, productId, quantity),
    onSuccess: (data) => {
      if (sessionId) {
        queryClient.setQueryData(cartKeys.session(sessionId), data)
      }
    },
  })
}

// ─── Remove item ──────────────────────────────────────────────────────────────

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  const sessionId = useCartStore((s) => s.sessionId)

  return useMutation({
    mutationFn: (productId: string) => removeCartItem(sessionId!, productId),
    onSuccess: (data) => {
      if (sessionId) {
        queryClient.setQueryData(cartKeys.session(sessionId), data)
      }
    },
  })
}

// ─── Clear cart ───────────────────────────────────────────────────────────────

export function useClearCart() {
  const queryClient = useQueryClient()
  const sessionId = useCartStore((s) => s.sessionId)
  const clearSessionId = useCartStore((s) => s.clearSessionId)

  return useMutation({
    mutationFn: () => clearCart(sessionId!),
    onSuccess: () => {
      if (sessionId) {
        queryClient.removeQueries({ queryKey: cartKeys.session(sessionId) })
      }
      clearSessionId()
    },
  })
}

// ─── Cart count (for navbar badge) ───────────────────────────────────────────

export function useCartCount(): number {
  const { data: cart } = useCart()
  return (cart as Cart | undefined)?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}

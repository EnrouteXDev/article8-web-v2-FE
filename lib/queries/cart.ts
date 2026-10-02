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
import type { AddToCartInput, Cart } from '@/lib/types'

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
// POST /cart — the server creates the session on the first add and reuses it
// when sessionId is sent. A product + size that is already in the cart has its
// quantity incremented; a different size becomes its own cart line.

export function useAddToCart() {
  const queryClient = useQueryClient()
  const sessionId = useCartStore((s) => s.sessionId)
  const setSessionId = useCartStore((s) => s.setSessionId)

  return useMutation({
    mutationFn: ({ productId, quantity, size }: Omit<AddToCartInput, 'sessionId'>) =>
      addToCart({ productId, quantity, size, sessionId: sessionId ?? undefined }),
    onSuccess: (data) => {
      // The add response returns sessionId — persist it
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
// Lines are addressed by cart item _id, since one product can be in the cart
// in several sizes.

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  const sessionId = useCartStore((s) => s.sessionId)

  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string
      quantity: number
    }) => updateCartItem(sessionId!, itemId, quantity),
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
    mutationFn: (itemId: string) => removeCartItem(sessionId!, itemId),
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

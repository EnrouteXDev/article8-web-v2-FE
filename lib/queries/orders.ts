import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrder, getOrderTracking, getOrderDashboard, cancelOrder } from '@/lib/api/orders'
import { orderKeys } from '@/lib/query-keys'
import type { CancelOrderInput, OrderFilters } from '@/lib/types'

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: orderKeys.list(filters ?? {}),
    queryFn: () => getOrders(filters),
  })
}

export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderNumber),
    queryFn: () => getOrder(orderNumber),
    enabled: !!orderNumber,
    select: (data) => data.order,
  })
}

export function useOrderTracking(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.tracking(orderNumber),
    queryFn: () => getOrderTracking(orderNumber),
    enabled: !!orderNumber,
    // Refresh tracking every 2 minutes when panel is open
    refetchInterval: 2 * 60 * 1000,
  })
}

export function useOrderDashboard(page?: number, limit?: number) {
  return useQuery({
    queryKey: orderKeys.dashboard(page, limit),
    queryFn: () => getOrderDashboard(page, limit),
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderNumber, data }: { orderNumber: string; data: CancelOrderInput }) =>
      cancelOrder(orderNumber, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
    },
  })
}

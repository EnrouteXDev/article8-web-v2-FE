import { useQuery } from '@tanstack/react-query'
import { getOrders, getOrder, getOrderTracking } from '@/lib/api/orders'
import { orderKeys } from '@/lib/query-keys'
import type { OrderFilters } from '@/lib/types'

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

import type { CategoryFilters, OrderFilters, ProductFilters } from '@/lib/types'

export const cartKeys = {
  all: ['cart'] as const,
  session: (sessionId: string) => [...cartKeys.all, sessionId] as const,
}

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: CategoryFilters) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

export const policyKeys = {
  all: ['policy'] as const,
}

export const supportKeys = {
  all: ['support-tickets'] as const,
  lists: () => [...supportKeys.all, 'list'] as const,
  list: (status?: string, page?: number, limit?: number) =>
    [...supportKeys.lists(), status, page, limit] as const,
}

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (orderNumber: string) => [...orderKeys.details(), orderNumber] as const,
  tracking: (orderNumber: string) => [...orderKeys.all, 'tracking', orderNumber] as const,
  dashboard: (page?: number, limit?: number) => [...orderKeys.all, 'dashboard', page, limit] as const,
}

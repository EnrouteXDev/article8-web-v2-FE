import { client } from './client'
import type {
  OrderFilters,
  OrderResponse,
  OrdersResponse,
  OrderTrackingResponse,
} from '@/lib/types'

export async function getOrders(filters?: OrderFilters): Promise<OrdersResponse> {
  const response = await client.get<OrdersResponse>('/order', { params: filters })
  return response.data
}

export async function getOrder(orderNumber: string): Promise<OrderResponse> {
  const response = await client.get<OrderResponse>(`/order/${orderNumber}`)
  return response.data
}

export async function getOrderTracking(orderNumber: string): Promise<OrderTrackingResponse> {
  const response = await client.get<OrderTrackingResponse>(`/order/${orderNumber}/tracking`)
  return response.data
}

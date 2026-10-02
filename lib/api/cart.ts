import { client } from './client'
import type { AddToCartInput, CartResponse } from '@/lib/types'

export async function addToCart(data: AddToCartInput): Promise<CartResponse> {
  const response = await client.post<CartResponse>('/cart', data)
  return response.data
}

export async function getCart(sessionId: string): Promise<CartResponse> {
  const response = await client.get<CartResponse>(`/cart/${sessionId}`)
  return response.data
}

export async function updateCartItem(
  sessionId: string,
  itemId: string,
  quantity: number,
): Promise<CartResponse> {
  const response = await client.patch<CartResponse>(
    `/cart/${sessionId}/item/${itemId}`,
    { quantity },
  )
  return response.data
}

export async function removeCartItem(
  sessionId: string,
  itemId: string,
): Promise<CartResponse> {
  const response = await client.delete<CartResponse>(
    `/cart/${sessionId}/item/${itemId}`,
  )
  return response.data
}

export async function clearCart(sessionId: string): Promise<{ message: string }> {
  const response = await client.delete<{ message: string }>(`/cart/${sessionId}`)
  return response.data
}

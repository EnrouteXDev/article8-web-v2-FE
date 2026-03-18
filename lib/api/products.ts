import { client } from './client'
import type {
  CreateProductInput,
  DeleteProductResponse,
  ProductFilters,
  ProductResponse,
  ProductsResponse,
} from '@/lib/types'

export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const response = await client.get<ProductsResponse>('/product', { params: filters })
  return response.data
}

export async function getProductById(id: string): Promise<ProductResponse> {
  const response = await client.get<ProductResponse>(`/product/${id}`)
  return response.data
}

export async function createProduct(data: CreateProductInput): Promise<ProductResponse> {
  const response = await client.post<ProductResponse>('/product', data)
  return response.data
}

export async function hideProduct(id: string): Promise<ProductResponse> {
  const response = await client.patch<ProductResponse>(`/product/${id}/hide`)
  return response.data
}

export async function deleteProduct(id: string): Promise<DeleteProductResponse> {
  const response = await client.delete<DeleteProductResponse>(`/product/${id}`)
  return response.data
}

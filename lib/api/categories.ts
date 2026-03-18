import { client } from './client'
import type {
  CategoriesResponse,
  CategoryFilters,
  CategoryResponse,
  CreateCategoryInput,
  DeleteCategoryResponse,
} from '@/lib/types'

export async function getCategories(filters?: CategoryFilters): Promise<CategoriesResponse> {
  const response = await client.get<CategoriesResponse>('/category', { params: filters })
  return response.data
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const response = await client.get<CategoryResponse>(`/category/${id}`)
  return response.data
}

export async function createCategory(data: CreateCategoryInput): Promise<CategoryResponse> {
  const response = await client.post<CategoryResponse>('/category', data)
  return response.data
}

export async function deleteCategory(id: string): Promise<DeleteCategoryResponse> {
  const response = await client.delete<DeleteCategoryResponse>(`/category/${id}`)
  return response.data
}

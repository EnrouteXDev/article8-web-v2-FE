import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryKeys } from '@/lib/query-keys'
import {
  getCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from '@/lib/api/categories'
import type { CategoryFilters, CreateCategoryInput } from '@/lib/types'

export function useCategories(filters?: CategoryFilters) {
  return useQuery({
    queryKey: categoryKeys.list(filters ?? {}),
    queryFn: () => getCategories(filters),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['delete-category'],
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
  })
}

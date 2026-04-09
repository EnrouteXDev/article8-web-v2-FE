import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productKeys } from '@/lib/query-keys'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  hideProduct,
  deleteProduct,
} from '@/lib/api/products'
import type { CreateProductInput, UpdateProductInput, ProductFilters } from '@/lib/types'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters ?? {}),
    queryFn: () => getProducts(filters),
  })
}

export function useInfiniteProducts(filters?: Omit<ProductFilters, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...productKeys.list(filters ?? {}), 'infinite'],
    queryFn: ({ pageParam }) => getProducts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useHideProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['hide-product'],
    mutationFn: (id: string) => hideProduct(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.product._id) })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      updateProduct(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(res.product._id) })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['delete-product'],
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

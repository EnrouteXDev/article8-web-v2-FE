import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewKeys } from '@/lib/query-keys'
import {
  getReviews,
  getProductReviews,
  hideReview,
  createReview,
} from '@/lib/api/reviews'
import type { ReviewFilters, CreateReviewInput } from '@/lib/types'

export function useReviews(filters?: ReviewFilters) {
  return useQuery({
    queryKey: reviewKeys.list(filters ?? {}),
    queryFn: () => getReviews(filters),
  })
}

export function useProductReviews(productId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: reviewKeys.product(productId, page, limit),
    queryFn: () => getProductReviews(productId, page, limit),
    enabled: !!productId,
  })
}

export function useHideReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: string) => hideReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
    },
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateReviewInput) => createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: reviewKeys.product(variables.productId),
      })
    },
  })
}

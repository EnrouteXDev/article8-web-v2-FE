import { client } from './client'
import type {
  AdminReviewsResponse,
  PublicReviewsResponse,
  ReviewFilters,
  CreateReviewInput,
  MessageResponse,
} from '@/lib/types'

export async function getReviews(filters?: ReviewFilters): Promise<AdminReviewsResponse> {
  const response = await client.get<AdminReviewsResponse>('/review/all', { params: filters })
  return response.data
}

export async function getProductReviews(
  productId: string,
  page = 1,
  limit = 10,
): Promise<PublicReviewsResponse> {
  const response = await client.get<PublicReviewsResponse>(`/review/product/${productId}`, {
    params: { page, limit },
  })
  return response.data
}

export async function hideReview(reviewId: string): Promise<MessageResponse> {
  const response = await client.patch<MessageResponse>(`/review/${reviewId}/hide`)
  return response.data
}

export async function createReview(data: CreateReviewInput): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/review', data)
  return response.data
}

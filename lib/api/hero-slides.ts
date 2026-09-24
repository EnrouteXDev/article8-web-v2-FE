import { client } from './client'
import type {
  CreateHeroSlideInput,
  DeleteHeroSlideResponse,
  HeroSlideResponse,
  HeroSlidesResponse,
  UpdateHeroSlideInput,
} from '@/lib/types'

/** Public: active slides only, for the landing page. */
export async function getHeroSlides(): Promise<HeroSlidesResponse> {
  const response = await client.get<HeroSlidesResponse>('/hero-slide')
  return response.data
}

/** Admin: every slide, active or not. */
export async function getAllHeroSlides(): Promise<HeroSlidesResponse> {
  const response = await client.get<HeroSlidesResponse>('/hero-slide/all')
  return response.data
}

export async function getHeroSlideById(id: string): Promise<HeroSlideResponse> {
  const response = await client.get<HeroSlideResponse>(`/hero-slide/${id}`)
  return response.data
}

export async function createHeroSlide(data: CreateHeroSlideInput): Promise<HeroSlideResponse> {
  const response = await client.post<HeroSlideResponse>('/hero-slide', data)
  return response.data
}

export async function updateHeroSlide(
  id: string,
  data: UpdateHeroSlideInput,
): Promise<HeroSlideResponse> {
  const response = await client.patch<HeroSlideResponse>(`/hero-slide/${id}`, data)
  return response.data
}

export async function deleteHeroSlide(id: string): Promise<DeleteHeroSlideResponse> {
  const response = await client.delete<DeleteHeroSlideResponse>(`/hero-slide/${id}`)
  return response.data
}

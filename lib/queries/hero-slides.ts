import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { heroSlideKeys } from '@/lib/query-keys'
import {
  getHeroSlides,
  getAllHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from '@/lib/api/hero-slides'
import type { CreateHeroSlideInput, UpdateHeroSlideInput } from '@/lib/types'

/** Public landing-page slides (active only). */
export function useHeroSlides() {
  return useQuery({
    queryKey: heroSlideKeys.public(),
    queryFn: getHeroSlides,
    staleTime: 5 * 60 * 1000,
  })
}

/** Admin list of every slide. */
export function useAllHeroSlides() {
  return useQuery({
    queryKey: heroSlideKeys.admin(),
    queryFn: getAllHeroSlides,
  })
}

export function useHeroSlide(id: string) {
  return useQuery({
    queryKey: heroSlideKeys.detail(id),
    queryFn: () => getHeroSlideById(id),
    enabled: !!id,
  })
}

export function useCreateHeroSlide() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHeroSlideInput) => createHeroSlide(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.all })
    },
  })
}

export function useUpdateHeroSlide() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroSlideInput }) =>
      updateHeroSlide(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.all })
    },
  })
}

export function useDeleteHeroSlide() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['delete-hero-slide'],
    mutationFn: (id: string) => deleteHeroSlide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: heroSlideKeys.all })
    },
  })
}

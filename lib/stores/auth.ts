import { create } from 'zustand'
import type { Admin } from '@/lib/types'

interface AuthState {
  admin: Admin | null
  setAdmin: (admin: Admin) => void
  clearAdmin: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  clearAdmin: () => set({ admin: null }),
}))

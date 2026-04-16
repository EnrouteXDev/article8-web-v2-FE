import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { loginAdmin, forgotPassword, resetPassword, inviteAdmin, getAdminUsers, updateAdminRole } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth'
import { adminUserKeys } from '@/lib/query-keys'
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput, InviteAdminInput, UpdateAdminRoleInput } from '@/lib/types'

export function useLoginAdmin() {
  const router = useRouter()
  const setAdmin = useAuthStore((s) => s.setAdmin)

  return useMutation({
    mutationFn: (data: LoginInput) => loginAdmin(data),
    onSuccess: (data) => {
      Cookies.set('auth_token', data.access_token)
      setAdmin(data.data)
      router.push('/admin/dashboard')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordInput) => forgotPassword(data),
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordInput) => resetPassword(data),
    onSuccess: () => {
      router.push('/admin/login')
    },
  })
}

export function useInviteAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: InviteAdminInput) => inviteAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all })
    },
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminUserKeys.all,
    queryFn: getAdminUsers,
  })
}

export function useUpdateAdminRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminRoleInput }) =>
      updateAdminRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all })
    },
  })
}

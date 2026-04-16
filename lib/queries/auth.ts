import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { loginAdmin, forgotPassword, resetPassword, inviteAdmin } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/stores/auth'
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput, InviteAdminInput } from '@/lib/types'

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
  return useMutation({
    mutationFn: (data: InviteAdminInput) => inviteAdmin(data),
  })
}

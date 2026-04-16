import { client } from './client'
import type {
  LoginInput,
  LoginResponse,
  ForgotPasswordInput,
  ResetPasswordInput,
  MessageResponse,
  InviteAdminInput,
  AdminUsersResponse,
  UpdateAdminRoleInput,
} from '@/lib/types'

export async function loginAdmin(data: LoginInput): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>('/auth/admin/login', data)
  return response.data
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/admin/forgot-password', data)
  return response.data
}

export async function resetPassword(data: ResetPasswordInput): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/admin/reset-password', data)
  return response.data
}

export async function inviteAdmin(data: InviteAdminInput): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/auth/admin/invite', data)
  return response.data
}

export async function getAdminUsers(): Promise<AdminUsersResponse> {
  const response = await client.get<AdminUsersResponse>('/admin/users')
  return response.data
}

export async function updateAdminRole(id: string, data: UpdateAdminRoleInput): Promise<MessageResponse> {
  const response = await client.patch<MessageResponse>(`/admin/users/${id}/role`, data)
  return response.data
}

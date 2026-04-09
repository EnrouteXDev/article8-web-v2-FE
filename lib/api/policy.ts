import { client } from './client'
import type { PolicyResponse, UpsertPolicyInput } from '@/lib/types'

export async function getPolicy(): Promise<PolicyResponse> {
  const response = await client.get<PolicyResponse>('/policy')
  return response.data
}

export async function upsertPolicy(data: UpsertPolicyInput): Promise<PolicyResponse> {
  const response = await client.put<PolicyResponse>('/policy', data)
  return response.data
}

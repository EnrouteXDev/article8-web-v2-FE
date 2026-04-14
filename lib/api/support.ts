import { client } from './client'
import type {
  CreateSupportTicketInput,
  ReplySupportTicketInput,
  SupportTicketsResponse,
  SupportTicketStatus,
  MessageResponse,
} from '@/lib/types'

export async function createSupportTicket(
  data: CreateSupportTicketInput,
): Promise<MessageResponse> {
  const response = await client.post<MessageResponse>('/support-ticket', data)
  return response.data
}

export async function getSupportTickets(
  status?: SupportTicketStatus,
  page?: number,
  limit?: number,
): Promise<SupportTicketsResponse> {
  const response = await client.get<SupportTicketsResponse>('/support-ticket', {
    params: { status, page, limit },
  })
  return response.data
}

export async function replySupportTicket(
  ticketId: string,
  data: ReplySupportTicketInput,
): Promise<{ message: string }> {
  const response = await client.patch<{ message: string }>(
    `/support-ticket/${ticketId}/reply`,
    data,
  )
  return response.data
}

import { client } from './client'
import type {
  ReplySupportTicketInput,
  SupportTicketsResponse,
  SupportTicketStatus,
} from '@/lib/types'

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

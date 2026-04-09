import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSupportTickets, replySupportTicket } from '@/lib/api/support'
import { supportKeys } from '@/lib/query-keys'
import type { ReplySupportTicketInput, SupportTicketStatus } from '@/lib/types'

export function useSupportTickets(status?: SupportTicketStatus, page?: number, limit?: number) {
  return useQuery({
    queryKey: supportKeys.list(status, page, limit),
    queryFn: () => getSupportTickets(status, page, limit),
  })
}

export function useReplySupportTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: ReplySupportTicketInput }) =>
      replySupportTicket(ticketId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.all })
    },
  })
}

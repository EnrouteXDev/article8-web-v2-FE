import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { policyKeys } from '@/lib/query-keys'
import { getPolicy, upsertPolicy } from '@/lib/api/policy'
import type { UpsertPolicyInput } from '@/lib/types'

export function usePolicy() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: getPolicy,
  })
}

export function useUpsertPolicy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertPolicyInput) => upsertPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policyKeys.all })
    },
  })
}

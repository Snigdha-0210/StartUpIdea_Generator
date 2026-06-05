
import { useQuery } from '@tanstack/react-query'
import { fetchPatentIntelligence } from '@/services/api/patent-intelligence'

export const usePatentIntelligence = () => {
  return useQuery({
    queryKey: ['patent-intelligence'],
    queryFn: fetchPatentIntelligence
  })
}

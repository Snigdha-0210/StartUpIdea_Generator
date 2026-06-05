
import { useQuery } from '@tanstack/react-query'
import { fetchResearchData } from '@/services/api/research-studio'
export const useResearchStudio = () => useQuery({ queryKey: ['research'], queryFn: fetchResearchData })


import { useQuery } from '@tanstack/react-query'
import { fetchFundingData } from '@/services/api/funding'
export const useFunding = () => useQuery({ queryKey: ['funding'], queryFn: fetchFundingData })

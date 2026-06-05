
import { useQuery } from '@tanstack/react-query'
import { fetchMarketValidation } from '@/services/api/market-validation'

export const useMarketValidation = () => {
  return useQuery({
    queryKey: ['market-validation'],
    queryFn: fetchMarketValidation
  })
}

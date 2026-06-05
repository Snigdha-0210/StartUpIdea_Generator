
import { useQuery } from '@tanstack/react-query'
import { fetchCorporateData } from '@/services/api/corporate-hub'
export const useCorporateHub = () => useQuery({ queryKey: ['corporate'], queryFn: fetchCorporateData })

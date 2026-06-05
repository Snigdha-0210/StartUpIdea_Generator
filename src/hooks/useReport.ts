
import { useQuery } from '@tanstack/react-query'
import { fetchReport } from '@/services/api/report'
export const useReport = () => useQuery({ queryKey: ['report'], queryFn: fetchReport })

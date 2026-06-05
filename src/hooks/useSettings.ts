
import { useQuery } from '@tanstack/react-query'
import { fetchSettings } from '@/services/api/settings'
export const useSettings = () => useQuery({ queryKey: ['settings'], queryFn: fetchSettings })

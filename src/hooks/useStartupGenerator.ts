
import { useMutation } from '@tanstack/react-query'
import { generateStartup } from '@/services/api/startup-generator'

export const useGenerateStartup = () => {
  return useMutation({
    mutationFn: generateStartup
  })
}

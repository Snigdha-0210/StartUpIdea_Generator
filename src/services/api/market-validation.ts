
export interface MarketData {
  tam: string
  sam: string
  som: string
  demandIndex: number
  competitorDensity: string
  growthRate: string
  sentiment: number
  viabilityScore: number
}

export const fetchMarketValidation = async (): Promise<MarketData> => {
  return new Promise(resolve => setTimeout(() => resolve({
    tam: '$15B',
    sam: '$3.2B',
    som: '$450M',
    demandIndex: 92,
    competitorDensity: 'Low',
    growthRate: '+24% YoY',
    sentiment: 85,
    viabilityScore: 94
  }), 800))
}

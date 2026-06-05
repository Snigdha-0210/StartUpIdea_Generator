
export interface PatentData {
  noveltyScore: number
  riskAssessment: string
  priorArt: { id: string, title: string, year: string, relevance: number }[]
  differentiators: string[]
}

export const fetchPatentIntelligence = async (): Promise<PatentData> => {
  return new Promise(resolve => setTimeout(() => resolve({
    noveltyScore: 78,
    riskAssessment: 'Moderate - Hardware patents exist, but AI load balancing is highly novel.',
    priorArt: [
      { id: 'US20210A1', title: 'Smart Grid Load Manager', year: '2021', relevance: 85 },
      { id: 'EP1928B1', title: 'Rural Micro-grid Storage', year: '2019', relevance: 60 }
    ],
    differentiators: ['Predictive ML algorithms for demand forecasting', 'Modular V2G hardware integration']
  }), 1000))
}

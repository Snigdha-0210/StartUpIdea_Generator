const fs = require('fs');
const path = require('path');

const tsCode = {
  'src/services/api/startup-generator.ts': `
export interface StartupIdea {
  id: string
  name: string
  problem: string
  solution: string
  targetCustomers: string
  revenueModel: string
  readinessScore: number
}

export const generateStartup = async (data: any): Promise<StartupIdea> => {
  return new Promise(resolve => setTimeout(() => resolve({
    id: 'gen-123',
    name: 'EcoCharge AI',
    problem: 'Lack of EV charging infrastructure in rural and highway corridors.',
    solution: 'Modular, AI-managed solar-powered charging hubs that predict load demand.',
    targetCustomers: 'Rural municipalities, long-haul fleets, regional travelers.',
    revenueModel: 'Pay-per-kWh, Subscription memberships, Grid-balancing credits.',
    readinessScore: 88
  }), 1500))
}
`,
  'src/hooks/useStartupGenerator.ts': `
import { useMutation } from '@tanstack/react-query'
import { generateStartup } from '@/services/api/startup-generator'

export const useGenerateStartup = () => {
  return useMutation({
    mutationFn: generateStartup
  })
}
`,
  'src/services/api/market-validation.ts': `
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
`,
  'src/hooks/useMarketValidation.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchMarketValidation } from '@/services/api/market-validation'

export const useMarketValidation = () => {
  return useQuery({
    queryKey: ['market-validation'],
    queryFn: fetchMarketValidation
  })
}
`,
  'src/services/api/patent-intelligence.ts': `
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
`,
  'src/hooks/usePatentIntelligence.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchPatentIntelligence } from '@/services/api/patent-intelligence'

export const usePatentIntelligence = () => {
  return useQuery({
    queryKey: ['patent-intelligence'],
    queryFn: fetchPatentIntelligence
  })
}
`,
  'src/services/api/digital-twin.ts': `
export interface TwinForecast {
  year: string
  bestCase: string
  expectedCase: string
  worstCase: string
}

export interface TwinData {
  fundingProbability: number
  adoptionRate: string
  forecasts: TwinForecast[]
}

export const fetchDigitalTwin = async (): Promise<TwinData> => {
  return new Promise(resolve => setTimeout(() => resolve({
    fundingProbability: 82,
    adoptionRate: 'Exponential',
    forecasts: [
      { year: 'Year 1', bestCase: '$1.2M', expectedCase: '$800K', worstCase: '$300K' },
      { year: 'Year 3', bestCase: '$8.5M', expectedCase: '$5.2M', worstCase: '$1.5M' },
      { year: 'Year 5', bestCase: '$24M', expectedCase: '$15M', worstCase: '$4.2M' }
    ]
  }), 900))
}
`,
  'src/hooks/useDigitalTwin.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchDigitalTwin } from '@/services/api/digital-twin'

export const useDigitalTwin = () => {
  return useQuery({
    queryKey: ['digital-twin'],
    queryFn: fetchDigitalTwin
  })
}
`
};

for (const [filepath, content] of Object.entries(tsCode)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

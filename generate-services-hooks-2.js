const fs = require('fs');
const path = require('path');

const tsCode = {
  'src/services/api/research-studio.ts': `
export const fetchResearchData = async () => new Promise(r => setTimeout(() => r({
  trlScore: 6,
  summary: 'Advanced ML modeling for grid balancing based on local transformer capacity limits.',
  applications: ['Rural EV charging', 'Micro-grid stabilization', 'V2G arbitrage'],
  fundingPotential: 'High (DOE Grants)'
}), 800))
`,
  'src/hooks/useResearchStudio.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchResearchData } from '@/services/api/research-studio'
export const useResearchStudio = () => useQuery({ queryKey: ['research'], queryFn: fetchResearchData })
`,
  'src/services/api/funding.ts': `
export const fetchFundingData = async () => new Promise(r => setTimeout(() => r({
  investorScore: 88, grantScore: 95, acceleratorScore: 75,
  opportunities: ['DOE Rural Infrastructure Grant ($2M)', 'ClimateTech Seed Fund ($500K)']
}), 800))
`,
  'src/hooks/useFunding.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchFundingData } from '@/services/api/funding'
export const useFunding = () => useQuery({ queryKey: ['funding'], queryFn: fetchFundingData })
`,
  'src/services/api/corporate-hub.ts': `
export const fetchCorporateData = async () => new Promise(r => setTimeout(() => r({
  portfolioHealth: 92, activeProjects: 14,
  departments: [{name: 'Energy', score: 95}, {name: 'Mobility', score: 82}]
}), 800))
`,
  'src/hooks/useCorporateHub.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchCorporateData } from '@/services/api/corporate-hub'
export const useCorporateHub = () => useQuery({ queryKey: ['corporate'], queryFn: fetchCorporateData })
`,
  'src/services/api/command-center.ts': `
export const fetchCommandData = async () => new Promise(r => setTimeout(() => r({
  status: 'Healthy', aiTasks: 45, nextSteps: ['Finalize Patent Draft', 'Submit DOE Grant']
}), 800))
`,
  'src/hooks/useCommandCenter.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchCommandData } from '@/services/api/command-center'
export const useCommandCenter = () => useQuery({ queryKey: ['command'], queryFn: fetchCommandData })
`,
  'src/services/api/builder.ts': `
export const generateAssets = async () => new Promise(r => setTimeout(() => r({
  deck: 'Generated', plan: 'Generated', financial: 'Pending'
}), 1500))
`,
  'src/hooks/useBuilder.ts': `
import { useMutation } from '@tanstack/react-query'
import { generateAssets } from '@/services/api/builder'
export const useBuilder = () => useMutation({ mutationFn: generateAssets })
`,
  'src/services/api/report.ts': `
export const fetchReport = async () => new Promise(r => setTimeout(() => r({
  execSummary: 'Highly viable startup opportunity in rural EV charging.',
  launchProb: 88, actionPlan: ['Incorporate C-Corp', 'File Provisional Patent']
}), 800))
`,
  'src/hooks/useReport.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchReport } from '@/services/api/report'
export const useReport = () => useQuery({ queryKey: ['report'], queryFn: fetchReport })
`,
  'src/services/api/settings.ts': `
export const fetchSettings = async () => new Promise(r => setTimeout(() => r({
  name: 'InnovateX Corp', apiLimit: '84%', activeMembers: 12
}), 800))
`,
  'src/hooks/useSettings.ts': `
import { useQuery } from '@tanstack/react-query'
import { fetchSettings } from '@/services/api/settings'
export const useSettings = () => useQuery({ queryKey: ['settings'], queryFn: fetchSettings })
`
};

for (const [filepath, content] of Object.entries(tsCode)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

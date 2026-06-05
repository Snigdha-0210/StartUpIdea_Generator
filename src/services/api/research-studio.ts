
export const fetchResearchData = async () => new Promise<any>(r => setTimeout(() => r({
  trlScore: 6,
  summary: 'Advanced ML modeling for grid balancing based on local transformer capacity limits.',
  applications: ['Rural EV charging', 'Micro-grid stabilization', 'V2G arbitrage'],
  fundingPotential: 'High (DOE Grants)'
}), 800))

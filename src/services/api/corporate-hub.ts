
export const fetchCorporateData = async () => new Promise<any>(r => setTimeout(() => r({
  portfolioHealth: 92, activeProjects: 14,
  departments: [{name: 'Energy', score: 95}, {name: 'Mobility', score: 82}]
}), 800))

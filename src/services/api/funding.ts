
export const fetchFundingData = async () => new Promise<any>(r => setTimeout(() => r({
  investorScore: 88, grantScore: 95, acceleratorScore: 75,
  opportunities: ['DOE Rural Infrastructure Grant ($2M)', 'ClimateTech Seed Fund ($500K)']
}), 800))

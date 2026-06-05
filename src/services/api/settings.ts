
export const fetchSettings = async () => new Promise<any>(r => setTimeout(() => r({
  name: 'InnovateX Corp', apiLimit: '84%', activeMembers: 12
}), 800))

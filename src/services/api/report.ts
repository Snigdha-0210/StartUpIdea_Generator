
export const fetchReport = async () => new Promise<any>(r => setTimeout(() => r({
  execSummary: 'Highly viable startup opportunity in rural EV charging.',
  launchProb: 88, actionPlan: ['Incorporate C-Corp', 'File Provisional Patent']
}), 800))

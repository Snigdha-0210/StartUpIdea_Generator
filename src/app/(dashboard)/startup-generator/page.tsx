"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useAppStore } from '@/store'
import HotspotMap from '@/components/HotspotMap'
import { AlertTriangle, TrendingUp, Search, ShieldAlert, Award, Lightbulb, Users, Target, Activity, AlertOctagon, CheckCircle2, Rocket, Briefcase, DollarSign, Crosshair, Zap, MapPin } from 'lucide-react'

export default function StartupGeneratorPage() {
  const [formData, setFormData] = useState({
    idea: 'Creator Economy & Education',
    industry: 'Education & Writing',
    targetScope: 'Country-Specific',
    specificLocation: 'United States',
    budget: '$0 (Bootstrapping)',
    time: 'Weekends Only'
  })
  
  const [isPending, setIsPending] = useState(false)
  const [data, setData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { setIdea } = useAppStore()

  const handleGenerate = async () => {
    setIsPending(true)
    try {
      const res = await fetch('/api/ideas/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await res.json()
      
      if (!res.ok || result.error) {
        setErrorMsg(result.error || 'Failed to validate idea.')
        setData(null)
      } else {
        setErrorMsg(null)
        setData(result)
        setIdea(formData.idea) // Save to global state
      }
    } catch (e) {
      console.error(e)
      setErrorMsg('A network error occurred.')
    } finally {
      setIsPending(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getVerdictColor = (verdict: string) => {
    const v = verdict?.toLowerCase() || '';
    if (v.includes('strong')) return 'bg-green-500/20 text-green-600 border-green-500/50'
    if (v.includes('high risk')) return 'bg-red-500/20 text-red-600 border-red-500/50'
    return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/50'
  }

  const getDifficultyColor = (diff: string) => {
    const d = diff?.toLowerCase() || '';
    if (d === 'low') return 'text-green-500'
    if (d === 'high') return 'text-red-500'
    return 'text-yellow-500'
  }

  return (
    <div className="space-y-6">
      <PageHeader title="StartupLens AI" description="Elite startup strategy advisor, venture capital analyst, and product-market-fit consultant." />
      
      <div className="grid md:grid-cols-12 gap-6">
        {/* INPUT FORM */}
        <Card className="md:col-span-4 h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary"/> Project Setup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary mb-1.5 block">Target Industry or Problem Area</label>
                  <textarea 
                    className="w-full p-4 border rounded-xl bg-background shadow-sm focus:ring-2 focus:ring-primary/20 resize-none transition-all placeholder:text-muted-foreground/60"
                    rows={3}
                    placeholder="E.g., Healthcare inefficiencies, AI for construction, Creator economy monetization..."
                    value={formData.idea}
                    onChange={e => setFormData({...formData, idea: e.target.value})}
                  />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry Category:</label>
              <select name="industry" value={formData.industry} onChange={handleChange} className="w-full p-2 rounded-md border outline-none bg-background">
                <option>Education & Writing</option>
                <option>Health & Fitness</option>
                <option>Finance & Money</option>
                <option>Software & Apps</option>
                <option>Shopping & Retail</option>
                <option>Other / Unsure</option>
              </select>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget:</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-2 rounded-md border outline-none bg-background">
                  <option>$0 (Bootstrapping)</option>
                  <option>Under $1,000</option>
                  <option>$1k - $5k</option>
                  <option>$10k+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time:</label>
                <select name="time" value={formData.time} onChange={handleChange} className="w-full p-2 rounded-md border outline-none bg-background">
                  <option>Weekends Only</option>
                  <option>Part-Time (Nights)</option>
                  <option>Full-Time</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Geographic Scope:</label>
                <select name="targetScope" value={formData.targetScope} onChange={handleChange} className="w-full p-2 rounded-md border outline-none bg-background">
                  <option>Global</option>
                  <option>Country-Specific</option>
                  <option>State / Province</option>
                  <option>Local City / District</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specific Location:</label>
                <input 
                  type="text" 
                  name="specificLocation"
                  placeholder="e.g. India, Texas, London..."
                  className="w-full p-2 rounded-md border focus:ring-2 focus:ring-primary outline-none" 
                  value={formData.specificLocation}
                  onChange={handleChange}
                  disabled={formData.targetScope === 'Global'}
                />
              </div>
            </div>

            <Button 
                  className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={isPending}
                >
                  {isPending ? (
                    <><Activity className="mr-2 h-5 w-5 animate-spin" /> Scanning Global Opportunities...</>
                  ) : (
                    <><Rocket className="mr-2 h-5 w-5" /> Generate Startup Opportunity</>
                  )}
                </Button>
          </CardContent>
        </Card>
        
        {/* RESULTS AREA */}
        <div className="md:col-span-8 space-y-6">
          {errorMsg && (
            <Card className="bg-destructive/10 border-destructive">
              <CardHeader><CardTitle className="text-destructive">Analysis Error</CardTitle></CardHeader>
              <CardContent><p>{errorMsg}</p></CardContent>
            </Card>
          )}

          {data && !errorMsg && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* OPPORTUNITY DETECTED BANNER */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Zap className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <h3 className="text-violet-200 uppercase tracking-widest text-xs font-bold mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Market Signal Detected</h3>
                    <p className="text-violet-50 font-medium mb-4 text-sm bg-black/20 p-3 rounded-lg border border-white/10">{data.market_signal}</p>
                    <h2 className="text-3xl font-black mb-2 text-white">The Opportunity</h2>
                    <p className="text-violet-100 max-w-3xl text-lg leading-relaxed font-medium">{data.startup_opportunity}</p>
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-center min-w-[200px]">
                    <div className="text-sm uppercase tracking-wider font-bold opacity-80 mb-2">Innovation Score</div>
                    <div className="text-5xl font-black text-white">{data.innovation_score}</div>
                  </div>
                </div>
              </div>

              {/* WHY NOW & TARGET USERS */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="w-5 h-5 text-primary"/> Why This, Why Now?</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <strong className="block text-muted-foreground mb-1">Market Shift:</strong>
                      <p className="font-medium">{data.why_now?.market_shift}</p>
                    </div>
                    <div>
                      <strong className="block text-muted-foreground mb-1">Technology Change:</strong>
                      <p className="font-medium">{data.why_now?.tech_change}</p>
                    </div>
                    <div>
                      <strong className="block text-muted-foreground mb-1">Consumer Behavior:</strong>
                      <p className="font-medium">{data.why_now?.consumer_behavior}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Users className="w-5 h-5 text-primary"/> Target Users</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium text-base leading-relaxed">{data.target_users}</p>
                  </CardContent>
                </Card>
              </div>

              {/* BUSINESS & COMPETITION */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-400"><TrendingUp className="w-5 h-5"/> Business Potential</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <strong className="block text-green-800 dark:text-green-300 mb-1">Monetization Model:</strong>
                      <p className="font-medium">{data.business_potential?.monetization}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="block text-green-800 dark:text-green-300 mb-1">Market Size:</strong>
                        <p className="font-medium">{data.business_potential?.market_size}</p>
                      </div>
                      <div>
                        <strong className="block text-green-800 dark:text-green-300 mb-1">Scalability:</strong>
                        <p className="font-medium">{data.business_potential?.scalability}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-400"><ShieldAlert className="w-5 h-5"/> Competition Snapshot</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <strong className="block text-orange-800 dark:text-orange-300 mb-1">Existing Players:</strong>
                      <ul className="list-disc pl-5">
                        {data.competition_snapshot?.existing_players?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <strong className="block text-orange-800 dark:text-orange-300 mb-1">Saturation Level:</strong>
                        <p className="font-medium">{data.competition_snapshot?.saturation_level}</p>
                      </div>
                    </div>
                    <div>
                      <strong className="block text-orange-800 dark:text-orange-300 mb-1">Competitor Weaknesses:</strong>
                      <p className="font-medium">{data.competition_snapshot?.weaknesses}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ACTION PLAN & RISKS */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-primary"><Rocket className="w-5 h-5"/> Next Action (MVP Plan)</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <p className="font-medium text-base mb-4">{data.next_action}</p>
                    {data.bonus_mode?.mvp_features && (
                      <div>
                        <strong className="block text-primary/80 mb-2">Core MVP Features:</strong>
                        <ul className="list-disc pl-5 space-y-1">
                          {data.bonus_mode.mvp_features.map((f: string, i: number) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-red-600 dark:text-red-400"><AlertTriangle className="w-5 h-5"/> Key Risks & Failure Points</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <ul className="list-disc pl-5 space-y-2 text-red-900/80 dark:text-red-200/80 font-medium">
                      {data.risks?.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* BUILD STRATEGY & DIFFICULTIES */}
              {data.build_strategy && (
                <Card className="border-orange-500/20 bg-orange-500/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-orange-700 dark:text-orange-400"><Briefcase className="w-5 h-5"/> Build Strategy & Execution Hurdles</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <strong className="block text-orange-800 dark:text-orange-300 mb-2">How to Build (Roadmap):</strong>
                      <ol className="list-decimal pl-5 space-y-1 font-medium text-orange-900/90 dark:text-orange-200/90">
                        {data.build_strategy.how_to_build?.map((step: string, i: number) => <li key={i}>{step}</li>)}
                      </ol>
                    </div>
                    <div>
                      <strong className="block text-red-700/80 mb-2">Technical Difficulties:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-red-900/80 dark:text-red-200/80">
                        {data.build_strategy.technical_difficulties?.map((diff: string, i: number) => <li key={i}>{diff}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong className="block text-red-700/80 mb-2">Operational Hurdles:</strong>
                      <ul className="list-disc pl-5 space-y-1 text-red-900/80 dark:text-red-200/80">
                        {data.build_strategy.operational_difficulties?.map((diff: string, i: number) => <li key={i}>{diff}</li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* EXECUTIVE GROWTH STRATEGY */}
              {data.bonus_mode && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-indigo-700 dark:text-indigo-400"><Award className="w-5 h-5"/> Executive Growth Strategy</CardTitle></CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-indigo-500/10">
                      <strong className="block text-indigo-800 dark:text-indigo-300 mb-1">1-Line Investor Pitch:</strong>
                      <p className="font-bold italic text-base">"{data.bonus_mode.pitch}"</p>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-indigo-500/10">
                      <strong className="block text-indigo-800 dark:text-indigo-300 mb-1">Landing Page Hook:</strong>
                      <p className="font-medium text-base">"{data.bonus_mode.landing_page_hook}"</p>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-indigo-500/10">
                      <strong className="block text-indigo-800 dark:text-indigo-300 mb-1">Viral Growth Strategy:</strong>
                      <p className="font-medium">{data.bonus_mode.viral_growth}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* THE LEAFLET MAP & RANKED LOCATIONS */}
              {data.top_locations && data.top_locations.length > 0 && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="h-full border-blue-500/20 bg-blue-500/5">
                      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-lg text-blue-700 dark:text-blue-400">
                        <MapPin className="w-5 h-5"/> Location Strategy Map
                      </CardTitle></CardHeader>
                      <CardContent className="h-[450px] p-4 pt-0">
                        <div className="h-full w-full rounded-lg overflow-hidden border border-blue-500/20 shadow-sm relative z-0">
                          <HotspotMap locations={data.top_locations || []} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="h-full">
                      <CardHeader><CardTitle className="text-lg">Top Launch Markets</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        {data.top_locations?.map((loc: any, i: number) => (
                          <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                              <strong className="text-base text-primary">{loc.name}</strong>
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs">{loc.score}/100</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{loc.reason}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}



            </div>
          )}

          {!data && !errorMsg && !isPending && (
            <div className="h-full min-h-[500px] flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground bg-secondary/10">
              <div className="text-center space-y-3 max-w-sm">
                <Search className="w-12 h-12 mx-auto opacity-20" />
                <h3 className="text-lg font-semibold text-foreground/80">StartupLens AI</h3>
                <p className="text-sm">Enter an industry or problem area to instantly discover a high-potential startup opportunity generated by our AI engine.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
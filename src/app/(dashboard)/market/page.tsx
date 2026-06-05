"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts'
import { Activity, Target, ShieldAlert, CheckCircle2, XCircle, Search, DollarSign, Users, LineChart, LayoutGrid } from 'lucide-react'

export default function MarketValidationPage() {
  const { currentIdea } = useAppStore()
  const [customIdea, setCustomIdea] = useState('')
  const [data, setData] = useState<any>(null)
  const [isPending, setIsPending] = useState(false)
  const [hasRunInitial, setHasRunInitial] = useState(false)

  // Pre-fill the input if there's a current idea in the store
  useEffect(() => {
    if (currentIdea && !hasRunInitial) {
      setCustomIdea(currentIdea)
      handleAnalyze(currentIdea)
      setHasRunInitial(true)
    }
  }, [currentIdea, hasRunInitial])

  const handleAnalyze = async (ideaToAnalyze: string) => {
    if (!ideaToAnalyze.trim()) return
    setIsPending(true)
    try {
      const res = await fetch('/api/market/analyze', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ idea: ideaToAnalyze }) 
      })
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setIsPending(false)
    }
  }

  // Transform data for the Bar Chart Funnel
  const chartData = data ? [
    { name: 'TAM', value: data.market_size.tam.value, label: data.market_size.tam.label },
    { name: 'SAM', value: data.market_size.sam.value, label: data.market_size.sam.label },
    { name: 'SOM', value: data.market_size.som.value, label: data.market_size.som.label }
  ] : []

  return (
    <div className="space-y-8 pb-20">
      <PageHeader title="Market Validation Engine" description="Rigorous AI-driven market sizing, competitor analysis, and viability scoring." />
      
      {/* INPUT TERMINAL */}
      <Card className="border-primary/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter a startup idea, business model, or market gap to validate..."
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-base transition-all font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(customIdea)}
              />
            </div>
            <Button 
              size="lg" 
              className="h-[60px] px-8 text-lg font-bold shadow-md"
              onClick={() => handleAnalyze(customIdea)}
              disabled={isPending || !customIdea.trim()}
            >
              {isPending ? <Activity className="w-5 h-5 animate-spin mr-2"/> : <Target className="w-5 h-5 mr-2"/>}
              Validate Market
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-card">
           <Activity className="w-12 h-12 text-primary animate-spin opacity-50 mb-4" />
           <p className="text-lg font-medium text-muted-foreground animate-pulse">Running rigorous venture capital analysis...</p>
        </div>
      )}

      {!isPending && data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* MARKET FUNNEL SECTION */}
          <div className="grid lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-blue-600"/> Market Sizing Funnel (Millions USD)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3}/>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 16, fontWeight: 'bold' }} width={60} />
                      <RechartsTooltip 
                        formatter={(value, name, props) => [props.payload.label, 'Market Value']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#cbd5e1' : index === 1 ? '#94a3b8' : '#4f46e5'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-gradient-to-br from-indigo-600 to-violet-800 text-white shadow-lg border-none h-full">
                <CardHeader>
                  <CardTitle className="text-indigo-100 flex items-center gap-2 text-lg"><Activity className="w-5 h-5"/> Viability Score</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center py-6">
                  <div className="text-6xl font-black mb-2 flex items-baseline">
                    {data.viability.score}
                    <span className="text-2xl text-indigo-300">/100</span>
                  </div>
                  <div className={`mt-2 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-2 ${
                    data.viability.verdict === 'Go' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 
                    data.viability.verdict === 'No-Go' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                    'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}>
                    {data.viability.verdict === 'Go' ? <CheckCircle2 className="w-4 h-4"/> : data.viability.verdict === 'No-Go' ? <XCircle className="w-4 h-4"/> : <Activity className="w-4 h-4"/>}
                    Verdict: {data.viability.verdict}
                  </div>
                  <p className="mt-6 text-sm text-indigo-100 text-center leading-relaxed">
                    {data.viability.explanation}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SIZING BREAKDOWN */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Total Addressable Market</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground mb-2">{data.market_size.tam.label}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{data.market_size.tam.reasoning}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Serviceable Available Market</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-foreground mb-2">{data.market_size.sam.label}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{data.market_size.sam.reasoning}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-primary uppercase tracking-wider font-bold">Serviceable Obtainable Market (Target)</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-primary mb-2">{data.market_size.som.label}</div>
                <p className="text-xs text-primary/80 leading-relaxed font-medium">{data.market_size.som.reasoning}</p>
              </CardContent>
            </Card>
          </div>

          {/* DEEP METRICS ROW */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-blue-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-lg"><Users className="w-5 h-5"/> Demographics & Target Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Primary Adopter Profile</strong>
                  <p className="text-sm font-medium">{data.target_demographics.primary_profile}</p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  <strong className="block text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">Pain Point Intensity</strong>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-200">{data.target_demographics.pain_point_intensity}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-green-500/20">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 text-lg"><LineChart className="w-5 h-5"/> Unit Economics Estimate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    <strong className="block text-xs uppercase tracking-wider text-green-700 dark:text-green-300 mb-1">Estimated CAC</strong>
                    <p className="text-lg font-black text-green-800 dark:text-green-200">{data.unit_economics.estimated_cac}</p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    <strong className="block text-xs uppercase tracking-wider text-green-700 dark:text-green-300 mb-1">Estimated LTV</strong>
                    <p className="text-lg font-black text-green-800 dark:text-green-200">{data.unit_economics.estimated_ltv}</p>
                  </div>
                </div>
                <div>
                  <strong className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Revenue Model</strong>
                  <p className="text-sm font-medium">{data.unit_economics.revenue_model}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SWOT ANALYSIS */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LayoutGrid className="w-5 h-5 text-indigo-500"/> Strategic SWOT Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-green-500/5 border-green-500/20">
                  <h4 className="font-black text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">S - Strengths</h4>
                  <ul className="list-disc pl-4 text-sm font-medium space-y-1">
                    {data.swot_analysis.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl border bg-orange-500/5 border-orange-500/20">
                  <h4 className="font-black text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">W - Weaknesses</h4>
                  <ul className="list-disc pl-4 text-sm font-medium space-y-1">
                    {data.swot_analysis.weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/20">
                  <h4 className="font-black text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">O - Opportunities</h4>
                  <ul className="list-disc pl-4 text-sm font-medium space-y-1">
                    {data.swot_analysis.opportunities.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="p-4 rounded-xl border bg-red-500/5 border-red-500/20">
                  <h4 className="font-black text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">T - Threats</h4>
                  <ul className="list-disc pl-4 text-sm font-medium space-y-1">
                    {data.swot_analysis.threats.map((s: string, i: number) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* COMPETITORS & BARRIERS */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-orange-500"/> Competitor Matrix</CardTitle>
                <CardDescription>Who you are fighting against for market share.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Direct Competitors</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.competitors.direct.map((c: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20 rounded-md text-sm font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Indirect Alternatives</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.competitors.indirect.map((c: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-secondary text-secondary-foreground border rounded-md text-sm font-medium">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">The Status Quo</h4>
                  <p className="text-sm font-medium">{data.competitors.status_quo}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500"/> Barriers to Entry</CardTitle>
                <CardDescription>Major hurdles you must overcome to launch.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.barriers_to_entry.map((barrier: string, index: number) => (
                    <li key={index} className="flex gap-3 items-start p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-xs">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium text-foreground leading-relaxed">{barrier}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        </div>
      )}
    </div>
  )
}
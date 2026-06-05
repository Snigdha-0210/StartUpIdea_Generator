"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'
import { Search, Activity, ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react'

export default function PatentIntelligencePage() {
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
      const res = await fetch('/api/patents/analyze', { 
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

  const getThreatColor = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('high')) return 'text-red-600 bg-red-500/10 border-red-500/30'
    if (l.includes('medium')) return 'text-orange-600 bg-orange-500/10 border-orange-500/30'
    return 'text-green-600 bg-green-500/10 border-green-500/30'
  }

  const getThreatIcon = (level: string) => {
    const l = level.toLowerCase()
    if (l.includes('high')) return <ShieldAlert className="w-4 h-4" />
    if (l.includes('medium')) return <AlertTriangle className="w-4 h-4" />
    return <CheckCircle2 className="w-4 h-4" />
  }

  return (
    <div className="space-y-8 pb-20">
      <PageHeader title="Patent Intelligence Matrix" description="Run a massive USPTO & global prior art sweep to identify infringement threats." />
      
      {/* INPUT TERMINAL */}
      <Card className="border-primary/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter your product concept or technical architecture..."
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-base transition-all font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(customIdea)}
              />
            </div>
            <Button 
              size="lg" 
              className="h-[60px] px-8 text-lg font-bold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
              onClick={() => handleAnalyze(customIdea)}
              disabled={isPending || !customIdea.trim()}
            >
              {isPending ? <Activity className="w-5 h-5 animate-spin mr-2"/> : <Fingerprint className="w-5 h-5 mr-2"/>}
              Sweep Database
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-card">
           <Activity className="w-12 h-12 text-indigo-500 animate-spin opacity-50 mb-4" />
           <p className="text-xl font-bold text-foreground">Querying Global Patent Databases...</p>
           <p className="text-sm font-medium text-muted-foreground mt-2 animate-pulse">Extracting up to 50 potential prior art records. This takes a few seconds.</p>
        </div>
      )}

      {!isPending && data && data.prior_art_matrix && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* DIFFERENTIATION STRATEGY */}
          {data.differentiation_strategy && (
            <Card className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border-indigo-500/20 shadow-sm">
              <CardHeader>
                <CardTitle className="text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" /> Recommended Evasion Strategy
                </CardTitle>
                <CardDescription>How to pivot your IP to avoid the threats listed below.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.differentiation_strategy.map((strategy: string, i: number) => (
                    <li key={i} className="flex gap-3 items-start p-3 bg-background/50 rounded-lg border">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium leading-relaxed">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-2 mb-2 text-foreground">
            <h3 className="text-2xl font-black">Prior Art Matrix</h3>
            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-bold uppercase border border-indigo-500/20">
              {data.prior_art_matrix.length} Potential Infringements Found
            </span>
          </div>

          {/* MASSIVE PRIOR ART GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.prior_art_matrix.map((art: any, index: number) => (
              <div key={index} className="bg-card border rounded-xl flex flex-col overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                
                <div className="p-4 border-b bg-muted/20">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border mb-3 ${getThreatColor(art.threat_level)}`}>
                    {getThreatIcon(art.threat_level)} {art.threat_level} THREAT
                  </div>
                  <h4 className="font-bold text-base leading-tight mb-2 line-clamp-3" title={art.title}>{art.title}</h4>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assignee: <span className="text-foreground">{art.assignee}</span></p>
                </div>
                
                <div className="p-4 flex-grow bg-card">
                  <p className="text-sm font-medium leading-relaxed text-muted-foreground line-clamp-4">{art.relevance_summary}</p>
                </div>

                <div className="p-3 bg-muted/30 border-t mt-auto">
                  <a 
                    href={art.google_patents_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-2 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    View Patent <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}
"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Globe, Rss, Target, ShieldAlert, Zap, Activity, TrendingUp, MapPin, Building2, Rocket, ArrowRight, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OpportunityPage() {
  const [level, setLevel] = useState('Global')
  const [topic, setTopic] = useState('Startups')
  const [region, setRegion] = useState('')
  
  const [newsData, setNewsData] = useState<any[]>([])
  const [isNewsLoading, setIsNewsLoading] = useState(false)

  const [aiData, setAiData] = useState<any[] | null>(null)
  const [isAiPending, setIsAiPending] = useState(false)
  const [selectedGapIndex, setSelectedGapIndex] = useState<number | null>(null)
  const [isDeepDivePending, setIsDeepDivePending] = useState(false)

  const fetchNews = async () => {
    setIsNewsLoading(true)
    try {
      const res = await fetch('/api/opportunity/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, topic, region }),
        cache: 'no-store'
      })
      const json = await res.json()
      if (json.success) setNewsData(json.news)
    } catch (e) {
      console.error(e)
    } finally {
      setIsNewsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAnalyzeMarket = async () => {
    setIsAiPending(true)
    setSelectedGapIndex(null)
    try {
      const industryContext = `${topic} in ${level === 'Global' ? 'the global market' : region || level}`
      const res = await fetch('/api/opportunity/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industryContext, level })
      })
      const result = await res.json()
      // result should be an array now based on the updated AI prompt
      setAiData(Array.isArray(result) ? result : [result])
    } catch (e) {
      console.error(e)
    } finally {
      setIsAiPending(false)
    }
  }

  const handleGapClick = async (index: number) => {
    setSelectedGapIndex(index);
    if (!aiData || !aiData[index]) return;
    
    // If we already loaded the deep dive for this gap, skip fetch
    if (aiData[index].market_size) return;

    setIsDeepDivePending(true);
    try {
      const res = await fetch('/api/opportunity/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gap: aiData[index] })
      });
      const detailedGap = await res.json();
      
      setAiData(prev => {
        if (!prev) return prev;
        const newData = [...prev];
        newData[index] = detailedGap;
        return newData;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeepDivePending(false);
    }
  }

  const getTopicIcon = () => {
    if (topic === 'Business Trends') return <Building2 className="w-5 h-5"/>
    return <Rocket className="w-5 h-5"/>
  }

  const selectedGap = selectedGapIndex !== null && aiData ? aiData[selectedGapIndex] : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Intelligence Terminal" description="Multi-level market gap analysis and top 50 real-time news." />
      
      {/* NAVIGATION TABS */}
      <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-end md:items-center">
        
        <div className="space-y-4 flex-1 w-full">
          {/* Level Filter */}
          <div className="flex flex-wrap gap-2">
            {['Global', 'Continent', 'Country', 'State/Regional'].map(l => (
              <button 
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${level === l ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
             {/* Topic Filter */}
             <div className="flex gap-2 bg-secondary/30 p-1 rounded-lg">
                {['Startups', 'Business Trends'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${topic === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t === 'Startups' ? <Rocket className="w-4 h-4"/> : <Building2 className="w-4 h-4"/>} {t}
                  </button>
                ))}
            </div>

            {/* Region Input */}
            {level !== 'Global' && (
              <div className="flex-1 min-w-[200px] relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <input 
                  type="text" 
                  placeholder={`Enter ${level} name (e.g. Asia, India, California)`}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <Button onClick={fetchNews} disabled={isNewsLoading || (level !== 'Global' && !region)} size="lg" className="shrink-0 h-14 px-8 shadow-lg">
          {isNewsLoading ? <Activity className="w-5 h-5 animate-spin mr-2"/> : <Rss className="w-5 h-5 mr-2"/>}
          Fetch Top 50 Intelligence
        </Button>
      </div>

      <div className="space-y-12 mt-8">
        
        {/* MASSIVE NEWS FEED (TOP) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary">{getTopicIcon()} Top 50 Intelligence Feed</h2>
            <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">{level} {region ? `> ${region}` : ''}</span>
          </div>

          {isNewsLoading ? (
             <div className="h-[700px] flex items-center justify-center border-2 border-dashed rounded-xl bg-card">
               <Activity className="w-12 h-12 text-primary animate-spin opacity-50" />
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {newsData.length > 0 ? newsData.map((news, idx) => (
                <a key={idx} href={news.link} target="_blank" rel="noopener noreferrer" className="flex flex-col group bg-card p-5 rounded-xl border hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-1 duration-200 h-fit">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {new Date(news.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                  <strong className="text-base text-card-foreground group-hover:text-primary transition-colors line-clamp-3 leading-snug mb-3 flex-grow">{news.title}</strong>
                  <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">{news.contentSnippet}</p>
                </a>
              )) : (
                <div className="col-span-2 text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">No articles found. Try adjusting the region or topic.</div>
              )}
            </div>
          )}
        </div>

        {/* AI MARKET ANALYSIS DATABASE (BOTTOM) */}
        <div className="space-y-6 pt-6 border-t-2 border-dashed">
          <Card className="border-violet-500/30 bg-violet-500/5 shadow-lg shadow-violet-500/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-400 text-lg">
                <Target className="w-5 h-5"/> Regional Gap Database
              </CardTitle>
              <p className="text-sm text-muted-foreground">Generate the Top Market Gaps specifically for this region.</p>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full py-6 font-bold shadow-md bg-violet-600 hover:bg-violet-700 text-white"
                onClick={handleAnalyzeMarket}
                disabled={isAiPending || (level !== 'Global' && !region)}
              >
                {isAiPending ? (
                  <div className="flex items-center"><Activity className="w-5 h-5 animate-spin mr-2"/> Scanning regional physical & socioeconomic gaps...</div>
                ) : (
                  <div className="flex items-center"><Zap className="w-5 h-5 mr-2"/> Scan Regional Gaps</div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* LIST OF GAPS */}
          {aiData && selectedGapIndex === null && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4"/> Top {aiData.length} Identified Gaps
              </h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {aiData.map((gap, index) => (
                  <button 
                    key={index}
                    onClick={() => handleGapClick(index)}
                    className="w-full text-left bg-card p-5 rounded-xl border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group flex items-center justify-between"
                  >
                    <div>
                      <strong className="block text-lg font-black text-foreground mb-1 group-hover:text-violet-600 transition-colors">{gap.short_title || gap.gap_identified.slice(0,30) + '...'}</strong>
                      <p className="text-sm text-muted-foreground line-clamp-1">{gap.gap_identified}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-600 transition-colors transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DETAILED DRILL DOWN */}
          {selectedGap && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300 pb-20">
              <Button variant="outline" size="sm" onClick={() => setSelectedGapIndex(null)} className="mb-2">
                ← Back to Database
              </Button>

              {isDeepDivePending ? (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-xl bg-card">
                  <Activity className="w-12 h-12 text-violet-500 animate-spin opacity-50 mb-4" />
                  <p className="text-muted-foreground font-medium">Running deep scan and generating charts for this gap...</p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-5 text-white shadow-md">
                    <h3 className="text-violet-200 uppercase tracking-widest text-[10px] font-bold mb-1 flex items-center gap-1.5"><Activity className="w-3 h-3"/> Deep Dive Analysis</h3>
                    <a 
                      href={selectedGap.source_link || `https://www.google.com/search?q=${encodeURIComponent(selectedGap.gap_identified + ' ' + region)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group flex items-start gap-2 mb-4 hover:opacity-80 transition-opacity"
                      title="View source information"
                    >
                      <h2 className="text-xl font-black leading-tight group-hover:underline">{selectedGap.gap_identified}</h2>
                      <svg className="w-5 h-5 text-violet-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    
                    {selectedGap.core_regional_problems && selectedGap.core_regional_problems.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <strong className="block text-violet-100 mb-1 text-xs uppercase tracking-wider">Physical / Socioeconomic Problems Solved:</strong>
                        <ul className="list-disc pl-4 text-sm font-medium">
                          {selectedGap.core_regional_problems.map((p: string, i: number) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* MARKET GROWTH CHART */}
                {selectedGap.chart_data && (
                  <Card className="lg:col-span-2">
                    <CardHeader className="p-4 pb-2"><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="w-4 h-4 text-blue-600"/> TAM Growth Projection (Billions)</CardTitle></CardHeader>
                    <CardContent className="p-4">
                      <div className="h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedGap.chart_data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val}B`} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                              formatter={(value) => [`$${value} Billion`, 'Market Size']}
                            />
                            <Line type="monotone" dataKey="marketSize" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

              {selectedGap.geo_arbitrage && (
                <Card className="border-teal-500/30 bg-teal-500/10">
                  <CardHeader className="p-4 pb-2"><CardTitle className="flex items-center gap-2 text-base text-teal-800 dark:text-teal-300"><Globe className="w-4 h-4"/> Geo-Arbitrage Target</CardTitle></CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="bg-white/60 dark:bg-black/30 p-3 rounded-lg border border-teal-500/20 text-sm">
                      <strong className="block text-teal-800 dark:text-teal-300 mb-0.5 text-xs">Clone Startup:</strong>
                      <p className="font-bold">{selectedGap.geo_arbitrage.global_startup_to_clone}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/30 p-3 rounded-lg border border-teal-500/20 text-sm">
                      <strong className="block text-teal-800 dark:text-teal-300 mb-0.5 text-xs">Local Gap:</strong>
                      <p className="font-medium">{selectedGap.geo_arbitrage.local_gap}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-black/30 p-3 rounded-lg border border-teal-500/20 text-sm">
                      <strong className="block text-teal-800 dark:text-teal-300 mb-0.5 text-xs">How to Localize:</strong>
                      <p className="font-medium">{selectedGap.geo_arbitrage.how_to_localize}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="p-4 pb-2"><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="w-4 h-4 text-green-600"/> Trends & Size</CardTitle></CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 text-sm">
                  <div>
                    <strong className="block text-muted-foreground mb-0.5 text-xs">TAM:</strong>
                    <p className="font-bold text-green-600">{selectedGap.market_size}</p>
                  </div>
                  <div>
                    <strong className="block text-muted-foreground mb-0.5 text-xs">Trends:</strong>
                    <ul className="list-disc pl-4 font-medium">
                      {selectedGap.industry_trends?.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2"><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="w-4 h-4 text-orange-600"/> Competitors & Risks</CardTitle></CardHeader>
                <CardContent className="p-4 pt-0 space-y-3 text-sm">
                  <div>
                    <strong className="block text-muted-foreground mb-0.5 text-xs">Competitors:</strong>
                    <ul className="list-disc pl-4 font-medium text-orange-700/80">
                      {selectedGap.competitors?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <strong className="block text-red-600/80 mb-0.5 text-xs">Risks:</strong>
                    <ul className="list-disc pl-4 font-medium text-red-700/80">
                      {selectedGap.risks?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
              </div>
              </>
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'
import { Search, Activity, ExternalLink, Banknote, Rocket, DollarSign, CheckCircle2 } from 'lucide-react'

export default function FundingPage() {
  const { currentIdea } = useAppStore()
  const [customIdea, setCustomIdea] = useState('')
  const [data, setData] = useState<any>(null)
  const [isPending, setIsPending] = useState(false)
  const [hasRunInitial, setHasRunInitial] = useState(false)

  // Location State
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedState, setSelectedState] = useState('')

  const locationData: Record<string, Record<string, string[]>> = {
    "North America": {
      "USA": ["California", "New York", "Texas", "Massachusetts"],
      "Canada": ["Ontario", "British Columbia", "Quebec"]
    },
    "Europe": {
      "United Kingdom": ["England", "Scotland", "Wales", "London (Region)"],
      "Germany": ["Berlin", "Bavaria", "Hesse"],
      "France": ["Île-de-France", "Auvergne-Rhône-Alpes"]
    },
    "Asia": {
      "India": ["Maharashtra", "Karnataka", "Delhi", "Telangana"],
      "Singapore": ["Central Region", "East Region"],
      "UAE": ["Dubai", "Abu Dhabi"]
    },
    "South America": {
      "Brazil": ["São Paulo", "Rio de Janeiro"],
      "Argentina": ["Buenos Aires"]
    },
    "Africa": {
      "Nigeria": ["Lagos", "Abuja"],
      "South Africa": ["Gauteng", "Western Cape"]
    },
    "Oceania": {
      "Australia": ["New South Wales", "Victoria", "Queensland"]
    },
    "Global / Worldwide": {}
  }

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
      const res = await fetch('/api/funding/match', { 
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

  const getTypeIcon = (type: string) => {
    const lower = type.toLowerCase()
    if (lower.includes('venture') || lower.includes('vc')) return <DollarSign className="w-5 h-5 text-emerald-500"/>
    if (lower.includes('accelerator')) return <Rocket className="w-5 h-5 text-orange-500"/>
    if (lower.includes('crowdfunding')) return <Banknote className="w-5 h-5 text-blue-500"/>
    return <CheckCircle2 className="w-5 h-5 text-violet-500"/>
  }

  return (
    <div className="space-y-8 pb-20">
      <PageHeader title="Funding Directory" description="Find active real-world VCs, Accelerators, and Crowdfunding platforms tailored to your startup." />
      
      {/* INPUT TERMINAL */}
      <Card className="border-primary/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter your startup idea, industry, and location to find funding..."
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 bg-background focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-base transition-all font-medium"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(customIdea)}
              />
            </div>
            <Button 
              size="lg" 
              className="h-[60px] px-8 text-lg font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
              onClick={() => handleAnalyze(customIdea)}
              disabled={isPending || !customIdea.trim()}
            >
              {isPending ? <Activity className="w-5 h-5 animate-spin mr-2"/> : <Banknote className="w-5 h-5 mr-2"/>}
              Find Platforms
            </Button>
          </div>

          {/* QUICK ADD FILTERS */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              Quick Add:
            </span>
            
            <select 
              className="text-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg outline-none font-semibold cursor-pointer"
              onChange={(e) => {
                const val = e.target.value;
                if (val) setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
                e.target.value = ""; // reset after selection
              }}
            >
              <option value="">+ Industry</option>
              <option value="FinTech">FinTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="B2B SaaS">B2B SaaS</option>
              <option value="DeepTech">DeepTech</option>
              <option value="Consumer Tech">Consumer Tech</option>
            </select>

            <select 
              className="text-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg outline-none font-semibold cursor-pointer"
              onChange={(e) => {
                const val = e.target.value;
                if (val) setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
                e.target.value = ""; // reset after selection
              }}
            >
              <option value="">+ Stage</option>
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
              <option value="Growth">Growth</option>
            </select>

            <select 
              className="text-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg outline-none font-semibold cursor-pointer"
              value={selectedContinent}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedContinent(val);
                setSelectedCountry('');
                setSelectedState('');
                if (val && val !== 'Global / Worldwide') setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
              }}
            >
              <option value="">+ Continent</option>
              <option value="Global / Worldwide">Global / Worldwide</option>
              {Object.keys(locationData).filter(c => c !== 'Global / Worldwide').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              className="text-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg outline-none font-semibold cursor-pointer disabled:opacity-50"
              value={selectedCountry}
              disabled={!selectedContinent || !locationData[selectedContinent] || Object.keys(locationData[selectedContinent]).length === 0}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCountry(val);
                setSelectedState('');
                if (val) setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
              }}
            >
              <option value="">+ Country</option>
              {selectedContinent && locationData[selectedContinent] && Object.keys(locationData[selectedContinent]).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select 
              className="text-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg outline-none font-semibold cursor-pointer disabled:opacity-50"
              value={selectedState}
              disabled={!selectedCountry || !locationData[selectedContinent]?.[selectedCountry]}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedState(val);
                if (val) setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
              }}
            >
              <option value="">+ State</option>
              {selectedCountry && locationData[selectedContinent]?.[selectedCountry]?.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            <input 
              type="text"
              placeholder="+ City / Town"
              className="w-32 text-sm bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-lg outline-none font-semibold placeholder:text-emerald-800/50 dark:placeholder:text-emerald-300/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value;
                  if (val) setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
                  e.currentTarget.value = "";
                }
              }}
              onBlur={(e) => {
                const val = e.target.value;
                if (val) setCustomIdea(prev => prev.trim() ? `${prev}, ${val}` : val);
                e.target.value = "";
              }}
            />
          </div>
        </CardContent>
      </Card>

      {isPending && (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl bg-card">
           <Activity className="w-12 h-12 text-emerald-500 animate-spin opacity-50 mb-4" />
           <p className="text-lg font-medium text-muted-foreground animate-pulse">Scanning live venture capital and accelerator databases...</p>
        </div>
      )}

      {!isPending && data && data.platforms && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* REAL WORLD PLATFORMS */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 mb-2 text-foreground">
                <h3 className="text-xl font-bold">Recommended Platforms</h3>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase">{data.platforms.length} Matches</span>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {data.platforms.map((platform: any, index: number) => (
                  <div key={index} className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-emerald-500/30 group flex flex-col">
                    <div className="p-5 border-b bg-muted/20 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(platform.type)}
                          <h4 className="font-bold text-lg text-card-foreground group-hover:text-emerald-600 transition-colors">{platform.name}</h4>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-background border px-2 py-0.5 rounded-md">
                          {platform.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex-grow space-y-3">
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Typical Check Size</span>
                        <strong className="text-base text-foreground">{platform.check_size}</strong>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Why it fits you</span>
                        <p className="text-sm font-medium leading-relaxed">{platform.fit_reason}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/10 mt-auto">
                      <a 
                        href={platform.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-2.5 flex items-center justify-center gap-2 bg-foreground text-background font-bold rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        Visit Platform <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* READINESS CHECKLIST */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="shadow-md border-orange-500/20 bg-orange-500/5 sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400"><CheckCircle2 className="w-5 h-5"/> Readiness Checklist</CardTitle>
                  <CardDescription>What you MUST have prepared before applying to these platforms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {data.readiness_checklist && data.readiness_checklist.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start bg-card p-3 rounded-lg border border-orange-500/10 shadow-sm">
                        <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-600 text-xs font-bold">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useAppStore } from '@/store'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { 
  Activity, Target, ShieldCheck, Zap, 
  ArrowRight, Search, Lightbulb, Banknote,
  CheckCircle2, Circle, PlayCircle, Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { currentIdea } = useAppStore()
  const [userName, setUserName] = useState<string>('Innovator')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists() && docSnap.data().name) {
          // Extract first name
          setUserName(docSnap.data().name.split(' ')[0])
        } else if (user.email) {
          setUserName(user.email.split('@')[0])
        }
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Zap className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-3">
            Welcome back, {userName} <span className="animate-wave text-4xl">👋</span>
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl font-medium max-w-2xl">
            Ready to build the future? Here is the current status of your innovation pipeline.
          </p>
          {currentIdea && (
            <div className="inline-flex items-center gap-3 mt-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-inner">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm font-bold tracking-wide uppercase text-indigo-100">Active Project:</span>
              <span className="text-sm font-semibold text-white truncate max-w-xs">{currentIdea}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. PREMIUM KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="group relative bg-card border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-600">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Innovation Score</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-foreground">84</span>
            <span className="text-lg font-bold text-muted-foreground mb-1">/100</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full w-[84%]"></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="group relative bg-card border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-600">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Market Validation</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-foreground">92</span>
            <span className="text-lg font-bold text-muted-foreground mb-1">%</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[92%]"></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="group relative bg-card border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-16 h-16 text-amber-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Patent Novelty</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-foreground">78</span>
            <span className="text-lg font-bold text-muted-foreground mb-1">/100</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[78%]"></div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="group relative bg-card border rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-16 h-16 text-rose-600" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-rose-500/10 p-3 rounded-xl text-rose-600">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-muted-foreground uppercase tracking-wider text-xs">Commercial Potential</h3>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-foreground text-rose-600">HIGH</span>
          </div>
          <div className="mt-4 flex gap-1">
            <div className="h-1.5 flex-1 bg-rose-600 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-rose-600 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-rose-600 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. INTERACTIVE PROGRESS TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8">Innovation Journey</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
                
                {/* Step 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-muted/20 p-5 rounded-2xl border transition-all hover:shadow-md hover:border-emerald-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg">Idea Generation</h4>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">Complete</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Market gaps identified and initial concepts forged.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-muted/20 p-5 rounded-2xl border transition-all hover:shadow-md hover:border-emerald-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg">Startup Validation</h4>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">Complete</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Product-market fit validated against real-world metrics.</p>
                  </div>
                </div>

                {/* Step 3 (Current) */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-indigo-100 dark:border-indigo-950 bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 animate-pulse">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-indigo-500/5 p-5 rounded-2xl border-2 border-indigo-500/30 shadow-md">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg text-indigo-950 dark:text-indigo-100">Patent Research</h4>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">In Progress</span>
                    </div>
                    <p className="text-sm text-indigo-800/70 dark:text-indigo-200/70 font-medium">Analyzing prior art to establish your IP moat.</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <Circle className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-background p-5 rounded-2xl border border-dashed opacity-50 transition-opacity hover:opacity-100">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-lg">Funding & Readiness</h4>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-md">Pending</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Prepare pitch materials and find matching VCs.</p>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. QUICK ACTIONS */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-bold ml-2">Quick Actions</h2>
          <div className="space-y-4">
            
            <Link href="/market" className="block group bg-card border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Market Validation</h4>
                    <p className="text-xs text-muted-foreground">Run a new analysis</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/patents" className="block group bg-card border rounded-2xl p-5 hover:shadow-lg hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl text-amber-600 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Patent Landscape</h4>
                    <p className="text-xs text-muted-foreground">Analyze prior art</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/startup-generator" className="block group bg-card border rounded-2xl p-5 hover:shadow-lg hover:border-violet-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-violet-500/10 p-3 rounded-xl text-violet-600 group-hover:scale-110 transition-transform">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Generate Opportunity</h4>
                    <p className="text-xs text-muted-foreground">AI startup ideation</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link href="/funding" className="block group bg-card border rounded-2xl p-5 hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Funding Directory</h4>
                    <p className="text-xs text-muted-foreground">Find matching VCs</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

          </div>
        </div>

      </div>

      {/* 5. GLASSMORPHISM AI INSIGHT PANEL */}
      <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 rounded-3xl p-1 shadow-2xl mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-xl"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-3xl rounded-[22px] p-8 md:p-10 border border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-wide">InnovateX AI Insights</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-3">
              <h4 className="text-blue-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Search className="w-4 h-4"/> What was discovered?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                The <strong className="text-white">AI-Powered Rural EV Charging Network</strong> shows a massive 92% market validation score based on recent trend shifts.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-purple-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4"/> Why does it matter?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                High market validation indicates strong product-market fit potential, drastically reducing early-stage commercialization risk.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-pink-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4"/> What should you do next?
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Proceed directly to <strong className="text-white">Patent Intelligence</strong> to analyze prior art and establish an initial IP moat.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

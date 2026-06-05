const fs = require('fs');
const path = require('path');

const files = {
  'src/app/api/opportunity/discover/route.ts': `import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function GET() {
  try {
    const data = await aiValidationService.discoverOpportunities();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,
  
  'src/app/api/market/analyze/route.ts': `import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();
    if (!idea) return NextResponse.json({ error: 'Idea required' }, { status: 400 });
    const data = await aiValidationService.analyzeMarket(idea);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,

  'src/app/api/patents/analyze/route.ts': `import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();
    if (!idea) return NextResponse.json({ error: 'Idea required' }, { status: 400 });
    const data = await aiValidationService.analyzePatents(idea);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,

  'src/app/api/funding/match/route.ts': `import { NextResponse } from 'next/server';
import { aiValidationService } from '@/services/aiValidationService';

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();
    if (!idea) return NextResponse.json({ error: 'Idea required' }, { status: 400 });
    const data = await aiValidationService.matchFunding(idea);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,

  'src/app/(dashboard)/opportunity/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { useState, useEffect } from 'react'

export default function OpportunityPage() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch('/api/opportunity/discover').then(res => res.json()).then(setData)
  }, [])

  if (!data) return <div className="p-12 text-center text-muted-foreground animate-pulse">Analyzing live market trends via AI...</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Opportunity Discovery" description="Generate innovative startup opportunities by analyzing trends." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>Emerging Technology</CardTitle></CardHeader><CardContent>{data.emergingTech}</CardContent></Card>
        <Card><CardHeader><CardTitle>Market Gaps</CardTitle></CardHeader><CardContent>{data.marketGaps}</CardContent></Card>
        <Card><CardHeader><CardTitle>Industry Challenges</CardTitle></CardHeader><CardContent>{data.industryChallenges}</CardContent></Card>
      </div>
      <InsightPanel discovered={data.discovered} matters={data.matters} nextSteps={data.nextSteps} />
    </div>
  )
}`,

  'src/app/(dashboard)/market/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'

export default function MarketValidationPage() {
  const { currentIdea } = useAppStore()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (currentIdea) {
      fetch('/api/market/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: currentIdea }) })
        .then(res => res.json()).then(setData)
    }
  }, [currentIdea])

  if (!currentIdea) return <div className="p-12 text-center">Please generate an idea in the Startup Generator first.</div>
  if (!data) return <div className="p-12 text-center text-muted-foreground animate-pulse">Calculating TAM/SAM/SOM via Gemini for: {currentIdea}...</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Market Validation" description="Validate startup ideas against market size and competitors." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>TAM</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{data.tam}</CardContent></Card>
        <Card><CardHeader><CardTitle>SAM</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{data.sam}</CardContent></Card>
        <Card><CardHeader><CardTitle>SOM</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{data.som}</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Competitor & Risk Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between border-b pb-2"><span>Competitors</span><span>{data.competitors}</span></div>
          <div className="flex justify-between border-b pb-2"><span>Barriers to Entry</span><span>{data.barriers}</span></div>
          <div className="flex justify-between border-b pb-2"><span>Innovation Viability</span><span className="text-success font-bold">Score: {data.viabilityScore}/100</span></div>
        </CardContent>
      </Card>
      <InsightPanel discovered={data.discovered} matters={data.matters} nextSteps={data.nextSteps} />
    </div>
  )
}`,

  'src/app/(dashboard)/patents/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'

export default function PatentIntelligencePage() {
  const { currentIdea } = useAppStore()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (currentIdea) {
      fetch('/api/patents/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: currentIdea }) })
        .then(res => res.json()).then(setData)
    }
  }, [currentIdea])

  if (!currentIdea) return <div className="p-12 text-center">Please generate an idea in the Startup Generator first.</div>
  if (!data) return <div className="p-12 text-center text-muted-foreground animate-pulse">Scanning prior art via Gemini for: {currentIdea}...</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Patent Intelligence" description="Analyze novelty and prior art for your concept." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Prior Art Analysis</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-4">
              {data.priorArt.map((art: string, i: number) => <li key={i}>{art}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Differentiation Suggestions</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              {data.differentiations.map((diff: string, i: number) => <li key={i}>{diff}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
      <InsightPanel discovered={data.discovered} matters={data.matters} nextSteps={data.nextSteps} />
    </div>
  )
}`,

  'src/app/(dashboard)/funding/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { useAppStore } from '@/store'
import { useState, useEffect } from 'react'

export default function FundingPage() {
  const { currentIdea } = useAppStore()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (currentIdea) {
      fetch('/api/funding/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: currentIdea }) })
        .then(res => res.json()).then(setData)
    }
  }, [currentIdea])

  if (!currentIdea) return <div className="p-12 text-center">Please generate an idea in the Startup Generator first.</div>
  if (!data) return <div className="p-12 text-center text-muted-foreground animate-pulse">Matching grants & investors via Gemini for: {currentIdea}...</div>

  return (
    <div className="space-y-6">
      <PageHeader title="Funding & Readiness" description="Support commercialization with targeted capital." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recommended Programs</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {data.programs.map((prog: string, i: number) => (
              <div key={i} className="p-3 border rounded-md">{prog}</div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Readiness Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2"><span>Investor Readiness</span><span className="font-bold">{data.investorReadiness}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Commercialization Readiness</span><span className="font-bold">{data.commercialReadiness}</span></div>
          </CardContent>
        </Card>
      </div>
      <InsightPanel discovered={data.discovered} matters={data.matters} nextSteps={data.nextSteps} />
    </div>
  )
}`,

  'src/app/(dashboard)/startup-generator/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { useState } from 'react'
import { useAppStore } from '@/store'

export default function StartupGeneratorPage() {
  const [ideaInput, setIdeaInput] = useState('AI-powered legal assistant')
  const [isPending, setIsPending] = useState(false)
  const [data, setData] = useState<any>(null)
  const { setIdea } = useAppStore()

  const handleGenerate = async () => {
    setIsPending(true)
    try {
      const res = await fetch('/api/ideas/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaInput })
      })
      const result = await res.json()
      setData(result)
      setIdea(ideaInput) // Save to global state so Market/Patents tabs can use it!
    } catch (e) {
      console.error(e)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Startup Generator" description="Validate and structure business models using live Google Trends data." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>User Inputs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="text-sm font-medium">Describe your startup idea:</label>
            <input 
              type="text" 
              className="w-full p-2 rounded-md border" 
              value={ideaInput}
              onChange={e => setIdeaInput(e.target.value)}
            />
            <Button className="w-full" onClick={handleGenerate} disabled={isPending}>
              {isPending ? 'Validating via Google Trends & AI...' : 'Validate Startup Idea'}
            </Button>
          </CardContent>
        </Card>
        
        {data && (
          <Card className="bg-primary/5">
            <CardHeader><CardTitle>Validation Results</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div><strong>Demand Score:</strong> <span className="text-xl font-bold text-primary">{data.demandScore}/100</span></div>
              <div><strong>Trend Direction:</strong> {data.trendDirection}</div>
              <div><strong>Market Interest:</strong> {data.marketInterest}</div>
              <div className="pt-4 border-t border-primary/10">
                <strong>AI Insights from Trends:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                  {data.insights?.map((insight: string, i: number) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <InsightPanel 
        discovered={data ? \`The idea "\${data.idea}" scored \${data.demandScore}/100 with a \${data.trendDirection.toLowerCase()} trend direction.\` : "Enter a startup idea to fetch live Google Trends validation."}
        matters="Validating search volume and trend trajectory reduces the risk of building products nobody is searching for."
        nextSteps={data ? "Proceed to Market Validation to analyze the TAM and competitors for this specific idea!" : "Click 'Validate Startup Idea' above."}
      />
    </div>
  )
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

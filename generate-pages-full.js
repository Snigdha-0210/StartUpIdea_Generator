const fs = require('fs');
const path = require('path');

const pageCode = {
  'src/app/(dashboard)/startup-generator/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useGenerateStartup } from '@/hooks/useStartupGenerator'
import { ScoreGauge } from '@/components/shared/ScoreGauge'

export default function StartupGeneratorPage() {
  const { mutate, data, isPending } = useGenerateStartup()

  return (
    <div className="space-y-6">
      <PageHeader title="Startup Generator" description="Configure and generate new startup models based on validated opportunities." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Idea Input</label>
              <textarea className="w-full h-24 p-2 rounded-md border bg-background" defaultValue="Rural EV Charging with AI" />
            </div>
            <Button onClick={() => mutate({})} disabled={isPending} className="w-full">
              {isPending ? 'Generating...' : 'Generate Startup Canvas'}
            </Button>
          </CardContent>
        </Card>
        {data && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader><CardTitle className="text-primary">{data.name}</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div><strong>Problem:</strong> {data.problem}</div>
              <div><strong>Solution:</strong> {data.solution}</div>
              <div><strong>Customers:</strong> {data.targetCustomers}</div>
              <div><strong>Revenue Model:</strong> {data.revenueModel}</div>
              <div className="pt-4 border-t"><ScoreGauge label="Investor Readiness" score={data.readinessScore} /></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
`,
  'src/app/(dashboard)/market/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMarketValidation } from '@/hooks/useMarketValidation'
import { MetricCard } from '@/components/shared/MetricCard'
import { Activity, Users, Target, TrendingUp } from 'lucide-react'

export default function MarketValidationPage() {
  const { data, isLoading } = useMarketValidation()

  if (isLoading) return <div>Loading market data...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Market Validation" description="Analyze Total Addressable Market and customer demand signals." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Addressable Market (TAM)" value={data.tam} icon={Target} />
        <MetricCard title="Serviceable Addressable Market (SAM)" value={data.sam} icon={Users} />
        <MetricCard title="Serviceable Obtainable Market (SOM)" value={data.som} icon={TrendingUp} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Market Dynamics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2"><span>Demand Index</span><span className="font-bold">{data.demandIndex}/100</span></div>
            <div className="flex justify-between border-b pb-2"><span>Competitor Density</span><span className="font-bold">{data.competitorDensity}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Growth Rate</span><span className="font-bold text-success">{data.growthRate}</span></div>
            <div className="flex justify-between border-b pb-2"><span>Customer Sentiment</span><span className="font-bold">{data.sentiment}%</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`,
  'src/app/(dashboard)/patents/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePatentIntelligence } from '@/hooks/usePatentIntelligence'
import { ScoreGauge } from '@/components/shared/ScoreGauge'

export default function PatentIntelligencePage() {
  const { data, isLoading } = usePatentIntelligence()

  if (isLoading) return <div>Loading patent data...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Patent Intelligence" description="Explore prior art, novelty scores, and risk analysis." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1"><CardContent className="pt-6"><ScoreGauge label="Novelty Score" score={data.noveltyScore} /></CardContent></Card>
        <Card className="col-span-2">
          <CardHeader><CardTitle>Risk Assessment</CardTitle></CardHeader>
          <CardContent>{data.riskAssessment}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Prior Art & Differentiators</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Prior Art Found</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.priorArt.map(p => (
                <li key={p.id} className="p-2 border rounded-md">{p.id} - {p.title} ({p.year})</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-success">Key Differentiators</h4>
            <ul className="space-y-2 text-sm list-disc pl-4 text-foreground/80">
              {data.differentiators.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/research/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResearchStudio } from '@/hooks/useResearchStudio'
import { Button } from '@/components/ui/button'

export default function ResearchStudioPage() {
  const { data, isLoading } = useResearchStudio()

  if (isLoading) return <div>Loading research...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Research Studio" description="Upload and analyze research papers for commercial viability." actions={<Button>Upload Paper</Button>} />
      <Card>
        <CardHeader><CardTitle>Research Summary (TRL: {data.trlScore})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p>{data.summary}</p>
          <div className="pt-4">
            <h4 className="font-semibold mb-2">Commercial Applications</h4>
            <ul className="list-disc pl-4 text-sm text-muted-foreground">
              {data.applications.map((app: string, i: number) => <li key={i}>{app}</li>)}
            </ul>
          </div>
          <div className="pt-4 border-t text-sm font-semibold text-primary">Funding Potential: {data.fundingPotential}</div>
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/digital-twin/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDigitalTwin } from '@/hooks/useDigitalTwin'
import { ScoreGauge } from '@/components/shared/ScoreGauge'

export default function DigitalTwinPage() {
  const { data, isLoading } = useDigitalTwin()

  if (isLoading) return <div>Loading simulation...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Innovation Digital Twin" description="Forecast revenue, adoption curves, and funding probabilities." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6"><ScoreGauge label="Funding Probability" score={data.fundingProbability} /></CardContent></Card>
        <Card>
          <CardHeader><CardTitle>Adoption Curve</CardTitle></CardHeader>
          <CardContent className="text-xl font-bold text-primary">{data.adoptionRate}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Growth Scenarios</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr><th className="p-3 rounded-tl-md">Timeline</th><th className="p-3">Worst Case</th><th className="p-3">Expected Case</th><th className="p-3 rounded-tr-md">Best Case</th></tr>
              </thead>
              <tbody>
                {data.forecasts.map((f: any) => (
                  <tr key={f.year} className="border-b">
                    <td className="p-3 font-medium">{f.year}</td>
                    <td className="p-3 text-destructive">{f.worstCase}</td>
                    <td className="p-3 font-semibold">{f.expectedCase}</td>
                    <td className="p-3 text-success">{f.bestCase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/funding/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFunding } from '@/hooks/useFunding'
import { ScoreGauge } from '@/components/shared/ScoreGauge'

export default function FundingPage() {
  const { data, isLoading } = useFunding()

  if (isLoading) return <div>Loading funding data...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Funding & Readiness" description="Match with grants, accelerators, and investors." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card><CardContent className="pt-6"><ScoreGauge label="Investor Match Score" score={data.investorScore} /></CardContent></Card>
        <Card><CardContent className="pt-6"><ScoreGauge label="Grant Match Score" score={data.grantScore} /></CardContent></Card>
        <Card><CardContent className="pt-6"><ScoreGauge label="Accelerator Score" score={data.acceleratorScore} /></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recommended Opportunities</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {data.opportunities.map((opp: string, i: number) => (
              <li key={i} className="p-3 bg-success/10 text-success rounded-md font-medium">{opp}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/corporate-hub/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCorporateHub } from '@/hooks/useCorporateHub'
import { ScoreGauge } from '@/components/shared/ScoreGauge'

export default function CorporateHubPage() {
  const { data, isLoading } = useCorporateHub()

  if (isLoading) return <div>Loading corporate data...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Corporate Innovation Hub" description="Manage innovation portfolios and leaderboards." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6"><ScoreGauge label="Overall Portfolio Health" score={data.portfolioHealth} /></CardContent></Card>
        <Card>
          <CardHeader><CardTitle>Active Projects</CardTitle></CardHeader>
          <CardContent className="text-4xl font-black text-primary">{data.activeProjects}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Department Leaderboard</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.departments.map((d: any) => (
            <ScoreGauge key={d.name} label={d.name} score={d.score} />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/command-center/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCommandCenter } from '@/hooks/useCommandCenter'
import { Badge } from '@/components/ui/badge'

export default function CommandCenterPage() {
  const { data, isLoading } = useCommandCenter()

  if (isLoading) return <div>Loading command center...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Innovation Command Center" description="Mission control for all AI agent activities and project health." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
          <CardContent><Badge variant="success" className="text-lg px-4 py-1">{data.status}</Badge></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>AI Tasks Completed</CardTitle></CardHeader>
          <CardContent className="text-4xl font-bold">{data.aiTasks}</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Recommended Next Steps</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {data.nextSteps.map((step: string, i: number) => (
              <li key={i} className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-primary"></span>{step}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/startup-builder/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useBuilder } from '@/hooks/useBuilder'
import { CheckCircle2, CircleDashed } from 'lucide-react'

export default function StartupBuilderPage() {
  const { mutate, data, isPending } = useBuilder()

  return (
    <div className="space-y-6">
      <PageHeader title="Startup Builder" description="Auto-generate pitch decks, business plans, and landing pages." />
      <Card>
        <CardHeader><CardTitle>Generate Assets</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <Button onClick={() => mutate({})} disabled={isPending}>{isPending ? 'Generating Assets...' : 'Generate Full Suite'}</Button>
          {data && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="p-4 border rounded-md flex items-center justify-between">
                <span className="font-medium">Pitch Deck</span>
                {data.deck === 'Generated' ? <CheckCircle2 className="text-success h-5 w-5" /> : <CircleDashed className="text-muted-foreground h-5 w-5" />}
              </div>
              <div className="p-4 border rounded-md flex items-center justify-between">
                <span className="font-medium">Business Plan</span>
                {data.plan === 'Generated' ? <CheckCircle2 className="text-success h-5 w-5" /> : <CircleDashed className="text-muted-foreground h-5 w-5" />}
              </div>
              <div className="p-4 border rounded-md flex items-center justify-between opacity-50">
                <span className="font-medium">Financial Model</span>
                {data.financial === 'Pending' && <CircleDashed className="h-5 w-5 animate-spin" />}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
`,
  'src/app/(dashboard)/report/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useReport } from '@/hooks/useReport'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { Button } from '@/components/ui/button'

export default function ReportPage() {
  const { data, isLoading } = useReport()

  if (isLoading) return <div>Loading report...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Commercialization Report" description="Executive summary of market, patent, and funding analysis." actions={<Button variant="outline">Export PDF</Button>} />
      <Card className="bg-primary/5">
        <CardHeader><CardTitle>Executive Summary</CardTitle></CardHeader>
        <CardContent className="text-sm font-medium leading-relaxed">{data.execSummary}</CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card><CardContent className="pt-6"><ScoreGauge label="Launch Probability" score={data.launchProb} /></CardContent></Card>
        <Card>
          <CardHeader><CardTitle>90-Day Action Plan</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              {data.actionPlan.map((action: string, i: number) => <li key={i}>{action}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`,
  'src/app/(dashboard)/settings/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings } from '@/hooks/useSettings'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { data, isLoading } = useSettings()

  if (isLoading) return <div>Loading settings...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage preferences, API keys, and platform integrations." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Organization Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><strong>Organization Name:</strong> {data.name}</div>
            <div><strong>Active Team Members:</strong> {data.activeMembers}</div>
            <Button variant="outline" size="sm" className="mt-2">Edit Profile</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>API Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><strong>API Limit Reached:</strong> {data.apiLimit}</div>
            <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden mt-1">
              <div className="bg-primary h-full" style={{ width: data.apiLimit }} />
            </div>
            <Button variant="outline" size="sm" className="mt-2">Manage API Keys</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`
};

for (const [filepath, content] of Object.entries(pageCode)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

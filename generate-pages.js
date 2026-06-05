const fs = require('fs');
const path = require('path');

const files = {
  'src/store/index.ts': `import { create } from 'zustand'

export interface Project {
  id: string
  name: string
  description: string
  industry: string
}

export interface AppState {
  currentProject: Project | null
  innovationIndex: number
  timelineProgress: number
  setCurrentProject: (p: Project) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentProject: {
    id: '1',
    name: 'AI-Powered Rural EV Charging Network',
    description: 'Transforming rural infrastructure with intelligent EV charging hubs powered by predictive AI for optimized grid load management.',
    industry: 'CleanTech / Transportation'
  },
  innovationIndex: 84,
  timelineProgress: 45,
  setCurrentProject: (p) => set({ currentProject: p })
}))
`,
  'src/store/mockData.ts': `export const MOCK_PROJECT = {
  id: '1',
  name: 'AI-Powered Rural EV Charging Network',
  description: 'Transforming rural infrastructure with intelligent EV charging hubs powered by predictive AI for optimized grid load management.',
  industry: 'CleanTech / Transportation',
  metrics: {
    launchProbability: 78,
    investmentReadiness: 85,
    marketPotential: 92,
    patentStrength: 65,
  }
}

export const MOCK_OPPORTUNITIES = [
  { id: '1', title: 'Predictive Load Balancing APIs', score: 92, demand: 'High' },
  { id: '2', title: 'Solar-integrated Micro-grids', score: 88, demand: 'Medium' },
  { id: '3', title: 'V2G (Vehicle to Grid) for Rural Farms', score: 81, demand: 'High' },
]

export const MOCK_SHARK_TANK_FEEDBACK = [
  { agent: 'Investor', score: 85, feedback: 'Strong TAM, but capital intensive. Need clarity on unit economics.' },
  { agent: 'Customer', score: 92, feedback: 'Range anxiety is real in rural areas. I would definitely use this.' },
  { agent: 'Patent Expert', score: 70, feedback: 'Hardware is hard to defend. Focus patents on the predictive AI algorithms.' },
  { agent: 'Competitor', score: 60, feedback: 'Tesla Superchargers might expand here eventually. What is your moat?' },
  { agent: 'Industry Mentor', score: 88, feedback: 'Great regulatory timing. Look into federal infrastructure grants.' },
]
`,
  'src/components/layout/Sidebar.tsx': `import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, Presentation, Search, Zap, 
  LineChart, Shield, Lightbulb, Users, 
  Activity, DollarSign, Building2, Terminal, 
  Rocket, FileText, Settings 
} from 'lucide-react'

const routes = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/board-room', label: 'Boardroom Summary', icon: Presentation },
  { href: '/opportunity', label: 'Opportunity Discovery', icon: Search },
  { href: '/startup-generator', label: 'Startup Generator', icon: Zap },
  { href: '/market', label: 'Market Validation', icon: LineChart },
  { href: '/patents', label: 'Patent Intelligence', icon: Shield },
  { href: '/research', label: 'Research Studio', icon: Lightbulb },
  { href: '/shark-tank', label: 'AI Shark Tank', icon: Users },
  { href: '/digital-twin', label: 'Innovation Digital Twin', icon: Activity },
  { href: '/funding', label: 'Funding & Readiness', icon: DollarSign },
  { href: '/corporate-hub', label: 'Corporate Innovation Hub', icon: Building2 },
  { href: '/command-center', label: 'Innovation Command Center', icon: Terminal },
  { href: '/startup-builder', label: 'Startup Builder', icon: Rocket },
  { href: '/report', label: 'Commercialization Report', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Zap className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">InnovateX AI</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === route.href 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
`,
  'src/components/layout/TopNav.tsx': `import { Bell, Search, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import { Progress } from '@/components/ui/progress'

export function TopNav() {
  const { currentProject, innovationIndex, timelineProgress } = useAppStore()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search projects, patents..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        {currentProject && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            {currentProject.name}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Innovation Success Index Widget */}
        <div className="hidden lg:flex items-center gap-3 bg-background border px-3 py-1.5 rounded-full shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground">Innovation Index</div>
          <div className="flex items-center gap-2">
            <Progress value={innovationIndex} className="w-16 h-2" />
            <span className="text-sm font-bold text-success">{innovationIndex}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-2 text-primary border-primary/30 hover:bg-primary/10">
          <Sparkles className="h-4 w-4" />
          AI Copilot
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-secondary/10 text-secondary">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
`,
  'src/components/layout/AppShell.tsx': `import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
`,
  'src/app/layout.tsx': `import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "InnovateX AI - Innovation Operating System",
  description: "Transforms ideas into validated startup opportunities.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={\`\${geistSans.variable} \${geistMono.variable} font-sans antialiased\`}>
        {children}
      </body>
    </html>
  )
}
`,
  'src/app/page.tsx': `import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
`,
  'src/app/(dashboard)/layout.tsx': `import { AppShell } from '@/components/layout/AppShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
`,
  'src/app/(dashboard)/dashboard/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { StatGrid } from '@/components/shared/StatGrid'
import { MetricCard } from '@/components/shared/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightCard } from '@/components/shared/InsightCard'
import { MOCK_PROJECT } from '@/store/mockData'
import { Activity, Target, Zap, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Command Center" 
        description={\`Currently working on: \${MOCK_PROJECT.name}\`} 
      />
      
      <StatGrid>
        <MetricCard title="Innovation Index" value="84/100" icon={Activity} trend={{ value: 12, isPositive: true }} />
        <MetricCard title="Market Validation" value="92%" icon={Target} trend={{ value: 4, isPositive: true }} />
        <MetricCard title="AI Insights Generated" value="156" icon={Zap} />
        <MetricCard title="Readiness Score" value="A-" icon={TrendingUp} trend={{ value: 2, isPositive: true }} />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline & Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                [Timeline Widget Visualization]
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <InsightCard 
            title="Strategic Opportunity" 
            content="Based on recent patent filings, focusing on predictive load balancing for rural EV grids provides a clear IP moat against major competitors."
          />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Run Market Validation', 'Generate Pitch Deck', 'Analyze Competitors'].map(action => (
                <div key={action} className="p-3 bg-secondary/5 rounded-md text-sm font-medium hover:bg-secondary/10 cursor-pointer transition-colors border">
                  {action}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
`,
  'src/app/(dashboard)/board-room/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { ScoreGauge } from '@/components/shared/ScoreGauge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrustBadge } from '@/components/shared/TrustBadge'
import { MOCK_PROJECT } from '@/store/mockData'

export default function BoardroomPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Boardroom Summary" 
        description="Executive overview of startup viability and readiness."
        actions={<TrustBadge label="Ready for Review" />}
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <ScoreGauge label="Launch Probability" score={MOCK_PROJECT.metrics.launchProbability} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <ScoreGauge label="Investment Readiness" score={MOCK_PROJECT.metrics.investmentReadiness} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <ScoreGauge label="Market Potential" score={MOCK_PROJECT.metrics.marketPotential} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <ScoreGauge label="Patent Strength" score={MOCK_PROJECT.metrics.patentStrength} />
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-success flex items-center gap-2">Top Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2"><span className="text-success font-bold">↑</span> High unserved demand in rural corridors</li>
              <li className="flex gap-2"><span className="text-success font-bold">↑</span> Strong tailwinds from government infrastructure grants</li>
              <li className="flex gap-2"><span className="text-success font-bold">↑</span> First-mover advantage in AI-driven micro-grid tech</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">Top Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-2"><span className="text-destructive font-bold">↓</span> High initial CAPEX for hardware deployment</li>
              <li className="flex gap-2"><span className="text-destructive font-bold">↓</span> Supply chain delays for transformers and battery storage</li>
              <li className="flex gap-2"><span className="text-destructive font-bold">↓</span> Dependency on local utility regulatory approvals</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
`,
  'src/app/(dashboard)/opportunity/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_OPPORTUNITIES } from '@/store/mockData'

export default function OpportunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Opportunity Discovery" description="AI-identified market adjacencies and technology trends." />
      
      <div className="grid md:grid-cols-3 gap-6">
        {MOCK_OPPORTUNITIES.map(opp => (
          <Card key={opp.id} className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{opp.title}</CardTitle>
                <Badge variant={opp.demand === 'High' ? 'success' : 'warning'}>{opp.demand} Demand</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Opportunity Score</span>
                <span className="font-bold text-lg">{opp.score}/100</span>
              </div>
              <div className="mt-4 h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: \`\${opp.score}%\` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
`,
  'src/app/(dashboard)/shark-tank/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_SHARK_TANK_FEEDBACK } from '@/store/mockData'
import { User } from 'lucide-react'

export default function SharkTankPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Shark Tank" description="Simulated investor and expert feedback." />
      
      <div className="grid gap-4">
        {MOCK_SHARK_TANK_FEEDBACK.map(feedback => (
          <Card key={feedback.agent} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">{feedback.agent}</div>
                  <div className="text-sm font-medium text-muted-foreground">AI Persona</div>
                </div>
              </div>
              
              <div className="flex-1 text-sm bg-muted/50 p-4 rounded-lg border">
                "{feedback.feedback}"
              </div>
              
              <div className="flex flex-col items-center justify-center min-w-[80px]">
                <div className="text-3xl font-black text-primary">{feedback.score}</div>
                <div className="text-xs text-muted-foreground font-semibold">SCORE</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

const fs = require('fs');
const path = require('path');

const files = {
  'src/components/layout/Sidebar.tsx': `"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, Search, Zap, 
  LineChart, Shield, Lightbulb, 
  DollarSign, Building2, FileText, Settings 
} from 'lucide-react'

const routes = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/opportunity', label: 'Opportunity Discovery', icon: Search },
  { href: '/startup-generator', label: 'Startup Generator', icon: Zap },
  { href: '/market', label: 'Market Validation', icon: LineChart },
  { href: '/patents', label: 'Patent Intelligence', icon: Shield },
  { href: '/research', label: 'Research Studio', icon: Lightbulb },
  { href: '/funding', label: 'Funding & Readiness', icon: DollarSign },
  { href: '/corporate-hub', label: 'Corporate Innovation Hub', icon: Building2 },
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
          {routes.map((route) => {
            const isActive = pathname === route.href || (pathname === '/' && route.href === '/dashboard')
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary/10 hover:text-foreground"
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
`,
  'src/components/layout/TopNav.tsx': `"use client"
import { Bell, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'

export function TopNav() {
  const { currentProject } = useAppStore()

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
  'src/components/shared/InsightPanel.tsx': `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Sparkles, ArrowRight } from "lucide-react"

export function InsightPanel({ discovered, matters, nextSteps }: { discovered: React.ReactNode, matters: React.ReactNode, nextSteps: React.ReactNode }) {
  return (
    <Card className="bg-primary/5 border-primary/20 shadow-sm mt-6">
      <CardContent className="p-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Search className="h-4 w-4" /> What was discovered?
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">{discovered}</div>
        </div>
        <div className="space-y-2 md:border-l md:pl-6 border-primary/10">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Info className="h-4 w-4" /> Why does it matter?
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">{matters}</div>
        </div>
        <div className="space-y-2 md:border-l md:pl-6 border-primary/10">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ArrowRight className="h-4 w-4" /> Next Steps
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">{nextSteps}</div>
        </div>
      </CardContent>
    </Card>
  )
}
import { Search } from 'lucide-react'
`,
  'src/app/(dashboard)/dashboard/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { StatGrid } from '@/components/shared/StatGrid'
import { MetricCard } from '@/components/shared/MetricCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { MOCK_PROJECT } from '@/store/mockData'
import { Activity, Target, ShieldCheck, Zap } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Single overview of the innovation journey." 
      />
      
      <StatGrid>
        <MetricCard title="Innovation Score" value="84/100" icon={Activity} />
        <MetricCard title="Market Validation" value="92%" icon={Target} />
        <MetricCard title="Patent Novelty" value="78/100" icon={ShieldCheck} />
        <MetricCard title="Commercialization Potential" value="High" icon={Zap} />
      </StatGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Progress Tracker</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b pb-2"><span>1. Idea Generation</span> <span className="text-success font-bold">Complete</span></div>
                <div className="flex justify-between items-center text-sm border-b pb-2"><span>2. Startup Validation</span> <span className="text-success font-bold">Complete</span></div>
                <div className="flex justify-between items-center text-sm border-b pb-2 bg-primary/5 p-2 rounded"><span>3. Patent Research</span> <span className="text-primary font-bold">In Progress</span></div>
                <div className="flex justify-between items-center text-sm border-b pb-2 opacity-50"><span>4. Funding & Readiness</span> <span>Pending</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {['Run Market Validation', 'Analyze Patent Landscape', 'Generate Startup Opportunity', 'Review Research Paper'].map(action => (
                <div key={action} className="p-3 bg-secondary/5 rounded-md text-sm font-medium hover:bg-secondary/10 cursor-pointer transition-colors border">
                  {action}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <InsightPanel 
        discovered="The 'AI-Powered Rural EV Charging Network' shows a 92% market validation score."
        matters="High market validation indicates strong product-market fit potential, reducing commercialization risk."
        nextSteps="Proceed to Patent Intelligence to analyze prior art and establish an IP moat."
      />
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

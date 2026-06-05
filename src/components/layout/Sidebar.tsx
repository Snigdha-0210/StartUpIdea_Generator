"use client"
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

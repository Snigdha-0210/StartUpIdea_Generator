"use client"
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

"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'

export default function CorporateHubPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Corporate Innovation Hub" description="Manage innovation pipelines inside organizations." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>AI Idea Clustering</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">AI has detected 3 duplicate submissions related to "Solar EV Charging".</p>
            <div className="p-3 bg-secondary/10 text-secondary rounded-md">Merged into: Project EcoCharge (Impact: High)</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Portfolio Overview</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2"><span>Active Projects</span><span className="font-bold">14</span></div>
            <div className="flex justify-between border-b pb-2"><span>Top Department</span><span className="font-bold">Energy R&D</span></div>
          </CardContent>
        </Card>
      </div>
      <InsightPanel 
        discovered="AI clustering identified duplicate efforts across departments, merging them into a single high-priority project."
        matters="Eliminating redundant R&D saves corporate resources and accelerates time-to-market."
        nextSteps="Review the newly merged project in the Innovation Pipeline."
      />
    </div>
  )
}

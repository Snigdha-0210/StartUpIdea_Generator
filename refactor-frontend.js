const fs = require('fs');
const path = require('path');

const frontendCode = {
  'src/app/(dashboard)/startup-generator/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { useState } from 'react'

export default function StartupGeneratorPage() {
  const [idea, setIdea] = useState('AI-powered legal assistant')
  const [isPending, setIsPending] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleGenerate = async () => {
    setIsPending(true)
    try {
      const res = await fetch('/api/ideas/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      })
      const result = await res.json()
      setData(result)
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
              value={idea}
              onChange={e => setIdea(e.target.value)}
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
        nextSteps={data ? "Proceed to Market Validation for deeper keyword-level analysis." : "Click 'Validate Startup Idea' above."}
      />
    </div>
  )
}
`
};

for (const [filepath, content] of Object.entries(frontendCode)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

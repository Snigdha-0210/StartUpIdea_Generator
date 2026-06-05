"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { Button } from '@/components/ui/button'

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Commercialization Report" description="Final output executive summary." actions={<Button>Download PDF</Button>} />
      <Card className="bg-primary/5">
        <CardHeader><CardTitle>Executive Summary</CardTitle></CardHeader>
        <CardContent>EcoCharge AI represents a highly viable startup opportunity in rural EV charging. With a TAM of $15B and high patent novelty in its predictive AI, it is strongly positioned for DOE grant funding.</CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>90-Day Roadmap</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-sm">
              <li>Incorporate C-Corp entity.</li>
              <li>File provisional patent for load-balancing algorithm.</li>
              <li>Submit application for DOE Rural Infrastructure Grant.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <InsightPanel 
        discovered="The comprehensive commercialization report is ready for stakeholder review."
        matters="A structured report synthesizes all validation steps into a compelling investor narrative."
        nextSteps="Download the PDF and share it with your corporate board or investors."
      />
    </div>
  )
}

const fs = require('fs');
const path = require('path');

const files = {
  'src/components/shared/InsightPanel.tsx': `import { Card, CardContent } from "@/components/ui/card"
import { Info, Search, ArrowRight } from "lucide-react"

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
            <ArrowRight className="h-4 w-4" /> What should you do next?
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">{nextSteps}</div>
        </div>
      </CardContent>
    </Card>
  )
}
`,
  'src/app/(dashboard)/opportunity/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'

export default function OpportunityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Opportunity Discovery" description="Generate innovative startup opportunities by analyzing trends." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Emerging Technology</CardTitle></CardHeader>
          <CardContent>AI-driven load balancing for decentralized energy grids.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Market Gaps</CardTitle></CardHeader>
          <CardContent>Lack of scalable infrastructure in rural regions.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Industry Challenges</CardTitle></CardHeader>
          <CardContent>Grid instability and high hardware costs.</CardContent>
        </Card>
      </div>
      <InsightPanel 
        discovered="A significant gap in rural EV charging infrastructure coupled with new AI advancements in load prediction."
        matters="It presents an opportunity to capture a high-demand, low-competition market segment."
        nextSteps="Navigate to the Startup Generator to structure a business model around this opportunity."
      />
    </div>
  )
}
`,
  'src/app/(dashboard)/startup-generator/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InsightPanel } from '@/components/shared/InsightPanel'

export default function StartupGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Startup Generator" description="Structure business models from validated opportunities." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>User Inputs</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <select className="w-full p-2 rounded-md border"><option>CleanTech</option></select>
            <select className="w-full p-2 rounded-md border"><option>Predictive AI</option></select>
            <input type="text" className="w-full p-2 rounded-md border" defaultValue="Grid Instability" />
            <select className="w-full p-2 rounded-md border"><option>Seed ($500k - $2M)</option></select>
            <Button className="w-full">Generate Startup</Button>
          </CardContent>
        </Card>
        <Card className="bg-primary/5">
          <CardHeader><CardTitle>EcoCharge AI</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div><strong>Problem:</strong> Rural grid instability limits EV adoption.</div>
            <div><strong>Solution:</strong> AI-managed solar-powered charging hubs.</div>
            <div><strong>Revenue Model:</strong> Pay-per-kWh & Subscriptions.</div>
            <div><strong>Business Model:</strong> B2B2C hardware-as-a-service.</div>
          </CardContent>
        </Card>
      </div>
      <InsightPanel 
        discovered="EcoCharge AI presents a viable B2B2C business model with a recurring revenue stream."
        matters="A clear revenue model and defined target market are essential for investor readiness."
        nextSteps="Proceed to Market Validation to verify the TAM and competitor landscape."
      />
    </div>
  )
}
`,
  'src/app/(dashboard)/market/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'

export default function MarketValidationPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Market Validation" description="Validate startup ideas against market size and competitors." />
      <div className="grid md:grid-cols-3 gap-6">
        <Card><CardHeader><CardTitle>TAM</CardTitle></CardHeader><CardContent className="text-2xl font-bold">$15B</CardContent></Card>
        <Card><CardHeader><CardTitle>SAM</CardTitle></CardHeader><CardContent className="text-2xl font-bold">$3.2B</CardContent></Card>
        <Card><CardHeader><CardTitle>SOM</CardTitle></CardHeader><CardContent className="text-2xl font-bold">$450M</CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Competitor & Risk Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between border-b pb-2"><span>Competitors</span><span>Tesla, ChargePoint</span></div>
          <div className="flex justify-between border-b pb-2"><span>Barriers to Entry</span><span>High CAPEX, Grid Regulations</span></div>
          <div className="flex justify-between border-b pb-2"><span>Innovation Viability</span><span className="text-success font-bold">High (94/100)</span></div>
        </CardContent>
      </Card>
      <InsightPanel 
        discovered="The Total Addressable Market is $15B with a low competitor density in rural regions."
        matters="A large TAM with low competition significantly lowers the risk of market entry failure."
        nextSteps="Analyze the Patent Intelligence module to ensure freedom to operate."
      />
    </div>
  )
}
`,
  'src/app/(dashboard)/patents/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'

export default function PatentIntelligencePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Patent Intelligence" description="Analyze novelty and prior art for your concept." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Prior Art Timeline</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li><strong>2019:</strong> EP1928B1 - Rural Micro-grid Storage</li>
              <li><strong>2021:</strong> US20210A1 - Smart Grid Load Manager</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Differentiation Suggestions</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2">
              <li>Focus patent claims on the <strong>predictive ML algorithms</strong> rather than hardware.</li>
              <li>Include modular V2G (Vehicle-to-Grid) arbitrage methods.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <InsightPanel 
        discovered="While hardware patents exist, the specific AI load balancing application is highly novel."
        matters="Establishing an IP moat around the software algorithm increases company valuation."
        nextSteps="Use these insights to draft provisional patent claims or move to Funding Readiness."
      />
    </div>
  )
}
`,
  'src/app/(dashboard)/research/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'
import { Button } from '@/components/ui/button'

export default function ResearchStudioPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Research Studio" description="Convert academic research into commercial startups." actions={<Button>Upload Paper</Button>} />
      <Card>
        <CardHeader><CardTitle>Research Summary: Advanced ML Grid Balancing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p>This paper demonstrates a novel neural network architecture for predicting localized grid loads in decentralized rural environments.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div><strong>TRL Score:</strong> 6 (Prototype demonstrated in relevant environment)</div>
            <div><strong>Commercial Potential:</strong> High</div>
          </div>
        </CardContent>
      </Card>
      <InsightPanel 
        discovered="The research paper translates directly into a high-potential CleanTech startup opportunity."
        matters="Bridging the gap between academia and industry accelerates commercialization of breakthrough technologies."
        nextSteps="Navigate to Funding & Readiness to find grants suitable for TRL 6 technologies."
      />
    </div>
  )
}
`,
  'src/app/(dashboard)/funding/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InsightPanel } from '@/components/shared/InsightPanel'

export default function FundingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Funding & Readiness" description="Support commercialization with targeted capital." />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recommended Programs</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 border rounded-md">DOE Rural Infrastructure Grant ($2M) - <span className="text-success font-bold">95% Match</span></div>
            <div className="p-3 border rounded-md">ClimateTech Seed Fund ($500K) - <span className="text-success font-bold">88% Match</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Readiness Status</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between border-b pb-2"><span>Investor Readiness</span><span className="font-bold text-success">High</span></div>
            <div className="flex justify-between border-b pb-2"><span>Commercialization Readiness</span><span className="font-bold text-warning">Medium</span></div>
          </CardContent>
        </Card>
      </div>
      <InsightPanel 
        discovered="The project is a 95% match for a $2M DOE grant due to its rural focus."
        matters="Non-dilutive funding at this stage preserves founder equity while financing CAPEX."
        nextSteps="Generate the final Commercialization Report to attach to your grant application."
      />
    </div>
  )
}
`,
  'src/app/(dashboard)/corporate-hub/page.tsx': `"use client"
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
`,
  'src/app/(dashboard)/report/page.tsx': `"use client"
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
`,
  'src/app/(dashboard)/settings/page.tsx': `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage profile, security, and integrations." />
      <Card>
        <CardHeader><CardTitle>Profile & Organization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><strong>Name:</strong> Innovator User</div>
          <div><strong>Organization:</strong> InnovateX Corp</div>
        </CardContent>
      </Card>
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

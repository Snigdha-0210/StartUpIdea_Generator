const fs = require('fs');
const path = require('path');

const generatePage = (title, description) => `"use client"
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="${title}" description="${description}" />
      <Card>
        <CardContent className="p-12 flex items-center justify-center text-muted-foreground">
          Detailed implementation for ${title} is coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
`;

const files = {
  'src/app/(dashboard)/startup-generator/page.tsx': generatePage("Startup Generator", "Configure and generate new startup models based on validated opportunities."),
  'src/app/(dashboard)/market/page.tsx': generatePage("Market Validation", "Analyze Total Addressable Market and customer demand signals."),
  'src/app/(dashboard)/patents/page.tsx': generatePage("Patent Intelligence", "Explore prior art, novelty scores, and risk analysis."),
  'src/app/(dashboard)/research/page.tsx': generatePage("Research Studio", "Upload and analyze research papers for commercial viability."),
  'src/app/(dashboard)/digital-twin/page.tsx': generatePage("Innovation Digital Twin", "Forecast revenue, adoption curves, and funding probabilities."),
  'src/app/(dashboard)/funding/page.tsx': generatePage("Funding & Readiness", "Match with grants, accelerators, and investors."),
  'src/app/(dashboard)/corporate-hub/page.tsx': generatePage("Corporate Innovation Hub", "Manage innovation portfolios and leaderboards."),
  'src/app/(dashboard)/command-center/page.tsx': generatePage("Innovation Command Center", "Mission control for all AI agent activities and project health."),
  'src/app/(dashboard)/startup-builder/page.tsx': generatePage("Startup Builder", "Auto-generate pitch decks, business plans, and landing pages."),
  'src/app/(dashboard)/report/page.tsx': generatePage("Commercialization Report", "Executive summary of market, patent, and funding analysis."),
  'src/app/(dashboard)/settings/page.tsx': generatePage("Settings", "Manage preferences, API keys, and platform integrations."),
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

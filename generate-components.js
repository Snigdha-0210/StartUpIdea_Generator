const fs = require('fs');
const path = require('path');

const components = {
  'src/components/ui/badge.tsx': `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        success: "border-transparent bg-success text-success-foreground",
        warning: "border-transparent bg-warning text-warning-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { Badge, badgeVariants }
`,
  'src/components/ui/progress.tsx': `import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root ref={ref} className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary/20", className)} {...props}>
    <ProgressPrimitive.Indicator className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName
export { Progress }
`,
  'src/components/shared/MetricCard.tsx': `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function MetricCard({ title, value, trend, icon: Icon, className }: { title: string, value: string, trend?: { value: number, isPositive: boolean }, icon?: any, className?: string }) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs", trend.isPositive ? "text-success" : "text-destructive")}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
`,
  'src/components/shared/PageHeader.tsx': `export function PageHeader({ title, description, actions }: { title: string, description?: string, actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  )
}
`,
  'src/components/shared/SectionHeader.tsx': `export function SectionHeader({ title, description }: { title: string, description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}
`,
  'src/components/shared/InsightCard.tsx': `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function InsightCard({ title, content }: { title: string, content: React.ReactNode }) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-primary">
          <Sparkles className="h-4 w-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/80 leading-relaxed">
        {content}
      </CardContent>
    </Card>
  )
}
`,
  'src/components/shared/ScoreGauge.tsx': `import { Progress } from "@/components/ui/progress"

export function ScoreGauge({ label, score, max = 100 }: { label: string, score: number, max?: number }) {
  const percentage = (score / max) * 100
  let color = "bg-primary"
  if (percentage >= 80) color = "bg-success"
  else if (percentage <= 40) color = "bg-destructive"
  else if (percentage <= 70) color = "bg-warning"

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-bold">{score}/{max}</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/20">
        <div className={\`h-full flex-1 transition-all \${color}\`} style={{ width: \`\${percentage}%\` }} />
      </div>
    </div>
  )
}
`,
  'src/components/shared/TrustBadge.tsx': `import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"

export function TrustBadge({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="flex items-center gap-1 bg-success/10 text-success border-success/20">
      <ShieldCheck className="h-3 w-3" />
      {label}
    </Badge>
  )
}
`,
  'src/components/shared/StatGrid.tsx': `export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{children}</div>
}
`
};

for (const [filepath, content] of Object.entries(components)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

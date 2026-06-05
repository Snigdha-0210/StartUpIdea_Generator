import { Card, CardContent } from "@/components/ui/card"
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

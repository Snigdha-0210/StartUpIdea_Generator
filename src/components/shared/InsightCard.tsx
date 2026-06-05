import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"

export function TrustBadge({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="flex items-center gap-1 bg-success/10 text-success border-success/20">
      <ShieldCheck className="h-3 w-3" />
      {label}
    </Badge>
  )
}

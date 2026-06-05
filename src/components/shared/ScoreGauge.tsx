

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
        <div className={`h-full flex-1 transition-all ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

import type { Insight } from '../../lib/insights'

interface InsightCardProps {
  insight: Insight
}

const SEVERITY = {
  green:  { border: 'border-accent/25',    bg: 'bg-accent/5',    dot: 'bg-accent',    badge: 'bg-accent/15 text-accent',    label: 'Positivo' },
  yellow: { border: 'border-attention/25', bg: 'bg-attention/5', dot: 'bg-attention', badge: 'bg-attention/15 text-attention', label: 'Atenção' },
  red:    { border: 'border-negative/25',  bg: 'bg-negative/5',  dot: 'bg-negative',  badge: 'bg-negative/15 text-negative',  label: 'Alerta' },
}

export default function InsightCard({ insight }: InsightCardProps) {
  const s = SEVERITY[insight.severity]
  return (
    <div className={`relative bg-surface border ${s.border} ${s.bg} rounded-2xl p-5 overflow-hidden`}>
      {/* Pulse dot top-right */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
      </div>

      <div className="flex items-start gap-4 pr-20">
        <div className={`w-12 h-12 rounded-xl ${s.badge.split(' ')[0]} flex items-center justify-center flex-shrink-0 text-2xl`}>
          {insight.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-title font-bold text-text-primary text-base mb-1.5 leading-snug">
            {insight.title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  )
}

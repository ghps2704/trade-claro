interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  color?: 'accent' | 'negative' | 'attention' | 'default'
  trend?: 'up' | 'down' | 'neutral'
}

const COLOR_MAP = {
  accent:    { border: 'border-accent/20', glow: 'bg-accent/5', text: 'text-accent',    icon: 'bg-accent/10' },
  negative:  { border: 'border-negative/20', glow: 'bg-negative/5', text: 'text-negative', icon: 'bg-negative/10' },
  attention: { border: 'border-attention/20', glow: 'bg-attention/5', text: 'text-attention', icon: 'bg-attention/10' },
  default:   { border: 'border-border', glow: '', text: 'text-text-primary', icon: 'bg-border/60' },
}

export default function KpiCard({ title, value, subtitle, icon, color = 'default', trend }: KpiCardProps) {
  const c = COLOR_MAP[color]
  return (
    <div className={`relative bg-surface border ${c.border} rounded-2xl p-5 overflow-hidden group hover:border-opacity-60 transition-all duration-200`}>
      {/* Background glow */}
      {color !== 'default' && (
        <div className={`absolute inset-0 ${c.glow} pointer-events-none`} />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
          <p className={`text-2xl font-title font-bold ${c.text} leading-none`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-text-secondary text-xs mt-2 leading-snug">{subtitle}</p>
          )}
        </div>

        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>

      {trend && (
        <div className={`mt-3 pt-3 border-t border-border/50 flex items-center gap-1 text-xs ${
          trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-negative' : 'text-text-secondary'
        }`}>
          <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
          <span>{trend === 'up' ? 'Em alta' : trend === 'down' ? 'Em queda' : 'Estável'}</span>
        </div>
      )}
    </div>
  )
}

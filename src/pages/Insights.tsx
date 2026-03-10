import { useMemo } from 'react'
import { useTrades } from '../hooks/useTrades'
import InsightCard from '../components/ui/InsightCard'
import { calculateInsights } from '../lib/insights'

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

export default function Insights() {
  const { trades, loading } = useTrades()
  const insights = calculateInsights(trades)

  const stats = useMemo(() => {
    if (trades.length === 0) return null
    const avg = trades.reduce((s, t) => s + t.result, 0) / trades.length
    const planRate = (trades.filter(t => t.followed_plan).length / trades.length) * 100
    const avgEmotion = trades.reduce((s, t) => s + t.emotion, 0) / trades.length
    const winRate = (trades.filter(t => t.result > 0).length / trades.length) * 100
    return { avg, planRate, avgEmotion, winRate }
  }, [trades])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-title text-3xl font-bold text-text-primary">Insights</h1>
        <p className="text-text-secondary text-sm mt-1">
          Padrões descobertos automaticamente nos seus {trades.length} trades
        </p>
      </div>

      {/* Progress para chegar em 5 */}
      {trades.length < 5 && (
        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="max-w-sm mx-auto text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="font-title text-xl font-bold text-text-primary mb-2">Poucos dados ainda</h2>
            <p className="text-text-secondary text-sm mb-6">
              Registre pelo menos 5 trades para ver insights automáticos sobre seus padrões de comportamento.
            </p>
            {/* Progress bar */}
            <div className="mb-2 flex justify-between text-xs text-text-secondary">
              <span>{trades.length} de 5 trades</span>
              <span>{5 - trades.length} restante{5 - trades.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-500"
                style={{ width: `${(trades.length / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  i < trades.length
                    ? 'bg-accent border-accent text-bg'
                    : 'bg-transparent border-border text-text-secondary'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats banner */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Resultado médio', value: fmt(stats.avg), color: stats.avg >= 0 ? 'text-accent' : 'text-negative' },
            { label: 'Win rate', value: `${stats.winRate.toFixed(1)}%`, color: stats.winRate >= 50 ? 'text-accent' : 'text-attention' },
            { label: 'Disciplina', value: `${stats.planRate.toFixed(0)}%`, color: stats.planRate >= 70 ? 'text-accent' : 'text-attention' },
            { label: 'Humor médio', value: `${stats.avgEmotion.toFixed(1)}/10`, color: stats.avgEmotion >= 6 ? 'text-accent' : 'text-attention' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-text-secondary text-xs mb-1">{s.label}</p>
              <p className={`font-title font-bold text-xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Insights list */}
      {trades.length >= 5 && insights.length === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <span className="text-4xl block mb-3">🔍</span>
          <h2 className="font-title text-xl font-bold text-text-primary mb-2">Sem insights ainda</h2>
          <p className="text-text-secondary">Continue registrando trades para que padrões apareçam.</p>
        </div>
      )}

      {insights.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-title font-semibold text-text-primary">
              {insights.length} insight{insights.length !== 1 ? 's' : ''} encontrado{insights.length !== 1 ? 's' : ''}
            </h2>
            <div className="flex gap-2">
              {['red', 'yellow', 'green'].map(s => {
                const count = insights.filter(i => i.severity === s).length
                if (count === 0) return null
                const colors: Record<string, string> = {
                  red: 'bg-negative/15 text-negative',
                  yellow: 'bg-attention/15 text-attention',
                  green: 'bg-accent/15 text-accent',
                }
                const labels: Record<string, string> = { red: 'Alertas', yellow: 'Atenção', green: 'Positivos' }
                return (
                  <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors[s]}`}>
                    {count} {labels[s]}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Alertas primeiro */}
          {(['red', 'yellow', 'green'] as const).map(severity => {
            const group = insights.filter(i => i.severity === severity)
            if (group.length === 0) return null
            return (
              <div key={severity} className="space-y-3 mb-4">
                {group.map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Resumo estatístico */}
      {trades.length >= 5 && (
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="font-title font-semibold text-text-primary mb-4">Resumo por Faixa de Emoção</h2>
          <div className="space-y-3">
            {[
              { label: 'Emoção baixa (1–3)', trades: trades.filter(t => t.emotion <= 3) },
              { label: 'Emoção neutra (4–6)', trades: trades.filter(t => t.emotion >= 4 && t.emotion <= 6) },
              { label: 'Emoção alta (7–10)', trades: trades.filter(t => t.emotion >= 7) },
            ].map(row => {
              const avg = row.trades.length > 0 ? row.trades.reduce((s, t) => s + t.result, 0) / row.trades.length : null
              const winRate = row.trades.length > 0 ? (row.trades.filter(t => t.result > 0).length / row.trades.length) * 100 : null
              return (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-text-primary text-sm font-medium">{row.label}</p>
                    <p className="text-text-secondary text-xs">{row.trades.length} trade{row.trades.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-text-secondary text-xs">Win rate</p>
                      <p className={`font-mono font-bold text-sm ${winRate === null ? 'text-text-secondary' : winRate >= 50 ? 'text-accent' : 'text-negative'}`}>
                        {winRate === null ? '—' : `${winRate.toFixed(0)}%`}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">Média</p>
                      <p className={`font-mono font-bold text-sm ${avg === null ? 'text-text-secondary' : avg >= 0 ? 'text-accent' : 'text-negative'}`}>
                        {avg === null ? '—' : fmt(avg)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

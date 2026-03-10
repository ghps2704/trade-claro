import { useState, useMemo } from 'react'
import { useTrades } from '../hooks/useTrades'
import ResultBadge from '../components/ui/ResultBadge'
import EmotionDots from '../components/ui/EmotionDots'
import KpiCard from '../components/ui/KpiCard'
import TradeForm from '../components/trade/TradeForm'
import type { TradeFormData } from '../types'

const fmt = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

export default function Dashboard() {
  const { trades, loading, createTrade } = useTrades()
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (data: TradeFormData) => {
    await createTrade(data)
    setShowForm(false)
  }

  const metrics = useMemo(() => {
    if (trades.length === 0) return null
    const wins = trades.filter(t => t.result > 0)
    const losses = trades.filter(t => t.result < 0)
    const withPlan = trades.filter(t => t.followed_plan)
    const withoutPlan = trades.filter(t => !t.followed_plan)

    const sorted = [...trades].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    let streak = 0
    let streakType: 'win' | 'loss' | null = null
    for (const t of sorted) {
      const isWin = t.result > 0
      if (streakType === null) { streakType = isWin ? 'win' : 'loss'; streak = 1 }
      else if ((streakType === 'win') === isWin) streak++
      else break
    }

    const byAsset: Record<string, number> = {}
    trades.forEach(t => { byAsset[t.asset] = (byAsset[t.asset] || 0) + t.result })
    const bestAsset = Object.entries(byAsset).sort((a, b) => b[1] - a[1])[0]

    return {
      total: trades.reduce((s, t) => s + t.result, 0),
      winRate: (wins.length / trades.length) * 100,
      wins: wins.length,
      losses: losses.length,
      avgEmotion: trades.reduce((s, t) => s + t.emotion, 0) / trades.length,
      planRate: (withPlan.length / trades.length) * 100,
      avgWithPlan: withPlan.length > 0 ? withPlan.reduce((s, t) => s + t.result, 0) / withPlan.length : 0,
      avgWithoutPlan: withoutPlan.length > 0 ? withoutPlan.reduce((s, t) => s + t.result, 0) / withoutPlan.length : 0,
      streak,
      streakType,
      bestAsset,
    }
  }, [trades])

  const chartTrades = useMemo(() => trades.slice(0, 14).reverse(), [trades])
  const maxAbs = useMemo(() => Math.max(...chartTrades.map(t => Math.abs(t.result)), 1), [chartTrades])

  const emotionBuckets = useMemo(() => {
    const buckets = [
      { label: '1–3', trades: trades.filter(t => t.emotion <= 3) },
      { label: '4–6', trades: trades.filter(t => t.emotion >= 4 && t.emotion <= 6) },
      { label: '7–10', trades: trades.filter(t => t.emotion >= 7) },
    ]
    return buckets.map(b => ({
      ...b,
      avg: b.trades.length > 0 ? b.trades.reduce((s, t) => s + t.result, 0) / b.trades.length : 0,
      count: b.trades.length,
    }))
  }, [trades])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm capitalize">{today}</p>
          <h1 className="font-title text-3xl font-bold text-text-primary mt-0.5">Dashboard</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
        >
          <span className="text-lg leading-none">+</span>
          Novo Trade
        </button>
      </div>

      {/* Empty state */}
      {trades.length === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="font-title text-xl font-bold text-text-primary mb-2">Nenhum trade ainda</h2>
          <p className="text-text-secondary text-sm mb-6 max-w-xs mx-auto">
            Registre seu primeiro trade para começar a ver métricas e insights sobre seu desempenho.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all"
          >
            Registrar primeiro trade →
          </button>
        </div>
      )}

      {metrics && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Resultado Total"
              value={fmt(metrics.total)}
              subtitle={`${trades.length} trades no total`}
              icon="💰"
              color={metrics.total >= 0 ? 'accent' : 'negative'}
            />
            <KpiCard
              title="Win Rate"
              value={`${metrics.winRate.toFixed(1)}%`}
              subtitle={`${metrics.wins}V · ${metrics.losses}D`}
              icon="🎯"
              color={metrics.winRate >= 50 ? 'accent' : 'attention'}
            />
            <KpiCard
              title="Humor Médio"
              value={`${metrics.avgEmotion.toFixed(1)}/10`}
              subtitle="estado emocional geral"
              icon="🧠"
              color={metrics.avgEmotion >= 6 ? 'accent' : metrics.avgEmotion >= 4 ? 'attention' : 'negative'}
            />
            <KpiCard
              title="Seguiu o Plano"
              value={`${metrics.planRate.toFixed(0)}%`}
              subtitle={`${trades.filter(t => t.followed_plan).length} de ${trades.length} trades`}
              icon="📋"
              color={metrics.planRate >= 70 ? 'accent' : metrics.planRate >= 50 ? 'attention' : 'negative'}
            />
          </div>

          {/* Streak + Best Asset */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-surface border rounded-2xl p-5 flex items-center gap-4 ${
              metrics.streakType === 'win' ? 'border-accent/20' : 'border-negative/20'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                metrics.streakType === 'win' ? 'bg-accent/10' : 'bg-negative/10'
              }`}>
                {metrics.streakType === 'win' ? '🔥' : '❄️'}
              </div>
              <div>
                <p className="text-text-secondary text-xs uppercase tracking-wider">Sequência atual</p>
                <p className={`font-title text-2xl font-bold mt-0.5 ${
                  metrics.streakType === 'win' ? 'text-accent' : 'text-negative'
                }`}>
                  {metrics.streak} {metrics.streakType === 'win' ? 'vitória' : 'derrota'}{metrics.streak !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {metrics.bestAsset && (
              <div className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-attention/10 flex items-center justify-center text-2xl flex-shrink-0">⭐</div>
                <div>
                  <p className="text-text-secondary text-xs uppercase tracking-wider">Melhor ativo</p>
                  <p className="font-title text-2xl font-bold text-text-primary mt-0.5">{metrics.bestAsset[0]}</p>
                  <p className="text-accent text-xs font-mono">{fmt(metrics.bestAsset[1])}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bar chart */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title font-semibold text-text-primary">Histórico de Resultado</h2>
              <span className="text-text-secondary text-xs">últimos {chartTrades.length} trades</span>
            </div>
            <div className="flex items-end gap-1.5 h-28">
              {chartTrades.map(trade => {
                const h = Math.max((Math.abs(trade.result) / maxAbs) * 100, 4)
                const isWin = trade.result >= 0
                return (
                  <div
                    key={trade.id}
                    className={`flex-1 group relative rounded-t-sm transition-all cursor-default ${isWin ? 'bg-accent/70 hover:bg-accent' : 'bg-negative/60 hover:bg-negative'}`}
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-bg border border-border rounded-lg px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="font-bold text-text-primary">{trade.asset}</p>
                      <p className={isWin ? 'text-accent' : 'text-negative'}>{fmt(trade.result)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Emoção × Resultado */}
            <div className="col-span-2 bg-surface border border-border rounded-2xl p-5">
              <h2 className="font-title font-semibold text-text-primary mb-4">Emoção × Resultado</h2>
              <div className="space-y-2.5">
                {trades.slice(0, 8).map(trade => {
                  const maxR = Math.max(...trades.slice(0, 8).map(t => Math.abs(t.result)), 1)
                  const w = (Math.abs(trade.result) / maxR) * 100
                  return (
                    <div key={trade.id} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-20 flex-shrink-0">
                        <span className="text-text-primary text-xs font-bold font-mono">{trade.asset}</span>
                        <span className={`text-[10px] px-1 rounded ${trade.type === 'Long' ? 'bg-accent/20 text-accent' : 'bg-negative/20 text-negative'}`}>{trade.type}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 bg-border rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${trade.result >= 0 ? 'bg-accent' : 'bg-negative'}`} style={{ width: `${w}%` }} />
                        </div>
                        <ResultBadge value={trade.result} size="sm" />
                      </div>
                      <EmotionDots value={trade.emotion} size="sm" />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Coluna direita */}
            <div className="space-y-4">
              <div className="bg-surface border border-border rounded-2xl p-5">
                <h2 className="font-title font-semibold text-text-primary mb-3 text-sm">Plano vs Sem Plano</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Com plano', val: metrics.avgWithPlan },
                    { label: 'Sem plano', val: metrics.avgWithoutPlan },
                  ].map(row => (
                    <div key={row.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-secondary">{row.label}</span>
                        <span className={`font-mono ${row.val >= 0 ? 'text-accent' : 'text-negative'}`}>{fmt(row.val)}</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.val >= 0 ? 'bg-accent/70' : 'bg-negative/70'}`}
                          style={{ width: `${Math.min(Math.abs(row.val) / Math.max(Math.abs(metrics.avgWithPlan), Math.abs(metrics.avgWithoutPlan), 1) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-5">
                <h2 className="font-title font-semibold text-text-primary mb-3 text-sm">Resultado por Emoção</h2>
                <div className="space-y-2">
                  {emotionBuckets.map(b => (
                    <div key={b.label} className="flex items-center gap-2">
                      <span className="text-text-secondary text-xs w-10">{b.label}</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        {b.count > 0 && (
                          <div
                            className={`h-full rounded-full ${b.avg >= 0 ? 'bg-accent/70' : 'bg-negative/70'}`}
                            style={{ width: `${Math.min(Math.abs(b.avg) / Math.max(...emotionBuckets.map(x => Math.abs(x.avg)), 1) * 100, 100)}%` }}
                          />
                        )}
                      </div>
                      <span className={`text-xs font-mono w-16 text-right ${b.count === 0 ? 'text-text-secondary' : b.avg >= 0 ? 'text-accent' : 'text-negative'}`}>
                        {b.count === 0 ? '—' : fmt(b.avg)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Últimos trades */}
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-title font-semibold text-text-primary">Últimos Trades</h2>
              <a href="/diary" className="text-accent text-xs hover:underline">Ver todos →</a>
            </div>
            <div className="space-y-1">
              {trades.slice(0, 6).map(trade => (
                <div key={trade.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 hover:bg-border/20 rounded-lg px-2 -mx-2 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${trade.result >= 0 ? 'bg-accent' : 'bg-negative'}`} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-primary text-sm font-bold">{trade.asset}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          trade.type === 'Long' ? 'bg-accent/15 text-accent' : 'bg-negative/15 text-negative'
                        }`}>{trade.type}</span>
                      </div>
                      <span className="text-text-secondary text-xs">
                        {new Date(trade.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <EmotionDots value={trade.emotion} size="sm" />
                    <ResultBadge value={trade.result} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showForm && <TradeForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
    </div>
  )
}

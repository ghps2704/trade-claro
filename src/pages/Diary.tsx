import { useState, useMemo } from 'react'
import { useTrades } from '../hooks/useTrades'
import TradeCard from '../components/trade/TradeCard'
import TradeForm from '../components/trade/TradeForm'
import type { Trade, TradeFormData } from '../types'

type PeriodFilter = 'week' | 'month' | 'all'
type ResultFilter = 'all' | 'positive' | 'negative'

export default function Diary() {
  const { trades, loading, createTrade, updateTrade, deleteTrade } = useTrades()
  const [showForm, setShowForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [assetFilter, setAssetFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all')

  const assets = useMemo(() => [...new Set(trades.map(t => t.asset))].sort(), [trades])

  const filtered = useMemo(() => {
    const now = new Date()
    return trades.filter(trade => {
      if (assetFilter && trade.asset !== assetFilter) return false
      if (resultFilter === 'positive' && trade.result <= 0) return false
      if (resultFilter === 'negative' && trade.result >= 0) return false
      if (periodFilter !== 'all') {
        const tradeDate = new Date(trade.date + 'T12:00:00')
        if (periodFilter === 'week') {
          const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7)
          if (tradeDate < weekAgo) return false
        } else if (periodFilter === 'month') {
          if (tradeDate.getMonth() !== now.getMonth() || tradeDate.getFullYear() !== now.getFullYear()) return false
        }
      }
      return true
    })
  }, [trades, assetFilter, periodFilter, resultFilter])

  const handleCreate = async (data: TradeFormData) => {
    await createTrade(data)
    setShowForm(false)
  }

  const handleEdit = async (data: TradeFormData) => {
    if (!editingTrade) return
    await updateTrade(editingTrade.id, data)
    setEditingTrade(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-title text-2xl font-bold text-text-primary">Diário</h1>
          <p className="text-text-secondary text-sm mt-1">{filtered.length} trades</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all"
        >
          + Novo Trade
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={assetFilter}
          onChange={e => setAssetFilter(e.target.value)}
          className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        >
          <option value="">Todos os ativos</option>
          {assets.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <div className="flex gap-1">
          {(['all', 'week', 'month'] as PeriodFilter[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                periodFilter === p
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {p === 'all' ? 'Tudo' : p === 'week' ? 'Esta semana' : 'Este mês'}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {(['all', 'positive', 'negative'] as ResultFilter[]).map(r => (
            <button
              key={r}
              onClick={() => setResultFilter(r)}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                resultFilter === r
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {r === 'all' ? 'Todos' : r === 'positive' ? '+ Positivos' : '- Negativos'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">Nenhum trade encontrado</p>
          <p className="text-text-secondary text-sm mt-1">Adicione seu primeiro trade ou ajuste os filtros</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-6 py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all"
          >
            Registrar Trade
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(trade => (
            <TradeCard key={trade.id} trade={trade} onDelete={deleteTrade} onEdit={setEditingTrade} />
          ))}
        </div>
      )}

      {showForm && <TradeForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingTrade && (
        <TradeForm
          onSubmit={handleEdit}
          onClose={() => setEditingTrade(null)}
          initialData={editingTrade}
        />
      )}
    </div>
  )
}

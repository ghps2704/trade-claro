import ResultBadge from '../ui/ResultBadge'
import EmotionDots from '../ui/EmotionDots'
import TagChip from '../ui/TagChip'
import type { Trade } from '../../types'

interface TradeCardProps {
  trade: Trade
  onDelete?: (id: string) => void
  onEdit?: (trade: Trade) => void
}

export default function TradeCard({ trade, onDelete, onEdit }: TradeCardProps) {
  const formattedDate = new Date(trade.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-accent/20 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-title font-bold text-text-primary text-lg">{trade.asset}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trade.type === 'Long'
                  ? 'bg-accent/20 text-accent'
                  : 'bg-negative/20 text-negative'
              }`}>
                {trade.type}
              </span>
            </div>
            <span className="text-text-secondary text-xs">{formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ResultBadge value={trade.result} size="md" />
          {onEdit && (
            <button
              onClick={() => onEdit(trade)}
              className="text-text-secondary hover:text-accent transition-colors text-sm px-1.5 py-0.5 rounded border border-transparent hover:border-accent/30"
              title="Editar"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => { if (confirm('Excluir este trade?')) onDelete(trade.id) }}
              className="text-text-secondary hover:text-negative transition-colors text-sm px-1.5 py-0.5 rounded border border-transparent hover:border-negative/30"
              title="Excluir"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary text-xs">Emoção:</span>
          <EmotionDots value={trade.emotion} size="sm" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary text-xs">Plano:</span>
          <span className={trade.followed_plan ? 'text-accent' : 'text-negative'}>
            {trade.followed_plan ? '✓' : '✗'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-text-secondary text-xs">Confiança:</span>
          <span className="text-text-primary text-xs font-mono">{trade.confidence}/10</span>
        </div>
      </div>

      {trade.note && (
        <blockquote className="border-l-2 border-accent/40 pl-3 mb-3 text-text-secondary text-sm italic">
          {trade.note}
        </blockquote>
      )}

      {trade.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {trade.tags.map(tag => <TagChip key={tag} tag={tag} />)}
        </div>
      )}
    </div>
  )
}

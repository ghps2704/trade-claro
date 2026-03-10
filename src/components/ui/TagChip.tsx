interface TagChipProps {
  tag: string
  onRemove?: () => void
  onClick?: () => void
  selected?: boolean
}

const TAG_COLORS: Record<string, string> = {
  'emocional': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'disciplina': 'bg-accent/20 text-accent border-accent/30',
  'revenge trade': 'bg-negative/20 text-negative border-negative/30',
  'fomo': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'overtrading': 'bg-red-500/20 text-red-300 border-red-500/30',
  'setup claro': 'bg-accent/20 text-accent border-accent/30',
  'stop errado': 'bg-negative/20 text-negative border-negative/30',
  'saída antecipada': 'bg-attention/20 text-attention border-attention/30',
  'paciência': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'impulsivo': 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function TagChip({ tag, onRemove, onClick, selected }: TagChipProps) {
  const colorClass = TAG_COLORS[tag] || 'bg-text-secondary/20 text-text-secondary border-text-secondary/30'
  const baseClass = `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border font-medium transition-opacity`
  const interactiveClass = onClick ? 'cursor-pointer hover:opacity-80' : ''
  const selectedClass = selected ? 'ring-1 ring-current' : ''

  return (
    <span
      className={`${baseClass} ${colorClass} ${interactiveClass} ${selectedClass}`}
      onClick={onClick}
    >
      {tag}
      {onRemove && (
        <button
          onClick={e => { e.stopPropagation(); onRemove() }}
          className="hover:opacity-70 ml-0.5"
        >×</button>
      )}
    </span>
  )
}

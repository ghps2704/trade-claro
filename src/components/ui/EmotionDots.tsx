interface EmotionDotsProps {
  value: number
  size?: 'sm' | 'md'
}

export default function EmotionDots({ value, size = 'md' }: EmotionDotsProps) {
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'

  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: 10 }, (_, i) => {
        const filled = i < value
        let color = 'bg-text-secondary/30'
        if (filled) {
          if (value <= 3) color = 'bg-negative'
          else if (value <= 6) color = 'bg-attention'
          else color = 'bg-accent'
        }
        return <span key={i} className={`${dotSize} rounded-full ${color}`} />
      })}
      <span className="ml-1 text-xs font-mono text-text-secondary">{value}</span>
    </div>
  )
}

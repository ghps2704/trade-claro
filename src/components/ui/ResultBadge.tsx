interface ResultBadgeProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
}

export default function ResultBadge({ value, size = 'md' }: ResultBadgeProps) {
  const isPositive = value >= 0
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl font-bold' : 'text-base font-semibold'
  const color = isPositive ? 'text-accent' : 'text-negative'

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)

  return (
    <span className={`font-mono ${sizeClass} ${color}`}>
      {isPositive ? '+' : ''}{formatted}
    </span>
  )
}

import type { Trade } from '../types'

export interface Insight {
  id: string
  icon: string
  title: string
  description: string
  severity: 'green' | 'yellow' | 'red'
}

export function calculateInsights(trades: Trade[]): Insight[] {
  if (trades.length === 0) return []
  const insights: Insight[] = []

  // Resultado médio por estado emocional
  const highEmotionTrades = trades.filter(t => t.emotion >= 8)
  const lowEmotionTrades = trades.filter(t => t.emotion <= 4)

  if (highEmotionTrades.length > 0 && lowEmotionTrades.length > 0) {
    const highAvg = highEmotionTrades.reduce((s, t) => s + t.result, 0) / highEmotionTrades.length
    const lowAvg = lowEmotionTrades.reduce((s, t) => s + t.result, 0) / lowEmotionTrades.length
    const diff = highAvg - lowAvg
    insights.push({
      id: 'emotion-result',
      icon: '🧠',
      title: 'Humor afeta seu resultado',
      description: diff > 0
        ? `Quando seu humor está alto (≥8), você lucra em média R$ ${highAvg.toFixed(0)} por trade. Com humor baixo (≤4), a média é R$ ${lowAvg.toFixed(0)}. Opere mais quando estiver bem!`
        : `Cuidado: mesmo com humor alto, seus resultados não melhoram significativamente. Revise seu processo decisório.`,
      severity: diff > 0 ? 'green' : 'yellow',
    })
  }

  // Resultado com plano vs sem plano
  const withPlan = trades.filter(t => t.followed_plan)
  const withoutPlan = trades.filter(t => !t.followed_plan)

  if (withPlan.length > 0 && withoutPlan.length > 0) {
    const withPlanAvg = withPlan.reduce((s, t) => s + t.result, 0) / withPlan.length
    const withoutPlanAvg = withoutPlan.reduce((s, t) => s + t.result, 0) / withoutPlan.length
    insights.push({
      id: 'plan-result',
      icon: '📋',
      title: 'Seguir o plano vale a pena',
      description: withPlanAvg > withoutPlanAvg
        ? `Seguindo o plano: média de R$ ${withPlanAvg.toFixed(0)}. Sem seguir: R$ ${withoutPlanAvg.toFixed(0)}. Disciplina paga!`
        : `Atenção: seus trades fora do plano estão tendo resultado similar. Pode ser hora de revisar o plano.`,
      severity: withPlanAvg > withoutPlanAvg ? 'green' : 'yellow',
    })
  }

  // Tag mais frequente em trades negativos
  const negativeTrades = trades.filter(t => t.result < 0)
  if (negativeTrades.length >= 3) {
    const tagCount: Record<string, number> = {}
    negativeTrades.forEach(t => t.tags.forEach(tag => { tagCount[tag] = (tagCount[tag] || 0) + 1 }))
    const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]
    if (topTag && topTag[1] >= 2) {
      insights.push({
        id: 'top-negative-tag',
        icon: '⚠️',
        title: `"${topTag[0]}" aparece nos seus prejuízos`,
        description: `A tag "${topTag[0]}" aparece em ${topTag[1]} trades negativos. Este é um padrão recorrente que merece atenção.`,
        severity: 'red',
      })
    }
  }

  // Melhor e pior dia da semana
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const byDay: Record<number, number[]> = {}
  trades.forEach(t => {
    const day = new Date(t.date + 'T12:00:00').getDay()
    if (!byDay[day]) byDay[day] = []
    byDay[day].push(t.result)
  })

  const dayAvgs = Object.entries(byDay)
    .filter(([, results]) => results.length >= 2)
    .map(([day, results]) => ({
      day: parseInt(day),
      avg: results.reduce((s, r) => s + r, 0) / results.length,
    }))

  if (dayAvgs.length >= 2) {
    const best = dayAvgs.sort((a, b) => b.avg - a.avg)[0]
    const worst = dayAvgs[dayAvgs.length - 1]
    insights.push({
      id: 'best-worst-day',
      icon: '📅',
      title: `Seu melhor dia: ${dayNames[best.day]}`,
      description: `Em média, você lucra R$ ${best.avg.toFixed(0)} às ${dayNames[best.day]}s. Pior dia: ${dayNames[worst.day]} com média de R$ ${worst.avg.toFixed(0)}.`,
      severity: best.avg > 0 ? 'green' : 'yellow',
    })
  }

  // Alerta revenge trade (últimos 2 negativos)
  if (trades.length >= 2) {
    const sorted = [...trades].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    if (sorted[0].result < 0 && sorted[1].result < 0) {
      insights.push({
        id: 'revenge-trade',
        icon: '🚨',
        title: 'Alerta: Revenge Trade',
        description: 'Seus últimos 2 trades foram negativos. Cuidado com o impulso de tentar recuperar rapidamente — este é o padrão clássico do revenge trade.',
        severity: 'red',
      })
    }
  }

  return insights
}

import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// ── Hooks ──────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return scrolled
}


// ── Data ───────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: 'Trader de futuros',
    role: 'Day trader — WINFUT/DOLFUT',
    avatar: '◎',
    color: 'bg-accent/20 text-accent',
    text: 'Percebi que meu desempenho caía toda vez que eu estava emocionalmente acima de 7. Sem registrar isso, nunca teria notado o padrão. Foi a primeira mudança concreta que fiz na minha rotina.',
    insight: 'Padrão emocional identificado',
  },
  {
    name: 'Trader de ações',
    role: 'Swing trader — B3',
    avatar: '◇',
    color: 'bg-attention/20 text-attention',
    text: 'Eu desconfiava que fazia revenge trade, mas não tinha prova disso. Quando vi no histórico que a maioria das perdas grandes vinha depois de 2 stops seguidos, ficou impossível ignorar.',
    insight: 'Revenge trade mapeado',
  },
  {
    name: 'Trader diversificado',
    role: 'Day e swing — cripto e ações',
    avatar: '◈',
    color: 'bg-negative/20 text-negative',
    text: 'O registro é rápido e não atrapalha a operação. O que mais vale são os insights semanais — eles me dão um ponto de partida claro para o que ajustar antes de abrir a semana.',
    insight: 'Rotina semanal de revisão',
  },
]

const FAQS = [
  {
    q: 'É realmente gratuito?',
    a: 'Sim, 100% gratuito. Sem limite de trades, sem cartão de crédito, sem plano pago. O objetivo é ajudar traders brasileiros a evoluírem.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Cada conta só enxerga seus próprios trades — nenhum outro usuário ou terceiro tem acesso aos seus dados. Usamos infraestrutura Supabase com Row Level Security.',
  },
  {
    q: 'Para que tipo de trader é indicado?',
    a: 'Para qualquer trader que opere B3, cripto ou forex. Day traders, swing traders e position traders podem usar — o foco é no comportamento, não no ativo.',
  },
  {
    q: 'Preciso lançar todos os trades?',
    a: 'Quanto mais você lançar, mais precisos ficam os insights. Mas mesmo com poucos lançamentos por semana você já começa a ver padrões relevantes.',
  },
  {
    q: 'O Trade Claro substitui a planilha?',
    a: 'Sim — e vai além. Planilhas guardam números, o Trade Claro guarda o contexto emocional e comportamental que explica esses números.',
  },
]

const COMPARISON = [
  { feature: 'Registro de resultado', planilha: true, nada: false, tradeclaro: true },
  { feature: 'Histórico de trades', planilha: true, nada: false, tradeclaro: true },
  { feature: 'Estado emocional por trade', planilha: false, nada: false, tradeclaro: true },
  { feature: 'Nível de confiança no setup', planilha: false, nada: false, tradeclaro: true },
  { feature: 'Insights automáticos', planilha: false, nada: false, tradeclaro: true },
  { feature: 'Alerta de revenge trade', planilha: false, nada: false, tradeclaro: true },
  { feature: 'Análise por dia da semana', planilha: false, nada: false, tradeclaro: true },
  { feature: 'Correlação emoção × resultado', planilha: false, nada: false, tradeclaro: true },
]

const FEATURES_DETAIL = [
  {
    icon: '◎',
    color: 'accent',
    tag: 'Diário',
    title: 'Registro completo em 30 segundos',
    description: 'Ativo, direção, resultado, data, emoção (1–10), confiança no setup, se seguiu o plano, tags e anotação livre. Tudo em um formulário rápido e intuitivo.',
    bullets: ['Autocomplete de ativos da B3', 'Escala visual de emoção', 'Tags pré-definidas + personalizadas'],
  },
  {
    icon: '◇',
    color: 'attention',
    tag: 'Insights',
    title: 'Padrões que você nunca veria sozinho',
    description: 'O sistema analisa seus trades e gera alertas automáticos baseados no seu histórico — não em regras genéricas.',
    bullets: ['Correlação emoção × resultado', 'Melhor e pior dia da semana', 'Detecção de revenge trade em tempo real'],
  },
  {
    icon: '◈',
    color: 'negative',
    tag: 'Dashboard',
    title: 'Visão clara do seu desempenho',
    description: 'Win rate, resultado acumulado, sequência atual, ativo mais lucrativo e muito mais. Tudo visual, sem fórmulas, sem planilha.',
    bullets: ['Gráfico de resultado por dia', 'KPIs da semana e do mês', 'Filtros por ativo e período'],
  },
]

// ── Mock components ────────────────────────────────────────────────────────────

function MockApp() {
  const trades = [
    { asset: 'WINFUT', type: 'Long', result: '+R$ 1.240', emotion: 8, positive: true },
    { asset: 'DOLFUT', type: 'Short', result: '-R$ 320', emotion: 3, positive: false },
    { asset: 'PETR4', type: 'Long', result: '+R$ 580', emotion: 7, positive: true },
  ]
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-accent/10 via-transparent to-attention/5 rounded-3xl blur-3xl" />
      <div className="relative bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
        {/* Fake browser bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-bg border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-negative/50" />
            <div className="w-3 h-3 rounded-full bg-attention/50" />
            <div className="w-3 h-3 rounded-full bg-accent/50" />
          </div>
          <div className="flex-1 mx-4 bg-border/60 rounded-md px-3 py-1 text-xs text-text-secondary font-mono">
            tradeclaro.app/dashboard
          </div>
        </div>

        <div className="flex h-72">
          {/* Mini sidebar */}
          <div className="w-12 bg-bg border-r border-border flex flex-col items-center py-3 gap-4">
            {['◈', '◎', '◇'].map((icon, i) => (
              <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${i === 0 ? 'bg-accent/20 text-accent' : 'text-text-secondary'}`}>
                {icon}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 space-y-3">
            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Resultado', value: '+R$ 4.820', green: true },
                { label: 'Win Rate', value: '67%', green: true },
                { label: 'Trades', value: '42', green: false },
              ].map(k => (
                <div key={k.label} className="bg-bg rounded-lg p-2 border border-border">
                  <p className="text-text-secondary text-[10px]">{k.label}</p>
                  <p className={`font-title font-bold text-sm ${k.green ? 'text-accent' : 'text-text-primary'}`}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-bg rounded-lg p-2 border border-border">
              <p className="text-text-secondary text-[10px] mb-1.5">Resultado acumulado</p>
              <div className="flex items-end gap-0.5 h-10">
                {[30, 50, 40, 75, 60, 45, 90, 70, 55, 85, 65, 100].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${h > 50 ? 'bg-accent/70' : 'bg-negative/50'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Trades */}
            <div className="space-y-1.5">
              {trades.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-bg rounded-lg px-2.5 py-1.5 border border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-primary text-xs font-bold">{t.asset}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${t.type === 'Long' ? 'bg-accent/20 text-accent' : 'bg-negative/20 text-negative'}`}>{t.type}</span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${t.positive ? 'text-accent' : 'text-negative'}`}>{t.result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MockInsightCard({ icon, title, desc, severity }: { icon: string; title: string; desc: string; severity: 'green' | 'yellow' | 'red' }) {
  const colors = {
    green: 'border-accent/30 bg-accent/5',
    yellow: 'border-attention/30 bg-attention/5',
    red: 'border-negative/30 bg-negative/5',
  }
  const dots = { green: 'bg-accent', yellow: 'bg-attention', red: 'bg-negative' }
  return (
    <div className={`border rounded-xl p-4 flex items-start gap-3 ${colors[severity]}`}>
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${dots[severity]}`} />
          <p className="text-text-primary font-semibold text-sm">{title}</p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface/50 transition-colors"
      >
        <span className="text-text-primary font-medium">{q}</span>
        <span className={`text-accent text-xl transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-text-secondary text-sm leading-relaxed border-t border-border pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const scrolled = useScrolled()
  const heroRef = useRef<HTMLDivElement>(null)
  const statsSection = useInView()
  const featuresSection = useInView()
  const comparisonSection = useInView()
  const testimonialsSection = useInView()
  const faqSection = useInView()

  const [mouse, setMouse] = useState({ x: -999, y: -999 })
  const [mouseVisible, setMouseVisible] = useState(false)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
      setMouseVisible(true)
    }
    const onLeave = () => setMouseVisible(false)
    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg text-text-primary overflow-x-hidden">

      {/* ── LANTERNA ───────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-300"
        style={{ opacity: mouseVisible ? 1 : 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle 380px at ${mouse.x}px ${mouse.y}px, rgba(0,212,170,0.07) 0%, rgba(0,212,170,0.03) 35%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle 80px at ${mouse.x}px ${mouse.y}px, rgba(0,212,170,0.12) 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/20' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-title text-xl font-bold">
            Trade<span className="text-accent">Claro</span>
          </h1>
          <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="hover:text-text-primary transition-colors">Funcionalidades</a>
            <a href="#insights" className="hover:text-text-primary transition-colors">Insights</a>
            <a href="#depoimentos" className="hover:text-text-primary transition-colors">Percepções</a>
            <a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium hidden sm:block">
              Entrar
            </Link>
            <Link to="/register" className="px-4 py-2 bg-accent text-bg font-bold rounded-xl text-sm hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 pb-16 px-6 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,212,170,0.07)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,184,0,0.04)_0%,_transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-attention/5 rounded-full blur-3xl pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-accent text-sm font-medium">Gratuito · Sem cartão · Para traders da B3</span>
              </div>

              {/* Headline */}
              <h1 className="font-title text-5xl xl:text-6xl font-bold leading-[1.1] mb-6">
                Seu próximo{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent to-accent/60">
                    nível
                  </span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M0 6 Q100 0 200 6" stroke="#00D4AA" strokeWidth="2" strokeOpacity="0.4" fill="none" />
                  </svg>
                </span>{' '}
                começa entendendo por que você perde
              </h1>

              <p className="text-text-secondary text-xl leading-relaxed mb-10">
                Diário de trades com inteligência emocional. Registre resultado, emoção e contexto de cada operação e deixe o sistema revelar os padrões que sabotam seus resultados.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/register" className="group px-8 py-4 bg-accent text-bg font-bold rounded-xl text-lg hover:bg-accent/90 transition-all text-center shadow-xl shadow-accent/20 flex items-center justify-center gap-2">
                  Criar conta grátis
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/login" className="px-8 py-4 border border-border text-text-secondary hover:text-text-primary hover:border-accent/40 rounded-xl text-lg transition-all text-center">
                  Já tenho conta
                </Link>
              </div>

              {/* Social proof mini */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['R', 'F', 'C', 'M'].map((l, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-bg flex items-center justify-center text-xs font-bold text-accent">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-text-secondary text-sm">
                  <span className="text-text-primary font-semibold">Seja um dos primeiros</span> traders a usar o Trade Claro
                </p>
              </div>
            </div>

            {/* Mock App */}
            <div className="hidden lg:block">
              <MockApp />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary animate-bounce">
          <span className="text-xs">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-text-secondary to-transparent" />
        </div>
      </section>

      {/* ── BETA BANNER ─────────────────────────────────────────────────────── */}
      <div ref={statsSection.ref} className="py-14 border-y border-border bg-surface/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-sm font-semibold">Acesso antecipado · Beta aberto</span>
          </div>
          <h2 className="font-title text-3xl font-bold text-text-primary mb-3">
            Seja um dos primeiros traders a usar
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
            O Trade Claro está em fase beta. Junte-se agora, ajude a moldar o produto e use tudo gratuitamente enquanto crescemos juntos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: '🚀', title: 'Acesso completo grátis', desc: 'Todas as funcionalidades disponíveis sem custo durante o beta.' },
              { icon: '🎯', title: 'Sem limite de trades', desc: 'Registre quantas operações quiser, sem restrição de plano.' },
              { icon: '💬', title: 'Influencie o produto', desc: 'Seu feedback vai diretamente para o desenvolvimento das próximas features.' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 bg-surface border border-border rounded-2xl p-5">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-text-primary font-semibold mb-1">{item.title}</p>
                  <p className="text-text-secondary text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROBLEM ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">O problema real</p>
            <h2 className="font-title text-4xl lg:text-5xl font-bold mb-6">
              Você opera bem no papel.<br />
              <span className="text-negative">Por que os resultados não vêm?</span>
            </h2>
            <p className="text-text-secondary text-xl leading-relaxed max-w-2xl mx-auto">
              Estudos mostram que traders experientes perdem mais de 60% de seu potencial por fatores comportamentais — não por falta de conhecimento técnico.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '😰',
                title: 'Opera com emoção alta',
                desc: 'Ansiedade, euforia ou medo antes de entrar numa operação distorce a percepção de risco e leva a decisões impulsivas.',
                stat: '73% dos stops',
                statLabel: 'são acionados em momentos de emoção alta',
              },
              {
                icon: '🔄',
                title: 'Revenge trade',
                desc: 'Depois de um stop, o instinto é recuperar imediatamente. Essa pressa geralmente transforma um prejuízo pequeno em um grande.',
                stat: '2.4x maior',
                statLabel: 'é o drawdown médio em dias com revenge trade',
              },
              {
                icon: '📋',
                title: 'Não segue o plano',
                desc: 'Você tem um setup, mas na hora H sai antes, entra atrasado ou amplia o tamanho. E na semana seguinte repete o mesmo erro.',
                stat: '45% mais wins',
                statLabel: 'quando o plano é seguido à risca',
              },
            ].map(item => (
              <div key={item.title} className="bg-surface border border-border rounded-2xl p-6 hover:border-accent/20 transition-colors">
                <span className="text-4xl block mb-4">{item.icon}</span>
                <h3 className="font-title text-lg font-bold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">{item.desc}</p>
                <div className="border-t border-border pt-4">
                  <p className="text-accent font-title font-bold text-xl">{item.stat}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{item.statLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" ref={featuresSection.ref} className="py-24 px-6 bg-surface/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Funcionalidades</p>
            <h2 className="font-title text-4xl lg:text-5xl font-bold mb-4">
              Tudo que você precisa.<br />Nada que você não precisa.
            </h2>
            <p className="text-text-secondary text-xl">Interface simples. Insights poderosos.</p>
          </div>

          <div className="space-y-20">
            {FEATURES_DETAIL.map((f, i) => (
              <div
                key={f.title}
                id={i === 1 ? 'insights' : undefined}
                className={`grid lg:grid-cols-2 gap-12 items-center ${featuresSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-700`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-4 ${
                    f.color === 'accent' ? 'bg-accent/10 text-accent border border-accent/20' :
                    f.color === 'attention' ? 'bg-attention/10 text-attention border border-attention/20' :
                    'bg-negative/10 text-negative border border-negative/20'
                  }`}>{f.tag}</div>
                  <h3 className="font-title text-3xl font-bold text-text-primary mb-4">{f.title}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">{f.description}</p>
                  <ul className="space-y-2.5">
                    {f.bullets.map(b => (
                      <li key={b} className="flex items-center gap-3 text-text-secondary">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                          f.color === 'accent' ? 'bg-accent/20 text-accent' :
                          f.color === 'attention' ? 'bg-attention/20 text-attention' :
                          'bg-negative/20 text-negative'
                        }`}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual block */}
                <div className={`relative ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className={`absolute -inset-4 rounded-3xl blur-2xl ${
                    f.color === 'accent' ? 'bg-accent/8' :
                    f.color === 'attention' ? 'bg-attention/8' :
                    'bg-negative/8'
                  }`} />
                  <div className="relative bg-surface border border-border rounded-2xl p-6">
                    {i === 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-bg rounded-xl p-3 border border-border">
                            <p className="text-text-secondary text-xs mb-1">Ativo</p>
                            <p className="text-accent font-bold font-mono">WINFUT</p>
                          </div>
                          <div className="bg-bg rounded-xl p-3 border border-border">
                            <p className="text-text-secondary text-xs mb-1">Resultado</p>
                            <p className="text-accent font-bold font-mono">+R$ 840</p>
                          </div>
                        </div>
                        <div className="bg-bg rounded-xl p-3 border border-border">
                          <p className="text-text-secondary text-xs mb-2">Emoção antes do trade</p>
                          <div className="flex justify-between text-xs text-text-secondary mb-2">
                            <span>1</span><span className="text-accent font-bold">7 — Bom</span><span>10</span>
                          </div>
                          <div className="relative h-2 bg-border rounded-full">
                            <div className="absolute left-0 top-0 h-full w-[70%] bg-gradient-to-r from-accent/60 to-accent rounded-full" />
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {['setup claro', 'paciência', 'disciplina'].map(t => (
                            <span key={t} className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full border border-accent/20">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      <div className="space-y-3">
                        <MockInsightCard icon="🧠" severity="red" title="Emoção ≥ 8 = prejuízo" desc="Nos últimos 30 dias, sua taxa de acerto cai de 67% para 29% quando você opera com emoção acima de 8." />
                        <MockInsightCard icon="⚠️" severity="yellow" title="Alerta: revenge trade" desc="Você fez 3 operações negativas seguidas hoje. Probabilidade de revenge trade: alta. Considere parar." />
                        <MockInsightCard icon="📅" severity="green" title="Quinta é seu melhor dia" desc="Resultado médio nas quintas: +R$ 780. Considere aumentar o risco nesses dias." />
                      </div>
                    )}
                    {i === 2 && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { l: 'Resultado', v: '+R$ 12.4k', c: 'text-accent' },
                            { l: 'Win Rate', v: '71%', c: 'text-accent' },
                            { l: 'Trades', v: '87', c: 'text-text-primary' },
                          ].map(k => (
                            <div key={k.l} className="bg-bg rounded-xl p-3 border border-border text-center">
                              <p className="text-text-secondary text-[10px]">{k.l}</p>
                              <p className={`font-title font-bold text-sm ${k.c}`}>{k.v}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-bg rounded-xl p-3 border border-border">
                          <p className="text-text-secondary text-xs mb-2">Resultado por dia da semana</p>
                          <div className="flex items-end gap-2 h-16">
                            {[
                              { d: 'Seg', v: 55, c: 'bg-accent/60' },
                              { d: 'Ter', v: 40, c: 'bg-negative/50' },
                              { d: 'Qua', v: 70, c: 'bg-accent/60' },
                              { d: 'Qui', v: 100, c: 'bg-accent' },
                              { d: 'Sex', v: 30, c: 'bg-negative/50' },
                            ].map(d => (
                              <div key={d.d} className="flex-1 flex flex-col items-center gap-1">
                                <div className={`w-full rounded-sm ${d.c}`} style={{ height: `${d.v}%` }} />
                                <span className="text-[9px] text-text-secondary">{d.d}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Como funciona</p>
            <h2 className="font-title text-4xl lg:text-5xl font-bold mb-4">
              De zero a insights em 3 passos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {[
              { n: '01', icon: '✍️', title: 'Crie sua conta', desc: 'Cadastro em menos de 1 minuto. Sem cartão, sem burocracia. Já começa a usar na hora.' },
              { n: '02', icon: '📝', title: 'Registre seus trades', desc: 'Após cada operação, informe ativo, resultado e como você estava se sentindo. Leva 30 segundos.' },
              { n: '03', icon: '💡', title: 'Receba insights', desc: 'O sistema analisa seus padrões e gera alertas personalizados para você melhorar semana a semana.' },
            ].map((step, i) => (
              <div key={step.n} className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-3xl">{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-bg text-xs font-bold">{i + 1}</span>
                  </div>
                </div>
                <p className="font-mono text-accent text-sm mb-2">{step.n}</p>
                <h3 className="font-title text-xl font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ─────────────────────────────────────────────────────── */}
      <section ref={comparisonSection.ref} className="py-24 px-6 bg-surface/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Comparativo</p>
            <h2 className="font-title text-4xl font-bold mb-4">Trade Claro vs. alternativas</h2>
            <p className="text-text-secondary text-lg">Veja o que muda quando você vai além dos números.</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 bg-bg border-b border-border">
              <div className="p-4 text-text-secondary text-sm font-medium">Funcionalidade</div>
              <div className="p-4 text-center text-text-secondary text-sm font-medium border-l border-border">Sem registro</div>
              <div className="p-4 text-center text-text-secondary text-sm font-medium border-l border-border">Planilha</div>
              <div className="p-4 text-center border-l border-border">
                <span className="text-accent font-bold text-sm">Trade Claro</span>
              </div>
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-bg/30'}`}>
                <div className="p-4 text-text-secondary text-sm">{row.feature}</div>
                <div className="p-4 text-center border-l border-border">
                  <span className={`text-lg ${row.nada ? 'text-accent' : 'text-text-secondary opacity-30'}`}>
                    {row.nada ? '✓' : '×'}
                  </span>
                </div>
                <div className="p-4 text-center border-l border-border">
                  <span className={`text-lg ${row.planilha ? 'text-accent' : 'text-text-secondary opacity-30'}`}>
                    {row.planilha ? '✓' : '×'}
                  </span>
                </div>
                <div className="p-4 text-center border-l border-border">
                  <span className="text-accent text-lg">✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section id="depoimentos" ref={testimonialsSection.ref} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Percepções</p>
            <h2 className="font-title text-4xl lg:text-5xl font-bold mb-4">
              O que traders descobrem sobre si mesmos
            </h2>
            <p className="text-text-secondary text-xl">Padrões comuns que aparecem quando você começa a registrar o lado comportamental das suas operações.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`bg-surface border border-border rounded-2xl p-6 flex flex-col transition-all duration-700 ${
                  testimonialsSection.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-attention text-sm">★</span>
                  ))}
                </div>

                <p className="text-text-secondary leading-relaxed mb-6 flex-1">"{t.text}"</p>

                {/* Result badge */}
                <div className="bg-accent/10 border border-accent/20 rounded-xl px-3 py-2 mb-4 text-center">
                  <p className="text-accent font-bold text-sm">{t.insight}</p>
                </div>

                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-text-primary font-semibold text-sm">{t.name}</p>
                    <p className="text-text-secondary text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Preço</p>
          <h2 className="font-title text-4xl lg:text-5xl font-bold mb-6">
            Simples assim: é grátis
          </h2>

          <div className="relative bg-surface border border-accent/30 rounded-3xl p-10 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-1 mb-6">
                <span className="text-accent font-semibold text-sm">Plano único · Totalmente grátis</span>
              </div>

              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="font-title text-7xl font-bold text-text-primary">R$ 0</span>
                <span className="text-text-secondary mb-3">/mês</span>
              </div>
              <p className="text-text-secondary mb-8">Sem letras miúdas.</p>

              <div className="grid sm:grid-cols-2 gap-3 text-left mb-8">
                {[
                  'Trades ilimitados',
                  'Todos os insights',
                  'Dashboard completo',
                  'Histórico completo',
                  'Diário emocional',
                  'Tags personalizadas',
                  'Exportação de dados',
                  'Suporte por email',
                ].map(f => (
                  <div key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                    <span className="text-accent">✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="inline-block px-12 py-4 bg-accent text-bg font-bold rounded-xl text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
              >
                Criar conta grátis →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" ref={faqSection.ref} className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="font-title text-4xl font-bold mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,212,170,0.10)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,184,0,0.05)_0%,_transparent_50%)] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Comece agora</p>
          <h2 className="font-title text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Entenda sua mente.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
              Melhore seus trades.
            </span>
          </h2>
          <p className="text-text-secondary text-xl mb-10 leading-relaxed">
            Junte-se a centenas de traders que pararam de repetir os mesmos erros comportamentais. Grátis, sem limite e sem cartão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/register" className="group px-12 py-5 bg-accent text-bg font-bold rounded-xl text-xl hover:bg-accent/90 transition-all shadow-2xl shadow-accent/30 flex items-center justify-center gap-2">
              Criar conta grátis
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/login" className="px-12 py-5 border border-border text-text-secondary hover:text-text-primary hover:border-accent/40 rounded-xl text-xl transition-all">
              Entrar
            </Link>
          </div>
          <p className="text-text-secondary text-sm">Sem cartão · Sem plano pago · Sempre grátis</p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <h3 className="font-title text-lg font-bold mb-1">
                Trade<span className="text-accent">Claro</span>
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Diário inteligente para day traders brasileiros que querem entender o próprio comportamento e melhorar seus resultados.
              </p>
            </div>
            <div>
              <p className="text-text-primary font-semibold text-sm mb-3">Produto</p>
              <div className="space-y-2">
                {[
                  { href: '#features', label: 'Funcionalidades' },
                  { href: '#depoimentos', label: 'Percepções' },
                  { href: '#faq', label: 'FAQ' },
                ].map(l => (
                  <a key={l.label} href={l.href} className="block text-text-secondary text-sm hover:text-text-primary transition-colors">{l.label}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-text-primary font-semibold text-sm mb-3">Conta</p>
              <div className="space-y-2">
                <Link to="/register" className="block text-text-secondary text-sm hover:text-text-primary transition-colors">Criar conta grátis</Link>
                <Link to="/login" className="block text-text-secondary text-sm hover:text-text-primary transition-colors">Fazer login</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-text-secondary text-sm">© {new Date().getFullYear()} Trade Claro · Todos os direitos reservados</p>
            <p className="text-text-secondary text-xs">Feito para traders brasileiros 🇧🇷</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

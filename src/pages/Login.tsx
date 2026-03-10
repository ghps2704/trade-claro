import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [resetSent, setResetSent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('email not confirmed') || msg.includes('not confirmed')) {
        setError('Você precisa confirmar seu email antes de entrar. Verifique sua caixa de entrada.')
      } else {
        setError('Email ou senha incorretos.')
      }
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    if (error) {
      setError('Não foi possível enviar o email. Verifique o endereço e tente novamente.')
    } else {
      setResetSent(true)
    }
    setLoading(false)
  }

  const goToForgot = () => {
    setMode('forgot')
    setError('')
    setResetSent(false)
  }

  const goToLogin = () => {
    setMode('login')
    setError('')
    setResetSent(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-title text-3xl font-bold text-text-primary mb-2">
            Trade<span className="text-accent">Claro</span>
          </h1>
          <p className="text-text-secondary">Seu diário de trades com inteligência emocional</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          {mode === 'login' ? (
            <>
              <h2 className="font-title text-xl font-bold text-text-primary mb-6">Entrar</h2>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-text-secondary text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-text-secondary text-sm">Senha</label>
                    <button
                      type="button"
                      onClick={goToForgot}
                      className="text-accent text-xs hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                </div>

                {error && (
                  <p className="text-negative text-sm bg-negative/10 border border-negative/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              <p className="text-text-secondary text-sm text-center mt-6">
                Ainda não tem conta?{' '}
                <Link to="/register" className="text-accent hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={goToLogin}
                className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors mb-6"
              >
                ← Voltar para o login
              </button>

              <h2 className="font-title text-xl font-bold text-text-primary mb-2">Redefinir senha</h2>
              <p className="text-text-secondary text-sm mb-6">
                Digite seu email e enviaremos um link para criar uma nova senha.
              </p>

              {resetSent ? (
                <div className="bg-accent/10 border border-accent/20 rounded-xl px-4 py-5 text-center">
                  <p className="text-accent font-semibold mb-1">Email enviado!</p>
                  <p className="text-text-secondary text-sm">
                    Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="block text-text-secondary text-sm mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-negative text-sm bg-negative/10 border border-negative/20 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

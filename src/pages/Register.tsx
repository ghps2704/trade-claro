import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    if (error) {
      setError('Erro ao criar conta. Verifique os dados e tente novamente.')
    } else {
      setEmailSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-title text-3xl font-bold text-text-primary mb-2">
            Trade<span className="text-accent">Claro</span>
          </h1>
          <p className="text-text-secondary">Comece a entender seus padrões de trading</p>
        </div>

        {emailSent ? (
          <div className="bg-surface border border-accent/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="font-title text-xl font-bold text-text-primary mb-2">Confirme seu email</h2>
            <p className="text-text-secondary text-sm mb-1">
              Enviamos um link de confirmação para
            </p>
            <p className="text-accent font-medium mb-4">{email}</p>
            <p className="text-text-secondary text-sm mb-6">
              Clique no link do email e depois volte aqui para entrar.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-accent text-bg font-bold rounded-xl hover:bg-accent/90 transition-all text-center"
            >
              Ir para o login
            </Link>
          </div>
        ) : (

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h2 className="font-title text-xl font-bold text-text-primary mb-6">Criar conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">Nome completo</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="João Silva"
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>

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
              <label className="block text-text-secondary text-sm mb-1.5">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-text-secondary text-sm text-center mt-6">
            Já tem conta?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
        )}
      </div>
    </div>
  )
}

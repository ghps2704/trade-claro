import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', icon: '◈', label: 'Dashboard' },
  { to: '/diary', icon: '◎', label: 'Diário' },
  { to: '/insights', icon: '◇', label: 'Insights' },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initial = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || '?'

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <h1 className="font-title text-xl font-bold text-text-primary">
          Trade<span className="text-accent">Claro</span>
        </h1>
        <p className="text-text-secondary text-xs mt-0.5">Diário de Trades</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all text-sm font-medium ${
                isActive
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-border/50'
              }`
            }
          >
            <span className="text-lg">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
            {initial.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-medium truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-text-secondary text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-2 text-text-secondary hover:text-negative transition-colors text-sm border border-border rounded-lg hover:border-negative/40"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}

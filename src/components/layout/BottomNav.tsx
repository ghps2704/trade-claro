import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', icon: '◈', label: 'Dashboard' },
  { to: '/diary', icon: '◎', label: 'Diário' },
  { to: '/insights', icon: '◇', label: 'Insights' },
]

export default function BottomNav() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-surface border-t border-border">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[11px] font-medium transition-colors ${
              isActive ? 'text-accent' : 'text-text-secondary'
            }`
          }
        >
          <span className="text-xl leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Sair */}
      <button
        onClick={handleSignOut}
        className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-[11px] font-medium text-text-secondary transition-colors active:text-negative"
      >
        <span className="text-xl leading-none">⏏</span>
        <span>Sair</span>
      </button>
    </nav>
  )
}

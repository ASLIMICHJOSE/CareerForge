import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Upload, MessageSquare, History, User, Settings, LogOut, Sun } from 'lucide-react'
import { useAuth } from '../AuthContext'

const navItems = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/analyze', icon: Upload, label: 'Analyze' },
  { to: '/app/interview', icon: MessageSquare, label: 'Mock Interview' },
  { to: '/app/history', icon: History, label: 'History' },
  { to: '/app/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US'

  return (
    <div className="flex h-screen bg-[#0a0d14] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-[#0d1117] border-r border-white/5">
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-sm">
            <span className="text-white">Career</span>
            <span className="gradient-text">Forge</span>
            <span className="text-gray-500 font-normal ml-1 text-xs">AI</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button 
            onClick={() => navigate('/app/profile')} 
            className="nav-item w-full text-left"
          >
            <Settings size={18} />
            Settings
          </button>
          <button 
            onClick={handleLogout} 
            className="nav-item w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/5"
          >
            <LogOut size={18} className="text-red-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0d1117]/50 backdrop-blur flex-shrink-0">
          <div />
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Sun size={16} className="text-gray-400" />
            </button>
            <div 
              onClick={() => navigate('/app/profile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20 cursor-pointer"
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


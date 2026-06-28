import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-black">
              <span className="text-white">Career</span>
              <span className="gradient-text">Forge</span>
            </span>
          </div>
          <p className="text-gray-400 mt-3 text-sm">Welcome back. Enter your credentials to access your workspace.</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            Sign In
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400 animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Email address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-gray-600" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Password</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-gray-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full justify-center text-sm py-3.5 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

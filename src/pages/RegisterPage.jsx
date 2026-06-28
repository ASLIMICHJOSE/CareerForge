import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { User, Mail, Lock, Briefcase, MapPin, Award, ArrowRight, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetRoles: 'Senior Product Designer',
    location: 'Brooklyn, NY',
    yearsExp: '5'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(formData)
      navigate('/app/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
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
          <p className="text-gray-400 mt-3 text-sm">Create an account to build a secure career workspace.</p>
        </div>

        {/* Register Card */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles size={16} className="text-violet-400" />
            Create Account
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400 animate-slide-up">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Full Name</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-4 text-gray-600" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Email address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-4 text-gray-600" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Password (Min 6 chars)</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-4 text-gray-600" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Years Exp</label>
                <div className="relative flex items-center">
                  <Award size={16} className="absolute left-4 text-gray-600" />
                  <input
                    name="yearsExp"
                    type="number"
                    required
                    min="0"
                    max="50"
                    value={formData.yearsExp}
                    onChange={handleChange}
                    className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Location</label>
                <div className="relative flex items-center">
                  <MapPin size={16} className="absolute left-4 text-gray-600" />
                  <input
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Target Role</label>
              <div className="relative flex items-center">
                <Briefcase size={16} className="absolute left-4 text-gray-600" />
                <input
                  name="targetRoles"
                  type="text"
                  required
                  placeholder="e.g. Software Engineer"
                  value={formData.targetRoles}
                  onChange={handleChange}
                  className="w-full bg-[#0d1420] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full justify-center text-sm py-3 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Get Started <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

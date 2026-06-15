import { Link, useNavigate } from 'react-router-dom'
import { Zap, Shield, Target, MessageSquare, ChevronRight, CheckCircle2, Star, ArrowRight, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'ATS Score Engine',
    desc: 'Instant scores that mirror how real Applicant Tracking Systems rank your resume — no guesswork.',
    color: 'from-blue-500 to-violet-500',
  },
  {
    icon: Target,
    title: 'Job Match Analysis',
    desc: 'Paste any job description and get a ranked list of matched and missing skills in seconds.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Learning Roadmap',
    desc: 'Receive a step-by-step coaching plan to close skill gaps and reach your target role faster.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: MessageSquare,
    title: 'Mock Interviews',
    desc: 'Practice with an AI that asks real questions and gives you live feedback on every answer.',
    color: 'from-pink-500 to-red-500',
  },
]

const steps = [
  { num: '01', title: 'Upload your resume', desc: 'Drop your PDF or DOCX — we parse it instantly.' },
  { num: '02', title: 'Add the job description', desc: 'Paste the full listing from any job board.' },
  { num: '03', title: 'Get your analysis', desc: 'ATS score, match %, and your personalized roadmap.' },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager @ Google',
    avatar: 'SC',
    text: 'CareerForge helped me go from a 62 to a 91 ATS score. I landed 4 interviews in my first week.',
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'SWE @ Stripe',
    avatar: 'MW',
    text: 'The mock interview feature is insanely good. It prepares you like nothing else out there.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'UX Designer @ Linear',
    avatar: 'PS',
    text: 'I used to blindly apply to jobs. Now I know exactly what to fix before submitting.',
    rating: 5,
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen grid-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#0a0d14]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
            </svg>
          </div>
          <span className="text-lg font-bold">
            <span className="text-white">Career</span>
            <span className="gradient-text">Forge</span>
            <span className="text-gray-400 text-sm font-normal ml-1.5">AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How it works</a>
          <button onClick={() => navigate('/app/dashboard')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Dashboard</button>
        </div>

        <button
          onClick={() => navigate('/app/analyze')}
          className="btn-primary text-sm"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 left-1/3 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-10 text-sm text-gray-400">
          <Sparkles size={14} className="text-violet-400" />
          Powered by GPT-class career models
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight max-w-4xl tracking-tight">
          <span className="text-white">Forge a resume that</span>
          <br />
          <span className="gradient-text">actually lands</span>
          <br />
          <span className="text-white">interviews</span>
        </h1>

        <p className="mt-7 text-gray-400 text-lg max-w-xl leading-relaxed">
          CareerForge AI analyzes your resume against any job description, scores it the
          way real ATS systems do, and builds a coaching plan to close every gap.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <button
            id="hero-analyze-btn"
            onClick={() => navigate('/app/analyze')}
            className="btn-primary shadow-lg shadow-violet-500/25 text-base px-8 py-4"
          >
            Analyze My Resume <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="btn-secondary text-base px-8 py-4"
          >
            See sample report
          </button>
        </div>

        <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Free to try</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> No credit card</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Results in 30 seconds</span>
        </div>

        {/* Hero preview card */}
        <div className="relative mt-20 max-w-3xl w-full">
          <div className="card p-7 glow-ring">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-2xl font-bold shadow-xl shadow-violet-500/20 flex-shrink-0">
                <span className="text-[#0a0d14]">87</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">SENIOR PRODUCT DESIGNER · STRIPE</p>
                <h3 className="text-xl font-bold text-white mb-3">Strong match — 3 fixes to reach 95+</h3>
                <div className="flex flex-wrap gap-2">
                  {['Design Systems', 'User Research', 'Figma', 'B2B SaaS'].map(s => (
                    <span key={s} className="tag-green">{s}</span>
                  ))}
                  {['Prototyping in Code', 'Pricing UX'].map(s => (
                    <span key={s} className="tag-red">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Everything you need to stand out</h2>
            <p className="text-gray-400 text-lg">A career coach, recruiter, and ATS expert — in one workspace.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Up and running in 60 seconds</h2>
            <p className="text-gray-400 text-lg">No setup. No lengthy onboarding. Just results.</p>
          </div>

          <div className="space-y-5">
            {steps.map((s, i) => (
              <div key={s.num} className="card p-7 flex items-start gap-6 hover:border-white/10 transition-all duration-300">
                <span className="text-5xl font-black gradient-text opacity-60 leading-none flex-shrink-0">{s.num}</span>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight size={20} className="text-gray-600 ml-auto flex-shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Loved by job seekers</h2>
            <p className="text-gray-400 text-lg">Thousands of candidates have leveled up their careers with CareerForge.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="card p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#f59e0b" className="text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-purple-600/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Ready to forge your future?</h2>
              <p className="text-gray-400 text-lg mb-8">Upload your resume in 30 seconds and get your full analysis for free.</p>
              <button
                onClick={() => navigate('/app/analyze')}
                className="btn-primary text-lg px-10 py-4 shadow-lg shadow-violet-500/25 mx-auto"
              >
                Start for free <ArrowRight size={20} />
              </button>
              <p className="text-gray-600 text-sm mt-5">No credit card required · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm">CareerForge <span className="text-gray-500 font-normal">AI</span></span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 CareerForge AI. All rights reserved.</p>
          <div className="flex gap-6 text-gray-600 text-sm">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

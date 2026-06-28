import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { TrendingUp, ArrowRight, CheckCircle2, AlertCircle, BookOpen, Award, Briefcase, LineChart, Upload } from 'lucide-react'
import { api } from '../api'

// Circular ATS score ring
function ATSRing({ score }) {
  const radius = 72
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const gap = circumference - progress

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg width="192" height="192" viewBox="0 0 192 192">
        {/* Background ring */}
        <circle
          cx="96" cy="96" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />
        {/* Progress ring */}
        <circle
          cx="96" cy="96" r={radius}
          fill="none"
          stroke="url(#atsGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${gap}`}
          className="progress-ring"
        />
        <defs>
          <linearGradient id="atsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">{score}</span>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-0.5">ATS Score</span>
      </div>
    </div>
  )
}

const STAGE_ICONS = {
  1: BookOpen,
  2: Award,
  3: Briefcase,
  4: LineChart,
  5: TrendingUp
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        const specificId = location.state?.analysisId
        if (specificId) {
          const res = await api.get(`/api/analyses/${specificId}`)
          setAnalysis(res.analysis)
        } else {
          const res = await api.get('/api/analyses')
          if (res.analyses && res.analyses.length > 0) {
            setAnalysis(res.analyses[0]) // latest
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load report data.')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [location.state])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-xl mx-auto">
          <p className="text-red-400 font-medium mb-3">{error}</p>
          <button onClick={() => navigate('/app/analyze')} className="btn-primary mx-auto text-sm">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="p-8 min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md card p-8 border border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20">
            <Upload size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">No analyses run yet</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Upload your resume and paste a job description. We will scan it for ATS matching and create a coaching roadmap.
          </p>
          <button onClick={() => navigate('/app/analyze')} className="btn-primary mx-auto text-sm shadow-lg shadow-violet-500/20">
            Analyze your resume
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Analysis Report</p>
          <h1 className="text-3xl font-extrabold text-white">{analysis.role} — {analysis.company}</h1>
          <p className="text-gray-500 text-sm mt-1">Analyzed {analysis.date} · {analysis.resumeName}</p>
        </div>
        <button
          id="start-mock-interview-btn"
          onClick={() => navigate('/app/interview')}
          className="btn-primary shadow-lg shadow-violet-500/20 flex-shrink-0"
        >
          Start Mock Interview <ArrowRight size={16} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* ATS Score */}
        <div className="card p-6 flex items-center justify-center">
          <ATSRing score={analysis.atsScore} />
        </div>

        {/* Job Match */}
        <div className="card p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-4">
            <TrendingUp size={12} /> Resume vs Job Match
          </p>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-6xl font-black gradient-text">{analysis.matchScore}%</span>
            <span className="text-emerald-400 text-sm font-semibold">
              {analysis.matchScore > 80 ? '+12 vs avg' : '+3 vs avg'}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
              style={{ width: `${analysis.matchScore}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-3">
            {analysis.matchScore >= 80 
              ? `Strong match. Close ${analysis.skillsMissing?.length || 0} gaps below to reach 95%.`
              : `Fair match. Close ${analysis.skillsMissing?.length || 0} gaps below to land an interview.`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">Quick Stats</p>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Keywords', value: analysis.quickStats?.keywords || 'N/A' },
              { label: 'Readability', value: analysis.quickStats?.readability || 'N/A' },
              { label: 'Length', value: analysis.quickStats?.length || 'N/A' },
              { label: 'Action verbs', value: analysis.quickStats?.actionVerbs || 'N/A' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-white font-bold text-lg">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Matched */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <h3 className="text-white font-bold">Matched Skills</h3>
            </div>
            <span className="text-gray-500 font-bold">{analysis.skillsMatched?.length || 0}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.skillsMatched?.map(s => (
              <span key={s} className="tag-green">{s}</span>
            ))}
            {(!analysis.skillsMatched || analysis.skillsMatched.length === 0) && (
              <p className="text-gray-600 text-sm">No matched skills detected.</p>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" />
              <h3 className="text-white font-bold">Missing Skills</h3>
            </div>
            <span className="text-gray-500 font-bold">{analysis.skillsMissing?.length || 0}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.skillsMissing?.map(s => (
              <span key={s} className="tag-red">{s}</span>
            ))}
            {(!analysis.skillsMissing || analysis.skillsMissing.length === 0) && (
              <p className="text-gray-600 text-sm">No missing skills! Excellent matching.</p>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      {analysis.roadmap && analysis.roadmap.length > 0 && (
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-white font-bold text-xl">Your Personalized Learning Roadmap</h3>
            <p className="text-gray-500 text-sm mt-1">A step-by-step plan to close the gap and land the interview.</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-12 bottom-12 w-px bg-white/5" />

            <div className="space-y-4">
              {analysis.roadmap.map((stage) => {
                const Icon = STAGE_ICONS[stage.stage] || BookOpen
                return (
                  <div key={stage.stage} className="flex gap-5">
                    {/* Icon */}
                    <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      stage.status === 'in-progress'
                        ? 'bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-violet-500/25'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <Icon size={18} className={stage.status === 'in-progress' ? 'text-white' : 'text-gray-500'} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 card-sm p-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-gray-500 font-medium">STAGE {stage.stage}</span>
                        <span className="text-xs text-gray-600">{stage.duration}</span>
                        {stage.status === 'in-progress' && (
                          <span className="text-xs bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-full font-medium">
                            In progress
                          </span>
                        )}
                      </div>
                      <h4 className="text-white font-semibold">{stage.title}</h4>
                      <p className="text-gray-500 text-sm mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

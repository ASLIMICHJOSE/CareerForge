import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Calendar, TrendingUp, Plus, FileText, Upload } from 'lucide-react'
import { api } from '../api'

function getAtsColor(score) {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 75) return 'bg-amber-500'
  return 'bg-orange-600'
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get('/api/analyses')
        if (res.analyses) {
          setAnalyses(res.analyses)
        }
      } catch (err) {
        setError(err.message || 'Failed to load analysis history.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

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
            Try new analysis
          </button>
        </div>
      </div>
    )
  }

  // Calculate dynamic stats
  const totalAnalyses = analyses.length
  const avgScore = totalAnalyses > 0 
    ? Math.round(analyses.reduce((acc, curr) => acc + curr.atsScore, 0) / totalAnalyses) 
    : 0
  const bestMatch = totalAnalyses > 0 
    ? Math.max(...analyses.map(a => a.matchScore)) 
    : 0

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Analysis History</h1>
          <p className="text-gray-500 text-sm mt-1">All your past resume analyses, in one place.</p>
        </div>
        <button
          id="new-analysis-btn"
          onClick={() => navigate('/app/analyze')}
          className="btn-primary shadow-lg shadow-violet-500/20"
        >
          <Plus size={16} />
          New analysis
        </button>
      </div>

      {totalAnalyses === 0 ? (
        <div className="text-center card p-12 max-w-lg mx-auto border border-white/5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/20">
            <Upload size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">No past history found</h2>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Run your first analysis by drop-uploading a resume file and specifying the job details.
          </p>
          <button onClick={() => navigate('/app/analyze')} className="btn-primary mx-auto text-sm shadow-lg shadow-violet-500/20">
            Analyze your resume
          </button>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {[
              { label: 'Total Analyses', value: String(totalAnalyses), color: 'text-blue-400' },
              { label: 'Average Score', value: String(avgScore), color: 'text-violet-400' },
              { label: 'Best Match', value: `${bestMatch}%`, color: 'text-purple-400' },
            ].map(s => (
              <div key={s.label} className="card p-5">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">{s.label}</p>
                <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 px-6 py-4 border-b border-white/5 bg-[#0d1117]/30">
              <div className="col-span-6 text-xs text-gray-500 uppercase tracking-widest font-semibold">Role</div>
              <div className="col-span-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">ATS Score</div>
              <div className="col-span-2 text-xs text-gray-500 uppercase tracking-widest font-semibold">Match</div>
              <div className="col-span-1" />
            </div>

            {/* Rows */}
            {analyses.map((a, i) => (
              <div
                key={a.id}
                className={`grid grid-cols-12 px-6 py-5 items-center hover:bg-white/2 transition-colors cursor-pointer group ${
                  i < analyses.length - 1 ? 'border-b border-white/5' : ''
                }`}
                onClick={() => navigate('/app/dashboard', { state: { analysisId: a.id } })}
              >
                {/* Role */}
                <div className="col-span-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{a.role}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                      {a.company}
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <Calendar size={12} />
                      {a.date}
                    </p>
                  </div>
                </div>

                {/* ATS */}
                <div className="col-span-3">
                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold ${getAtsColor(a.atsScore)}`}>
                    {a.atsScore}
                  </span>
                </div>

                {/* Match */}
                <div className="col-span-2 flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <TrendingUp size={14} />
                  {a.matchScore}%
                </div>

                {/* Arrow */}
                <div className="col-span-1 flex justify-end">
                  <ArrowUpRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

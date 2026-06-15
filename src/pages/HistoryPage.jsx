import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Calendar, TrendingUp, Plus, FileText } from 'lucide-react'

const analyses = [
  { id: 1, role: 'Senior Product Designer', company: 'Stripe', date: 'Jun 15, 2026', ats: 87, match: 82, atsColor: 'bg-emerald-500' },
  { id: 2, role: 'Lead UX Designer', company: 'Linear', date: 'Jun 10, 2026', ats: 91, match: 88, atsColor: 'bg-emerald-500' },
  { id: 3, role: 'Product Designer II', company: 'Vercel', date: 'Jun 02, 2026', ats: 79, match: 71, atsColor: 'bg-amber-500' },
  { id: 4, role: 'Staff Designer', company: 'Notion', date: 'May 24, 2026', ats: 84, match: 76, atsColor: 'bg-amber-500' },
  { id: 5, role: 'Sr. Designer (Growth)', company: 'Figma', date: 'May 11, 2026', ats: 73, match: 65, atsColor: 'bg-amber-600' },
]

function getAtsColor(score) {
  if (score >= 85) return 'bg-emerald-500'
  if (score >= 75) return 'bg-amber-500'
  return 'bg-orange-600'
}

export default function HistoryPage() {
  const navigate = useNavigate()

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

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Analyses', value: '5', color: 'text-blue-400' },
          { label: 'Average Score', value: '83', color: 'text-violet-400' },
          { label: 'Best Match', value: '88%', color: 'text-purple-400' },
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
        <div className="grid grid-cols-12 px-6 py-4 border-b border-white/5">
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
            onClick={() => navigate('/app/dashboard')}
          >
            {/* Role */}
            <div className="col-span-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{a.role}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1.5">
                  {a.company}
                  <Calendar size={12} />
                  {a.date}
                </p>
              </div>
            </div>

            {/* ATS */}
            <div className="col-span-3">
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold ${getAtsColor(a.ats)}`}>
                {a.ats}
              </span>
            </div>

            {/* Match */}
            <div className="col-span-2 flex items-center gap-1.5 text-emerald-400 font-semibold">
              <TrendingUp size={14} />
              {a.match}%
            </div>

            {/* Arrow */}
            <div className="col-span-1 flex justify-end">
              <ArrowUpRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

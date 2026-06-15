import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, CloudUpload, FileText, Sparkles, X } from 'lucide-react'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState(null)
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const handleAnalyze = () => {
    if (!file && !jobDesc) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/app/dashboard')
    }, 2000)
  }

  const sampleJobDesc = `Senior Product Designer at Stripe

We are looking for a Senior Product Designer to join our team and help us build world-class financial infrastructure.

Requirements:
- 5+ years of product design experience
- Expert in Figma and design systems
- Experience with B2B SaaS products
- Strong user research skills
- Experience with prototyping in code (React preferred)
- Familiarity with quantitative research methods
- Understanding of pricing UX and growth experiments
- Excellent stakeholder management skills`

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6 text-sm text-gray-400">
          <Sparkles size={13} className="text-violet-400" />
          Step 1 of 1
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3">Analyze your resume</h1>
        <p className="text-gray-400 text-lg">Drop your resume + paste a job description. We'll do the rest.</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Resume upload */}
        <div className="card p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Your Resume</p>

          {file ? (
            <div className="border border-white/10 rounded-xl p-6 flex items-center gap-4 bg-white/3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          ) : (
            <div
              id="resume-dropzone"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-violet-500/60 bg-violet-500/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/2'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                <CloudUpload size={24} className="text-white" />
              </div>
              <p className="text-white font-semibold mb-1">Drag & drop your resume</p>
              <p className="text-gray-500 text-sm mb-3">PDF or DOCX, up to 5MB</p>
              <span className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors">or browse files</span>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Job Description</p>
            <button
              onClick={() => setJobDesc(sampleJobDesc)}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              Use sample
            </button>
          </div>
          <textarea
            id="job-description-textarea"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-64 bg-[#0d1420] border border-white/5 rounded-xl p-4 text-gray-300 placeholder-gray-600 text-sm resize-none focus:outline-none focus:border-violet-500/40 focus:bg-[#0d1420] transition-all"
          />
          <p className="text-gray-600 text-xs mt-2">{jobDesc.length} characters</p>
        </div>
      </div>

      {/* Analyze button */}
      <div className="max-w-5xl mx-auto mt-8 flex justify-center">
        <button
          id="analyze-resume-btn"
          onClick={handleAnalyze}
          disabled={loading}
          className={`btn-primary text-lg px-10 py-4 shadow-lg shadow-violet-500/25 min-w-48 justify-center ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze Resume
            </>
          )}
        </button>
      </div>

      {/* Features hint */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-3 gap-4">
        {[
          { icon: '🎯', label: 'ATS Score', desc: 'Real scoring engine' },
          { icon: '🔍', label: 'Skill Gap Analysis', desc: "Know what's missing" },
          { icon: '🗺️', label: 'Learning Roadmap', desc: 'Step-by-step plan' },
        ].map(f => (
          <div key={f.label} className="card-sm p-4 text-center">
            <span className="text-2xl">{f.icon}</span>
            <p className="text-white text-sm font-semibold mt-2">{f.label}</p>
            <p className="text-gray-600 text-xs mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

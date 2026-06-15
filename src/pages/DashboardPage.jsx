import { useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, CheckCircle2, AlertCircle, BookOpen, Award, Briefcase, LineChart } from 'lucide-react'

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

const roadmapStages = [
  {
    stage: 1, duration: '1 week', status: 'in-progress',
    title: 'Master Pricing UX patterns',
    desc: 'Study how Stripe, Linear, and Vercel structure pricing pages.',
    icon: BookOpen,
  },
  {
    stage: 2, duration: '2 weeks', status: 'pending',
    title: 'Build a React prototype demo',
    desc: 'Ship one interactive prototype using React + Framer Motion.',
    icon: Award,
  },
  {
    stage: 3, duration: '1 week', status: 'pending',
    title: 'Add quantitative case study',
    desc: 'Document a project with metrics: conversion, retention, NPS.',
    icon: Briefcase,
  },
  {
    stage: 4, duration: '1 week', status: 'pending',
    title: 'Run a growth experiment writeup',
    desc: 'Show A/B testing thinking — hypothesis, result, learning.',
    icon: LineChart,
  },
  {
    stage: 5, duration: '1 week', status: 'pending',
    title: 'Practice quantitative research framing',
    desc: 'Complete two Maze usability studies and document findings.',
    icon: TrendingUp,
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Analysis Report</p>
          <h1 className="text-3xl font-extrabold text-white">Senior Product Designer — Stripe</h1>
          <p className="text-gray-500 text-sm mt-1">Analyzed just now · resume_v3.pdf</p>
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
          <ATSRing score={87} />
        </div>

        {/* Job Match */}
        <div className="card p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-4">
            <TrendingUp size={12} /> Resume vs Job Match
          </p>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-6xl font-black gradient-text">82%</span>
            <span className="text-emerald-400 text-sm font-semibold">+12 vs avg</span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-white/5 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
              style={{ width: '82%' }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-3">Strong match. Close 3 gaps below to reach 95%.</p>
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">Quick Stats</p>
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Keywords', value: '34 / 41' },
              { label: 'Readability', value: 'A' },
              { label: 'Length', value: '1.2 pg' },
              { label: 'Action verbs', value: '27' },
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
            <span className="text-gray-500 font-bold">7</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Design Systems', 'Figma', 'User Research', 'B2B SaaS', 'Accessibility', 'Prototyping', 'Stakeholder Management'].map(s => (
              <span key={s} className="tag-green">{s}</span>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400" />
              <h3 className="text-white font-bold">Missing Skills</h3>
            </div>
            <span className="text-gray-500 font-bold">4</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Pricing UX', 'Prototyping in Code (React)', 'Quantitative Research', 'Growth Experiments'].map(s => (
              <span key={s} className="tag-red">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-white font-bold text-xl">Your Personalized Learning Roadmap</h3>
          <p className="text-gray-500 text-sm mt-1">A 5-step plan to close the gap and land the interview.</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-12 bottom-12 w-px bg-white/5" />

          <div className="space-y-4">
            {roadmapStages.map((stage) => (
              <div key={stage.stage} className="flex gap-5">
                {/* Icon */}
                <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  stage.status === 'in-progress'
                    ? 'bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-violet-500/25'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <stage.icon size={18} className={stage.status === 'in-progress' ? 'text-white' : 'text-gray-500'} />
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

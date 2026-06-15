import { useState } from 'react'
import { Pencil, Mail, MapPin, Briefcase, Award, Target } from 'lucide-react'

const profile = {
  name: 'Alex Morgan',
  initials: 'AM',
  role: 'Senior Product Designer',
  status: 'Open to opportunities',
  email: 'alex.morgan@email.com',
  location: 'Brooklyn, NY',
  yearsExp: 7,
  analysesRun: 23,
  targetRoles: 'Sr / Staff',
  plan: 'Pro · Renews Jul 2026',
}

const accountFields = [
  { label: 'Full name', value: profile.name },
  { label: 'Email', value: profile.email },
  { label: 'Plan', value: profile.plan },
  { label: 'Default target role', value: profile.role },
  { label: 'Location', value: profile.location },
]

export default function ProfilePage() {
  const [editing, setEditing] = useState(null)

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and career preferences.</p>
      </div>

      {/* Profile card */}
      <div className="relative overflow-hidden rounded-2xl mb-6">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-violet-600/25 to-purple-700/30" />
        <div className="absolute inset-0 bg-[#111827]/40" />

        <div className="relative flex items-center gap-6 p-7">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-violet-500/30 flex-shrink-0">
            {profile.initials}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white">{profile.name}</h2>
            <p className="text-gray-300 text-sm mt-0.5">{profile.role} · {profile.status}</p>
            <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5"><Mail size={13} />{profile.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} />{profile.location}</span>
            </div>
          </div>

          {/* Edit */}
          <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/15 transition-colors">
            <Pencil size={14} />
            Edit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { icon: Briefcase, label: 'Years Experience', value: profile.yearsExp },
          { icon: Award, label: 'Analyses Run', value: profile.analysesRun },
          { icon: Target, label: 'Target Roles', value: profile.targetRoles },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon size={16} className="text-violet-400" />
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{s.label}</p>
            </div>
            <p className="text-3xl font-extrabold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Account details */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="text-white font-bold">Account details</h3>
        </div>
        {accountFields.map((field, i) => (
          <div
            key={field.label}
            className={`flex items-center justify-between px-6 py-5 ${
              i < accountFields.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <span className="text-gray-500 text-sm w-44">{field.label}</span>
            <span className="text-white font-semibold flex-1">{field.value}</span>
            <button
              onClick={() => setEditing(field.label)}
              className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="card mt-6 p-6 border-red-500/20">
        <h3 className="text-white font-bold mb-1">Danger zone</h3>
        <p className="text-gray-500 text-sm mb-5">Permanently delete your account and all analyses.</p>
        <button className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  )
}

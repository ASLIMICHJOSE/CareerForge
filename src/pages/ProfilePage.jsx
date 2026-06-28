import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { Pencil, Mail, MapPin, Briefcase, Award, Target, Check, X } from 'lucide-react'
import { api } from '../api'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()
  const [editingField, setEditingField] = useState(null) // holds the key of the field being edited
  const [editValue, setEditValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) return null

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US'

  const accountFields = [
    { label: 'Full name', key: 'name', value: user.name },
    { label: 'Email', key: 'email', value: user.email, readOnly: true },
    { label: 'Plan', key: 'plan', value: user.plan || 'Pro', readOnly: true },
    { label: 'Default target role', key: 'role', value: user.role },
    { label: 'Location', key: 'location', value: user.location },
  ]

  const handleEdit = (field) => {
    if (field.readOnly) return
    setEditingField(field.key)
    setEditValue(field.value)
    setError('')
  }

  const handleSave = async (key) => {
    setLoading(true)
    setError('')
    try {
      let val = editValue
      if (key === 'yearsExp') val = Number(editValue) || 0
      
      const res = await api.put('/api/profile', { [key]: val })
      updateUser(res.user)
      setEditingField(null)
    } catch (err) {
      setError(err.message || 'Failed to update field.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you absolutely sure you want to delete your account? This will permanently erase your profile, all resume analyses, and interview sessions. This action is irreversible.'
    )
    if (!confirmDelete) return

    setLoading(true)
    setError('')
    try {
      await api.delete('/api/profile')
      await logout()
      navigate('/register')
    } catch (err) {
      setError(err.message || 'Failed to delete account.')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 animate-fade-in max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and career preferences.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Profile card */}
      <div className="relative overflow-hidden rounded-2xl mb-6">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-violet-600/25 to-purple-700/30" />
        <div className="absolute inset-0 bg-[#111827]/40" />

        <div className="relative flex items-center gap-6 p-7">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-violet-500/30 flex-shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white">{user.name}</h2>
            <p className="text-gray-300 text-sm mt-0.5">{user.role} · {user.status}</p>
            <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5"><Mail size={13} />{user.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} />{user.location}</span>
            </div>
          </div>

          {/* Quick Edit */}
          <button 
            onClick={() => handleEdit({ key: 'name', value: user.name })}
            className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/15 transition-colors"
          >
            <Pencil size={14} />
            Edit Name
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {[
          { icon: Briefcase, label: 'Years Experience', key: 'yearsExp', value: user.yearsExp },
          { icon: Award, label: 'Analyses Run', key: 'analysesRun', value: user.analysesRun || 0, readOnly: true },
          { icon: Target, label: 'Target Roles', key: 'targetRoles', value: user.targetRoles },
        ].map(s => {
          const isEditing = editingField === s.key
          return (
            <div key={s.label} className="card p-5 relative">
              <div className="flex items-center gap-2 mb-3">
                <s.icon size={16} className="text-violet-400" />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{s.label}</p>
              </div>
              
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type={s.key === 'yearsExp' ? 'number' : 'text'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-[#0d1420] border border-white/10 rounded-lg px-2.5 py-1 text-white text-sm focus:outline-none w-full"
                    autoFocus
                  />
                  <button 
                    onClick={() => handleSave(s.key)}
                    disabled={loading}
                    className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={() => setEditingField(null)}
                    className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-extrabold text-white truncate max-w-[80%]">{s.value}</p>
                  {!s.readOnly && (
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-gray-500 hover:text-white transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Account details */}
      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="text-white font-bold">Account details</h3>
        </div>
        {accountFields.map((field, i) => {
          const isEditing = editingField === field.key
          return (
            <div
              key={field.label}
              className={`flex items-center justify-between px-6 py-5 ${
                i < accountFields.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <span className="text-gray-500 text-sm w-44">{field.label}</span>
              
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-[#0d1420] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none w-full max-w-md"
                    autoFocus
                  />
                  <button 
                    onClick={() => handleSave(field.key)}
                    disabled={loading}
                    className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => setEditingField(null)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <span className="text-white font-semibold flex-1">{field.value}</span>
              )}

              {!isEditing && !field.readOnly && (
                <button
                  onClick={() => handleEdit(field)}
                  className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Danger zone */}
      <div className="card mt-6 p-6 border-red-500/20">
        <h3 className="text-white font-bold mb-1">Danger zone</h3>
        <p className="text-gray-500 text-sm mb-5">Permanently delete your account and all analyses.</p>
        <button 
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          Delete account
        </button>
      </div>
    </div>
  )
}

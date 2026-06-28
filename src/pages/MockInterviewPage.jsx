import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, ChevronRight, MessageSquare } from 'lucide-react'
import { api } from '../api'

export default function MockInterviewPage() {
  const [session, setSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef()

  // Auto-scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch active interview session on mount
  useEffect(() => {
    async function loadInterview() {
      try {
        const res = await api.get('/api/interviews/sessions')
        if (res.sessions && res.sessions.length > 0) {
          const activeSession = res.sessions[0]
          setSession(activeSession)
          setMessages(activeSession.messages || [])
        }
      } catch (err) {
        setError(err.message || 'Failed to load interview session.')
      } finally {
        setLoading(false)
      }
    }
    loadInterview()
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || sending || !session) return
    const textToSend = input.trim()
    
    // Add user's message optimistically to UI
    const tempUserMsg = { id: 'temp-' + Date.now(), sender: 'user', text: textToSend }
    setMessages(prev => [...prev, tempUserMsg])
    setInput('')
    setSending(true)

    try {
      const res = await api.post(`/api/interviews/${session.id}/message`, { text: textToSend })
      
      // Update with full response (user message with feedback + ai follow-up)
      setMessages(prev => {
        // filter out temp message
        const base = prev.filter(m => m.id !== tempUserMsg.id)
        return [...base, res.userMessage, res.aiMessage]
      })
    } catch (err) {
      setError(err.message || 'Failed to send message.')
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id))
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Find the latest user message with feedback
  const lastUserMessageWithFeedback = [...messages]
    .reverse()
    .find(m => m.sender === 'user' && m.feedback)

  const feedbackData = lastUserMessageWithFeedback?.feedback

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !session) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-xl mx-auto">
          <p className="text-red-400 font-medium mb-3">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mx-auto text-sm">
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5 bg-[#0d1117]/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">AI Interviewer · {session?.company || 'Stripe'}</h2>
            <p className="text-gray-500 text-sm">{session?.role || 'Senior Product Designer'} · Behavioral round</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={16} className={`text-gray-400 transition-transform ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-slide-up ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 flex-shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'ai'
                    ? 'bg-[#111827] border border-white/5 text-gray-200'
                    : 'bg-gradient-to-br from-blue-600 to-violet-600 text-white'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white flex-shrink-0">
                <Sparkles size={14} />
              </div>
              <div className="bg-[#111827] border border-white/5 text-gray-400 max-w-xs p-4 rounded-2xl text-sm italic">
                AI is typing analysis and follow-up...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-8 py-5 border-t border-white/5 bg-[#0d1117]/25">
          <div className="flex items-center gap-3 bg-[#111827] border border-white/5 rounded-2xl px-5 py-3">
            <input
              id="interview-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              placeholder="Type your answer..."
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 text-sm focus:outline-none disabled:opacity-50"
            />
            <button
              id="send-answer-btn"
              onClick={sendMessage}
              disabled={sending || !input.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-50"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback sidebar */}
      {sidebarOpen && (
        <div className="w-80 flex-shrink-0 border-l border-white/5 px-6 py-6 bg-[#0d1117]/10 overflow-y-auto">
          <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5 flex items-center gap-1.5">
            <MessageSquare size={12} /> Live Evaluation
          </h3>

          {!feedbackData ? (
            <p className="text-gray-600 text-sm leading-relaxed">
              Submit your first answer to see evaluation scores and tips.
            </p>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {[
                { label: 'Structure', score: feedbackData.structure, color: 'from-amber-500 to-orange-500' },
                { label: 'Clarity', score: feedbackData.clarity, color: 'from-emerald-500 to-teal-500' },
                { label: 'Impact Focus', score: feedbackData.impact, color: 'from-red-500 to-pink-500' }
              ].map(f => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-medium">{f.label}</span>
                    <span className="text-white text-sm font-bold">{f.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${f.color} transition-all duration-1000`}
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="card-sm p-4 mt-6">
                <p className="text-gray-400 text-xs font-semibold mb-2">💡 Tip</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {feedbackData.tip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

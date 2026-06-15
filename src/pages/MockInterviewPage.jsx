import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, ChevronRight } from 'lucide-react'

const initialMessages = [
  {
    id: 1,
    sender: 'ai',
    text: "Hi! I'm your interviewer for the Senior Product Designer role at Stripe. Let's start with: walk me through a recent project where you shipped a complex feature end-to-end. What was the impact?",
  },
]

const feedbackHints = [
  { label: 'Structure', score: 72, color: 'from-amber-500 to-orange-500' },
  { label: 'Clarity', score: 85, color: 'from-emerald-500 to-teal-500' },
  { label: 'Impact Focus', score: 60, color: 'from-red-500 to-pink-500' },
]

export default function MockInterviewPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { id: Date.now(), sender: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowFeedback(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Great example! I love how you tied the outcome to business metrics. Let me ask a follow-up: how did you handle disagreements with the engineering team during that project?",
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-full">
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 py-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold">AI Interviewer · Stripe</h2>
            <p className="text-gray-500 text-sm">Senior Product Designer · Behavioral round</p>
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
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-8 py-5 border-t border-white/5">
          <div className="flex items-center gap-3 bg-[#111827] border border-white/5 rounded-2xl px-5 py-3">
            <input
              id="interview-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              className="flex-1 bg-transparent text-gray-200 placeholder-gray-600 text-sm focus:outline-none"
            />
            <button
              id="send-answer-btn"
              onClick={sendMessage}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback sidebar */}
      {sidebarOpen && (
        <div className="w-72 flex-shrink-0 border-l border-white/5 px-6 py-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">Live Feedback</h3>

          {!showFeedback ? (
            <p className="text-gray-600 text-sm">Submit your first answer to see feedback.</p>
          ) : (
            <div className="space-y-5 animate-fade-in">
              {feedbackHints.map(f => (
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
                  Lead with the business context before explaining your process. Stripe values data-driven decisions.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

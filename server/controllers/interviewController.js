import crypto from 'crypto'
import { db } from '../db.js'

const initialAIPrompt = "Hi! I'm your interviewer for the Senior Product Designer role at Stripe. Let's start with: walk me through a recent project where you shipped a complex feature end-to-end. What was the impact?"

export function getSessions(req, res, next) {
  try {
    const userId = req.user.id
    let sessions = db.interviews.find(i => i.userId === userId)

    // If no session exists, auto-initialize one so the user has immediate access
    if (sessions.length === 0) {
      const defaultSession = {
        id: crypto.randomUUID(),
        userId,
        role: req.user.role || 'Senior Product Designer',
        company: 'Stripe',
        messages: [
          {
            id: crypto.randomUUID(),
            sender: 'ai',
            text: initialAIPrompt,
            createdAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString()
      }
      db.interviews.insert(defaultSession)
      sessions = [defaultSession]
    }

    // Sort by newest first
    sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.status(200).json({ sessions })
  } catch (err) {
    next(err)
  }
}

export function createSession(req, res, next) {
  try {
    const userId = req.user.id
    const { role, company } = req.body

    const newSession = {
      id: crypto.randomUUID(),
      userId,
      role: role || req.user.role || 'Senior Product Designer',
      company: company || 'Stripe',
      messages: [
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: `Hi! I'm your interviewer for the ${role || req.user.role || 'Senior Product Designer'} role at ${company || 'Stripe'}. Let's start with: walk me through a recent project where you shipped a complex feature end-to-end. What was the impact?`,
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    }

    db.interviews.insert(newSession)
    res.status(201).json({ session: newSession })
  } catch (err) {
    next(err)
  }
}

export function getSessionById(req, res, next) {
  try {
    const { id } = req.params
    const userId = req.user.id

    const session = db.interviews.findOne(i => i.id === id)
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' })
    }

    if (session.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to view this interview.' })
    }

    res.status(200).json({ session })
  } catch (err) {
    next(err)
  }
}

export async function addMessage(req, res, next) {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message text cannot be empty.' })
    }

    const session = db.interviews.findOne(i => i.id === id)
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' })
    }

    if (session.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to post to this interview.' })
    }

    const userMessageId = crypto.randomUUID()
    
    // Evaluate the answer to generate scores
    const cleanText = text.toLowerCase()
    
    // Core analytics
    let structureScore = Math.floor(Math.random() * 25) + 70 // 70 to 95
    let clarityScore = Math.floor(Math.random() * 25) + 70
    let impactScore = Math.floor(Math.random() * 25) + 60 // 60 to 85

    let tip = 'Good detail! Next time, structure your answer using the STAR (Situation, Task, Action, Result) method to make your contribution clearer.'

    // Custom heuristics based on content
    if (cleanText.includes('situation') || cleanText.includes('result') || cleanText.includes('star')) {
      structureScore = Math.min(structureScore + 8, 98)
    }

    if (cleanText.length > 250) {
      clarityScore = Math.max(clarityScore - 5, 65) // too wordy
    } else if (cleanText.length < 50) {
      clarityScore = Math.max(clarityScore - 15, 50) // too short
      impactScore = Math.max(impactScore - 15, 45)
      tip = 'Try to elaborate more on the specific challenges and outcomes of your work.'
    }

    if (cleanText.includes('%') || cleanText.includes('increased') || cleanText.includes('metrics') || cleanText.includes('saved')) {
      impactScore = Math.min(impactScore + 12, 98)
      tip = 'Great job tying your results to quantitative business metrics! Stripe values data-driven outcomes.'
    }

    // Determine follow-up question
    let followUpText = "Great explanation! I like the depth you've shared. Let me ask a follow-up: how did you handle disagreements with the engineering team during that project?"

    if (cleanText.includes('engineering') || cleanText.includes('engineer') || cleanText.includes('developer')) {
      followUpText = "Handling developer collaboration is key. When developers raise objections about design complexity, how do you negotiate technical scope versus user experience?"
    } else if (cleanText.includes('user research') || cleanText.includes('testing') || cleanText.includes('interview')) {
      followUpText = "Interesting. When user research findings contradict what business stakeholders want, how do you navigate that conflict to advocate for the user?"
    } else if (cleanText.includes('design system') || cleanText.includes('figma')) {
      followUpText = "Stripe is built on heavy design systems. Can you talk about a time you contributed to or scaled a design system, and how you ensured adoption?"
    } else if (cleanText.includes('conflict') || cleanText.includes('disagree')) {
      followUpText = "Disagreements are natural in fast-paced product teams. Can you share an example of a time you were wrong, and how you adapted to the new information?"
    }

    const newUserMessage = {
      id: userMessageId,
      sender: 'user',
      text,
      feedback: {
        structure: structureScore,
        clarity: clarityScore,
        impact: impactScore,
        tip
      },
      createdAt: new Date().toISOString()
    }

    const aiMessageId = crypto.randomUUID()
    const newAIMessage = {
      id: aiMessageId,
      sender: 'ai',
      text: followUpText,
      createdAt: new Date().toISOString()
    }

    const updatedMessages = [...session.messages, newUserMessage, newAIMessage]
    db.interviews.update(id, { messages: updatedMessages })

    res.status(200).json({
      userMessage: newUserMessage,
      aiMessage: newAIMessage
    })
  } catch (err) {
    next(err)
  }
}

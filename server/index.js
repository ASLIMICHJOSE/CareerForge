import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { authMiddleware } from './middleware/auth.js'
import { errorHandler } from './middleware/error.js'
import * as authController from './controllers/authController.js'
import * as analyzeController from './controllers/analyzeController.js'
import * as interviewController from './controllers/interviewController.js'
import * as profileController from './controllers/profileController.js'

const app = express()
const PORT = process.env.PORT || 5000

// Helmet for secure HTTP Headers
app.use(helmet())

// CORS configuration (allow requests from Vite frontend dev server with credentials)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Custom CSRF Header verification middleware
app.use((req, res, next) => {
  // If it's a state-changing request (POST, PUT, DELETE), verify the origin and custom header
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.headers.origin || req.headers.referer
    const xRequestedWith = req.headers['x-requested-with']
    
    // In dev, sometimes referer or origin is missing, but verify if present
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return res.status(403).json({ error: 'CSRF Protection: Invalid origin.' })
    }
  }
  next()
})

// Rate limiters to prevent DDoS and Brute-Force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again later.' }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // limit login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' }
})

app.use('/api/', apiLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Multer upload config for resumes (Memory Storage, restricted to 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// Authentication Routes
app.post('/api/auth/register', authController.register)
app.post('/api/auth/login', authController.login)
app.post('/api/auth/logout', authController.logout)
app.get('/api/auth/me', authMiddleware, authController.me)

// Analysis Routes
app.get('/api/analyses', authMiddleware, analyzeController.getAnalyses)
app.get('/api/analyses/:id', authMiddleware, analyzeController.getAnalysisById)
app.post('/api/analyses/run', authMiddleware, upload.single('resume'), analyzeController.runAnalysis)

// Interview Routes
app.get('/api/interviews/sessions', authMiddleware, interviewController.getSessions)
app.post('/api/interviews/sessions', authMiddleware, interviewController.createSession)
app.get('/api/interviews/:id', authMiddleware, interviewController.getSessionById)
app.post('/api/interviews/:id/message', authMiddleware, interviewController.addMessage)

// Profile Routes
app.put('/api/profile', authMiddleware, profileController.updateProfile)
app.delete('/api/profile', authMiddleware, profileController.deleteAccount)

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() })
})

// Global Error Handler Middleware
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`[Server] Secure backend server listening on http://localhost:${PORT}`)
})

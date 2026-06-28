import jwt from 'jsonwebtoken'
import { db } from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'career_forge_secure_jwt_secret_token_key'

export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please login.' })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET)

    // Find user
    const user = db.users.findOne(u => u.id === decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'User session invalid. Please log in again.' })
    }

    // Attach user (without password hash)
    const { passwordHash, ...safeUser } = user
    req.user = safeUser
    next()
  } catch (err) {
    console.error('Auth middleware error:', err.message)
    return res.status(401).json({ error: 'Invalid or expired authentication token. Please log in.' })
  }
}

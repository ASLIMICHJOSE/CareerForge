import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'career_forge_secure_jwt_secret_token_key'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role, targetRoles, location, yearsExp } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required fields.' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' })
    }

    // Check existing
    const existing = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || targetRoles || 'Product Designer',
      status: 'Open to opportunities',
      location: location || 'Remote',
      yearsExp: Number(yearsExp) || 0,
      targetRoles: targetRoles || role || 'Product Designer',
      plan: 'Pro · Renews Jul 2026',
      createdAt: new Date().toISOString()
    }

    db.users.insert(newUser)

    // Sign JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' })

    // Set cookie
    res.cookie('token', token, COOKIE_OPTIONS)

    const { passwordHash: _, ...safeUser } = newUser
    res.status(201).json({ message: 'Registration successful', user: safeUser })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required fields.' })
    }

    // Find user
    const user = db.users.findOne(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' })
    }

    // Sign JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // Set cookie
    res.cookie('token', token, COOKIE_OPTIONS)

    const { passwordHash: _, ...safeUser } = user
    res.status(200).json({ message: 'Login successful', user: safeUser })
  } catch (err) {
    next(err)
  }
}

export function logout(req, res, next) {
  try {
    res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 })
    res.status(200).json({ message: 'Logout successful' })
  } catch (err) {
    next(err)
  }
}

export function me(req, res, next) {
  try {
    // req.user has already been loaded by authMiddleware
    res.status(200).json({ user: req.user })
  } catch (err) {
    next(err)
  }
}

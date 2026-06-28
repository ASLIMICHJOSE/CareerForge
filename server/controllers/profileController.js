import { db } from '../db.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 0
}

export function updateProfile(req, res, next) {
  try {
    const userId = req.user.id
    const { name, role, targetRoles, location, yearsExp, status } = req.body

    const updates = {}
    if (name !== undefined) updates.name = name
    if (role !== undefined) updates.role = role
    if (targetRoles !== undefined) updates.targetRoles = targetRoles
    if (location !== undefined) updates.location = location
    if (yearsExp !== undefined) updates.yearsExp = Number(yearsExp) || 0
    if (status !== undefined) updates.status = status

    const updatedUser = db.users.update(userId, updates)
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const { passwordHash, ...safeUser } = updatedUser
    res.status(200).json({ message: 'Profile updated successfully.', user: safeUser })
  } catch (err) {
    next(err)
  }
}

export function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id

    // Cascade Delete
    db.analyses.deleteByUserId(userId)
    db.interviews.deleteByUserId(userId)
    db.users.delete(userId)

    // Clear Auth Cookie
    res.clearCookie('token', COOKIE_OPTIONS)
    res.status(200).json({ message: 'Account and associated data deleted successfully.' })
  } catch (err) {
    next(err)
  }
}

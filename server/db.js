import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.join(__dirname, 'db.json')

// Initialize DB file
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    users: [],
    analyses: [],
    interviews: []
  }, null, 2))
}

function readData() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading database file, returning default schema:', err)
    return { users: [], analyses: [], interviews: [] }
  }
}

function writeData(data) {
  try {
    const tempFile = DB_FILE + '.tmp'
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8')
    fs.renameSync(tempFile, DB_FILE)
  } catch (err) {
    console.error('Error atomic-writing database file:', err)
  }
}

export const db = {
  users: {
    find: (filterFn) => readData().users.filter(filterFn),
    findOne: (filterFn) => readData().users.find(filterFn),
    insert: (user) => {
      const data = readData()
      data.users.push(user)
      writeData(data)
      return user
    },
    update: (id, updates) => {
      const data = readData()
      const idx = data.users.findIndex(u => u.id === id)
      if (idx === -1) return null
      data.users[idx] = { ...data.users[idx], ...updates }
      writeData(data)
      return data.users[idx]
    },
    delete: (id) => {
      const data = readData()
      data.users = data.users.filter(u => u.id !== id)
      writeData(data)
    }
  },
  analyses: {
    find: (filterFn) => readData().analyses.filter(filterFn),
    findOne: (filterFn) => readData().analyses.find(filterFn),
    insert: (analysis) => {
      const data = readData()
      data.analyses.push(analysis)
      writeData(data)
      return analysis
    },
    deleteByUserId: (userId) => {
      const data = readData()
      data.analyses = data.analyses.filter(a => a.userId !== userId)
      writeData(data)
    }
  },
  interviews: {
    find: (filterFn) => readData().interviews.filter(filterFn),
    findOne: (filterFn) => readData().interviews.find(filterFn),
    insert: (interview) => {
      const data = readData()
      data.interviews.push(interview)
      writeData(data)
      return interview
    },
    update: (id, updates) => {
      const data = readData()
      const idx = data.interviews.findIndex(i => i.id === id)
      if (idx === -1) return null
      data.interviews[idx] = { ...data.interviews[idx], ...updates }
      writeData(data)
      return data.interviews[idx]
    },
    deleteByUserId: (userId) => {
      const data = readData()
      data.interviews = data.interviews.filter(i => i.userId !== userId)
      writeData(data)
    }
  }
}

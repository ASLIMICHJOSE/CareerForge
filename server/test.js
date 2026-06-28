import { db } from './db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function runTests() {
  console.log('\n--- Running Backend Sanity Verification Tests ---\n')

  // Cleanup past test garbage if any
  db.users.delete('test-user-id')

  // Test 1: User password hash matching
  const plainPass = 'securePassword990!'
  const hash = await bcrypt.hash(plainPass, 10)
  
  const testUser = {
    id: 'test-user-id',
    name: 'Test Analyst',
    email: 'test@example.com',
    passwordHash: hash,
    role: 'Engineer',
    yearsExp: 2,
    createdAt: new Date().toISOString()
  }

  db.users.insert(testUser)
  console.log('✔ Test 1: User registration inserts successfully.')

  // Test 2: Find user
  const loadedUser = db.users.findOne(u => u.email === 'test@example.com')
  if (loadedUser && loadedUser.name === 'Test Analyst') {
    console.log('✔ Test 2: User details loaded correctly from database.')
  } else {
    throw new Error('Database lookup failure.')
  }

  // Test 3: Password verification comparison
  const match = await bcrypt.compare(plainPass, loadedUser.passwordHash)
  if (match) {
    console.log('✔ Test 3: Cryptographic password matching is correct.')
  } else {
    throw new Error('Cryptographic password compare logic failed.')
  }

  // Test 4: Token generation check
  const secretKey = 'career_forge_secure_jwt_secret_token_key'
  const jwtToken = jwt.sign({ id: loadedUser.id }, secretKey, { expiresIn: '1h' })
  const decoded = jwt.verify(jwtToken, secretKey)
  
  if (decoded.id === 'test-user-id') {
    console.log('✔ Test 4: JWT token validation succeeds.')
  } else {
    throw new Error('JWT verify returned corrupt token ID.')
  }

  // Cleanup
  db.users.delete('test-user-id')
  console.log('\n✔ All backend sanity checks passed successfully.\n')
}

runTests().catch(err => {
  console.error('✖ Verification failed:', err)
  process.exit(1)
})

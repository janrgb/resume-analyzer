import type { QueryResolvers, MutationResolvers } from 'types/graphql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from 'src/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

// Simulated user "database"
const users = [
  {
    id: 1,
    email: "user1@example.com",
    password: bcrypt.hashSync('password1', 10),
  },
  {
    id: 2,
    email: 'user2@example.com',
    password: bcrypt.hashSync('password2', 10),
  },
]

export const loginUser: MutationResolvers['loginUser'] = async ({ input }) => {
  const { email, password } = input

  // Find the user in the DB
  const user = users.find((u) => u.email == email)
  if (!user) {
    return {
      message: "ERROR! This user is not in our system."
    }
  }

  // Compare the hashed password
  const passMatch = await bcrypt.compare(password, user.password)
  if (!passMatch) {
    return {
      message: "ERROR! Invalid credentials."
    }
  }

  // Generate JWT token.
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' })
  return { token: token }
}

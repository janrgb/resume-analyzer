import { MutationResolvers } from "types/graphql";
import { compare } from 'bcrypt'
import { users } from '../signup/signup_endpoint'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'your-secure-secret'
const JWT_EXPIRATION = '1h'

export const loginUser: MutationResolvers['loginUser'] = async ({ input }) => {
  const { email, password } = input

  // Validate input
  if (!email || !password) {
    return {
      __typename: 'Error',
      message: 'Email and password are required.',
    }
  }

  // Find user
  const user = users.find(user => user.email === email)
  if (!user) {
    return {
      __typename: 'Error',
      message: 'Invalid email or password.',
    }
  }

  // Verify password
  const passwordMatch = await compare(password, user.password)
  if (!passwordMatch) {
    return {
      __typename: 'Error',
      message: 'Invalid email or password.',
    }
  }

  // Generate JWT
  const token = jwt.sign({ email: user.email, username: user.username }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  })

  return {
    __typename: 'Token',
    token,
  }
}



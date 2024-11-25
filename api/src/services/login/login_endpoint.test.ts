import { loginUser } from './login_endpoint'
import { users } from '../signup/signup_endpoint'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'test-secret' // Mock JWT secret for testing

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload, secret, options) => `mock-token-${payload.email}`),
}))

describe('loginUser', () => {
  beforeEach(() => {
    // Reset the users array before each test
    users.length = 0
  })

  it('should login successfully and return a JWT token', async () => {
    const hashedPassword = await hash('securePassword123', 10)
    const input = { email: 'test@example.com', password: 'securePassword123' }

    // Add a user to the in-memory storage
    users.push({ email: input.email, password: hashedPassword, username: 'testUser' })

    const response = await loginUser({ input })

    expect(response.__typename).toBe('Token')
    expect(response.message).toBe(`mock-token-${input.email}`)
  })

  it('should fail when email is not registered', async () => {
    const input = { email: 'notregistered@example.com', password: 'password123' }

    const response = await loginUser({ input })

    expect(response.__typename).toBe('Error')
    expect(response.message).toBe('Invalid email or password.')
  })

  it('should fail when password is incorrect', async () => {
    const hashedPassword = await hash('correctPassword', 10)
    const input = { email: 'test@example.com', password: 'wrongPassword' }

    // Add a user to the in-memory storage
    users.push({ email: input.email, password: hashedPassword, username: 'testUser' })

    const response = await loginUser({ input })

    expect(response.__typename).toBe('Error')
    expect(response.message).toBe('Invalid email or password.')
  })

  it('should fail when email or password is missing', async () => {
    const inputs = [
      { email: '', password: 'password123' }, // Missing email
      { email: 'test@example.com', password: '' }, // Missing password
    ]

    for (const input of inputs) {
      const response = await loginUser({ input })

      expect(response.__typename).toBe('Error')
      expect(response.message).toBe('Email and password are required.')
    }
  })
})

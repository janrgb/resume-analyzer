import { registerUser } from './signup_endpoint'
import { users } from './signup_endpoint' // Ensure users array is accessible for testing

describe('registerUser', () => {
  beforeEach(() => {
    // Reset the users array before each test
    users.length = 0
  })

  it('should register a new user successfully', async () => {
    const input = {
      email: 'test@example.com',
      password: 'securePassword123',
      username: 'testUser',
    }

    const response = await registerUser({ input })

    expect(response.code).toBe(201)
    expect(response.message).toBe('User registered. Yipee!')
    expect(users).toHaveLength(1)
    expect(users[0]).toMatchObject({
      email: input.email,
      username: input.username,
    })
  })

  it('should fail when email is already registered', async () => {
    const input = {
      email: 'duplicate@example.com',
      password: 'password123',
      username: 'user1',
    }

    // Add a user with the same email to the in-memory storage
    users.push({
      email: input.email,
      password: 'hashedPassword',
      username: input.username,
    })

    const response = await registerUser({ input })

    expect(response.code).toBe(400)
    expect(response.message).toBe('Email already in use')
    expect(users).toHaveLength(1) // No additional users should be added
  })

  it('should fail when email format is invalid', async () => {
    const input = {
      email: 'invalid-email',
      password: 'password123',
      username: 'user2',
    }

    const response = await registerUser({ input })

    expect(response.code).toBe(400)
    expect(response.message).toBe('Email not accpeted')
    expect(users).toHaveLength(0) // No user should be added
  })

  it('should fail when required fields are missing', async () => {
    const inputs = [
      { email: '', password: 'password123', username: 'user3' }, // Missing email
      { email: 'test@example.com', password: '', username: 'user4' }, // Missing password
      { email: 'test@example.com', password: 'password123', username: '' }, // Missing username
    ]

    for (const input of inputs) {
      const response = await registerUser({ input })

      expect(response.code).toBe(400)
      expect(response.message).toBe('All fields are required')
      expect(users).toHaveLength(0) // No user should be added
    }
  })
})

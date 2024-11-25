import { loginUser } from './userlogin'
import jwt from 'jsonwebtoken'

describe('login', () => {
  it('should return the jwt token just fine', async () => {
    const result = await loginUser({
      input: { email: "user2@example.com", password: "password2" }
    })

    expect(result).toHaveProperty('token')
  })

  it('returns an error message for invalid email', async () => {
    const result = await loginUser({
      input: { email: "user3@example.com", password: "password2" }
    })

    expect(result).toEqual({ message: "ERROR! This user is not in our system." })
  })

  it('returns an error for invalid password', async () => {
    const result = await loginUser({
      input: { email: "user2@example.com", password: "password3" }
    })

    expect(result).toEqual({ message: "ERROR! Invalid credentials." })
  })
})

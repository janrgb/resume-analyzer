import { registerUser } from './user'

describe('register', () => {
  it('should return 201 and a success message', async () => {
    const result = await registerUser({
      input: { email: "somebody@yahoo.com", password: "12345", username: "goober" }
    })

    expect(result.code).toBe(201)
    expect(result.message).toBe("User registered successfully.")
  })

  it('should return 400 bad request', async () => {
    const result = await registerUser({
      input: { email: "test@example.com", password: "uhhh", username: "TheDarkLord" }
    })

    expect(result.code).toBe(400)
    expect(result.message).toBe("Email already exists.")
  })

  it('should return 400 bad request', async () => {
    const result = await registerUser({
      input: { email: ".", password: "1", username: "who" }
    })

    expect(result.code).toBe(400)
  })
})

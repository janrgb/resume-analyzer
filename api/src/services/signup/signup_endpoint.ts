import { MutationResolvers } from "types/graphql";
import { hash } from 'bcrypt'

export const users: Array<{ email: string; password: string; username: string }> = []

export const registerUser: MutationResolvers['registerUser'] = async ({ input }) => {
  const { email, password, username } = input

  // Check input to ensure all fields are filled
  if (!email || !password || !username) {
    return {
      code: 400,
      message: "All fields are required",
    }
  }

  // Validate email
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email_regex.test(email)) {
    return {
      code: 400,
      message: "Email not accpeted",
    }
  }

  // Check email uniqueness
  const existingUser = users.find(user => user.email === email)

  if (existingUser) {
    return {
      code: 400,
      message: "Email already in use",
    }
  }

  // Hash password and push
  const hashedPwd = await hash(password, 10)

  users.push({
    email: email,
    password: hashedPwd,
    username: username,
  })

  return {
    code: 201,
    message: "User registered. Yipee!",
  }
}


import type { QueryResolvers, MutationResolvers } from 'types/graphql'
import { validate } from '@redwoodjs/api'

import bcrypt from 'bcrypt'

import { db } from 'src/lib/db'

const emails = ['test@example.com', 'user@example.com']

export const registerUser: MutationResolvers['registerUser'] = ({ input }) => {
  const { email, password } = input

  // Check email is valid
  try {
    validate(email, 'email', { email: true })
  } catch (EmailValidationError) {
    return {
      code: 400,
      message: "Email does not follow correct pattern."
    }
  }

  // Check if email already exists
  if (emails.includes(email)) {
    return {
      code: 400,
      message: "Email already exists."
    }
  }

  // Hash the pass.
  const hashedPassword = bcrypt.hash(password, 10)

  console.log(`Storing user with email: ${email} and hashed password: ${password}`)

  // If the email is unique, proceed with registration (dummy success for now)
  return {
    code: 201,
    message: "User registered successfully."
  }

  /*return db.user.create({
    data: input,
  })*/
}

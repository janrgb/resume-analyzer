export const schema = gql`
  type LoggingUser {
    email: String!
    password: String!
  }

  input LoginUser {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }

  type Error {
    message: String!
  }

  union LoginResponse = Token | Error

  type Mutation {
    loginUser(input: LoginUser!): LoginResponse! @requireAuth
  }
`

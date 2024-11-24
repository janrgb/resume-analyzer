export const schema = gql`
  type User {
    email: String!
    password: String!
    username: String!
  }

  input RegisterUser {
    email: String!
    password: String!
    username: String!
  }

  type Response {
    code: Int!
    message: String
  }

  type Mutation {
    registerUser(input: RegisterUser!): Response! @skipAuth
  }
`

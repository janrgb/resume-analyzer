export const schema = gql`
  type ChatGPTResponse {
    role: String!
    content: String!
  }

  type Query {
    generateText(prompt: String!): ChatGPTResponse! @skipAuth
  }
`

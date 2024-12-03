export const schema = gql`
  input ResumeDefinition {
    resume_text: String!
    job_description: String!
  }

  type ChatGPTResponse {
    error: String
    fit_score: Int
    feedback: [String]
  }

  type ErrorResponse {
    error: String!
  }

  type Query {
    generateText(prompt: ResumeDefinition!): ChatGPTResponse! @requireAuth
  }
`

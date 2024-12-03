export const schema = gql`
  type ResumeDefinition {
    resume_text: String!
    job_description: String!
  }

  type ChatGPTResponse {
    fit_score: Int!
    feedback: [String!]!
  }

  type Query {
    generateText(prompt: ResumeDefinition!): ChatGPTResponse! @requireAuth
  }
`

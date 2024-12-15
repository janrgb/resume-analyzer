export const schema = gql`
  input ResumeDefinition {
    resume_text: String!
    job_description: String!
  }

  type ChatGPTResponse {
    error: String
    fit_score: Int
    feedback: [String]
    keywords_matched: JSON
  }

  type Query {
    generateText(prompt: ResumeDefinition!): ChatGPTResponse! @requireAuth
  }
`

export const schema = gql`
  input ResumeStatistics {
    res_text: String
    job_text: String
    raw_score: Int
    raw_feedback: [String]
    raw_keywords: [String]
  }

  type AlgorithmOutput {
    refined_score: Int
    refined_feedback: JSON
    refined_keywords: [String]
  }

  type Mutation {
    refineInput(input: ResumeStatistics!): AlgorithmOutput! @requireAuth
  }
`

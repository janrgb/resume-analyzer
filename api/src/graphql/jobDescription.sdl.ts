export const schema = gql`
  type Mutation {
    submitJobDescription(job_description: String!): JobDescriptionResponse!
  }

  type JobDescriptionResponse {
    message: String!
    status: String!
  }
`

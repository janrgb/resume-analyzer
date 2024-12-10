export const schema = gql`
  input JobDescription {
    content: String,
    sessionID: String!
  }

  type DescriptionResponse {
    message: String
    status: String!
    error: String
    the_desc: String
  }

  type Mutation {
    uploadDescription(input: JobDescription!): DescriptionResponse! @requireAuth
  }
`

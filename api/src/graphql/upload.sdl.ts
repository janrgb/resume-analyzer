export const schema = gql`
  scalar Upload

  type UploadResponse {
    message: String
    status: String!
    error: String
  }

  type Mutation {
    resumeUpload(input: Upload!): UploadResponse! @requireAuth
  }
`

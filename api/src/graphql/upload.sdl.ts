export const schema = gql`

  type UploadResponse {
    message: String
    status: String!
    error: String
  }

  type Mutation {
    resumeUpload(input: File!): UploadResponse! @requireAuth
  }
`

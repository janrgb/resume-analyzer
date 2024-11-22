export const schema = gql`
  type Mutation {
    uploadResume(resume_file: Upload!): UploadResponse!
  }

  type UploadResponse {
    message: String!
    status: String!
  }
`

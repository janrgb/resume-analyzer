export const schema = gql`
  type TempStorage {
    resumeText: String
  }

  type Query {
    getTempStorage(sessionID: String!): TempStorage @requireAuth
  }

  type UploadResponse {
    message: String
    status: String!
    error: String
  }

  type Mutation {
    resumeUpload(input: File!): UploadResponse! @requireAuth
  }
    
`

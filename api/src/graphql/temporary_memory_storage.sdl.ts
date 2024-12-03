export const schema = gql`

input JobDescription{
  content: String
}

type descResponse{
  message: String
  status: String!
  error: String
}

type reponse{
  message: String
  status: String!
  error: String
}

type Mutation{
  addResume(input: File!): response! @requireAuth
  addDesc(input: JobDescription!): descResponse! @requireAuth
}
`

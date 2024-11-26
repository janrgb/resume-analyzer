export const schema = gql`

input JobDescription{
  content: String
}

type descResponse{
  message: String
  status: String!
  error: String
}


type response{
  message: String
  status: String!
  error: String
}



type Mutation{
  addFile(input: File!): response! @requireAuth
  addDesc(input: JobDescription!): descResponse! @requireAuth
}

`
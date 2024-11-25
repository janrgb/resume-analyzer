import type {
  ExamplePostsQuery,
  ExamplePostsQueryVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  ExamplePostsQuery,
  ExamplePostsQueryVariables
> = gql`
  query ExamplePostsQuery {
    examplePosts {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  examplePosts,
}: CellSuccessProps<ExamplePostsQuery>) => {
  return (
    <ul>
      {examplePosts.map((item) => {
        return <li key={item.id}>{JSON.stringify(item)}</li>
      })}
    </ul>
  )
}

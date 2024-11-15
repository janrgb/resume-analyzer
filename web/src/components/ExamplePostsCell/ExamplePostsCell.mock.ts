// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  examplePosts: [
    {
      __typename: 'examplePosts' as const,
      id: 42,
    },
    {
      __typename: 'examplePosts' as const,
      id: 43,
    },
    {
      __typename: 'examplePosts' as const,
      id: 44,
    },
  ],
})

import type { MutationResolvers } from 'types/graphql'

export const uploadDescription: MutationResolvers['uploadDescription'] = ({ input }) => {
  const { content } = input

  // Clean the text.
  const cleanContent = content.trim()

  // Check if content is above 5000 characters.
  if (cleanContent.length > 5000){
    return {
      status: "error",
      error: "Job description exceeds character limit."
    }
  }

  return {
    status: "success",
    message: "Job description submitted successfully."
  }
}

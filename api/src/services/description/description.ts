import type { MutationResolvers } from 'types/graphql'
import { tempStorage, clearSessionData } from '../upload/upload'

export const uploadDescription: MutationResolvers['uploadDescription'] = ({ input }) => {
  const { content, sessionID } = input

  // Clean the text.
  const cleanContent = content.trim()

  // Check if content is above 5000 characters.
  if (cleanContent.length > 5000){
    return {
      status: "error",
      error: "Job description exceeds character limit."
    }
  }

  // Store to session.
  if (!tempStorage[sessionID]) {
    tempStorage[sessionID] = {}
  }
  tempStorage[sessionID].jobDescription = content

  return {
    status: "success",
    message: "Job description submitted successfully.",
    the_desc: content,
  }
}

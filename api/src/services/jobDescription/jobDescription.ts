import { GraphQLError } from 'graphql'

interface JobDescriptionResponse {
  message: string
  status: string
}

export const submitJobDescription = async ({ job_description }: { job_description: string }): Promise<JobDescriptionResponse> => {
  const MAX_CHAR_COUNT = 5000

  // Validate job description length.
  if (job_description.length > MAX_CHAR_COUNT) {
    throw new GraphQLError('Job description exceeds character limit.', {
      extensions: { code: 'CHARACTER_LIMIT_EXCEEDED' },
    })
  }

  // Clean up the text (remove extra whitespace)
  const cleanedDescription = job_description.trim().replace(/\s+/g, ' ')

  return {
    message: 'Job description submitted successfully.',
    status: 'success',
  }
}

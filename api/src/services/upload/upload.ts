import { extractTextFromPDF } from 'src/lib/pdfUtils'
import type { MutationResolvers } from 'types/graphql'

interface MyResume {
  resumeText: string,
  jobDescription: string
}
const storage_list: MyResume[] = []
export const tempStorage: Record<string, { resumeText?: string, jobDescription? : string }> = {}

// Clear session data.
export const clearSessionData = (sessionID: string) => {
  delete tempStorage[sessionID]
}

// Handle resume upload.
export const resumeUpload: MutationResolvers['resumeUpload'] = async ({ input }) => {
  const { file, sessionID } = input
  const { name, type, size } = file

  // Validate file type.
  if (type !== 'application/pdf') {
    console.log(type)
    return {
      status: 'error',
      error: 'Invalid file type. Only PDF files are allowed.'
    }
  }

  // Check against max size.
  const MAX_FILE_SIZE = 2 * 1024 * 1024
  if (size > MAX_FILE_SIZE) {
    return {
      status: 'error',
      error: 'File exceeds maximum limit of 2MB.',
    }
  }

  // Extract text from the PDF.
  try {
    const text = await extractTextFromPDF(file)

    // Store to session.
    if (!tempStorage[sessionID]) {
      tempStorage[sessionID] = {}
    }
    tempStorage[sessionID].resumeText = text

    return {
      message: 'Resume uploaded successfully.',
      status: 'success',
      the_resume: text,
    }
  } catch (error) {
    return {
      status: 'error',
      error: 'Failed to process the PDF. Please try again.',
    }
  }
}

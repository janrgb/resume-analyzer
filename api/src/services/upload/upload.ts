import { extractTextFromPDF } from 'src/lib/pdfUtils'
import type { MutationResolvers } from 'types/graphql'
import { QueryResolvers } from 'types/graphql'

export const tempStorage: Record<string, {resumeText?: string, jobDescription?: string }> = {}

// Clear session data.
export const clearSessionData = (sessionID: string) => {
  delete tempStorage[sessionID]
}

// Handle resume upload.
export const resumeUpload: MutationResolvers['resumeUpload'] = async ({ input }) => {
  const sessionID = 'session-id-example'

  const { name, size, type } = input

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
      error: 'File exceeds maximum limit of 2MB.'
    }
  }

  // Extract text from the PDF.
  try {
    const text = await extractTextFromPDF(input)
    console.log("Extracted Text from PDF:", text)
    // Store to session.
    if (!tempStorage[sessionID]) {
      tempStorage[sessionID] = {}
    }
    tempStorage[sessionID].resumeText = text
    console.log("TEMPSTORAGE INFO:",tempStorage)
    return {
      message: 'Resume uploaded successfully.',
      status: 'success'
    }
  } catch (error) {
    return {
      status: 'error',
      error: 'Failed to process the PDF. Please try again.'
    }
  }
  
}

export const getTempStorage: QueryResolvers['getTempStorage'] = () => {
  const sessionID = 'session-id-example'; // Hardcoded session ID
  console.log(`Fetching temp storage for session: ${sessionID}`); // Log session ID to verify.

  const sessionData = tempStorage[sessionID];

  if (sessionData) {
    return {
      resumeText: sessionData.resumeText,
    };
  } else {
    throw new Error('No data found for this session.');
  }
}

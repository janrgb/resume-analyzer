import { extractTextFromPDF } from 'src/lib/pdfUtils'
import type { MutationResolvers } from 'types/graphql'

export const resumeUpload: MutationResolvers['resumeUpload'] = async ({ input }) => {
  console.log("HRER")
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

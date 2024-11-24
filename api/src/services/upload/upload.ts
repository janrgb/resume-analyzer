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

  // If we reach here, file size is valid
  console.log("Name: ", name)
  console.log("Mimetype: ", type)
  console.log("Size: ", size)

  return {
    message: "Resume uploaded successfully.",
    status: "success",
  }
}

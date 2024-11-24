import type { MutationResolvers } from 'types/graphql'

export const resumeUpload: MutationResolvers['resumeUpload'] = async ({ input }) => {
  const { filename, mimetype, createReadStream } = input

  // Validate file type.
  if (mimetype !== 'application/pdf') {
    return {
      status: 'error',
      error: 'Invalid file type. Only PDF files are allowed.'
    }
  }

  // Validate file size.
  const MAX_FILE_SIZE = 2 * 1024 * 1024
  const stream = createReadStream()
  if (!stream || typeof stream.pipe !== 'function'){
    throw new Error('Invalid stream returned by createReadStream.')
  }

  let totalBytes = 0
  let fileTooLarge = false

  // Read the stream and calculate the size
  const sizeCheckPromise = new Promise<void>((resolve, reject) => {
    stream.on('data', (chunk) => {
      totalBytes += chunk.length
      // console.log("totalBytes: ", totalBytes)

      // If size exceeds, destroy stream and mark as too large
      if (totalBytes > MAX_FILE_SIZE) {
        fileTooLarge = true
        stream.destroy() // Stop reading further
        resolve() // End the promise successfully
      }
    })

    stream.on('end', () => resolve())
    stream.on('error', (err) => reject(err))
  })

  // Wait for the size check to complete
  await sizeCheckPromise

  // Return error if file was too large
  if (fileTooLarge) {
    return {
      status: 'error',
      error: 'File size exceeds maximum limit of 2MB.'
    }
  }

  // If we reach here, file size is valid
  console.log("Name: ", filename)
  console.log("Mimetype: ", mimetype)
  console.log("Size: ", totalBytes)

  return {
    message: "Resume uploaded successfully.",
    status: "success",
  }
}

import { GraphQLError } from 'graphql'

interface UploadFile {
  mimeType: string
  size: number
}

interface UploadResponse {
  message: string
  status: string
}

export const uploadResume = async ({ resume_file }: { resume_file: { file: UploadFile } }): Promise<UploadResponse> => {
  const file = resume_file.file
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

  // Validate file type
  if (file.mimeType !== 'application/pdf') {
    throw new GraphQLError('Invalid file type. Only PDF files are allowed.', {
      extensions: { code: 'INVALID_FILE_TYPE' }
    })
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new GraphQLError('File size exceeds 2MB.', {
      extensions: { code: 'FILE_TOO_LARGE' }
    })
  }

  // Assuming we do not need to persist the file
  return {
    message: 'Resume uploaded successfully.',
    status: 'success',
  }
}

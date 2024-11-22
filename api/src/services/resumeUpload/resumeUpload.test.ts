import { uploadResume } from './resumeUpload'

describe('resumeUpload', () => {
  it('successfully uploads a PDF file', async () => {
    const mockFile = {
      mimeType: 'application/pdf',
      size: 1024 * 1024,
    }

    const response = await uploadResume({ resume_file: { file: mockFile } })
    expect(response.status).toBe('success')
    expect(response.message).toBe('Resume uploaded successfully.')
  })

  it('throws an error for non-PDF files', async () => {
    const mockFile = {
      mimeType: 'image/png',
      size: 1024 * 1024,
    }

    await expect(uploadResume({ resume_file: { file: mockFile }})).rejects.toThrow(
      'Invalid file type. Only PDF files are allowed.'
    )
  })

  it('throws an error for oversized files', async () => {
    const mockFile = {
      mimeType: 'application/pdf',
      size: 3 * 1024 * 1024,
    }

    await expect(uploadResume({ resume_file: { file: mockFile }})).rejects.toThrow(
      'File size exceeds 2MB.'
    )
  })
})

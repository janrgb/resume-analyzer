import fs from 'fs'
import path from 'path'
import { resumeUpload } from './upload'  // The upload function you want to test
import { createPost } from '../posts/posts'

const testFilePath = path.join(__dirname, 'test-resume.pdf')

// Create a small PDF file for testing
beforeAll(() => {
  const fileContent = 'This is a fake PDF content'
  fs.writeFileSync(testFilePath, fileContent)
})

describe('File Upload Tests', () => {
  it('should extract metadata and handle a real PDF file.', async () => {
    const filestream = fs.createReadStream(testFilePath)

    const mockFile = {
      filename: 'test-resume.pdf',
      mimetype: 'application/pdf',
      createReadStream: () => filestream,
    }

    const result = await resumeUpload({
      input: mockFile
    })

    expect(result.message).toBe("Resume uploaded successfully.")
    expect(result.status).toBe("success")
  })
})

afterAll(() => {
  // Clean up the file after tests
  fs.unlinkSync(testFilePath)
})

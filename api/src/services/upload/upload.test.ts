import fs from 'fs'
import path from 'path'
import { resumeUpload } from './upload'  // The upload function you want to test
import mime from 'mime-types'

const validFile = path.join(__dirname, 'test.pdf')
const invalidFile = path.join(__dirname, 'bosch.pdf')
const superInvalidFile = path.join(__dirname, 'guh.png')

describe('File Upload Tests', () => {
  it('should extract metadata and handle a real PDF file.', async () => {
    // Create a file mockup.
    const realFile = new File([fs.readFileSync(validFile)], 'test.pdf', { type: mime.lookup(validFile).toString() })

    const result = await resumeUpload({
      input: {
        file: realFile,
        sessionID: 'sample'
      }
    })

    expect(result.message).toBe("Resume uploaded successfully.")
    expect(result.status).toBe("success")
  })

  it('should fail because size is too large', async () => {
    const realFile = new File([fs.readFileSync(invalidFile)], 'bosch.pdf', { type: mime.lookup(invalidFile).toString() })
    const result = await resumeUpload({
      input: {
        file: realFile,
        sessionID: 'sample',
      }
    })

    expect(result.error).toBe("File exceeds maximum limit of 2MB.")
    expect(result.status).toBe("error")
  })

  it('should fail because file type is not pdf', async () => {
    const realFile = new File([fs.readFileSync(superInvalidFile)], 'guh.png', { type: mime.lookup(superInvalidFile).toString() })
    const result = await resumeUpload({
      input: {
        file: realFile,
        sessionID: 'sample',
      }
    })

    expect(result.error).toBe("Invalid file type. Only PDF files are allowed.")
    expect(result.status).toBe("error")
  })
})

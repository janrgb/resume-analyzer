import fs from 'fs'
import path from 'path'
import { resumeUpload } from './upload'  // The upload function you want to test
import mime from 'mime-types'

const validFile = path.join(__dirname, 'Elective_Stats.pdf')
const invalidFile = path.join(__dirname, 'bosch.pdf')
const superInvalidFile = path.join(__dirname, 'guh.png')

describe('File Upload Tests', () => {
  it('should extract metadata and handle a real PDF file.', async () => {
    const filestream = fs.createReadStream(validFile)
    const mockFile = {
      filename: path.basename(validFile),
      mimetype: mime.lookup(validFile),
      createReadStream: () => filestream,
    }

    const result = await resumeUpload({
      input: mockFile
    })

    expect(result.message).toBe("Resume uploaded successfully.")
    expect(result.status).toBe("success")
  })

  it('should fail because size is too large', async () => {
    const filestream = fs.createReadStream(invalidFile)
    const mockFile = {
      filename: path.basename(invalidFile),
      mimetype: mime.lookup(invalidFile),
      createReadStream: () => filestream,
    }

    const result = await resumeUpload({
      input: mockFile
    })

    expect(result.error).toBe("File size exceeds maximum limit of 2MB.")
    expect(result.status).toBe("error")
  })

  it('should fail because file type is not pdf', async () => {
    const filestream = fs.createReadStream(superInvalidFile)
    const mockFile = {
      filename: path.basename(superInvalidFile),
      mimetype: mime.lookup(superInvalidFile),
      createReadStream: () => filestream,
    }

    const result = await resumeUpload({
      input: mockFile
    })
  })
})

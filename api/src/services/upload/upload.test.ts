import { resumeUpload } from './upload'
import { Readable } from 'stream'

describe('upload', () => {
  const mockFile = {
    filename: 'resume.pdf',
    mimetype: 'application/pdf',
    createReadStream: () => {
      const stream = new Readable()
      stream.push("This is some fake PDF content")
      stream.push(null)
      return stream
    },
  }

  /*const mockFile = ({ filename = 'test.pdf', mimetype = 'application/pdf', size = 1024 * 1024 }) => ({
    filename,
    mimetype,
    createReadStream: jest.fn(() => ({
      destroy: jest.fn(() => {
        if (events['error']) {
          events['error'].forEach
        }
      }),
      pipe: jest.fn(),
      on: jest.fn((event, callback) => {
        if (event === 'data') callback(Buffer.alloc(size))
        if (event === 'end') callback()
        if (event === 'error') callback(new Error('Stream error'))
      }),
    })),
  })*/

  it('should return a success for valid PDF', async () => {
    // const validFile = mockFile({ filename: 'resume.pdf', mimetype: 'application/pdf' })
    const result = await resumeUpload({
      input: mockFile
    })

    expect(result).toEqual({
      message: "Resume uploaded successfully.",
      status: 'success',
      error: null
    })
  })

  it('should return error for invalid file type', async () => {
    const invalidFile = { ...mockFile, mimetype: 'text/plain' }
    const result = await resumeUpload({
      input: invalidFile
    })

    expect(result).toEqual({
      message: null,
      status: 'error',
      error: 'Invalid file type. Only PDF files are allowed.',
    })
  })
})

describe('file size validation', () => {
  
})

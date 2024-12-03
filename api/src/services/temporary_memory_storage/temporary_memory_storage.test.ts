import fs from 'fs'
import path from 'path'
import { addResume } from './temporary_memory_storage'
import { addDesc } from './temporary_memory_storage'
import { tempStorage } from '../upload/upload'
import mime from 'mime-types'

const validFile = path.join(__dirname, 'test.pdf')

describe('Temporary Memory Storage Tests', () => {
  it('should store resume text and job description in tempStorage', async () => {


  const file = new File([fs.readFileSync(validFile)], 'test.pdf', { type:
  mime.lookup(validFile).toString() })

  const sessionID = "session_id_one"

  const result = await addResume({
    input: file

  })


  expect(result.status).toBe("success")
  expect(result.message).toBe("Resume Text Successfully Extracted and Stored!")

  const jobDesc = "This is a mockup job description. It should be retrieved and then saved."

  const descResult = await addDesc({
    input: {content: jobDesc}
  })


  expect(descResult.status).toBe("success")
  expect(descResult.message).toBe("Job Description Successfully Extracted and Stored!")

  expect(tempStorage[sessionID]).toBeUndefined()

  })


})
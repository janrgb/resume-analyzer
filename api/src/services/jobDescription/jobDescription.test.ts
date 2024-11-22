import { submitJobDescription } from "./jobDescription";

describe('jobDescription', () => {
  it('successfully submits a valid job description', async () => {
    const validDescription = 'A valid description text.'

    const response = await submitJobDescription({ job_description: validDescription })
    expect(response.status).toBe('success')
    expect(response.message).toBe('Job description submitted successfully.')
  })

  it('throws an error for job descriptions exceeding 5000 chars', async () => {
    const longDescription = 'c'.repeat(5001)

    await expect(submitJobDescription({ job_description: longDescription })).rejects.toThrow(
      "Job description exceeds character limit."
    )
  })
})

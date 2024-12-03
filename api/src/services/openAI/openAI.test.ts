import { generateText } from './openAI'
import { OpenAI } from 'openai'

// Mock the OpenAI constructor
const mockCreate = jest.fn()
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: mockCreate,
        }
      }
    }
  })
})

describe('generateText', () => {
  it("returns a mocked fit score and feedback.", async () => {
    // Mock the 'create' method.
    mockCreate
      .mockResolvedValueOnce({
        choices: [{ message: { content: '85' }}],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: '["Suggestion 1", "Suggestion 2"]' } }],
      })

    // Call the function being tested.
    const result = await generateText({
      prompt: {
        resume_text: "Mock resume text",
        job_description: "Mock job description",
      },
    })

    // Check the result!
    expect(result.fit_score).toBe(85)
    expect(result.feedback).toEqual(['Suggestion 1', 'Suggestion 2'])

    // Verify the mocked method calls.
    expect(mockCreate).toHaveBeenCalledTimes(2)
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'assistant',
          content: expect.stringContaining('Mock resume text'),
        },
      ]
    })
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'assistant',
          content: expect.stringContaining('Mock job description'),
        },
      ]
    })
  })
})

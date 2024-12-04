// Mock the OpenAI constructor
import { generateText } from './openAI'
import { OpenAI } from 'openai'

// Mock the openai module.
jest.mock('openai', () => {
  const mockCreate = jest.fn()
  return {
    OpenAI: jest.fn().mockImplementation(() => {
      return {
        chat: {
          completions: {
            create: mockCreate,
          }
        }
      }
    }),
    __mockCreate: mockCreate,   // Ship the mockCreate out to be accessed globally.
  }
})

// Test suite.
describe('generateText', () => {

  // Rename the variable for easy referencing.
  let mockCreate: jest.Mock

  beforeEach(() => {
    const { __mockCreate } = jest.requireMock('openai') // Here's how we access the mocked create.
    mockCreate = __mockCreate
    mockCreate.mockReset()                              // Tests can be flaky between each other: reset for posterity.
  })

  it("returns a mocked fit score and feedback.", async () => {
    // Mock the 'create' method.
    mockCreate
      .mockResolvedValueOnce({
        choices: [{ message: { content: '85' }}],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: '["Suggestion 1", "Suggestion 2"]' } }],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: '["Python", "AI", "ML"]' } }],
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
    expect(result.keywords_matched).toEqual(['Python', 'AI', 'ML'])

    // Verify the mocked method calls.
    expect(mockCreate).toHaveBeenCalledTimes(3)
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
    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo-16k',
      messages: [
        {
          role: 'assistant',
          content: expect.stringContaining('one-word matched')
        }
      ]
    })
  }),

  it('should return an error when feedback array is not an array', async () => {
    // Mock the 'create' method
    mockCreate
      .mockResolvedValueOnce({
        choices: [{ message: { content: '85' }}],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: "trolled" } }],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: '["Python", "AI", "ML"]'} }],
      })

    // Call the function being tested.
    const result = await generateText({
      prompt: {
        resume_text: "Mock resume text",
        job_description: "Mock job description",
      },
    })

    // Check for error!
    expect(result.error).toBe("Unable to process request. Please try again later.")
  }),

  it('should return an error when matched keywords array is not an array', async () => {
    // Mock the 'create' method
    mockCreate
      .mockResolvedValueOnce({
        choices: [{ message: { content: '85' }}],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: '["Suggestion 1", "Suggestion 2"]' } }],
      })
      .mockResolvedValueOnce({
        choices: [{ message: { content: 'trolled' } }],
      })

    const result = await generateText({
      prompt: {
        resume_text: "Mock resume text",
        job_description: "Mock job description",
      },
    })

    expect(result.error).toBe("Unable to process request. Please try again later.")
  })
})


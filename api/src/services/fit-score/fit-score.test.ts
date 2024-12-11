import { refineInput } from './fit-score'

describe('refineInput Mutation Resolver', () => {
  it('should return default values if either res_text or job_text is empty', async () => {
    const input = {
      res_text: '',
      job_text: '',
      raw_score: 0,
      raw_feedback: [],
      raw_keywords: [],
    }

    const result = await refineInput({ input })
    expect(result).toEqual({
      refined_score: 0,
      refined_feedback: {
        missing_key_words: ['None'],
        suggestions: ['None'],
      },
      refined_keywords: ['No keywords found'],
    })
  })

  it('should return a full match', async () => {
    const input = {
      res_text: 'Hello this is a test',
      job_text: 'Hello this is a test',
      raw_score: 90,
      raw_feedback: [],
      raw_keywords: [],
    }

    const result = await refineInput({ input })
    expect(result).toEqual({
      refined_score: 100,
      refined_feedback: {
        missing_key_words: [],
        suggestions: [],
      },
      refined_keywords: ['hello', 'this', 'is', 'a', 'test'],
    })
  }),

  it('should return a partial match', async () => {
    const input = {
      res_text: "Hello this is a",
      job_text: "Hello this is a test",
      raw_score: 100,
      raw_feedback: [],
      raw_keywords: [],
    }

    const result = await refineInput({ input })
    expect(result).toEqual({
      refined_score: 80,
      refined_feedback: {
        missing_key_words: ['test'],
        suggestions: [],
      },
      refined_keywords: ['hello', 'this', 'is', 'a']
    })
  }),

  it('should work with non-alphanumeric chars', async () => {
    const input = {
      res_text: "Hello {}this is a!&*(",
      job_text: "Hello this is a test",
      raw_score: 100,
      raw_feedback: [],
      raw_keywords: [],
    }

    const result = await refineInput({ input })
    expect(result).toEqual({
      refined_score: 80,
      refined_feedback: {
        missing_key_words: ['test'],
        suggestions: [],
      },
      refined_keywords: ['hello', 'this', 'is', 'a']
    })
  })

  it('should return 100 for fitscore', async () => {
    const input = {
      res_text: "Hello this is a test, William!",
      job_text: "Hello this is a test",
      raw_score: 100,
      raw_feedback: [],
      raw_keywords: [],
    }

    const result = await refineInput({ input })
    expect(result).toEqual({
      refined_score: 100,
      refined_feedback: {
        missing_key_words: [],
        suggestions: [],
      },
      refined_keywords: ['hello', 'this', 'is', 'a', 'test']
    })
  })
})

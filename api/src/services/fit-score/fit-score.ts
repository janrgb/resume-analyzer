import type { MutationResolvers } from 'types/graphql'

export const refineInput: MutationResolvers['refineInput'] = async ({ input }) => {
  /* Grab the raw values from ChatGPT. */
  const { res_text, job_text, raw_score, raw_feedback, raw_keywords } = input

  if (res_text === "" || job_text === "") {
    return {
      refined_score: 0,
      refined_feedback: {
        missing_key_words: ["None"],
        suggestions: ["None"]
      },
      refined_keywords: ['No keywords found']
    }
  }

  /* DEBUG */
  console.log("Resume text: ", res_text)
  console.log("Job text: ", job_text)

  /* Tokenize both res_text and job_text. */
  const res_text_tokens: string[] = Tokenizer(res_text)
  const job_text_tokens: string[] = Tokenizer(job_text)

  /* DEBUG */
  console.log("Resume tokens: ", res_text_tokens)
  console.log("Job tokens: ", job_text_tokens)

  /* Algorithmically calculate the number of matched keywords. */
  const { common_key_words, missing_key_words } = Matcher(job_text_tokens, res_text_tokens)

  /* DEBUG */
  console.log("Common key words: ", common_key_words)
  console.log("Missing key words: ", missing_key_words)

  /* Algorithmically calculate the fit score. */
  const refined_score: number = CalculateFitScore(common_key_words.length, job_text_tokens.length)

  /* DEBUG */
  console.log("Fit score: ", refined_score)

  /* Use the missing keywords to come up with suggestions. */
  const suggestions_array: string[] = raw_feedback

  /* DEBUG */
  console.log("Suggestions: ", suggestions_array)

  /* Finally, return the components we have calculated. This is the API's response. */
  return {
    refined_score: refined_score,
    refined_feedback: {
      missing_key_words: missing_key_words,
      suggestions: suggestions_array
    },
    refined_keywords: common_key_words
  }
}

/* Tokenizer. */
const Tokenizer = (text: string) => {
  const lower_text: string = text.toLowerCase()
  const no_punct_text: string = lower_text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  const final_text: string = no_punct_text.replace(/\s{2,}/g," ")
  const text_tokens: string[] = final_text.split(" ")
  return text_tokens
}

/* Keyword Matcher. */
const Matcher = (array1: string[], array2: string[]) => {
  const common_key_words: string[] = []
  const missing_key_words: string[] = []
  for (const element of array1) {
    if (array2.includes(element)) {
      common_key_words.push(element)
    } else {
      missing_key_words.push(element)
    }
  }
  return { common_key_words, missing_key_words }
}

/* Fit Score calculator. */
const CalculateFitScore = (matched_words: number, total_keywords: number) => {
  return total_keywords > 0 ? Math.floor((matched_words / total_keywords) * 100) : 0
}

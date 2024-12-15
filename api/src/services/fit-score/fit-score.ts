import type { MutationResolvers } from 'types/graphql'
import { removeStopwords, eng } from 'stopword'

export const refineInput: MutationResolvers['refineInput'] = async ({ input }) => {
  /* Grab the raw values from ChatGPT. */
  let { res_text, job_text, raw_score, raw_feedback, raw_keywords } = input

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
  const res_text_tokens: string[] = removeStopwords(Tokenizer(res_text), eng)
  let job_text_tokens: string[] = removeStopwords(Tokenizer(job_text), eng)
  let job_set_string: Set<string> = new Set(job_text_tokens)
  job_text_tokens = Array.from(job_set_string)

  /* DEBUG */
  console.log("Resume tokens: ", res_text_tokens)
  console.log("Job tokens: ", job_text_tokens)

  /* Algorithmically calculate the number of matched keywords. */
  const { common_key_words, missing_key_words } = Matcher(job_text_tokens, res_text_tokens)

  /* DEBUG */
  console.log("Common key words: ", common_key_words)
  console.log("Missing key words: ", missing_key_words)

  /* Algorithmically calculate the fit score. */
  const refined_score: number = CalculateFitScore(common_key_words, common_key_words.length, job_text_tokens.length, raw_keywords['required_skills'], raw_keywords['preferred_skills'])

  /* DEBUG */
  console.log("Raw score: ", raw_score)
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
/* Fit Score calculator. */
const CalculateFitScore = (
  matched_words: string[],
  matched_length: number,
  total_keywords: number,
  required: string[],
  preferred: string[]
): number => {

  // Firstly, there is an edge case where we have no required or preferred skills: in that case, the fit score should be 100.
  if (required.length === 0 && preferred.length === 0) {
    return 100
  }

  // Lowercase everything.
  const lowerRequiredSkills: string[] = required.map((skill) => skill.toLowerCase());
  const lowerPreferredSkills: string[] = preferred.map((skill) => skill.toLowerCase());

  // Initialize weights
  const required_weight: number = 0.7;
  const preferred_weight: number = 0.3;

  // Calculate matched keywords for required and preferred skills
  const matched_required: number = lowerRequiredSkills.filter((skill) =>
    matched_words.includes(skill)
  ).length;

  const matched_preferred: number = lowerPreferredSkills.filter((skill) =>
    matched_words.includes(skill)
  ).length;

  // Total required and preferred skill counts
  const total_required: number = lowerRequiredSkills.length;
  const total_preferred: number = lowerPreferredSkills.length;

  // Avoid division by zero by ensuring totals are non-zero
  const required_score: number =
    total_required > 0
      ? (matched_required / total_required) * required_weight
      : 0;

  const preferred_score: number =
    total_preferred > 0
      ? (matched_preferred / total_preferred) * preferred_weight
      : 0;

  // Combine weighted scores
  const combined_score: number = required_score + preferred_score;

  // Fit score as a percentage (scaled to 0–100)
  const fit_score: number = Math.round(combined_score * 100);

  return fit_score;
};


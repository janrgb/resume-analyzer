import { OpenAI } from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateText = async ({ prompt }) => {
  const FitScore = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      { role: "system", content: `You are a helpful resume analysis tool. You will receive a prompt asking for a numerical fit score to a provided resume based on a provided job description. This fit score should reflect how well the resume matches the job description. Follow the instructions in the prompt to the letter.` },
      { role: "user", content: `Generate a fit score as a whole number (0-100) for the following resume: "${prompt.resume_text.slice(0, 10000)}" based on the following job description: "${prompt.job_description.slice(0, 10000)}". Respond ONLY with a numeric value (e.g., 85). If you cannot determine a score, respond with 0.` }
    ],
  })

  const Feedback = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      { role: "system", content: `You are a helpful resume analysis tool. You will receive a prompt asking for one-sentence suggestions to improve a provided resume based on a provided job description. Follow the instructions in the prompt to the letter.` },
      { role: "user", content: `Please generate an array of strings, with each one being one-sentence suggestions to improve the resume: ${prompt.resume_text.slice(0, 10000)} based on the following job description: ${prompt.job_description.slice(0, 10000)}. Prioritize missing components and suggestions relevant to the job description only, like missing skills, above all else. Also, please classify each suggestion as either being related to skills, experience, or formatting and place that at the start. Limit yourself to 10 suggestions max. Respond only with a valid JSON array of strings, e.g., ["Skills Improvement: Suggestion1", "Experience Improvement: Suggestion2", "Formatting Improvement: Suggestion3"].` }
    ],
  })

  const KeywordsMatched = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      { role: "system", content: `You are a helpful resume analysis tool. You will receive a prompt asking to list one-word keywords from a provided job description. Follow the instructions in the prompt to the letter.`},
      { role: "user", content: `Please generate two arrays of one-word (please shorten two-word keywords to one-word e.g. "Operating Systems" becomes "OS") matched keywords in JSON format: a required_skills array and preferred_skills array. Each array can have max 30 elements. It must be based on the following job description: ${prompt.job_description.slice(0, 10000)}. Format these two arrays as two properties of a JSON object. Respond only with a valid JSON object, e.g., {required_skills: ["Python", "AWS", "Azure"], preferred_skills: ["Communication", "Management", "Java"]}.` }
    ]
  })

  let fitScore = 0;
  try {
    const fitScoreContent = FitScore?.choices[0]?.message?.content.trim();
    fitScore = parseInt(fitScoreContent, 10);
    if (isNaN(fitScore)) {
      console.error("Invalid Fit Score response:", fitScoreContent);
      fitScore = 0; // Fallback value
    }
  } catch (error) {
    console.error("Error parsing Fit Score:", error);
  }

  let feedbackArray: string[] = []
  try {
    feedbackArray = JSON.parse(Feedback?.choices[0].message?.content || '[]')
    if (!Array.isArray(feedbackArray)){
      return {
        error: "Unable to process request. Please try again later."
      }
    }
  } catch (error) {
    return {
      error: "Unable to process request. Please try again later."
    }
  }

  let keywordsMatchedObject: JSON
  try {
    keywordsMatchedObject = JSON.parse(KeywordsMatched?.choices[0].message?.content || '{}')
    if (
      typeof keywordsMatchedObject !== 'object' ||
      !Array.isArray(keywordsMatchedObject['required_skills']) ||
      !Array.isArray(keywordsMatchedObject['preferred_skills'])
    ) {
      return {
        error: "Unable to process request. Please try again later."
      }
    }
  } catch (error) {
    return {
      error: "Unable to process request. Please try again later."
    }
  }

  console.log("Required skills: ", keywordsMatchedObject['required_skills'])
  return {
      fit_score: fitScore,
      feedback: feedbackArray,
      keywords_matched: keywordsMatchedObject
  }
}

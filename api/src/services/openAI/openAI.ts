import type { QueryResolvers } from 'types/graphql'
import { OpenAI } from 'openai'
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const generateText = async ({ prompt }) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    messages: [
      { role: "user", content: prompt },
    ],
  })

  console.log(prompt)
  return {
      role: completion?.choices[0]?.message?.role,
      content: completion?.choices[0].message?.content
  }
}

/*
export const generateText = ({ prompt }) => {
  return {
    role: "assistant",
    content: "What a lovely request!"
  }
}
  */

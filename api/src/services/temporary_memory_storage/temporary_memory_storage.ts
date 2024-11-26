import { MutationResolvers } from "types/graphql"
import { extractTextFromPDF } from 'src/lib/pdfUtils'
import { tempStorage} from '../upload/upload'


export const addResume: MutationResolvers['addResume'] = async ({ input }) => {
  const { name, size, type } = input

  const sessionID = "session_id_one"

  if(!tempStorage[sessionID]){
    tempStorage[sessionID] = {}
  }

try{
  const text = await extractTextFromPDF(input)
  tempStorage[sessionID].resumeText = text

  return{
    status: "success",
    message: "Resume Text Successfully Extracted and Stored!",
  }

}catch(error){
  return{
    status: "error",
    message:"Error during processing resume text",
  }
}
}

export const addDesc: MutationResolvers['addDesc'] = async ({ input }) => {
  const { content } = input

  const sessionID = "session_id_one"

  if(!tempStorage[sessionID]){
    tempStorage[sessionID] = {}
  }

  tempStorage[sessionID].jobDescription = content


  if(tempStorage[sessionID]){
    delete tempStorage[sessionID]
  }

  return{
    status: "success",
    message: "Job Description Successfully Extracted and Stored!",
  }
}



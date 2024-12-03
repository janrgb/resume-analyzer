import { MutationResolvers } from "types/graphql"



export const addFile: MutationResolvers['addFile'] = async ({ input }) => {
  const { name, size, type } = input

  if (type !== 'application/pdf') {
    return {
      status: 'error',
      message: 'Invalid File Type!'
    }
  }

  const fileSize = size/(1024 * 1024);
  if(size > fileSize){
    return{
      status: 'error',
      message: "File Size Limit Exceeded!",
    }
  }
}

export const addDesc: MutationResolvers['addDesc'] = async ({ input }) => {
  const { content } = input


  if(content.length > 5000){
    return{
      status: 'error',
      message: "Character Limit Exceeded!",
    }
  }

  if(content.length === 0){
    return{
      status: 'error',
      message: "Required",
    }
  }

  return {
    status: "success",
    message: "Description was successfully validated!"
  }


}


import { Metadata, useMutation } from '@redwoodjs/web'
import { Label, Form, FileField, FieldError, TextAreaField, Submit, SubmitHandler } from '@redwoodjs/forms'
import PrivateRoute from 'src/components/PrivateRoute'

const UPLOAD_RESUME = gql`
  mutation ResumeUploadMutation ($input: File!) {
    resumeUpload(input: $input) {
      message
      status
      error
    }
  }
`

const UPLOAD_DESC = gql`
  mutation UploadDescriptionMutation ($input: JobDescription!) {
    uploadDescription(input: $input) {
      message
      status
      error
    }
  }
`

interface FormValues {
  resume: FileList
  jobDescription: String
}

const ResumeUploadPage = () => {
  const [resumeUpload] = useMutation(UPLOAD_RESUME, {
    onCompleted: (data) => {
      const { status } = data.resumeUpload
      if (status === 'success'){
        const { message } = data.resumeUpload
        alert(message)
      } else {
        const { error } = data.resumeUpload
        alert(`Error: ${error}`)
      }
    },
    onError: (error) => {
      alert(`Unexpected error: ${error.message}`)
    }
  })
  const [uploadDescription] = useMutation(UPLOAD_DESC, {
    onCompleted: (data) => {
      const { status } = data.uploadDescription

      if (status === 'success'){
        const { message } = data.uploadDescription
        alert(message)
      } else {
        const { error } = data.uploadDescription
        alert(`Error: ${error}`)
      }
    },
    onError: (error) => {
      alert(`Unexpected error: ${error.message}`)
    }
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Get file metadata.
      if (data.resume?.length > 0) {
        const file = data.resume[0]
        console.log(file.type)
        console.log(file.size)
        console.log(file.name)

        // Send an uploadResume mutation.
        await resumeUpload({
          variables: {
            input: file
          }
        })
      }

      if (data.jobDescription) {
        await uploadDescription({
          variables: {
            input: {
              content: data.jobDescription
            }
          }
        })
      }
    } catch (error) {
      console.error("Error during submission:", error)
      alert('An error occurred during submission.')
    }
  }

  return (
    <>
      <Metadata title="Resume Upload" description="Resume upload page" />
      <PrivateRoute>
        <h1>Upload Resume and Description</h1>
        <br></br>
        <Form onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
          <Label name="resume" errorClassName="error">
            Upload Resume (PDF Only)
          </Label>
          <FileField name="resume" accept=".pdf" validation={{ required: true }} errorClassName="error"/>
          <FieldError name="resume" className="error" />
          <Label name="jobDescription" errorClassName="error">Job Description</Label>
          <TextAreaField
            name="jobDescription"
            maxLength={5000}
            validation={{ required: true }}
            errorClassName="error"
          />
          <FieldError name="jobDescription" className="error" />
          <Submit>Upload</Submit>
        </Form>
      </PrivateRoute>
    </>
  )
}

export default ResumeUploadPage

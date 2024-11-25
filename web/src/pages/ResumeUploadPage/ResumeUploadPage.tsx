import { Metadata, useMutation } from '@redwoodjs/web'
import { Label, Form, FileField, FieldError, TextAreaField, Submit, SubmitHandler } from '@redwoodjs/forms'
import PrivateRoute from 'src/components/PrivateRoute'
import './ResumeUploadPage.css'
import { isValidElement, useState } from 'react'

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

const MAX_FILE_SIZE = 2 * 1024 * 1024
const MAX_CHAR_COUNT = 5000

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

  // File upload validation state.
  const [isFileValid, setIsFileValid] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      if (file.type !== 'application/pdf') {
        setFileError('Only PDF files are allowed.')
        setIsFileValid(false)
      } else if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds the 2MB limit.')
        setIsFileValid(false)
      } else {
        setFileError(null)
        setIsFileValid(true)
      }
    } else {
      setFileError('No file selected.')
      setIsFileValid(false)
    }
  }

  // Job description validation state.
  const [isJobDescriptionValid, setIsJobDescriptionValid] = useState(true)
  const [jobDescriptionError, setJobDescriptionError] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setJobDescription(value)

    if (value.length > MAX_CHAR_COUNT) {
      setJobDescriptionError('Job description exceeds the 5000 character limit!')
      setIsJobDescriptionValid(false)
    } else {
      setJobDescriptionError(null)
      setIsJobDescriptionValid(true)
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if(!isValidElement || !isJobDescriptionValid) {
      alert("Please fix the errors before submitting.")
      return
    }

    try {
      // Get file metadata.
      if (data.resume?.length > 0) {
        const file = data.resume[0]
        console.log(file.type)
        console.log(file.size)
        console.log(file.name)

        // Send an resumeUpload mutation.
        await resumeUpload({
          variables: {
            input: file
          }
        })
      }

      // Send a uploadDescription mutation.
      await uploadDescription({
        variables: {
          input: {
            content: jobDescription
          }
        }
      })
    } catch (error) {
      console.error("Error during submission:", error)
      alert('An error occurred during submission.')
    }
  }

  return (
    <div className="home-resume">
      <Metadata title="Resume Upload" description="Resume upload page" />
      <PrivateRoute>
        <h1>Upload Resume and Description</h1>
        <br></br>
        <Form className="form-resume" onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
          <Label name="resume" errorClassName="error">
            Upload Resume (PDF Only - 2MB limit)
          </Label>
          <FileField name="resume" accept=".pdf" validation={{ required: true }} errorClassName="error-field" onChange={handleFileChange}/>
          <FieldError name="resume" className="error-field-resume" />
          {fileError && <div className="error">{fileError}</div>}
          <Label name="job description" errorClassName="error-label">Job Description (Max 5000 characters)</Label>
          <TextAreaField
            name="job description"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            maxLength={5000}
            validation={{ required: false }}
            errorClassName="error-field"
          />
          <FieldError name="job description" className="error-field-resume" />
          {jobDescriptionError && <div className="error">{jobDescriptionError}</div>}

          <p>
            {MAX_CHAR_COUNT - jobDescription.length} characters remaining
          </p>

          <Submit className="button" disabled={!isFileValid || !isJobDescriptionValid}>Upload</Submit>
        </Form>
      </PrivateRoute>
    </div>
  )
}

export default ResumeUploadPage

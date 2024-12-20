import { Metadata, useMutation } from '@redwoodjs/web'
import { Label, Form, FileField, FieldError, TextAreaField, Submit, SubmitHandler } from '@redwoodjs/forms'
import PrivateRoute from 'src/components/PrivateRoute'
import './ResumeUploadPage.css'
import { isValidElement, useState } from 'react'
import Spinner from 'src/components/Spinner/Spinner'
import { navigate } from '@redwoodjs/router'

export const UPLOAD_RESUME = gql`
  mutation ResumeUploadMutation ($input: UploadInput!) {
    resumeUpload(input: $input) {
      message
      status
      the_resume
      error
    }
  }
`

export const UPLOAD_DESC = gql`
  mutation UploadDescriptionMutation ($input: JobDescription!) {
    uploadDescription(input: $input) {
      message
      status
      the_desc
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
  const [loading, setLoadingCount] = useState(0)

  const startLoading = () => setLoadingCount((prev) => prev + 1)
  const stopLoading = () => setLoadingCount((prev) => Math.max(prev - 1, 0))

  const [resumeSuccess, setResumeSuccess] = useState(false)
  const [descriptionSuccess, setDescriptionSuccess] = useState(false)

  const [resumeUpload] = useMutation(UPLOAD_RESUME, {
    onCompleted: (data) => {
      stopLoading()
      const { status } = data.resumeUpload
      if (status === 'success') {
        setResumeSuccess(true)
        const { message, the_resume } = data.resumeUpload
        localStorage.setItem('resumeText', the_resume)
        alert(message)
      } else {
        const { error } = data.resumeUpload
        alert(`Error: ${error}`)
      }
    },
    onError: (error) => {
      stopLoading()
      alert(`Unexpected error: ${error.message}`)
    }
  })
  const [uploadDescription] = useMutation(UPLOAD_DESC, {
    onCompleted: (data) => {
      stopLoading()
      const { status } = data.uploadDescription

      if (status === 'success'){
        setDescriptionSuccess(true)
        const { message, the_desc } = data.uploadDescription
        localStorage.setItem('jobDescriptionText', the_desc)
        alert(message)
      } else {
        const { error } = data.uploadDescription
        alert(`Error: ${error}`)
      }
    },
    onError: (error) => {
      stopLoading()
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
    startLoading()

    try {
      // Get file metadata.
      if (data.resume?.length > 0) {
        const file = data.resume[0]

        // Send an resumeUpload mutation.
        await resumeUpload({
          variables: {
            input: {
              file: file,
              sessionID: localStorage.getItem('token'),
            }
          }
        })
      }

      // Send a uploadDescription mutation.
      startLoading()
      await uploadDescription({
        variables: {
          input: {
            content: jobDescription,
            sessionID: localStorage.getItem('token')
          }
        }
      })
    } catch (error) {
      console.error("Error during submission:", error)
      alert('An error occurred during submission.')
    } finally {
      stopLoading()
    }
  }

  if (resumeSuccess && descriptionSuccess) {
    navigate('/dashboard')
  }

  return (
    <PrivateRoute>
      {loading > 0 ? (
        <Spinner />
      ) : (
        <div className="home-resume">
          <Metadata title="Resume Upload" description="Resume upload page" />
            <h1>Upload Resume and Description</h1>
            <br></br>
            <Form className="form-resume" onSubmit={onSubmit} config={{ mode: 'onBlur' }}>
              <Label name="resume" errorClassName="error">
                Upload Resume (PDF Only - 2MB limit)
              </Label>
              <FileField data-testid="file_input" name="resume" accept=".pdf" validation={{ required: true }} errorClassName="error-field" onChange={handleFileChange}/>
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

              <Submit data-testid="resume-upload" className="button" disabled={!isFileValid || !isJobDescriptionValid}>Upload</Submit>
            </Form>
        </div>
      )}
    </PrivateRoute>
  )
}

export default ResumeUploadPage

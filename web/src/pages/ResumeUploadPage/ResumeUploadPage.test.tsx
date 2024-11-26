import { render, screen, fireEvent, waitFor } from '@redwoodjs/testing/web'
import { navigate } from '@redwoodjs/router'
import ResumeUploadPage, { UPLOAD_RESUME, UPLOAD_DESC } from './ResumeUploadPage'

jest.mock('@redwoodjs/web', () => ({
  ...jest.requireActual('@redwoodjs/web'),
  useMutation: jest.fn(),
}))

jest.mock('@redwoodjs/router', () => ({
  ...jest.requireActual('@redwoodjs/router'),
  navigate: jest.fn(),
}))

jest.mock('src/components/PrivateRoute/PrivateRoute', () => {
  return ({ children }: { children: React.ReactNode }) => <>{children}</>
})

describe('ResumeUploadPage', () => {
  let mockResumeUpload: jest.Mock
  let mockUploadDescription: jest.Mock

  beforeEach(() => {
    mockResumeUpload = jest.fn()
    mockUploadDescription = jest.fn()

    jest.requireMock('@redwoodjs/web').useMutation.mockImplementation((query: any) => {
      const operationName = query?.definitions?.[0]?.name?.value
      if (operationName === UPLOAD_RESUME) {
        return [mockResumeUpload, {}]
      }
      if (operationName === UPLOAD_DESC) {
        return [mockUploadDescription, {}]
      }
      return [jest.fn(), {}]
    })

    mockResumeUpload.mockReset()
    mockUploadDescription.mockReset()
    jest.mocked(navigate).mockReset()
  })

  it('renders successfully', () => {
    expect(() => {
      render(<ResumeUploadPage />)
    }).not.toThrow()
  })

  it('shows error for invalid file type', async () => {
    render(<ResumeUploadPage />)

    const fileInput = screen.getByLabelText('Upload Resume (PDF Only - 2MB limit)')
    const invalidFile = new File(['dummy content'], 'resume.txt', { type: 'text/plain' })
    fireEvent.change(fileInput, { target: { files: [invalidFile] } })

    expect(await screen.findByText(/Only PDF files are allowed./i)).toBeInTheDocument()
  })

  it('validates job description character limit', async () => {
    render(<ResumeUploadPage />)

    const jobDescriptionInput = screen.getByLabelText('Job Description (Max 5000 characters)')
    fireEvent.change(jobDescriptionInput, { target: { value: 'a'.repeat(5001) } })

    expect(await screen.findByText(/Job description exceeds the 5000 character limit/i)).toBeInTheDocument()
  })

  it('submits the form successfully and navigates to the dashboard', async () => {
    mockResumeUpload.mockResolvedValueOnce({
      data: { resumeUpload: { status: 'success', message: 'Resume uploaded successfully' } },
    })
    mockUploadDescription.mockResolvedValueOnce({
      data: { uploadDescription: { status: 'success', message: 'Description uploaded successfully' } },
    })

    render(<ResumeUploadPage />)

    // Create a Blob with valid content
    const blob = new Blob(['dummy content'], { type: 'application/pdf' })
    Object.defineProperty(blob, 'size', { value: 1 * 1024 * 1024 }) // Set size to 1MB
    const file = new File([blob], 'resume.pdf', { type: 'application/pdf' })

    // Trigger file input change
    const fileInput = screen.getByLabelText('Upload Resume (PDF Only - 2MB limit)')
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Ensure file validation passed
    expect(screen.queryByText(/Only PDF files are allowed./i)).toBeNull()
    expect(screen.queryByText(/File size exceeds the 2MB limit./i)).toBeNull()

    const jobDescriptionInput = screen.getByLabelText('Job Description (Max 5000 characters)')
    fireEvent.change(jobDescriptionInput, { target: { value: 'A valid job description' } })

    const submitButton = screen.getByTestId('resume-upload')

    // Add console logs to check the submission behavior
    console.log('Button clicked') // Debugging log
    fireEvent.click(submitButton)

    await waitFor(() => {
      console.log('mockResumeUpload calls:', mockResumeUpload.mock.calls.length) // Log to check if called
      console.log('mockUploadDescription calls:', mockUploadDescription.mock.calls.length) // Log to check if called
      expect(mockResumeUpload).toHaveBeenCalledTimes(1)
      expect(mockUploadDescription).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/dashboard')
    })
  })


  it('shows errors when GraphQL mutations fail', async () => {
    mockResumeUpload.mockRejectedValueOnce(new Error('Resume upload failed'))
    mockUploadDescription.mockRejectedValueOnce(new Error('Description upload failed'))

    render(<ResumeUploadPage />)

    const fileInput = screen.getByLabelText('Upload Resume (PDF Only - 2MB limit)')
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    const jobDescriptionInput = screen.getByLabelText('Job Description (Max 5000 characters)')
    fireEvent.change(jobDescriptionInput, { target: { value: 'A valid job description' } })

    const submitButton = screen.getByTestId('resume-upload')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Unexpected error: Resume upload failed/i)).toBeInTheDocument()
      expect(screen.getByText(/Unexpected error: Description upload failed/i)).toBeInTheDocument()
    })
  })
})

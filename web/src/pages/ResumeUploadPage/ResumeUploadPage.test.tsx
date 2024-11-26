import { render } from '@redwoodjs/testing/web'

import ResumeUploadPage from './ResumeUploadPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ResumeUploadPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ResumeUploadPage />)
    }).not.toThrow()
  })
})


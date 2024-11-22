import { render } from '@redwoodjs/testing/web'

import TestImagePAgePage from './TestImagePAgePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TestImagePAgePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TestImagePAgePage />)
    }).not.toThrow()
  })
})

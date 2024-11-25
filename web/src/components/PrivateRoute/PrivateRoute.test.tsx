import { render } from '@redwoodjs/testing/web'

import PrivateRoute from './PrivateRoute'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PrivateRoute', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PrivateRoute />)
    }).not.toThrow()
  })
})

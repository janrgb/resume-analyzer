import { Redirect } from '@redwoodjs/router'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  // Redirect to login if token does not exist.
  if (!token) {
    return <Redirect to="/login" />
  }

  // If the token DOES exist, render the protected page (children)
  return children
}

export default PrivateRoute

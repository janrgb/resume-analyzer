import { Redirect } from '@redwoodjs/router'
import { jwtDecode } from 'jwt-decode'

// Function for determining whether token has expired.
const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token)
    return decoded.exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token')

  // Redirect to login if token does not exist.
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token')
    return <Redirect to="/login" />
  }

  // If the token DOES exist, render the protected page (children)
  return children
}

export default PrivateRoute

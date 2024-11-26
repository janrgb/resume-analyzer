import { Redirect } from '@redwoodjs/router'

const RootGuard = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token')

  if (isLoggedIn){
    return <Redirect to="/dashboard" />
  }

  // If not logged in, these pages are accessible.
  return children
}

export default RootGuard

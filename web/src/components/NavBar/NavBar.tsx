import { Link, routes } from '@redwoodjs/router'
import "./NavBar.css"

const NavBar = () => {
  const isLoggedIn = !!localStorage.getItem('token')

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {!isLoggedIn && (
          <>
            <li>
              <Link to={routes.login()}>Login</Link>
            </li>
            <li>
              <Link to={routes.register()}>Register</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to={routes.dashboard()}>Dashboard</Link>
            </li>
            <li>
              <Link to={routes.resumeUpload()}>Upload</Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.reload()
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default NavBar

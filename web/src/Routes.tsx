// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route} from '@redwoodjs/router'
import UploadPage from './pages/UploadPage/UploadPage'
import MainLayout from './layouts/MainLayout/MainLayout'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Route path="/" page={RegisterPage} name="register" />
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/resume-upload" page={ResumeUploadPage} name="resumeUpload" />
        <Route path="/dashboard" page={DashboardPage} name="dashboard" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

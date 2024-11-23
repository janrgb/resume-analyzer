import type { ReactNode } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import FatalErrorPage from './pages/FatalErrorPage/FatalErrorPage'

import Routes from './Routes'

import './index.css'
import './scaffold.css'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider>
      <RedwoodApolloProvider>
        <Router>
          <Routes />
        </Router>
      </RedwoodApolloProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App

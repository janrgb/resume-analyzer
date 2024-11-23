import type { ReactNode } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'

import Routes from './Routes'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => (
      <RedwoodProvider>
        <Router>
        <Routes/>
        </Router>
      </RedwoodProvider>
)

export default App

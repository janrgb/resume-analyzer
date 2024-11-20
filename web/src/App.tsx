import type { ReactNode } from 'react'

import HomePage from './pages/HomePage/HomePage'

import './index.css'
import './scaffold.css'

interface AppProps {
  children?: ReactNode
}

const App = ({ children }: AppProps) => (
  <div className='parent'>
  <HomePage></HomePage>
  </div>
)

export default App

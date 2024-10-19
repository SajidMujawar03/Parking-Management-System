import { useState } from 'react'
import './App.css'
import './index.css'
import Layout from './layout/Layout.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Layout/>
    </>
  )
}

export default App

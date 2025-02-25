import { useState } from 'react'
import './App.css'
import Product from './pages/Products'

function App() {
  const [] = useState(0)

  return (
    <>
       <div className="App">
      
      <Product />
    </div>
    </>
  )
}

export default App

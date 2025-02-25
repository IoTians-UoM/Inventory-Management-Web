import { useState } from 'react'
import './App.css'
import "antd/dist/reset.css";
import Inventory from "./pages/Inventory";
import Product from './pages/Products'


function App() {
  const [] = useState(0)

  return (
    <>
      <Inventory />
      <Product />
    </>
  )
}

export default App;

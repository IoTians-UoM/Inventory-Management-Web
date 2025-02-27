import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "antd/dist/reset.css";
import Inventory from "./pages/Inventory";
import Product from './pages/Products';
import { useEffect, useState } from 'react';
import initWS, { processQueue } from './utils/websocket-util';
import { Action, InventoryItem, InventoryPayload, Message, ProductPayload, Product as ProductType } from './types/types';
import { getAllInventory } from './api/inventory';
import { getAllProducts } from './api/product';

function App() {
  const [products, setProducts] = useState<ProductType[]>([]); 
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Pass only the `url` and `setData` function to `initWS`
  useEffect(() => {
    initWS('ws://localhost:8000');
    
    setInterval(() => {
      const message = processQueue()
      setMessages(message)
    }, 1000);

    setTimeout(() => {
      getAllProducts()
      getAllInventory()
    }, 1000);
    
  }, []);

  const setMessages = (msg: string) => {
    if (!msg) return
    const message = JSON.parse(msg);
    console.log('Message in:', message);
    // setData(prev => [...prev, message]);
    switch (message.action) {
      case Action.PRODUCT_GET_ALL:{
        console.log("p",message.payload)
        const p = (message.payload as ProductPayload).products || [];
        setProducts(prev=>[...prev,...p.filter((p: ProductType) => !prev.find((prevItem: ProductType) => prevItem.id === p.id))]);
        break; 
      }
      case Action.INVENTORY_GET_ALL:{
        const i = (message.payload as InventoryPayload).inventory || [];
        setInventory(prev=>[...prev,...i.filter((i: InventoryItem) => !prev.find((prevItem: InventoryItem) => prevItem.product_id === i.product_id))]);
        break;
      }
      default:
        break;
    }
  }

  return (
    <Router>
      <header style={{ backgroundColor: '#BACC81', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', borderRadius: '5px' }}>
        <nav>
          <Link to="/" style={{ marginRight: '20px', color: 'white', textDecoration: 'none' }}>Products</Link>
          <Link to="/inventory" style={{ color: 'white', textDecoration: 'none' }}>Inventory</Link>
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Product items={products} />} />
          <Route path="/inventory" element={<Inventory items={inventory} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

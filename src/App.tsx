import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "antd/dist/reset.css";
import Inventory from "./pages/Inventory";
import Product from './pages/Products';
import { useEffect, useState } from 'react';
import initWS from './utils/websocket-util';
import { Action, InventoryItem, InventoryPayload, Message, ProductPayload, Product as ProductType, Type } from './types/types';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]); 
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Pass only the `url` and `setData` function to `initWS`
  useEffect(() => {
    initWS('ws://192.168.112.14:8000', setMessages);
  }, []);

  useEffect(() => {
    console.log('Data:', data);
  }, [data]);

  const setMessages = (message: Message) => {
    console.log('Message:', message);
    setData(prev => [...prev, message]);
    switch (message.action) {
      case Action.PRODUCT_GET_ALL:
        setProducts((message.payload as ProductPayload).products || []);
        break;
      case Action.INVENTORY_GET_ALL:
        setInventory((message.payload as InventoryPayload).inventory_items || []);
        break;
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

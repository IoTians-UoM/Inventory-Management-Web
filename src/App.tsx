import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "antd/dist/reset.css";
import Inventory from "./pages/Inventory";
import Product from './pages/Products';

const socket = new WebSocket('ws://192.168.112.14:8000'); // Replace with your server URL

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setMessage(event.data); // Example of handling incoming messages
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Router>
      <nav className="p-4">
        <Link to="/inventory" className="mr-4">Inventory</Link>
        <Link to="/">Products</Link>
      </nav>

      <p>Latest WebSocket message: {message}</p>

      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;

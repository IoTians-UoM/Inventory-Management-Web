import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "antd/dist/reset.css";
import Inventory from "./pages/Inventory";
import Product from './pages/Products';

const socket = new WebSocket('ws://192.168.112.14:8000'); // Replace with your server URL

function App() {
  const [queue, setQueue] = useState<string[]>([]);

  useEffect(() => {
    socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
      
      // Add the incoming message to the queue
      setQueue((prevQueue) => [...prevQueue, event.data]);
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      socket.close();
    };
  }, []);

  // Optional: Method to process and remove the first message in the queue
  const processNextMessage = () => {
    if (queue.length > 0) {
      const nextMessage = queue[0]; // Get the first message
      console.log('Processing message:', nextMessage);
      setQueue((prevQueue) => prevQueue.slice(1)); // Remove the processed message
    }
  };

  return (
    <Router>
      <header style={{ backgroundColor: '#BACC81', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white',  borderRadius: '5px' }}>
        <nav>
          <Link to="/" style={{ marginRight: '20px', color: 'white', textDecoration: 'none' }}>Products</Link>
          <Link to="/inventory" style={{ color: 'white', textDecoration: 'none' }}>Inventory</Link>
        </nav>
        <div>
          <h2 style={{ fontSize: '16px' }}>WebSocket Message Queue:</h2>
          <ul style={{ fontSize: '14px', listStyle: 'none', padding: '0' }}>
            {queue.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <button onClick={processNextMessage} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
            Process Next Message
          </button>
        </div>
      </header>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Product />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

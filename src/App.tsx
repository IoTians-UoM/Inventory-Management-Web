// import { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import './App.css';
// import "antd/dist/reset.css";
// import Inventory from "./pages/Inventory";
// import Product from './pages/Products';

// const socket = new WebSocket('ws://192.168.112.14:8000'); // Replace with your server URL

// function App() {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     socket.onopen = () => {
//       console.log('WebSocket Connected');
//     };

//     socket.onmessage = (event) => {
//       console.log('Message from server:', event.data);
//       setMessage(event.data); // Example of handling incoming messages
//     };

//     socket.onclose = () => {
//       console.log('WebSocket Disconnected');
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   return (
//     <Router>
//       <nav className="p-4">
//         <Link to="/inventory" className="mr-4">Inventory</Link>
//         <Link to="/">Products</Link>
//       </nav>

//       <p>Latest WebSocket message: {message}</p>

//       <Routes>
//         <Route path="/" element={<Product />} />
//         <Route path="/inventory" element={<Inventory />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




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
      <nav className="p-4">
        <Link to="/inventory" className="mr-4">Inventory</Link>
        <Link to="/">Products</Link>
      </nav>

      <h2>WebSocket Message Queue:</h2>
      <ul>
        {queue.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <button onClick={processNextMessage} className="mt-4 p-2 bg-blue-200 text-white rounded">
        Process Next Message
      </button>

      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;

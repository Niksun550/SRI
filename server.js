const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // 💥 Real-time layer

const PORT = 3000;

const ORDERS_FILE = path.join(__dirname, 'orders.json');

app.use(express.static('public'));
app.use(express.json());

let orders = [];

// Load existing orders if file exists
if (fs.existsSync(ORDERS_FILE)) {
  const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
  orders = JSON.parse(data);
}

// Serve existing orders to dashboard
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// Handle new order submission
app.post('/api/orders', (req, res) => {
  const { name, items } = req.body;
  const newOrder = {
    id: Date.now(),
    name,
    items,
    status: 'pending'
  };
  orders.push(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  
  io.emit('newOrder', newOrder); // 🔊 Broadcast to all connected clients
  res.status(201).json(newOrder);
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('🟢 New dashboard connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔴 Dashboard disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

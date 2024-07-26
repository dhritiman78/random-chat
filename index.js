const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const PORT = process.env.PORT || 3000;
const userdetails = {}

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    userdetails[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', {user: userdetails[socket.id],message: message})
  })
});

server.listen(PORT, () => {
  console.log('server running at http://localhost:3000');
});

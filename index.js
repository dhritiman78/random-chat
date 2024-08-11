const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const PORT = 3000;
const userdetails = {}

const app = express();
const server = createServer(app);
const io = new Server(server);



app.use(express.static(join(__dirname, 'dist')));
app.use(express.static(join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});
app.get('/:slug', (req, res) => {
  res.sendFile(join(__dirname, 'dist', `${req.params.slug}.html`));
});
app.get('/src/output', (req, res) => {
  res.sendFile(join(__dirname, 'src', `output.css`));
});

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    userdetails[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });
  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', {user: userdetails[socket.id],message: message})
  })
  socket.on('typing-status', (isTyping) => {
    socket.broadcast.emit('show-typing-status', {isUserTyping: isTyping, user_name: userdetails[socket.id]})
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', userdetails[socket.id]);
  });
});


server.listen(PORT, () => {
  console.log('server running at http://localhost:3000');
}); 

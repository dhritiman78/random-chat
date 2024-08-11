const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const PORT = 3000;
const userdetails = {}

const app = express();
const server = createServer(app);
const io = new Server(server);

// Name spaces
const chatroomNamespace = io.of('/chatRoom');
const chatrandomNamespace = io.of('/chatRandom');

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

chatroomNamespace.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    userdetails[socket.id] = name;
    socket.broadcast.emit('user-joined', name);  });
  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', {user: userdetails[socket.id], message: message})
  })
  socket.on('typing-status', (isTyping) => {
    socket.broadcast.emit('show-typing-status', {isUserTyping: isTyping, user_name: userdetails[socket.id]})
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', userdetails[socket.id]);
  });
});

const users = {};
const randomUsersDetails = {}

chatrandomNamespace.on('connection', (socket) => {
  socket.on('new-user', (name_random) => {
    users[name_random] = { socket: socket, connectedTo: null, isConnected: false };
    randomUsersDetails[socket.id] = name_random
    makeMatch(name_random, '')
  });
  socket.on('send-text',(text) => {
    let sendUserName = randomUsersDetails[socket.id]
    let recieverUserName = users[sendUserName].connectedTo;
    users[recieverUserName]?.socket.emit('recieved-text',{user: sendUserName, message: text} )
  })

socket.on('user-next',() => {
  const disconnectedUser = randomUsersDetails[socket.id]
    const connectedUser = users[disconnectedUser]?.connectedTo
    users[connectedUser]?.socket.emit('user-disconnected', disconnectedUser);
    users[connectedUser].connectedTo = null;
    users[connectedUser].isConnected = false;
    makeMatch(connectedUser, disconnectedUser)
    users[disconnectedUser]?.socket.emit('user-ready-to-connect')
    users[disconnectedUser].connectedTo = null;
    users[disconnectedUser].isConnected = false;
    makeMatch(disconnectedUser, connectedUser)
})

  socket.on('disconnect', () => {
    const disconnectedUser = randomUsersDetails[socket.id]
    const connectedUser = users[disconnectedUser]?.connectedTo

    if (disconnectedUser) {
      // Notify the connected user about the disconnection
      if (connectedUser && users[connectedUser]) {
        users[connectedUser].socket.emit('user-disconnected', disconnectedUser);
        users[connectedUser].connectedTo = null;
        users[connectedUser].isConnected = false;
        makeMatch(connectedUser, disconnectedUser)
      }

      // Remove the disconnected user from the users object
      delete users[disconnectedUser];
    }
  });
});

function findMatch(name_random, notToConnect) {
  let isAlreadyConnected = false;
  let alreayConnectedTo = '';
  for (const user in users) {
    if (users[user].isConnected === true && users[user].connectedTo == name_random && user!=notToConnect) {
      isAlreadyConnected = true
      alreayConnectedTo = user
    }
  }
  if (isAlreadyConnected) {
    return alreayConnectedTo
  } else {
    for (const user in users) {
      if (users[user].isConnected === false && user !== name_random && user!=notToConnect) {
        return user;
      }
    }
  }
  
  return null;
}

function makeMatch(name_random, notToConnect) {
  const match = findMatch(name_random , notToConnect);

    if (match) {
      // Update both users' connections
      users[name_random].connectedTo = match;
      users[match].connectedTo = name_random;
      users[name_random].isConnected = true;
      users[match].isConnected = true;

      // Emit event to both users' sockets
      users[name_random]?.socket.emit('user-matched', users[name_random].connectedTo);
      users[match]?.socket.emit('user-matched', users[match].connectedTo);
    } else {
      // Retry matching after 5 seconds if no match is found
      retryConn(name_random)
    }
}

function retryConn(name_random) {
  setTimeout(() => {
    const matchRetry = findMatch(name_random, '');
    if (matchRetry) {
      users[name_random].connectedTo = matchRetry;
      users[matchRetry].connectedTo = name_random;
      users[name_random].isConnected = true;
      users[matchRetry].isConnected = true;

      users[name_random]?.socket.emit('user-matched', users[name_random].connectedTo);
      users[matchRetry]?.socket.emit('user-matched', users[matchRetry].connectedTo);
    }
  }, 5000);
}


server.listen(PORT, () => {
  console.log('server running at http://localhost:3000');
}); 
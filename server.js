import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // In-memory store for chat rooms
const BOT_USER = { id: 'chithi-plus-bot', name: 'Chithi+ Bot', isBot: true };

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ pin, user }) => {
    if (!pin || !user) {
      return;
    }

    socket.join(pin);
    console.log(`${user.name} (${socket.id}) joined room ${pin}`);

    // Create room if it doesn't exist
    if (!rooms[pin]) {
      rooms[pin] = {
        users: [],
        messages: [{
          id: crypto.randomUUID(),
          text: `Welcome! Room ${pin} is now active. Share the PIN to invite others.`,
          sender: BOT_USER,
          timestamp: Date.now()
        }]
      };
    }

    // Add user to the room, preventing duplicates
    if (!rooms[pin].users.some(u => u.id === user.id)) {
        rooms[pin].users.push({ ...user, socketId: socket.id });
    } else {
        // Update socketId for existing user on reconnect
        const existingUser = rooms[pin].users.find(u => u.id === user.id);
        if (existingUser) existingUser.socketId = socket.id;
    }

    socket.data.pin = pin;
    socket.data.user = user;

    // Send full room data to the newly connected client
    socket.emit('roomData', {
      messages: rooms[pin].messages,
      users: rooms[pin].users.map(({socketId, ...u}) => u), // Don't send socketId to client
    });

    // Notify all other clients in the room about the updated user list
    socket.to(pin).emit('userListUpdate', rooms[pin].users.map(({socketId, ...u}) => u));
  });

  socket.on('sendMessage', (messageData) => {
    const { pin, text, sender } = messageData;
    const room = rooms[pin];
    if (room) {
      const newMessage = {
        id: crypto.randomUUID(),
        text,
        sender,
        timestamp: Date.now(),
      };
      room.messages.push(newMessage);
      io.to(pin).emit('newMessage', newMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    const { pin, user } = socket.data;

    if (pin && user && rooms[pin]) {
      rooms[pin].users = rooms[pin].users.filter(u => u.socketId !== socket.id);
      
      io.to(pin).emit('userListUpdate', rooms[pin].users.map(({socketId, ...u}) => u));

      // Optional: Clean up empty room after a delay
      if (rooms[pin].users.length === 0) {
        setTimeout(() => {
          if (rooms[pin] && rooms[pin].users.length === 0) {
            console.log(`Deleting empty room: ${pin}`);
            delete rooms[pin];
          }
        }, 60000); // 1 minute delay
      }
    }
  });
});

app.get('/', (req, res) => {
  res.send('Chithi+ Server is running!');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

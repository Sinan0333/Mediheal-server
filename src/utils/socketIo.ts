import app from '../app';
import http from 'http'
import { Server } from 'socket.io';



const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {
    console.log('New user connected');
  
      socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  
    socket.on('sendMessage', (message) => {
        io.emit('message', message); // Broadcast the message to all connected clients
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  
});

export default server
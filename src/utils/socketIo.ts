import app from '../app';
import http from 'http'
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

interface Users {
  userId: string;
  socketId:string

}

let users:Users[] = []

const addUser = (userId:string,socketId:string)=>{
  const exists = users.find(user => user.userId === userId)
  if(exists){
    exists.socketId = socketId
  }else{
    users.push({userId,socketId})
  }
}

const getUser = (userId: string) => users.find(user => user.userId === userId)

io.on('connection', (socket) => {
    console.log('New user connected',socket.id);

    socket.on("add_user", (userId) => {
      addUser(userId,socket.id)
    })
  
    socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
    });
  
    socket.on('sendMessage', ({sender,receiver,text}) => {
      const receiverData = getUser(receiver)
      const senderData = getUser(sender)
      
      if(receiverData){
        io.to(receiverData.socketId).emit('message',{sender,receiver,text})
      }
      if(senderData){
        io.to(senderData.socketId).emit('message',{sender,receiver,text})
      }
      console.log(users);
      
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  
});

export default server
import app from '../app';
import http from 'http'
import { Server } from 'socket.io';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
const removeUser = (userId:string) => users = users.filter(user => user.userId !== userId)

io.on('connection', (socket) => { 

    socket.on("add_user", (userId) => {
      addUser(userId,socket.id)
      
    })

    socket.on("chat:started",({to})=>{
      const user = getUser(to)
      if(user){
        io.to(user.socketId).emit("chat:started")
      }
    })
  
    socket.on('sendMessage', ({sender,receiver,text,createdAt}) => {
      const receiverData = getUser(receiver)
      const senderData = getUser(sender)
      
      if(receiverData) io.to(receiverData.socketId).emit('message',{sender,receiver,text,createdAt})
      if(senderData) io.to(senderData.socketId).emit('message',{sender,receiver,text,createdAt})
    });

    socket.on("end_session",(receiver)=>{
      const user = getUser(receiver)
      users =  removeUser(receiver)
      if(user){
        io.to(user.socketId).emit("exit_from_chat")
      }
    })

    socket.on("call:start",({sender,receiver})=>{      
      const receiverData = getUser(receiver)
      if(receiverData){
        io.to(receiverData.socketId).emit("call:start",sender)
      }
      
    })


    socket.on('disconnect', () => {
      // console.log('User disconnected');
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

});

export default server
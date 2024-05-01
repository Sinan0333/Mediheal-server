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
const removeUser = (userId:string) => users = users.filter(user => user.userId !== userId)

io.on('connection', (socket) => {

    socket.on("add_user", (userId) => {
      addUser(userId,socket.id)
      
    })
  
    socket.on('sendMessage', ({sender,receiver,text}) => {
      const receiverData = getUser(receiver)
      const senderData = getUser(sender)
      
      if(receiverData) io.to(receiverData.socketId).emit('message',{sender,receiver,text})
      if(senderData) io.to(senderData.socketId).emit('message',{sender,receiver,text})
    });

    socket.on("end_session",(receiver)=>{
      const user = getUser(receiver)
      users =  removeUser(receiver)
      if(user){
        io.to(user.socketId).emit("exit_from_chat")
      }
    })

    socket.on("call:start",({sender,receiver})=>{      
      const senderData = getUser(sender)
      const receiverData = getUser(receiver)
      if(senderData){
        io.to(senderData.socketId).emit("call:start",{receiver})
      }
      if(receiverData){
        io.to(receiverData.socketId).emit("call:start")
      }
      
    })

    socket.on("user:call",({to,offer})=>{
      const user = getUser(to)
      
      if(user){
        io.to(user.socketId).emit("incoming:call",{from:socket.id,offer})
      }
      
    })

    socket.on("call:accepted",({to,ans})=>{
      io.to(to).emit("call:accepted",{from:socket.id,ans})
    })

    socket.on("peer:negotiationneeded",({to,offer})=>{
      io.to(to).emit("peer:negotiationneeded",{from:socket.id,offer})
    })

    socket.on("peer:negotiationDone",({to,ans})=>{
      io.to(to).emit("peer:negotiationFinal",{from:socket.id,ans})
    })
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on("call:end",({to})=>{
      io.to(to).emit("call:end")
    })
});

export default server
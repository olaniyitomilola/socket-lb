
const { Server } = require('socket.io');

const http =  require('http')
const express = require('express')
const app = express();
const cors = require('cors');

app.use(cors())

const server = http.createServer(app);



const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });


  io.on('connection', (socket) => {

    socket.on('in_chat',(data)=>{
        let room = (data.language + data.level).toLowerCase()
        socket.join(room);
        // socket.emit('initialMessage',rooms[room])
        console.log(`User: ${data.first_name} joined room ${room} `)
       

    })

    socket.on('send_message', async (data)=>{
        console.log(data)
        io.in(data.room).emit('recieve_messages',data)
    })


    socket.on('new_message', async (data)=>{
        console.log(data)
        io.emit('recieve_messages',data)
    })
    
    socket.on('disconnect', () => {
    //  console.log(`User ${socket.id} disconnected`);
    });

   
    
  });

  server.listen(3004,()=>{
    console.log('server listening on 3004')
  })

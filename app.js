
const { Server } = require('socket.io');


const http =  require('http')
const express = require('express')
const app = express();
const cors = require('cors');
const { DB, insertChat, getAllChats, getChats } = require('./database');

app.use(cors())




const server = http.createServer(app);



const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });


  io.on('connection', (socket) => {
 //   console.log(socket.rooms)
    socket.on('in_chat',async (data)=>{
      socket.join((data.language + data.level).toLowerCase());

        try {
           let myMessages = await getChats((data.language + data.level).toLowerCase())
           console.log(myMessages)
           io.to(socket.id).emit('userMessages',myMessages)

           console.log(`User: ${data.first_name} joined room ${(data.language + data.level).toLowerCase()} `)
          
        } catch (error) {
          console.log(error)
        }
       
       

    })

    // socket.on('mymessage', async (data)=>{
    //     console.log(data)
    //     io.in(data.room).emit('recieve_messages',data)
    // })


    socket.on('new_message', async (data)=>{
        console.log(data)
       // await insertChat(data.user_id,data.room,data.text);
        io.emit('recieve_messages',data)
    })
    
    socket.on('disconnect', () => {
    //  console.log(`User ${socket.id} disconnected`);
    });

   
    
  });

  server.listen(3004,async ()=>{
    try {
      DB.connect();
          console.log('server listening on 3004')
          console.log(await getAllChats())

    } catch (error) {
      console.log(error)
    }
  })

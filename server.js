const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const console = require('console');
const formatMessage = require('/Users/sardor.jurayev/Documents/nodeJS/Realtimne-Chat/utility/message.js');
const ChatBot = "Chat Bot ";
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('/Users/sardor.jurayev/Documents/nodeJS/Realtimne-Chat/utility/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);



// set static folder
app.use(express.static(path.join(__dirname, 'html')));
app.get('/', (req, res) => {
    res.sendFile('/Users/sardor.jurayev/Documents/nodeJS/Realtimne-Chat/html/index.htm');
 })



// run when  client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room}) =>{

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcomes the client
    socket.emit('message', formatMessage(ChatBot,'Welcome to Chat'));

    //Broadcast when a user connects
    socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(ChatBot, `${user.username} has joined the chat`));
    
    // Send user and room info
    io.to(user.room).emit('roomUser', {
        room: user.room,
        user: getRoomUsers(user.room)
    });

    });


    //Listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // runns when a client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
        io.to(user.room).emit('message', formatMessage(ChatBot, `${user.username} 
        has left the chat`))
        
        // Send user and room info
        io.to(user.room).emit('roomUser', {
        room: user.room,
        user: getRoomUsers(user.room)
    });
        }
    });

});

const PORT = 3000 || process.env.PORT;
 
server.listen(PORT, () => console.log(`server running on port`));
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const console = require('console');
const formatMessage = require('/Users/sardor.jurayev/Documents/nodeJS/Realtimne-Chat/utility/message.js');
const ChatBot = "Chat Bot ";
const { userJoin, getCurrentUser} = require('/Users/sardor.jurayev/Documents/nodeJS/Realtimne-Chat/utility/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);



// set static folder
app.use(express.static(path.join(__dirname, 'html')));

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
    });

    //confirms a connection
     console.log('New WS Connection...');
    

    //Listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.emit('message', formatMessage('USER ', msg));
    });

    // runns when a client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

});

const PORT = 3000 || process.env.PORT;
 
server.listen(PORT, () => console.log(`server running on port`));
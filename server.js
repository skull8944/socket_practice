const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./server/utils/message');
const { isRealString } = require('./server/utils/isRealString');
const { Users } = require('./server/utils/users');
const app = express();
const port = process.env.port || 8787;
const server = http.createServer(app);
const io = socketIO(server);
let users = new Users();

app.use(express.static('public'));

// socket.broadcast.emit 傳給所有client除了自己的socket
// io.emit 傳給所有client
io.on('connection', (socket) => {
    console.log('a new user just connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage(
            'Admin',
            `Welcome to room:${params.room}!`
        ));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage(
            'Admin',
            `User ${params.name} joined`
        ))

        callback();
    });

    socket.emit('newMessage',
        generateMessage('Admin', 'Welcome to the chat app!')
    )

    socket.on('createMessage', (message) => {
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(
                user.name,
                message.text
            ));
        }
    })

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if(user) {
            io.emit('newLocationMessage', generateLocationMessage(
                user.name,
                coords.lat, 
                coords.lng
            ));
        }        
    });

    socket.on('disconnect', () => {
        console.log('user discornected');
        
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage(
                'Admin', 
                `${user.name} has left ${user.room} chat room.`
            ));
        }
    });
})

server.listen(port, () => {
    console.log(`Server is on port ${port}`)
})
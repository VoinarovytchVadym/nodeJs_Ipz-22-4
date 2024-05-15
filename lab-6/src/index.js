const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const _dir = __dirname.replace("\\src", "");


const {addUser, getUsersInRoom, getUser, removeUser, getUserByUsername} = require("./utils/users");
const {generateMessage, generateLocationMessage} = require("./utils/messages")

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publicPath = _dir + "\\public";

app.use(express.static(_dir + "\\public"));
app.use(express.static(_dir + "\\src\\styles"));

io.on('connection', (socket) => {

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', `Welcome, ${user.username}!`))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        if(user.room){
            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        }
    });


    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                users: getUsersInRoom(user.room)
            })
        }
    });

    socket.on('userIsTyping', () => {
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.room).emit('userIsTyping', user.username);
        }
    });

    socket.on('sendPrivateMessage', ({ message, username }, callback) => {
        const user = getUserByUsername(username);
        const sender = getUser(socket.id);

        if (user != null && sender != null) {
            const PrivateMessage = generateMessage(sender.username, "Private message: " + message);

            if (user.room === sender.room) {
                io.to(user.id).emit('privateMessage', PrivateMessage);
            } else {
                io.to(user.id).emit('notification', `Private message from ${sender.username}: ${PrivateMessage.text}`);
            }

            io.to(sender.id).emit('notification', `Private message has been sent to ${user.username}`);
            callback();
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(publicPath + '/index.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(publicPath + '/chat.html');
})


server.listen(3000, function () {
    console.log('listening on *:3000');
});
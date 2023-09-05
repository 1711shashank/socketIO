const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);

const { Server } = require("socket.io");

const port = 3001;

const io = new Server(server, {
    cors: {
        origin: ["http://192.168.184.1:19006","http://192.168.184.59:19006"]
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);

    socket.on("join room", ({ room }) => {
        socket.join(room);
        console.log(`joined room: ${room}`);
    });

    socket.on("send_msg", ({ room, user, message }) => {
        const data = { user, message };
        console.log(`Received message in room ${room} from ${user}: ${message}`);
        io.to(room).emit("receive_msg", data);
    });

    socket.on("send_resetRequest", (data) => {
        const { room: receivedRoom } = data;
        io.to(receivedRoom).emit("receive_resetRequest");
    });

    socket.on("send_data", ({ myTurn, room, index }) => {
        const data = { myTurn, index };
        console.log(data);
        io.to(room).emit("receive_data", data);
    });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
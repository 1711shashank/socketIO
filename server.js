const express = require('express');
const app = express();
const { createServer } = require('http');
const server = createServer(app);

const { Server } = require("socket.io");

const port = 3001;

const io = new Server(server, {
    cors: {
        origin: "http://localhost:19006",
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected: ${socket.id}`);

    socket.on("join room", ({ playerId, room }) => {
        socket.join(room); // Join the room
        console.log(`${playerId} joined room: ${room}`);
    });

    socket.on("send_msg", ({ room, user, message }) => {
        const data = { user, message };
        console.log(`Received message in room ${room} from ${user}: ${message}`);
        io.to(room).emit("receive_msg", data);
    });

    socket.on("reset_game", (data) => {
        const { room: receivedRoom } = data;
        io.to(receivedRoom).emit("game_reset");
    });

    socket.on("send_data", ({ myTurn, room, index, }) => {
        const data = { myTurn, index };
        console.log(data);
        io.to(room).emit("receive_data", data);
    });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
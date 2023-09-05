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

    socket.on("join room", ({ myTurn, roomInput }) => {
        socket.join(roomInput); // Join the room
        console.log(`${myTurn} joined room: ${roomInput}`);
    });

    socket.on("send_msg", ({ room, user, message }) => {
        const data = { user, message };
        console.log(`Received message in room ${room} from ${user}: ${message}`);
        io.to(room).emit("receive_msg", data);
    });

    socket.on("reset_game", (data) => {
        const { roomInput: receivedRoomInput } = data;
        io.to(receivedRoomInput).emit("game_reset");
    });

    socket.on("send_data", ({ myTurn, roomInput, index, }) => {
        const data = { myTurn, index };
        console.log(data);
        io.to(roomInput).emit("receive_data", data);
    });
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});
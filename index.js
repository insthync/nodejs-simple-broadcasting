const { Server } = require("socket.io");
require('dotenv').config();

const port = Number(process.env.SERVER_PORT || 8212);

const io = new Server({ /* options */ });

io.on("connection", (socket) => {
    socket.on("all", (data) => {
        // Broadcast to all clients
        io.emit("msg", data);
    });
    socket.on("other", (data) => {
        // Broadcast to other clients
        socket.broadcast.emit("msg", data);
    });
});

io.listen(port);
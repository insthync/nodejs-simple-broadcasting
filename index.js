const { Server } = require("socket.io");
const fs = require("fs");
const https = require("https");
const http = require("http");
require('dotenv').config();

const io = new Server();

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

const port = Number(process.env.SERVER_PORT || 8000)
const useHttps = Number(process.env.USE_HTTPS || 0) > 0
const keyFilePath = process.env.HTTPS_KEY_FILE_PATH || ''
const certFilePath = process.env.HTTPS_CERT_FILE_PATH || ''
const httpsPort = Number(process.env.HTTPS_SERVER_PORT || 8080)

const httpServer = http.createServer()
io.attach(httpServer)
httpServer.listen(port, () => {
    console.log(`Simple Socket.io Broadcasting is listening on port ${port}`);
})

if (useHttps) {
    const httpsServer = https.createServer({
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    })
    io.attach(httpsServer)
    httpsServer.listen(httpsPort, () => {
        console.log(`Simple Socket.io Broadcasting is listening on port ${httpsPort}`);
    })
}
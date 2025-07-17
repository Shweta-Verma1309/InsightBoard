const express = require("express");
const http = require('http');
const app = require('./microservices/app');
const server = http.createServer(app);
const { Server } = require('socket.io');
const socketHandlers = require('./common/utils/socketHandlers');
const cors = require('cors');


app.use(express.json());


const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
}
);

require('dotenv').config();
require('./common/config/db')();

io.on('connection', (socket) => {
  socketHandlers(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
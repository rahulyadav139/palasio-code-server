const express = require('express');
const dotEnv = require('dotenv');
const http = require('http');
const { YSocketIO } = require('y-socket.io/dist/server');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);

dotEnv.config();

app.use(cors());

app.get('/', (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/socket.io',
      addTrailingSlash: false,
      transports: ['websocket', 'polling'],
      cors: {
        origin: process.env.APP_URL,
        methods: ['GET', 'POST'],
      },
    });

    const ysocketio = new YSocketIO(io, {
      authenticate: handshake => {
        return true;
      },

      gcEnabled: true,
    });
    ysocketio.initialize();

    res.socket.server.io = io;
  }
  res.end();
});

server.listen(8080 || process.env.PORT, () => {
  console.log('listening');
});

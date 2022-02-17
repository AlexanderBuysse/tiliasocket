const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

let inProgress = false;


io.on('connection', (socket) => {

    console.log(`${socket.id} connected`);


    socket.on('disconnect', () => {
        console.log(`user disconnect`);
        inProgress = false;
    });

    io.emit(`inprogress`, inProgress);

    socket.on('start', (code) => {
        io.emit(`codeString`, code);
        io.emit(`startShow`, true);
        inProgress = true;
        console.log(code);
    });

    socket.on('stop', ()=> { 
        inProgress = false;
        io.emit(`inprogress`, inProgress);
    })
});

server.listen(process.env.PORT ||3000, () => {
  console.log('listening on *:3000');
});
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('public'));

let inProgress = false;
let showMode = false;


io.on('connection', (socket) => {

    console.log(`${socket.id} connected`);

    if(!showMode) {
        showMode = socket.id;
        io.emit('showButton', true);
    }


    socket.on('disconnect', () => {
        console.log(`user disconnect`);
        inProgress = false;
        console.log(showMode, socket.id);
        if(showMode === socket.id) {
            showMode= false;
            console.log('gebruiker is uit de show mode');
        }
    });

    io.emit(`inprogress`, inProgress);

    socket.on('start', (code) => {
        io.emit(`codeString`, code);
        io.emit(`startShow`, true);
        inProgress = true;
    });

    socket.on('stop', ()=> { 
        inProgress = false;
    })

    socket.on('hideShowButton', (bool)=> {
        io.emit('showButton', false);
    })
});

server.listen(process.env.PORT ||3000, () => {
  console.log('listening on *:3000');
});
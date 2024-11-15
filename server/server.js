const express = require('express');
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const { Game } = require("./Game.js");
const gameRoom = new Map();

const app = express();
app.use(cors());


app.get('/1', (req, res) => {
    console.log(1);
    res.json("Hello");
})

const server = http.createServer(app);

const io = socket(server, {
    path : "/",
    cors : {
        origin : "http://localhost:3000",
        credential : true
    }
});


io.on('connection', socket => {
    const systemMessage = (msg, room)=>{
        io.sockets.in(room).emit('chats', {name : "System", content : msg});
    }

    socket.on('join_room', ( { room, name }) => {
        socket.join(room);
        socket['nick'] = name;
        console.log(io.sockets.adapter.rooms.get(room));
        if(!gameRoom.get(room)){
            gameRoom.set(room, new Map())
            gameRoom.get(room).set('expectId', 1);
            socket['isRoomMaster'] = true;
            gameRoom.get(room).set(socket.id, Boolean(socket['playerId'] = 1));
        }
        else {
            console.log("UnRM");
            gameRoom.get(room).set(socket.id, false);
            socket.isRoomMaster = false; 
            socket['playerId'] = gameRoom.get(room).get('expectId');//io.sockets.adapter.rooms.get(room).size;
        }
        gameRoom.get(room).set('expectId', gameRoom.get(room).get('expectId')+1);
        io.to(socket.id).emit('join_room', { room : room, isRoomMaster : socket['isRoomMaster'], status : 200 });
        io.sockets.in(room).emit('chats', {name : `System`, content : `${socket.nick}#${socket.playerId} joined.`});
        socket['isRoomMaster'] && io.sockets.in(room).emit('chats', {name : `System`, content : `You're Room Master.`});
        
        console.log(name, "joined", room);
    });

    socket.on('chat', ({room, content}) => {
        console.log(room, content, socket.rooms, io.sockets.adapter.rooms.get(room));
        io.sockets.in(room).emit('chats', {name : `${socket['nick']}#${socket.playerId}`, content : content});
    });

    socket.on('start', (room) => {
        if(Array.from(gameRoom.get(room).values()).every(e => e)){
            console.log(Array.from(gameRoom.get(room).keys()).slice(1));
            new Game(room, [...Array.from(gameRoom.get(room).keys()).slice(1)]);
            io.sockets.in(room).emit('onStart', { Started : true, status : 200, playerNum : Game.getGame(room).getAllPlayers().length});
            console.log(room, "start");
        }
        else {
            systemMessage('Unready Player', room);
        }
    })

    socket.on('ready', (room)=>{
        gameRoom.get(room).set(socket.id, !gameRoom.get(room).get(socket.id));
        io.sockets.in(room).emit('chats', {name : "System", content : `${socket.nick}#${socket.playerId} has ${gameRoom.get(room).get(socket.id) ? "ready" : "unready"}.`});
        console.log(gameRoom.get(room));
        socket.emit("onReady");
    })

    socket.on('disconnecting', () => {
        console.log(socket.id, 'disconnected');
        socket.rooms.forEach(e => {
            if(gameRoom.get(e)){
                gameRoom.get(e).delete(socket.id);
                io.sockets.adapter.rooms.get(e).size === 0 && gameRoom.delete(e);
            }
            io.sockets.in(e).emit('chats', {name : "System", content : `${socket.nick}#${socket.playerId} disconnected`});
        })
    });

    socket.on('disconnect', () => {
        console.log(socket.id, "disconnect");
    });


    //In Game
    socket.on('bet', ({room, bet}) => {
        const game = Game.getGame(room);
        const isBetted = game.getPlayerById(socket.id).bet(bet);
        isBetted ? 
            game.getAllPlayers().every(e => e.getInfo().betting !== 0) ?
            game.OnStart() && io.sockets.in(room).emit("transState", {State : "onSet"})
            :socket.emit("accomplishBet", true)
        : socket.emit("accomplishBet", false);
        
    });
});

server.listen(8080, () => {
    console.log("Server is Listening");
});
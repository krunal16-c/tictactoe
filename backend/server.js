// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let games = {};

io.on('connection', (socket) => {
  socket.on('createGame', (pin) => {
    games[pin] = {
      players: [socket.id],
      board: Array(9).fill(null),
      xIsNext: true,
    };
    socket.join(pin);
  });

  socket.on('makeMove', (pin, i) => {
    if (games[pin] && games[pin].players.includes(socket.id)) {
      games[pin].board[i] = games[pin].xIsNext ? 'X' : 'O';
      games[pin].xIsNext = !games[pin].xIsNext;
      io.to(pin).emit('gameUpdate', games[pin]); // Emit the updated game state to both clients
    }
  });

  socket.on('joinGame', (pin) => {
    if (games[pin] && games[pin].players.length < 2) {
      games[pin].players.push(socket.id);
      socket.join(pin);
      io.to(pin).emit('gameStart', games[pin]);
    }
  });

  socket.on('makeMove', (pin, i) => {
    if (games[pin] && games[pin].players.includes(socket.id)) {
      games[pin].board[i] = games[pin].xIsNext ? 'X' : 'O';
      games[pin].xIsNext = !games[pin].xIsNext;
      io.to(pin).emit('gameUpdate', games[pin]);
    }
  });
});

server.listen(3000, () => console.log('Server listening on port 3000'));
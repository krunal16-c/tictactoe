// TicTacToe.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'; 
import './Tictactoe.css';

const socket = io('http://localhost:3000');

const TicTacToe = () => {

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [timer, setTimer] = useState(0); // Add this line
  const [winningSquares, setWinningSquares] = useState([]);
  const [pin, setPin] = useState(null); 


  useEffect(() => {
    socket.on('gameStart', (game) => {
      setBoard(game.board);
      setXIsNext(game.xIsNext);
    });

    socket.on('gameUpdate', (game) => {
      setBoard(game.board);
      setXIsNext(game.xIsNext);
    });
  }, []);

  const createGame = () => {
    const pin = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit PIN
    setPin(pin);
    socket.emit('createGame', pin);
  };

  const joinGame = (pin) => {
    setPin(pin);
    socket.emit('joinGame', pin);
  };

const handleMove = (i) => {
    if (pin) {
        socket.emit('makeMove', pin, i);
    }
};

  useEffect(() => {
    const interval = setInterval(() => {
      if (winner || isDraw) {
        clearInterval(interval);
      } else {
        setTimer((prevTimer) => prevTimer + 1);
      }
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, [winner, isDraw]);

  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  useEffect(() => {
    for (let line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setScore({ ...score, [board[a]]: score[board[a]] + 1 });
        setWinningSquares([a, b, c]);
      }
    }

    if (!board.includes(null) && !winner) {
      setIsDraw(true);
    }
  }, [board, winner]);
  
  useEffect(() => {
    socket.on('gameUpdate', (game) => {
      setBoard(game.board);
      setXIsNext(game.xIsNext);
      
    });
  }, []);
  const handleClick = async (i) => {
    if (board[i] || winner) return;
    const boardCopy = [...board];
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
    setTimer(0);
    setWinningSquares([]);
  };

  const renderSquare = (i) => (
    <button className={`square ${winningSquares.includes(i) ? 'winning' : ''}`} // Modify this line
    onClick={() => handleClick(i)}>
      {board[i]}
    </button>
  );

  

  return (
    <div>
      <div className="board">
        {Array(9).fill(null).map((_, i) => renderSquare(i))}
      </div>
        <input type="text" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter PIN" />
        <button onClick={() => createGame(pin)}>Create Game</button>
        <button onClick={() => joinGame(pin)}>Join Game</button>
      <div className="info">
        <div>Next player: {xIsNext ? 'X' : 'O'}</div> {/* Add this line */}
        <div>Time elapsed: {timer} seconds</div> {/* Add this line */}
        <div>Score: X - {score.X}, O - {score.O}</div> {/* Add this line */}
      </div>
      {winner && <div className="winner">Winner: {winner}</div>}
      {!winner && isDraw && <div className="draw">Game is a draw</div>}
      <button onClick={resetGame}>Reset</button>
    </div>
  );
};

export default TicTacToe;
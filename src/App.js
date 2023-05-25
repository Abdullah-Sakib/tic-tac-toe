import React, { useEffect, useState } from "react";
import "./App.css";
import io from 'socket.io-client';

const socket = io('http://localhost:5000', { transports: ["websocket"] });

function App() {
  const [players, setPlayers] = useState([]);
  const [symbol, setSymbol] = useState(null);
  const [turn, setTurn] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  function handleBoxClick(index) {
    if (board[index] !== null || winner !== null) {
      console.log(`boad move ${board[index]}  winner status ${winner !== null}`)
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    checkForWinner(newBoard);

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    socket.emit('player-move', { board: newBoard, turn: currentPlayer === "X" ? "O" : "X" });
  }

  function checkForWinner(board) {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
  }

  function renderBox(index) {
    return (
      <div className="box" onClick={() => handleBoxClick(index)}>
        {board[index]}
      </div>
    );
  }

  function renderStatus() {
    if (winner) {
      return `${winner} wins!`;
    } else if (!board.includes(null)) {
      return "It's a tie!";
    } else {
      return `Current player: ${currentPlayer}`;
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server');
      socket.emit('player-join');
    });
    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });
    socket.on('player-joined', (player) => {
      console.log('player joined', player);
      setPlayers([...players, player]);
      if (player.id === socket.id) {
        setSymbol(player.symbol);
      }
    });
    socket.on('player-join', (player) => {
      console.log('player join', player);
      setPlayers([...players, player]);
    });
    socket.on('player-left', (id) => {
      console.log('player left', id);
      setPlayers(players.filter((player) => player.id !== id));
      // setCurrentPlayer(players.filter((player) => player.id !== id));
    });
    socket.on('player-move', (data) => {
      console.log('player move', data);
      console.log('player move', data.turn);

      setBoard(data.board);
      setTurn(data.turn);
      setCurrentPlayer(data.turn);
      setWinner(checkForWinner(data.board));
    });
    socket.on('game-end', (data) => {
      console.log('game end', data);
      setWinner(data.winner);
    });
  }, [players]);


  return (
    <div className="board">
      <h1>Tic Tac Toe</h1>
      <div className="row">
        {renderBox(0)}
        {renderBox(1)}
        {renderBox(2)}
      </div>
      <div className="row">
        {renderBox(3)}
        {renderBox(4)}
        {renderBox(5)}
      </div>
      <div className="row">
        {renderBox(6)}
        {renderBox(7)}
        {renderBox(8)}
      </div>
      <div className="status">{renderStatus()}</div>
      {(renderStatus() === "O wins!" ||
        renderStatus() === "It's a tie!" ||
        renderStatus() === "X wins!") && (
        <button className="reset" onClick={() => resetGame()}>
          Restart Game
        </button>
      )}
    </div>
  );
}

export default App;

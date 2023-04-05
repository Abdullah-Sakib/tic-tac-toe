import React, { useState } from "react";
import "./App.css";

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);

  function handleBoxClick(index) {
    if (board[index] !== null || winner !== null) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    checkForWinner(newBoard);

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
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

  console.log(renderStatus());

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
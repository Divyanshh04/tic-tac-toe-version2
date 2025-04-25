const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartButton");
const toggleBtn = document.getElementById("darkModeToggle");

let currentPlayer = "X";
let gameActive = true;
let boardState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const minimax = (newBoard, player) => {
  const huPlayer = "X";
  const aiPlayer = "O";
  const availSpots = newBoard.reduce((acc, val, i) => {
    if (val === "") acc.push(i);
    return acc;
  }, []);

  if (checkWinner(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWinner(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      const result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

const checkWinner = (boardToCheck, player) => {
  return winningConditions.some(condition =>
    condition.every(index => boardToCheck[index] === player)
  );
};

const handleClick = (e) => {
  const index = e.target.dataset.index;
  if (boardState[index] !== "" || !gameActive) return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner(boardState, currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";

  const bestMove = minimax([...boardState], "O").index;
  boardState[bestMove] = "O";
  cells[bestMove].textContent = "O";

  if (checkWinner(boardState, "O")) {
    statusText.textContent = `AI wins!`;
    gameActive = false;
    return;
  }

  if (!boardState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
};

const restartGame = () => {
  boardState = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "";
};

cells.forEach(cell => cell.addEventListener("click", handleClick));
restartBtn.addEventListener("click", restartGame);

// 🌙 DARK MODE TOGGLE
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  toggleBtn.textContent = isDark ? "🌞" : "🌙";
});

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "🌞";
  } else {
    toggleBtn.textContent = "🌙";
  }
});

const boardSize = 4;
let board = [];
let score = 0;

function initBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  let emptyTiles = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) emptyTiles.push([r, c]);
    }
  }
  if (emptyTiles.length === 0) return;
  const [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  const boardDiv = document.getElementById("game-board");
  boardDiv.innerHTML = "";
  board.forEach(row => {
    row.forEach(value => {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      if (value !== 0) {
        tile.textContent = value;
        tile.classList.add("tile-" + value);
      }
      boardDiv.appendChild(tile);
    });
  });
  document.getElementById("score").textContent = `점수: ${score}`;
}

function slide(row) {
  let arr = row.filter(val => val);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  return arr.filter(val => val).concat(Array(boardSize - arr.filter(val => val).length).fill(0));
}

function rotateLeft(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function rotateRight(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[boardSize - 1 - i]));
}

function handleMove(direction) {
  let rotated = board;
  if (direction === "ArrowUp") rotated = rotateLeft(board);
  if (direction === "ArrowRight") rotated = rotateRight(rotateRight(board));
  if (direction === "ArrowDown") rotated = rotateRight(board);

  let newBoard = rotated.map(row => slide(row));

  if (direction === "ArrowUp") newBoard = rotateRight(newBoard);
  if (direction === "ArrowRight") newBoard = rotateRight(rotateRight(newBoard));
  if (direction === "ArrowDown") newBoard = rotateLeft(newBoard);

  if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
    board = newBoard;
    addRandomTile();
    updateBoard();
    if (isGameOver()) alert("공간이 없어요! 게임 종료!!");
  }
}

function isGameOver() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) return false;
      if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

window.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    handleMove(e.key);
  }
});

initBoard();

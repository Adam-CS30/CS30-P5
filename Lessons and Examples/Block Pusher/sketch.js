// Block Pusher
// Adam Abouelela
// April 29, 2024
// One more crack at 2D arrays

const COLUMNS = 5, ROWS = 5, TILE_SIZE = 100;
let tileTypes = [], playerX = 3, playerY = 4 //0>grass, 1>checken, 2>cow, 3>star
let board = [
  [0, 1, 0, 0, 3],
  [1, 0, 0, 1, 0],
  [0, 1, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0]
]

function preload() {
  for (let i = 0; i < 4; i++) {
    tileTypes.push(loadImage("assets/" + i + ".png"))
  }
}

function setup() {
  createCanvas(COLUMNS*TILE_SIZE, ROWS*TILE_SIZE);
  board[playerY][playerX] = 2
}

function draw() {
  background(220);
  renderBoard();
}

function swap(x1, y1, x2, y2){
  let temp = board[y1][x1];
  board[y1][x1] = board[y2][x2];
  board[y2][x2] = temp;
}

function keyPressed(){
  if (keyCode === UP_ARROW && playerY > 0){
    if (board[playerY-1][playerX] === 0){swap(playerX, playerY, playerX, playerY-1); playerY--;}
    else if (board[playerY-2][playerX] === 0){
      swap(playerX, playerY-1, playerX, playerY-2);
      swap(playerX, playerY, playerX, playerY-1);
      playerY--;
    }
  }
  if (keyCode === DOWN_ARROW && playerY < ROWS){
    if (board[playerY+1][playerX] === 0){swap(playerX, playerY, playerX, playerY+1); playerY++;}
    else if (board[playerY+2][playerX] === 0){
      swap(playerX, playerY+1, playerX, playerY+2);
      swap(playerX, playerY, playerX, playerY+1);
      playerY++;
    }
  }
  if (keyCode === RIGHT_ARROW && playerX < COLUMNS && (board[playerY][playerX+1] === 0 || board[playerY][playerX+2] === 0)){swap(playerX, playerY, playerX+1, playerY); playerX++;}
  if (keyCode === LEFT_ARROW && playerX > 0 && (board[playerY][playerX-1] === 0 || board[playerY][playerX-2] === 0)){swap(playerX, playerY, playerX-1, playerY); playerX--;}
}

function renderBoard(){
  for (let y = 0; y < ROWS; y++){
    for(let x = 0; x < COLUMNS; x++){
      image(tileTypes[board[y][x]], x*TILE_SIZE, y*TILE_SIZE)
    }
  }
}
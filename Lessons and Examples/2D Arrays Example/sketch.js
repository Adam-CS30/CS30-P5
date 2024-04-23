// Puzzle Game Starter
// Adam Abouelela
// April 23, 2024

const SQUARE_SIZE = 50; const NUM_ROWS = 4; const NUM_COLS = 5;
let grid = 
[
  [  0, 255,   0, 255, 255],
  [  0, 255,   0,   0,   0],
  [  0,   0, 255,   0, 255],
  [255, 255,   0, 255,   0]
];

function setup() {
createCanvas(NUM_COLS * SQUARE_SIZE, NUM_ROWS * SQUARE_SIZE);
}

function draw() {
  background(220);
  drawGrid();
}

function drawGrid(){
  // Read data from 2D array (grid), and use the numbers there to set the color for squares which are arranged in a grid fashion.
  for (let y = 0; y < NUM_ROWS; y++){
    for(let x = 0; x < NUM_COLS; x++){
      fill(grid[y][x]);
      square(x*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);
    }
  }
}

function flipTiles(y, x){
  if (grid[x][y] === 255){grid[x][y] = 0;}
  else{grid[x][y] = 255;}
}

function mousePressed(){
  if (mouseButton === LEFT){flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));}
}
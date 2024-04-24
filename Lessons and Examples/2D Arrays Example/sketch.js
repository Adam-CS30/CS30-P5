// Puzzle Game Starter
// Adam Abouelela
// April 23, 2024

const SQUARE_SIZE = 50; const NUM_ROWS = 6; const NUM_COLS = 6;
let grid = [], win = false;

function setup() {
  createCanvas(NUM_COLS * SQUARE_SIZE, NUM_ROWS * SQUARE_SIZE);
  for (let y = 0; y < NUM_ROWS; y++){
    grid.push([]);
    for (let x = 0; x < NUM_COLS; x++){
      grid[y].push(int(random(2))*255);
    }
  }
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

function flipTiles(x, y, cheat){
  if (grid[y][x] === 255){grid[y][x] = 0;}
  else{grid[y][x] = 255;}

  if (!cheat){
    if (y !== NUM_ROWS-1){
      if (grid[y+1][x] === 255){grid[y+1][x] = 0;}
      else{grid[y+1][x] = 255;}
    }

    if (y !== 0){
      if (grid[y-1][x] === 255){grid[y-1][x] = 0;}
      else{grid[y-1][x] = 255;}
    }

    if (x !== NUM_COLS-1){
      if (grid[y][x+1] === 255){grid[y][x+1] = 0;}
      else{grid[y][x+1] = 255;}
    }

    if (x !== 0){
      if (grid[y][x-1] === 255){grid[y][x-1] = 0;}
      else{grid[y][x-1] = 255;}
    }
  }
}

function checkWin(){
  let tile = grid[0][0];
  for (let y = 0; y < NUM_ROWS; y++){
    for(let x = 0; x < NUM_COLS; x++){
      if (tile !== grid[y][x]){
        win = false;
        break;
      }
    }
    if (!win){break;}
  }
  print(win);
}

function mousePressed(){
  if (mouseButton === LEFT && mouseX <= width && mouseY <= height){
    if (keyIsDown(SHIFT)){flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)), true);}
    else{flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)), false);}
    checkWin();
  }
}
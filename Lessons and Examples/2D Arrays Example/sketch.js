// Puzzle Game Starter
// Adam Abouelela
// April 23, 2024

const SQUARE_SIZE = 50; const NUM_ROWS = 6; const NUM_COLS = 6;
let grid = [], win = false, n = 0;

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
  noStroke();
  drawGrid();
  stroke(0);
  if (win){winWhite(); drawWin(grid[0][0]);}
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

function drawWin(tileColor){
  if (n <= width/2){
    for (let y = 0; y <= NUM_ROWS; y++){
      for(let x = 0; x <= NUM_COLS; x++){line(x*SQUARE_SIZE, 0+n, x*SQUARE_SIZE, height-n);}
      line(0+n, y*SQUARE_SIZE, width-n, y*SQUARE_SIZE);
    }
    n += 3;
  }

  else{
  if (tileColor === 255){fill(0);}
  else{fill(255);}
  
  textSize(50);
  textAlign(CENTER);
  text('YOU WIN!', width/2, height/2);
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
        return false;
      }
    }
  }
  return true;
}

function mousePressed(){
  if (mouseButton === LEFT && mouseX <= width && mouseY <= height && !win){
    if (keyIsDown(SHIFT)){flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)), true);}
    else{flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)), false);}
    if (checkWin()){
      win = true;
    }
    else{win = false;}
  }
}
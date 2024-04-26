// Puzzle Game Starter
// Adam Abouelela
// April 23, 2024

const SQUARE_SIZE = 50; const NUM_ROWS = 6; const NUM_COLS = 6;
let grid = [], squareMode = false; win = 0, n = 0;

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
  
  if (win){noStroke();}
  drawGrid();
  if (!win){tileOverlay(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));}
  
  if (win){animateWin();}
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

// Plays one of two short animations based on the way the board was filled.
function animateWin(){
  // If the filled board was white:
  if (grid[0][0] === 255){

    // The borders between the tiles is removed and replaced by fake ones that get shorter until they disappear.
    stroke(0);
    if (n <= width/2){
      for (let y = 0; y <= NUM_ROWS; y++){
        for(let x = 0; x <= NUM_COLS; x++){line(x*SQUARE_SIZE, 0+n, x*SQUARE_SIZE, height-n);}
        line(0+n, y*SQUARE_SIZE, width-n, y*SQUARE_SIZE);
      }
      n += 3;
    }
    // When the animation has played display 'YOU WIN!'.
    else{textWin();}
  }
  
  // If the filled board was black:
  else{
    // A white rectangle as wide as the screen spawns at the center and vertically grows until it fill the screen.
    // The 'YOU WIN!' text is always displayed but camoflauges with the black tiles to make it seem like it is being revealed.
    fill(255);
    rect(0, height/2-n/2, width, n);
    textWin();
    if (n <= height){n += 3;}
  }
}

// Display 'YOU WIN!' in black on the center of the screen.
function textWin(){
  fill(0);
  textSize(60);
  textAlign(CENTER, CENTER);
  text('YOU WIN!', width/2, height/2);
}

function flipTiles(x, y){
  if (grid[y][x] === 255){grid[y][x] = 0;}
  else{grid[y][x] = 255;}

  if (!keyIsDown(SHIFT)){
    if (y !== NUM_ROWS-1){
      if (grid[y+1][x] === 255){grid[y+1][x] = 0;}
      else{grid[y+1][x] = 255;}
    }

    if (x !== NUM_COLS-1){
      if (grid[y][x+1] === 255){grid[y][x+1] = 0;}
      else{grid[y][x+1] = 255;}
    }

    if (squareMode){
      if (x !== NUM_COLS-1 && y !== NUM_ROWS-1){
        if (grid[y+1][x+1] === 255){grid[y+1][x+1] = 0;}
        else{grid[y+1][x+1] = 255;}
      }
    }

    else{
      if (y !== 0){
        if (grid[y-1][x] === 255){grid[y-1][x] = 0;}
        else{grid[y-1][x] = 255;}
      }

      if (x !== 0){
        if (grid[y][x-1] === 255){grid[y][x-1] = 0;}
        else{grid[y][x-1] = 255;}
      }
    }
  }
}

function tileOverlay(x, y){
  fill(50, 220, 100, 150);

  square(x*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);

  if (!keyIsDown(SHIFT)){
    if (y !== NUM_ROWS-1){square(x*SQUARE_SIZE, (y+1)*SQUARE_SIZE, SQUARE_SIZE);}
    if (x !== NUM_COLS-1){square((x+1)*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);}

    if (squareMode){if (x !== NUM_COLS-1 && y !== NUM_ROWS-1){square((x+1)*SQUARE_SIZE, (y+1)*SQUARE_SIZE, SQUARE_SIZE);}}

    else{
      if (y !== 0){square(x*SQUARE_SIZE, (y-1)*SQUARE_SIZE, SQUARE_SIZE);}
      if (x !== 0){square((x-1)*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);}
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
    flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));
    win = checkWin();
  }
}

function keyPressed(){
  if (key === ' '){
    if (squareMode){squareMode = false;}
    else{squareMode = true;}
  }
}
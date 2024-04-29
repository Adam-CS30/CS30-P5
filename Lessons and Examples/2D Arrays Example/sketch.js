// Puzzle Game Starter
// Adam Abouelela
// April 23, 2024

// SQUARE_SIZE is the size of each tile, while NUM_ROWS and NUM_COLS are the number of rows and columns.
const SQUARE_SIZE = 50; const NUM_ROWS = 6; const NUM_COLS = 6;

let grid = []; // grid will be a 2D array that stores the states of all tiles.
let squareMode = false; // squareMode is a boolean that stores whether or not the flip mode should be a square(true) or cross(false).
let win = false; // Stores whether the player has won.
let n = 0; // n is used in the win animations.

function setup() {
  createCanvas(NUM_COLS * SQUARE_SIZE, NUM_ROWS * SQUARE_SIZE);

  // Creates a 2D array where each item is randomly either 0 or 255.
  for (let y = 0; y < NUM_ROWS; y++){
    grid.push([]);
    for (let x = 0; x < NUM_COLS; x++){
      grid[y].push(int(random(2))*255);
    }
  }
}

function draw() {
  background(220);
  
  // If the game was won, stroke is turned off.
  if (win){noStroke();}

  // Draws the grid.
  drawGrid();
  // Creates an overlay on top of the grid to show which tiles would be flipped.
  if (!win){tileOverlay(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));}
  
  // If the game was won, display the win animation.
  if (win){animateWin();}
}

function drawGrid(){
  // Draw the grid by reading the values in the 2D array "grid" and using the numbers there as the color for each square on the grid.
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

    // The borders between the tiles is removed and replaced by fake lines that get shorter until they disappear.
    // Animation stops when the lines have disappeared.
    stroke(0);
    if (n <= width/2){
      for (let y = 0; y <= NUM_ROWS; y++){
        for(let x = 0; x <= NUM_COLS; x++){line(x*SQUARE_SIZE, 0+n, x*SQUARE_SIZE, height-n);}
        line(0+n, y*SQUARE_SIZE, width-n, y*SQUARE_SIZE);
      }
      n += 3; // The length of each line gets shorter by n*2 each frame.
    }
    
    else{textWin();} // When the animation has stopped display 'YOU WIN!'.
  }
  
  // If the filled board was black:
  else{
    // A white rectangle as wide as the screen spawns at the center and vertically grows until it fill the screen.
    // The 'YOU WIN!' text is always displayed but camoflauges with the black tiles to make it seem like it is being revealed.
    fill(255);
    rect(0, height/2-n/2, width, n);
    textWin();
    
    if (n <= height){n += 0.01*pow(n, 1.3)+1;} // The height of the rectangle 'n' grows exponentially until it spans the whole height of the screen.
  }
}

// Display 'YOU WIN!' in black on the center of the screen.
function textWin(){
  fill(0);
  textSize(SQUARE_SIZE*NUM_COLS/5);
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

// Creates an overlay on the tiles that will be flipped based on the 
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

// Checks to see if every tile's color is equal to the first tile. If so, return true.
function checkWin(){
  let tile = grid[0][0];
  for (let y = 0; y < NUM_ROWS; y++){
    for(let x = 0; x < NUM_COLS; x++){
      // If any tile doesn't match the first tile, return false.
      if (tile !== grid[y][x]){
        return false;
      }
    }
  }
  return true;
}

function mousePressed(){
  // If the mouse is on the canvas while a left click occurs and the game hasn't been won, certain tiles will flip color.
  if (mouseButton === LEFT && mouseX <= width && mouseY <= height && !win){
    // 
    flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));
    // Check to see if the flip caused the game to be won.
    win = checkWin();
  }
}

// When the spacebar is pressed toggle the flip mode between a square and a cross.
function keyPressed(){
  if (key === ' '){
    if (squareMode){squareMode = false;}
    else{squareMode = true;}
  }
}

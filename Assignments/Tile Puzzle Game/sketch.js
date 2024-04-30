// Puzzle Game Starter
// Adam Abouelela
// April 23, 2024

// A puzzle game made of tiles that can be flipped to change their color between black and white.
// To win all tiles need to be the same color whether it's black or white.
// The shape in which the tiles are flipped can be toggled between a cross or square using the spacebar.
// Holding down shift allows you to cheat by flipping a single tile.

// SQUARE_SIZE is the size of each tile, while NUM_ROWS and NUM_COLS are the number of rows and columns.
// These constants can be changed to be whatever the player wants.
const SQUARE_SIZE = 50; const NUM_ROWS = 6; const NUM_COLS = 6;

let grid = []; // grid will be a 2D array that stores the states of all tiles.
let squareMode = false; // squareMode is a boolean that  stores whether the flip mode should be a square(true) or cross(false).
let win = false; // win stores whether the player has won.
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
  
  // If the game was won, stroke is turned off so that it doesn't mess with the win animation.
  if (win){noStroke();}

  // Draws the grid.
  drawGrid();

  // Creates an overlay on top of the grid to show which tiles would be flipped, if the player was to click, using the index position in the 2D array of the tile that the mouse is closest to.
  if (!win){tileOverlay(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));}
  
  // If the game was won, display a win animation.
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

// This function flips the color of the correct tiles when the player clicks.
function flipTiles(x, y){
  // Flips the center tile.
  if (grid[y][x] === 255){grid[y][x] = 0;}
  else{grid[y][x] = 255;}

  // Checks to see if shift is held down before flipping more tiles. If it is held down, it won't flip more tiles.
  if (!keyIsDown(SHIFT)){

    // All tiles except the center tile are checked to make sure they exist before they can be flipped.
    // The bottom and right tiles are immediately flipped no matter the state of squareMode.
    if (y !== NUM_ROWS-1){
      if (grid[y+1][x] === 255){grid[y+1][x] = 0;}
      else{grid[y+1][x] = 255;}
    }

    if (x !== NUM_COLS-1){
      if (grid[y][x+1] === 255){grid[y][x+1] = 0;}
      else{grid[y][x+1] = 255;}
    }

    // If the flip mode is square, then the bottom-right tile is flipped.
    if (squareMode){
      if (x !== NUM_COLS-1 && y !== NUM_ROWS-1){
        if (grid[y+1][x+1] === 255){grid[y+1][x+1] = 0;}
        else{grid[y+1][x+1] = 255;}
      }
    }

    // If the flip mode isn't square (so it's a cross), then the top and left tiles are flipped.
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

// Creates an overlay on the tiles that would be flipped if the player clicks.
// This function works similarly to how flipTiles() works in terms of checking which tiles should be flipped/highlighted.
function tileOverlay(x, y){
  // Green semi-transparent color.
  fill(50, 220, 100, 150);

  // The center tile is always highlighted.
  square(x*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);

  // Will only highlight other tiles if the player isn't holding shift.
  if (!keyIsDown(SHIFT)){
    // All tiles except the center are checked to make sure that they exist before highlighting them.
    // The bottom and right tiles are highlighted immediately since they are highlighted in both cross and square mode.
    if (y !== NUM_ROWS-1){square(x*SQUARE_SIZE, (y+1)*SQUARE_SIZE, SQUARE_SIZE);}
    if (x !== NUM_COLS-1){square((x+1)*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);}

    // Highlights the bottom-right tile if square mode is active.
    if (squareMode){if (x !== NUM_COLS-1 && y !== NUM_ROWS-1){square((x+1)*SQUARE_SIZE, (y+1)*SQUARE_SIZE, SQUARE_SIZE);}}

    // Hightlights the top and left tiles if square mode isn't active (which means that cross mode is active instead).
    else{
      if (y !== 0){square(x*SQUARE_SIZE, (y-1)*SQUARE_SIZE, SQUARE_SIZE);}
      if (x !== 0){square((x-1)*SQUARE_SIZE, y*SQUARE_SIZE, SQUARE_SIZE);}
    }
  }
}

// Checks to see if every tile's color is equal to the first tile. If so, it returns true.
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
    // Flip the correct tiles using the index position in the 2D array of the tile that the mouse is closest to.
    flipTiles(int(constrain(mouseX/SQUARE_SIZE, 0, NUM_COLS-1)), int(constrain(mouseY/SQUARE_SIZE, 0, NUM_ROWS-1)));
    // Check to see if the flip caused the game to be won.
    win = checkWin();
  }
}

// When the spacebar is pressed toggle the tile flip mode between a square and a cross.
function keyPressed(){
  if (key === ' '){
    if (squareMode){squareMode = false;}
    else{squareMode = true;}
  }
}

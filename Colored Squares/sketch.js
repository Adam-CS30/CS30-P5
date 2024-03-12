// Colored Squares
// Adam Abouelela
// March 1, 2024
// Creating a grid of semi-randomly colored squares

let size = 20; 

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  document.addEventListener("contextmenu", event => event.preventDefault());
}

// Draws a new grid everytime there is a mouse click. If it's a left click the squares get smaller. If it's a right click the squares get bigger.
function mousePressed(){
  if (mouseButton === LEFT) {size -= 4;}
  else if (mouseButton === RIGHT) {size += 4;}
  drawGrid();
}

// Draws a new grid with the same size squares everytime a key is pressed.
function keyPressed(){drawGrid();}

// Draws a grid of squares where each square that is drawn is based on the colors of the previous square.
function drawGrid(){
  background(220);
  // Randomizes an initial color.
  let R = random(0,255);
  let G = random(0,255);
  let B = random(0,255);
  
  // "n" is the furthest each square's RGB values can be from the previous square.
  // It's adjusted based on the number of squares that fit in the grid, making it so that as the number of squares increase, 'n' decreases to keep the color gradient somewhat stable between square sizes.
  let n = (width/((width - width%size) / size))/2;
  
  // The way the squares are drawn makes it so that it seems like there is a gradient drawn from left to right.
  for (let x = size/2; x <= width - size/2; x+=size){
    for (let y = size/2; y <= height - size/2; y+=size){

      // Randomize new RGB values while having the new RGB values be within a range of the previous RGB values.
      R = random(R-n, R+n);
      G = random(G-n, G+n);
      B = random(B-n, B+n);

      // Limits the RGB values from having a value outside the interval [0,255].
      if (R < 0){R=0;}
      if (G < 0){G=0;}
      if (B < 0){B=0;}
      if (R > 255){R=255;}
      if (G > 255){G=255;}
      if (B > 255){B=255;}
      
      // Draws the square with the new RGB values and whatever the current size is.
      fill(R,G,B);
      square(x, y, size);
    }
  }
}
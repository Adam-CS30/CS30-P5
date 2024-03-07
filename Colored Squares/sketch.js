// Colored Squares
// Adam Abouelela
// March 1, 2024
// Creating a grid of semi-randomly colored squares

let s = 20; 
let n, R, G, B;

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  document.addEventListener("contextmenu", event => event.preventDefault());
}

function mousePressed(){
  if (mouseButton === LEFT) {s -= 4;}
  else if (mouseButton === RIGHT) {s += 4;}
  drawGrid();
}

function keyPressed(){drawGrid();}

function randomColor(){
  R = random(50,255);
  G = random(50,255);
  B = random(50,255);
  return [R,G,B];
}

function drawGrid(){
  background(220);
  let total1 = 0;
  let total2 = 0;
  
  while (abs(total2 - total1) < 100){
    square1 = randomColor();
    square2 = randomColor();
    total1 = square1[0] + square1[1] + square1[2];
    total2 = square2[0] + square2[1] + square2[2];
  }
  
  n = (width/((width - width%s) / s))/2;
  
  for (let x = s/2; x < width - s/2; x+=s){
    for (let y = s/2; y < height - s/2; y+=s){
      R = random(R-n, R+n);
      G = random(G-n, G+n);
      B = random(B-n, B+n);
      if (R < 0){R=0;}
      if (G < 0){G=0;}
      if (B < 0){B=0;}
      if (R > 255){R=255;}
      if (G > 255){G=255;}
      if (B > 255){B=255;}
      
      fill(R,G,B);
      square(x, y, s);
    }
  }
}
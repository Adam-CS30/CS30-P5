// Colored Squares
// Adam Abouelela
// March 1, 2024
// Creating a grid of semi-randomly colored squares

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER)
  document.addEventListener("contextmenu", event => event.preventDefault())
}

function mousePressed(){
  let R = random(50,255);
  let G = random(50,255);
  let B = random(50,255);
  let size = 20;
  let n = 10;
  let squares = pow(((width - width%size) / size),2);
  
  for (let x = size/2; x < width; x+=size){
    for (let y = size/2; y < height; y+=size){
      R = random(R-n, R+n);
      G = random(G-n, G+n);
      B = random(B-n, B+n);
      if (R < 0){R=0;}
      if (G < 0){G=0;}
      if (B < 0){B=0;}
      if (R > 255){R=255;}
      if (G > 255){G=255;}
      if (B > 255){B=255;}
      
      fill(R,G,B)

      square(x, y, size)
    }
  }
}
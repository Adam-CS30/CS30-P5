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
  let size = 20
  for (let x = size/2; x < width; x+=size){
    for (let y = size/2; y < height; y+=size){
      fill(random(0,255))
      square(x, y, size)
    }
  }
}
// Terrain Generation Starter
// Adam Abouelela
// March 11, 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let w = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNERS);
}

function draw() {
  background(220);
  drawRange(0);
}

function keyPressed(){
  if (keyCode === LEFT_ARROW){
    w--;
    if (w<1){w=1;}}
  else if (keyCode === RIGHT_ARROW){w++;}
}

function drawRange(t){
  fill(0);
  for (let x = 0; x < width; x+=w){
    let h = map(noise(t), 0, 1, height*0.8, height*0.2);
    rect(x, height, x+w, height-h);
    t += 0.01;
  }
}
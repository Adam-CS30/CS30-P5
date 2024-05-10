function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(1);
}

let g = 220

function draw() {
  g = 220
  background(g);
  print(frameCount);
}

function keyPressed(){
  g=0;
}
// Gradient Background + Nested loops
// Adam Abouelela
// Feb 29, 2024
// Creating a gradient + drawing with nested loops

let rectHeight = 1;
let spacing = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(220);
  gradientBackground();
  nestedLoops()
}

function gradientBackground(){
  //use a single loop to draw many rectangles then color them to make a gradient
  let y = 0;
  while (y < height){
    fill(color(map(y,0,mouseY,0,255),map(y,0,height,255,200),map(y,0,height,0,255)));
    rect(0,y,width,rectHeight);
    y+= rectHeight;
  }
}

function nestedLoops(){
  for (let x = 0; x < 100; x+=spacing){
    for (let y = 0; y<100; y+=spacing){
      circle(x,y,10)
    }
  }
}
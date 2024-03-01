// Gradient Background + Nested loops
// Adam Abouelela
// Feb 29, 2024
// Creating a gradient + drawing with nested loops

let rectHeight = 1;
let circleSize = 20;
let spacing = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);
  document.addEventListener("contextmenu", event => event.preventDefault())
  textAlign(CENTER, CENTER);
  noStroke();
}

function draw() {
  background(220);
  gradientBackground();
  nestedLoops();
}

function gradientBackground(){
  //use a single loop to draw many rectangles then color them to make a gradient
  let y = 0;
  while (y < height){
    fill(color(0,map(y,0,height,200,200),map(y,0,height,0,255)));
    rect(0,y,width,rectHeight);
    y+= rectHeight;
  }
}

function circleDistance(x1, y1, x2, y2){
  // given two coords find the distance between them
  let a = abs(x1-x2)
  let b = abs(y1-y2)
  let c = sqrt(pow(a,2) + pow(b,2))
  return c;
}

function nestedLoops(){
  for (let x = 0; x < width; x+=spacing){
    for (let y = 0; y < height; y+=spacing){

      let d = round(circleDistance(x,y, mouseX, mouseY));
      let currentSize = circleSize;
      if (d > 100){fill(0);}
      else {fill(255,0,0); currentSize = circleSize * 1.2;}

      circle(x,y,currentSize);
      fill(255);
      text(d,x,y);
    }
  }
}
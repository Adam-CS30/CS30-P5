// Adding Libraries
// Adam Abouelela
// May 10, 2024
let scribble = new Scribble();

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  strokeWeight(4);
  scribble.scribbleLine(width/2, height/2, mouseX, mouseY);
  scribble. scribbleEllipse(width/2, height/2, mouseX*2-width, mouseX*2-width)
}

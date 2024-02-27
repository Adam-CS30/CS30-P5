// Drawing with Loops 1
// Adam Abouelela
// Feb. 27, 2024
// Using loops + arrays to create some visualizations

let xPos, yPos;

function setup() {
  createCanvas(600, 600);
  ellipseMode(CENTER);
  xPos = [width*0.05, width*0.05, width*0.95, width*0.95]
  yPos = [width*0.05, width*0.95, width*0.05, width*0.95]
}

function draw() {
  background(220);
  cornersAndMouse();
}

function cornersAndMouse(){
  // draw some circles near each of the four corners and connect some lines from there to the mouse position
  fill(255);
  for (i in xPos){
    circle(xPos[i], yPos[i], 20);
    line(xPos[i], yPos[i], mouseX, mouseY);
  }
  circle(mouseX, mouseY, 20)
}

function mousePressed(){
  xPos.push(mouseX)
  yPos.push(mouseY)
}
// Drawing with Loops 1
// Adam Abouelela
// Feb. 27, 2024
// Using loops + arrays to create some visualizations

let xPos, yPos;

function setup() {
  createCanvas(200, 200);
  ellipseMode(CENTER);
  xPos = [];
  yPos = [];
  borderCircles();
  //initWithLoops();
}

function draw() {
  background(220);
  drawTriangles();
  drawCircles();
  noLoop();
}

function borderCircles(){
  for (let x = 0; x < width; x += 50){
    xPos.push(x);
    yPos.push(0);
  }
  for (let y = 0; y < height; y += 50){
    yPos.push(y);
    xPos.push(width);
  }
  for (let x = width; x > 0; x -= 50){
    xPos.push(x);
    yPos.push(height);
  }
  for (let y = height; y > 0; y -= 50){
    yPos.push(y);
    xPos.push(0);
  }
  print(xPos);
  print(yPos);
}

function drawTriangles(){
  fill(255, 0, 0);
  print(xPos);
  print(yPos);
  for (i in xPos){
    if (i < xPos.length - 1){
      triangle(xPos[i], yPos[i], xPos[i+1], yPos[i+1], mouseX, mouseY)
    }
    else {triangle(xPos[i], yPos[i], xPos[i+1], yPos[i+1], mouseX, mouseY)}
  }
}

function initWithLoops(){
  // lay down initial circles with loops
  for (let x = 10; x < width; x += 20){
    xPos.push(x);
    yPos.push(height/2);
  }
}

function drawCircles(){
  // draw some circles near each of the four corners and connect some lines from there to the mouse position
  fill(0);
  for (i in xPos){
    circle(xPos[i], yPos[i], 20);
    line(xPos[i], yPos[i], mouseX, mouseY);
  }
  fill(255);
  circle(mouseX, mouseY, 10)
}

function mousePressed(){
  xPos.push(mouseX)
  yPos.push(mouseY)
}
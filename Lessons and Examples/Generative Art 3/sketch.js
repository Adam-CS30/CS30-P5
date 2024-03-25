// Generative Art 3 (Line Repetition)
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

function setup() {
  createCanvas(windowWidth,windowHeight);
  background(220);
  stroke(0,80)
  noLoop();
}

function draw() {
  for (let i = 0; i < 500; i++){randomElement(random(50,100));}
}

function randomElement(currentL){
  push();
  translate(width/2,height/2);
  rotate(random(-PI,PI));
  while (currentL>5){
    rotate(random(-PI/4,PI/4));
    line(0,0,0,currentL);
    translate(0,currentL);
    currentL = currentL*0.75;
  }
  pop();
}
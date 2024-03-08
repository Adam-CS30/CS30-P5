// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let t = 0;
let posX = 320;

function setup() {
  createCanvas(600, 600);
  ellipseMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(220);
  let r = noise(t);
  ring(r);
  block(r);
  t += 0.01;
}

function ring(r){
  r = map(r,0,1,40,100)
  strokeWeight(8);
  fill(220);
  stroke(150,150,200);
  circle(150, 150, r);
  strokeWeight(1);
  stroke(0);
}

function block(r){
  r = map(r,0,1,1,5);
  posX += r;
  fill(240,100,150);
  if (posX>610){posX=320}
  rect(posX,150,20,50);
}
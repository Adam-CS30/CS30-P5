// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let t = 0;
let posX;

function setup() {
  createCanvas(700, 700);
  ellipseMode(CENTER);
  rectMode(CENTER);
}

function draw() {
  background(220);
  let n = noise(t);
  borders();
  ring(n);
  block(n);
  colors(n);
  t += 0.01;
}

function borders(){
  line(0,height/2,width,height/2);
  line(width/2,0,width/2,height/2);
}

function ring(diameter){
  diameter = map(diameter,0,1,40,200)
  strokeWeight(10);
  fill(220);
  stroke(150,150,200);
  circle(width/4, height/4, diameter);
  strokeWeight(1);
  stroke(0);
}

function block(speed){
  speed = map(speed,0,1,0,10);
  posX += speed;
  fill(240,100,150);
  if (posX>width+10 || isNaN(posX)){posX=width/2+10}
  rect(posX,height/4,20,50);
}

function colors(intensity){
  intensity = map(intensity,0,1,0,255)
  strokeWeight(30);
  stroke(intensity,0,0);
  line(width/5, height*3/4, width*2/5, height*3/4);
  stroke(intensity,intensity,0);
  line(width*2/5, height*3/4, width*3/5, height*3/4);
  stroke(intensity,intensity,intensity);
  line(width*3/5, height*3/4, width*4/5, height*3/4);
  strokeWeight(1);
  stroke(0);
}
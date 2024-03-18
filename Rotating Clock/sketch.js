// Rotating Clock
// Adam ABouelela
// March 18, 2024
// Draw an animated clock


function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  translate(width/2,height/2);
  clockFace();
  for (let i = 0; i<60; i++){
    if (i % 5 === 0){
      strokeWeight(4);
      line(240,0,270,0);
      strokeWeight(1);
    }
    else {line(250,0,270,0);}
    rotate(6);}
}

function clockFace(){
  fill(220);
  strokeWeight(5);
  ellipse(0,0,600);
  fill(0);
  ellipse(0,0,5);
  strokeWeight(1);
}
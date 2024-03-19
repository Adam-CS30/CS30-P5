// Rotating Clock
// Adam ABouelela
// March 18, 2024
// Draw an animated clock


function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  angleMode(DEGREES);
  frameRate(60);
  fill(220);
}

function draw() {
  background(200);
  translate(width/2,height/2);
  clockFace();
  secondHand();
  minuteHand();
  hourHand();
  print(frameCount)
}

function clockFace(){
  push();
  // Draw the clock face.
  strokeWeight(5);
  ellipse(0,0,600);
  strokeWeight(1);

  // Draw the tick lines.
  for (let i = 0; i<60; i++){
    if (i % 5 === 0){
      strokeWeight(3);
      line(250,0,280,0);
      strokeWeight(1);
    }
    else {line(260,0,280,0);}
    rotate(6);}
  pop();
}

function hourHand(){
  push();
  strokeWeight(10);
  rotate(frameCount/(3600*10));
  line(0,0,0,-220)
  pop();
}

function minuteHand(){
  push();
  strokeWeight(5);
  rotate(frameCount/600);
  line(0,0,0,-250)
  pop();
}

function secondHand(){
  strokeWeight(3);
  push();
  rotate(frameCount/10);
  line(0,0,0,-280)
  pop();
}
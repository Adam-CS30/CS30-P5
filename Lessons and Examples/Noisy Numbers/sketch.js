// Noisy Numbers
// Adam Abouelela
// March 7, 2024
// A look at randomness: uniform distribution vs perlin noise

let segmentLength = 3;
let ballY = 500; let ySpeed;
let ballTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  segmentLine();
  moveBall();
}

function segmentLine(){
  strokeWeight(15);
  let x = 0;
  let greyTime = 0;

  while (x < width){
    // random()
    let greyValue = random(0,255);

    // perlin noise()
    greyValue = noise(greyTime);
    greyValue = map(greyValue, 0, 1, 0, 255);
    greyTime += 0.08;

    stroke(greyValue);
    line(x, height/2, x+segmentLength, height/2);
    x+= segmentLength;
  }
}

function moveBall(){
  strokeWeight(1); stroke(0);
  ySpeed = random(-20,20);

  ySpeed = noise(ballTime);
  print(ySpeed);
  ySpeed = map(ySpeed,0,1,-5,5);
  ballTime += 0.1;

  ballY += ySpeed;
  circle(width*0.7, ballY, 30)
}
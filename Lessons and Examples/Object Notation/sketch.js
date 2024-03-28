// Object Notation
// Adam Abouelela
// March 28, 2024
// Look at Object Notation

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  spawnBall(mouseX,mouseY);
}

function spawnBall(initialX, initialY){
  // create a ball object and store it in the array
  let ball = {
    x: initialX,
    y: initialY,
    radius: 30,
    xSpeed: random(-5,5),
    ySpeed: random(-5,5)
  };
  ballArray.push(ball);
}

function draw() {
  background(220);
  for (let b of ballArray){
    b.x += b.xSpeed
    b.y += b.ySpeed
    circle(b.x,b.y,b.radius);
  }
}

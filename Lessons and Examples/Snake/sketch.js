// Snake Game
// Adam ABouelela
// March 22, 2024
// Replicate the original snake game

let x = [], y = [], speed = 1, segments = 3, directionX = 20, directionY = 0, dead = false, size = 20;

function setup() {
  createCanvas(600, 600);
  noStroke();
  rectMode(CENTER);
  frameRate(speed);
  x.push(width/2 - size);
  x.push(width/2);
  x.push(width/2 + size);
  y.push(height/2);
  y.push(height/2);
  y.push(height/2);
}

function draw() {
  background(50);
  updateBody();
  snake();
}

function snake(){
  fill(210);
  for (let i = 0; i < segments; i++){
    if (i === 0){
      fill(255,0,0);
      square(x[i],y[i],size-2);
    }
    else {square(x[i],y[i],size-2);}
    fill(210)
  }
}

function updateBody(){
  x.push(x[segments-1] + directionX);
  y.push(y[segments-1]  + directionY);
  x.shift()
  y.shift()
}

function keyPressed(){
  if (keyCode === LEFT_ARROW && directionX === 0){directionX = -20; directionY = 0;}
  else if (keyCode === RIGHT_ARROW && directionX === 0){directionX = 20; directionY = 0;}
  else if (keyCode === UP_ARROW && directionY === 0){directionX = 0; directionY = -20;}
  else if (keyCode === DOWN_ARROW && directionY === 0){directionX = 0; directionY = 20;}
}
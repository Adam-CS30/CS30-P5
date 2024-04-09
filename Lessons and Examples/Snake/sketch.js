// Snake Game
// Adam ABouelela
// March 22, 2024
// Replicate the original snake game

let x = [], y = [], speed = 1, segments = 5, heading = 0, tempDirectionX = 20, tempDirectionY = 0, dead = false, size = 20;

function setup() {
  createCanvas(600, 600);
  noStroke();
  //rectMode(CENTER);
  frameRate(speed);
  for (let i = 0; i < segments; i++){
    if (i < (segments-1)/2){x.push(width/2 - size*(((segments-1)/2)-i));}
    else if (i === (segments-1)/2){x.push(width/2);}
    else{x.push(width/2 + size*((segments-1)/2-(segments-(i+1))));}
    y.push(height/2);
  }
}

function draw() {
  background(50);
  updateBody();
  snake();
}

function snake(){
  fill(210);
  // The snake is drawn from tail to head
  for (let i = 0; i < segments; i++){
    if (i === 0){
      triangle(x[i]+1, y)
    }
    else if (i === x.length-1){
      fill(255,0,0);
      square(x[i]+1,y[i]+1,size-2);
    }
    else {square(x[i]+1,y[i]+1,size-2);}
    fill(210)
  }
}

function updateBody(){
  if (tempDirectionX == 0){
    if (tempDirectionY == 20){heading = 0}
    else{heading = 2}
  }
  else{
    if (tempDirectionX == 20){heading = 1}
    else{heading = 3}
  }

  x.push(x[segments-1] + tempDirectionX);
  y.push(y[segments-1]  + tempDirectionY);
  x.shift()
  y.shift()
}

function keyPressed(){
  if (keyCode === LEFT_ARROW && (tempDirectionX !== -20 && heading !== 1)){tempDirectionX = -20; tempDirectionY = 0;}
  else if (keyCode === RIGHT_ARROW && (tempDirectionX !== 20 && heading !== 3)){tempDirectionX = 20; tempDirectionY = 0;}
  else if (keyCode === UP_ARROW && (tempDirectionY !== -20 && heading !== 2)){tempDirectionX = 0; tempDirectionY = -20;}
  else if (keyCode === DOWN_ARROW && (tempDirectionY !== 20 && heading !== 0)){tempDirectionX = 0; tempDirectionY = 20;}
}
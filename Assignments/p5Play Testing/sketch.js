// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player, paused = false;

function setup() {
  player = new Player(50,50)
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  if (!paused){player.determineMovement(); player.update();}
    player.display();
  if (paused){pauseScreen();}
}

function pauseScreen(){
  fill(30,180);
  rect(0,0,width,height);
}

function keyPressed(){
  if (key === ' ' && player.dashes > 0) {player.dash();}

  else if (keyCode === ESCAPE){
    print('hi')
    if (paused){paused = false}
    else{paused = true}
  }
}

class Player{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]}
    this.dashing = false;
	this.stationary = true;
    this.facing = 1;
    this.movespeed = 0.8;
    this.dashes = 1;
    this.alive = true;
  }

  determineMovement(){
    this.stationary = true;
    for (let action in this.keybinds){
      for (let keyBind of this.keybinds[action]){
        if (keyIsDown(keyBind)){
          this.stationary = false;
          this.move(action);
          break;
        }
      }
    }
  }

  dash(){
    this.dashing = true;
    this.dashes--;
    this.movespeed = 35;
    
    if (this.stationary){
      if (this.facing === 0){this.vel.x -= this.movespeed;}
      else {this.vel.x += this.movespeed;}
    }
  }

  move(action){
    if (action === 'up') {this.vel.y -= this.movespeed;}
    if (action === 'down') {this.vel.y += this.movespeed;}
	if (action === 'left') {this.vel.x -= this.movespeed; this.facing = 0;}
    if (action === 'right') {this.vel.x += this.movespeed; this.facing = 1;}
  }

  update(){
    //this.vel.add(this.acc);
    this.pos.add(this.vel);

    if (abs(this.vel.x) > 0.01){this.vel.x *= 0.75;}
    else{this.vel.x = 0;}
    if (abs(this.vel.y) > 0.01){this.vel.y *= 0.75;}
    else{this.vel.y = 0;}

    this.dashes += 1/120

    this.dashing = false;
    this.movespeed = 0.8;
  }

  display(){
    noStroke();
    fill(100, 200, 100);
    rect(this.pos.x, this.pos.y, 20, 40);
  }
}

class Terrain{
  constructor(x, y, sizeX, sizeY){
    this.x = x; this.y = y; this.sX = sizeX; this.sY = sizeY;

  }
}
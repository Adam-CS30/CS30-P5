// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player, screen1, paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(50,50);
  screen1 = [new NeutralTerrain(width/4, height/2, width/2, 20)];
}

function draw() {
  background(220);

  if (!paused){updateAll();}
  displayAll();
  if (paused){pauseScreen();}
}

function updateAll(){
  player.determineMovement();
  player.update();
  for (let terrain of screen1){terrain.update();}
}

function displayAll(){
  player.display();
  for (let terrain of screen1){terrain.display();}
}

function pauseScreen(){
  fill(30,180);
  rect(0,0,width,height);
}

function keyPressed(){
  if (key === ' ' && player.dashes > 0) {player.dash();}

  else if (keyCode === ESCAPE){
    print('hi')
    if (paused){paused = false;}
    else{paused = true;}
  }
}

class Player{
  // 9 x 18 hitbox
  constructor(x, y){
    this.pos = createVector(x, y);
    this.oldPos = createVector(x, y);
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
    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;
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
    rect(this.pos.x, this.pos.y, 9, 17);
  }
}

class Terrain{
  constructor(x, y, sizeX, sizeY){
    this.x = x; this.y = y; this.sX = sizeX; this.sY = sizeY;
    this.collidable = true;
    this.touchable = true;
  }

  checkCollision(){
    if (this.x < player.pos.x && player.pos.x < this.x + this.sX &&
       this.y < player.pos.y && player.pos.y < this.y + this.sY) {this.onCollision();}
  }

  update(){
    if (this.collidable){this.checkCollision();}
  }

  display(){
    noStroke();
    fill(200, 200, 100);
    rect(this.x, this.y, this.sX, this.sY);
  }
}

class NeutralTerrain extends Terrain{
  constructor(x, y, sizeX, sizeY){
    super(x, y, sizeX, sizeY); 
  }

  onCollision(){
    print('Collision');
    if(false){}
  }
}
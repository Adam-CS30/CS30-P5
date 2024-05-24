// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player, screen1, scaling = 2.7, paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(2, height/(2*scaling));
  screen1 = [new NeutralTerrain(0, 5, 9, 9), new NeutralTerrain(2, 4, 1, 1), new NeutralTerrain(4, 4, 1, 1)];
}

function draw() {
  background(220);

  if (!paused){updateAll();}
  displayAll();
  if (paused){pauseScreen();}
}

function updateAll(){
  player.update();
  for (let terrain of screen1){terrain.update();}
}

function displayAll(){
  push();
  scale(scaling);
  player.display();
  for (let terrain of screen1){terrain.display();}
  pop();
}

function pauseScreen(){
  fill(30,180);
  rect(0,0,width,height);
}

function keyPressed(){
  if (keyCode === ESCAPE){
    print('pause triggered');
    if (paused){paused = false;}
    else{paused = true;}
  }

  else{player.checkAbility();}
}

class Player{
  // 9 x 17 hitbox
  constructor(x, y){
    this.realPos = createVector(x, y);
    this.oldPos = createVector(x, y);
    this.pos = createVector(x, y);
    this.moveVel = createVector(0, 0);
    this.naturalVel = createVector(0, 0);

    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]};
    this.specialKeys = {'dash':['j', 'e'], 'jump':['k', ' ']};
    this.toMove = [];

    this.triggerJump = false;
    this.triggerDash = false;
    this.dashing = false;
    this.grounded = false;

	  this.stationary = true;
    this.alive = true;

    this.regularMovespeed = 1;
    this.facing = 1;
    this.dashes = 20;
  }

  checkMovement(){
    for (let action in this.keybinds){
      for (let keyBind of this.keybinds[action]){
        if (keyIsDown(keyBind)){
          this.toMove.push(action);
          break;
        }
      }
    }

    if (this.toMove.indexOf('left') !== -1 && this.toMove.indexOf('right') !== -1){
      this.toMove.splice(this.toMove.indexOf('left'), 1);
      this.toMove.splice(this.toMove.indexOf('right'), 1);
    }

    if (this.toMove.indexOf('up') !== -1 && this.toMove.indexOf('down') !== -1){
      this.toMove.splice(this.toMove.indexOf('up'), 1);
      this.toMove.splice(this.toMove.indexOf('down'), 1);
    }
  }

  checkAbility(){
    for (let action in this.specialKeys){
      for (let keyBind of this.specialKeys[action]){
        if (key === keyBind){
          if (action === 'dash' && this.dashes > 0){this.triggerDash = true; this.dash();}
          else if (action === 'jump' && this.grounded){this.grounded = false; this.jump();}
          break;
        }
      }
    }
  }

  dash(){
    print('dash');
    this.dashing = true;
    this.dashes--;
    this.movespeed = this.regularMovespeed*30;
    
    this.checkMovement();
    print(this.toMove)
    if (this.toMove.length === 1){this.movespeed = this.regularMovespeed*30;}
    else if (this.toMove.length === 2){this.movespeed = sqrt(0.5*pow(this.regularMovespeed*30,2));}

    else{
      if (this.facing === 0){this.moveVel.x -= this.movespeed;}
      else {this.moveVel.x += this.movespeed;}
    }
  }

  jump(){
    print('jump');
    this.naturalVel.y -= 6;
  }

  move(){
    for (let action of this.toMove){
      if (action === 'right') {this.moveVel.x += this.movespeed; this.facing = 1;}
      else if (action === 'left') {this.moveVel.x -= this.movespeed; this.facing = 0;}
      else if (action === 'up' && this.triggerDash) {this.moveVel.y -= this.movespeed;}
      else if (action === 'down' && this.triggerDash) {this.moveVel.y += this.movespeed;}
    }
  }

  modifyPosition(){
    this.realPos.add(this.moveVel);
    this.realPos.add(this.naturalVel);
    
    if (this.realPos.y > 190){this.grounded = true; this.realPos.y = 190;}
    if (this.grounded || this.dashing){this.naturalVel.y = 0;}

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = round(this.realPos.x);
    this.pos.y = round(this.realPos.y);
  }

  update(){
    if (!this.triggerDash){this.checkMovement();}
    this.move();
    this.modifyPosition();


    if (!this.dashing){
      if (abs(this.moveVel.x) > 0.03){this.moveVel.x *= 0.5;}
      else{this.moveVel.x = 0;}
      if (abs(this.moveVel.y) > 0.03){this.moveVel.y *= 0.5;}
      else{this.moveVel.y = 0;}
      if (! this.grounded){this.naturalVel.y += 0.35;}
    }

    if (abs(this.moveVel.x) > 0 || abs(this.moveVel.y) > 0){this.stationary = false;}
    else{this.stationary = true;}

    this.triggerDash = false;
    this.dashing = false;
    this.toMove = [];
    this.movespeed = this.regularMovespeed;
    if (this.pos.y < 137){print(this.pos.y)}
  }

  display(){
    noStroke();
    fill(100, 200, 100);
    rect(this.realPos.x, this.realPos.y, 9, 17);
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
    player.dashes = 2;
    if(false){}
  }
}
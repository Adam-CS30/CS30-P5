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
  //background(220);

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

function keyPressed(){ //runs at the end of the frame in the time between this frame and the next (essentially an inbetween frame...)
  if (keyCode === ESCAPE){
    print('pause triggered');
    if (paused){paused = false;}
    else{paused = true;}
    background(220)
  }

  else{player.checkAbility();}
}

class Player{
  // 9 x 17 hitbox
  constructor(x, y){
    this.realPos = createVector(x, y); // Current position of character.
    this.oldPos = createVector(x, y); // Position of character last frame.
    this.pos = createVector(x, y); // Rounded position of character.

    this.controlledVel = createVector(0, 0); // This velocity is only affected by walking/running.
    this.naturalVel = createVector(0, 0); // This velocity is only affected by jumping/gravity.
    this.dashVel = createVector(0,0); // This velocity is only active when dashing.

    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]};
    this.specialKeys = {'dash':['j', 'e'], 'jump':['k', ' ']};
    this.toMove = []; // A list that containins the directions that the player wishes to move each frame.

    this.triggerJump = false;
    this.triggerDash = false;
    this.dashing = false;
    this.grounded = false;

	  this.stationary = true;
    this.alive = true; // Self-explanatory

    this.dashTime = -999; // # of frames since the last dash was triggered.
    this.dashDuration = 12 // # of frames that a dash lasts.
    this.regularMovespeed = 1; // Player's regular walkspeed / movespeed.
    this.facing = 1; // Direcrtion that the player is facing (left = -1 and right = 1).
    this.hangtime = 3; // # of frames before gravity affects the player midair.
    this.dashes = 20;
  }

  checkMovement(){
    this.toMove = [];

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
    this.dashTime = frameCount;
    this.dashes--;
    this.movespeed = this.regularMovespeed*7;
    this.dashVel = createVector(0,0);
    this.naturalVel = createVector(0,0);
    this.controlledVel = createVector(0,0);
    
    // Position is actually updated on the next frame;
    this.checkMovement(); // It rechecks the movement keys in case the user pressed a directional key really quickly in the time between frames.
    if (this.toMove.length === 1){this.movespeed = this.movespeed;}
    else if (this.toMove.length === 2){this.movespeed = sqrt(pow(this.movespeed,2)/2);}
    else{this.controlledVel.x += this.facing * this.movespeed;}
  }

  jump(){
    print('jump');
    this.naturalVel.y -= 6;
  }

  modifyVelocity(){
    for (let action of this.toMove){
      if (action === 'right') {this.controlledVel.x += this.movespeed; this.facing = 1;}
      else if (action === 'left') {this.controlledVel.x -= this.movespeed; this.facing = -1;}
      else if (action === 'up' && this.triggerDash) {this.controlledVel.y -= this.movespeed;}
      else if (action === 'down' && this.triggerDash) {this.controlledVel.y += this.movespeed;}
    }
  }

  modifyPosition(){
    if (this.grounded){this.naturalVel.y = 0;}
    this.realPos.add(this.controlledVel);
    this.realPos.add(this.naturalVel);
    
    if (this.realPos.y >= 190){this.grounded = true; this.realPos.y = 190;}
    else{this.grounded = false;}

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = round(this.realPos.x);
    this.pos.y = round(this.realPos.y);
  }

  update(){
    // dash deceleration
    if (!this.triggerDash){this.checkMovement();}
    if (this.triggerDash || !this.dashing){this.modifyVelocity();}
    this.modifyPosition();

    if (!this.dashing){
      if (abs(this.controlledVel.x) > 0.03){this.controlledVel.x *= 0.5;}
      else{this.controlledVel.x = 0;}
      if (abs(this.controlledVel.y) > 0.03){this.controlledVel.y *= 0.5;}
      else{this.controlledVel.y = 0;}

      if (! this.grounded){
        if (this.naturalVel.y < 8){this.naturalVel.y += 0.3;}
        else{this.naturalVel.y = 8;}
      }
    }

    if (abs(this.controlledVel.x) > 0 || abs(this.controlledVel.y) > 0){this.stationary = false;}
    else{this.stationary = true;}

    if (this.dashing && frameCount - this.dashTime === this.dashDuration){this.dashing = false; this.controlledVel.x = 0; this.controlledVel.y = 0; this.dashVel.y = 0;}
    this.triggerDash = false;
    this.movespeed = this.regularMovespeed;
    if (this.realPos.y < 128){print(this.dashing);print('pos:', this.realPos.y); print('vel:', this.naturalVel.y);}
  }

  display(){
    noStroke();
    if (this.triggerDash){fill(170,220,255)}
    else if (this.dashing){fill(50,180,255)}
    else{fill(100,200,100);}
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
// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player, screen1, scaling = 3.5, paused = false;

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
  for (let terrain of screen1){terrain.display();}
  player.display();
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
    this.airborneTime = -999;
    this.dashDuration = 12; // # of frames that a dash lasts.
    this.regularMovespeed = 1.5; // Player's regular walkspeed / movespeed.
    this.facing = 1; // Direcrtion that the player is facing (left = -1 and right = 1).
    this.hangtime = 4; // # of frames before gravity affects the player midair.
    this.dashes = 20; // # of dashes the player normally has.
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
          else if (action === 'jump' && this.grounded && !this.triggerDash){this.grounded = false; this.jump();}
          break;
        }
      }
    }
  }

  dash(){
    if (frameCount - this.dashTime < this.hangtime){return;} // Can't dash again if you already dashed within the last few frames.

    print('dash');
    this.dashing = true;
    this.dashTime = frameCount+1;
    this.dashes--;

    // Reset all velocities before dashing.
    this.naturalVel = createVector(0,0);
    this.controlledVel = createVector(0,0);
    
    // Position is actually updated on the next frame;
    this.checkMovement(); // It rechecks the movement keys in case the user pressed a directional key really quickly in the time between frames.
    if (this.toMove.length === 1){this.movespeed = this.regularMovespeed*6;}
    else if (this.toMove.length === 2){this.movespeed = sqrt(pow(this.regularMovespeed*6,2)/2);}
    else{this.controlledVel.x += this.facing * this.regularMovespeed*6;}
    //this.modifyVelocity();
  }

  jump(){
    print('jump');
    this.naturalVel.y -= 6;
    this.dashing = false;

    print(this.controlledVel.x);

    /* If dash speed was converted and the dash was a diagonal (it can't realistically be an upwards diagonal) then vertical
       dash speed is also converted to horizontal speed at a lower rate, but the jump power is weaker. */
    if (this.controlledVel.x !== 0 && this.controlledVel.y !== 0) {
      if (this.dashTime < 5){} // work on this

      this.naturalVel.x += this.facing*abs(this.controlledVel.y);
      this.naturalVel.y *= 0.9;
      print(this.controlledVel.y)
      this.controlledVel.y = 0;
    }

    this.naturalVel.x += this.controlledVel.x * 1.2;
    
    print(this.naturalVel.x, this.naturalVel.y)
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
    
    // Grounded state is checked at the end of the frame. airborneTime is set on the frame at which the player is no longer grounded.
    if (this.realPos.y >= 190){this.grounded = true; this.realPos.y = 190; this.airborneTime = frameCount;}
    else{this.grounded = false;}

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = round(this.realPos.x);
    this.pos.y = round(this.realPos.y);
  }

  update(){
    // airborne time
    if (!this.triggerDash){this.checkMovement();}
    if (!this.dashing || this.triggerDash){this.modifyVelocity();}

    // Movement decceleration and gravitational acceleration.
    if (!this.dashing){
      if (abs(this.controlledVel.x) > 0.03){this.controlledVel.x *= 0.5;}
      else{this.controlledVel.x = 0;}
      if (abs(this.controlledVel.y) > 0.03){this.controlledVel.y *= 0.5;}
      else{this.controlledVel.y = 0;}
      if (abs(this.naturalVel.x) > 0.03){this.naturalVel.x *= 0.95;}
      else{this.naturalVel.x = 0;}

      if (this.grounded) {this.naturalVel.x = 0;}

      if ((!this.grounded && abs(this.naturalVel.y) > 0.00001) || (frameCount - this.dashTime >= this.dashDuration + this.hangtime && frameCount - this.airborneTime > this.hangtime)){
        //print(frameCount - this.airborneTime);
        if (this.naturalVel.y < 8){this.naturalVel.y += 0.3;}
        if (this.naturalVel.y > 8){this.naturalVel.y = 8;}
      }
    }
    // Dash deceleration
    else{
      this.controlledVel.x *= 0.95;
      this.controlledVel.y *= 0.95;
    }

    if (this.dashing && frameCount - this.dashTime === this.dashDuration){this.dashing = false; this.controlledVel.x = 0; this.controlledVel.y = 0;}
    this.triggerDash = false;
    this.movespeed = this.regularMovespeed;

    this.modifyPosition();

    if (this.realPos.y < 128){print(this.dashing); print('pos:', this.realPos.y); print('vel:', this.naturalVel.y + this.controlledVel.y);}
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
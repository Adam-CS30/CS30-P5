// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player, screen1, scaling = 3.5, paused = false;

function setup() {
  createCanvas(windowWidth, windowHeight); //(320x180 real screen)
  //print(width)
  //frameRate(2)
  player = new Player(2, height/(2*scaling));
  screen1 = [new NeutralTerrain(100, 185, 8, 8), new NeutralTerrain(2, 4, 1, 1), new NeutralTerrain(4, 4, 1, 1)];
}

function draw() {
  background(20, 40, 60);

  if (!paused){updateAll();}
  displayAll();
  if (paused){pauseScreen();}
}

// All calculations for the player, terrain, camera, and other entities are done here.
function updateAll(){
  player.update();
  for (let terrain of screen1){terrain.update();}
}

// Displays all enities and terrain using the camera.
function displayAll(){
  push();
  scale(scaling);
  for (let terrain of screen1){terrain.display();}
  player.display(); // Player displayed last so they are the frontmost object.
  pop();
}

function pauseScreen(){
  fill(30,180);
  rect(0,0,width,height);
}

function keyPressed(){ //runs at the end of the frame in the time between this frame and the next (essentially an in-between frame)
  // Checks first if it was a pause/unpause.
  if (keyCode === ESCAPE){
    print('pause triggered');
    paused = !paused; // Flips the pause state.
    background(220)
  }
  // If it's not a pause/unpause then it checks if a movement ability was triggered.
  else{player.checkAbility();}
}

class Player{
  // 8 x 12 hitbox
  constructor(x, y){
    this.realPos = createVector(x, y); // Current position of character.
    this.oldPos = createVector(x, y); // Position of character last frame.
    this.pos = createVector(x, y); // Rounded position of character.
    this.sX = 8;
    this.sY = 11;

    // Two velocity vectors are implemented. Added together, they make up the total velocity of the player. They both have seperate ways in which they are accelerated/deccelerated.
    this.controlledVel = createVector(0, 0); // This velocity is only affected by dashing and running. This velocity is has a sharp rate of decceleration.
    this.naturalVel = createVector(0, 0); // This velocity is only affected by jumping and gravity. This velocity only has a value when the player is midair and has a lower rate of decceleration.

    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]}; // Keys the player can press for directional movement.
    this.specialKeys = {'dash':['j', 'e'], 'jump':['k', ' ']}; // Keys that the player can press for special movement.
    this.toMove = []; // A list that containins the directions that the player wishes to move each frame.

    this.triggerDash = false; // Is true when a dash is triggered and is reset to false near the end of every frame.
    this.dashing = false; // Whether the player is currently dashing.
    this.grounded = false; // Whether the player is on the ground.

	  this.stationary = true;
    this.alive = true; // Self-explanatory

    this.dashTime = -999; // The frame at which the last dash was triggered.
    this.airborneTime = -999; // The frame at which the player is no longer grounded.
    this.dashDuration = 12; // # of frames that a dash lasts.
    this.regularMovespeed = 1.5; // Player's regular walkspeed / movespeed.
    this.movespeed = 1.5; // Player's current walkspeed / movespeed.
    this.facing = 1; // Direction that the player is facing (left = -1 and right = 1).
    this.hangtime = 4; // # of frames before gravity affects the player midair.
    this.dashes = 2; // # of dashes the player normally has.
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
          if (action === 'dash' && this.dashes > 0 && frameCount - this.dashTime >= this.hangtime-1){this.dash();}
          else if (action === 'jump' && this.grounded){this.jump();}
          break;
        }
      }
    }
  }

  // Keep in mind the dash() and jump() can only trigger at end of a frame, after the character has been already displayed, but before the calculations of the next frame. They sort of trigger in between frames.
  // This function 
  dash(){
    print('dash');
    this.dashing = true;
    this.triggerDash = true;
    this.dashTime = frameCount+1; // 
    this.dashes--;
    this.movespeed = this.regularMovespeed*6;

    // Reset all velocities before dashing.
    this.naturalVel = createVector(0,0);
    this.controlledVel = createVector(0,0);
    
    // Position is actually updated on the next frame;
    this.checkMovement(); // It rechecks the movement keys in case the user pressed a directional key really quickly in the time between frames.
    if (this.toMove.length === 2){this.movespeed = sqrt(pow(this.movespeed,2)/2);}
    else if (this.toMove.length === 0){this.controlledVel.x += this.facing * this.movespeed;}
    this.move();
  }

  jump(){
    // sometimes doesnt detect diagonal
    print('jump');
    this.grounded = false;
    this.naturalVel.y -= 6;

    // If a dash was interrupted in the first half of the dash, the horizontal velocity converted is based off the initial horizontal velocity of the dash.
    // This is to make getting the maximum speed from a dash interruption easier/more consistent.
    if (frameCount - this.dashTime < 6 && this.controlledVel.x !== 0){this.controlledVel.x = this.facing * this.movespeed;}

    // If a downwards diagonal dash was interrupted then vertical dash speed is converted into some extra horizontal speed and your original horizontal dash speed is slightly boosted, but the jump power is weaker.
    // You travel approximately 1.3x the distance using a diagonal dash interruption compared to horizontal dashing.
    if (abs(this.controlledVel.x) > 0 && this.controlledVel.y > 0) {
      this.controlledVel.x *= 1.2; // Interrupting a diagonal dash grants you a small boost to your original horizontal speed.
      // This is the same check for if the dash was interrupted in the first half.
      if (frameCount - this.dashTime < 6){this.controlledVel.y = this.facing * this.movespeed;}

      // 'facing' is used to check the direction which vertical speed will be converted to horizontal speed.
      this.naturalVel.x += this.facing * 0.9 * abs(this.controlledVel.y);
      this.naturalVel.y *= 0.85; // Jump power is reduced.
    }

    this.naturalVel.x += this.controlledVel.x;
    this.controlledVel.y = 0;
    this.dashing = false;
    this.movespeed = this.regularMovespeed;
    
    print(this.naturalVel.x, this.naturalVel.y);
  }

  // This function is responsible for directional movement based on player keypresses.
  move(){
    for (let action of this.toMove){
      if (action === 'right') {this.controlledVel.x += this.movespeed; this.facing = 1;}
      else if (action === 'left') {this.controlledVel.x -= this.movespeed; this.facing = -1;}
      else if (action === 'up' && this.triggerDash) {this.controlledVel.y -= this.movespeed;}
      else if (action === 'down' && this.triggerDash) {this.controlledVel.y += this.movespeed;}
    }
  }

  // Applies decceleration and gravitational acceleration based on conditions.
  modifyVelocity(){
    // Acceleration/decceleration applied if player not dashing:
    if (!this.dashing){
      // Horizontal controlled velocity is halfed every frame where player isn't dashing.
      if (abs(this.controlledVel.x) > 0.03){this.controlledVel.x *= 0.5;}
      else{this.controlledVel.x = 0;} // If horizontal controlled velocity is low enough, it's just set to 0.
      if (abs(this.naturalVel.x) > 0.03){this.naturalVel.x *= 0.95;}
      else{this.naturalVel.x = 0;}

      if (this.grounded) {this.naturalVel.x = 0;}

      // if already falling or hangtime is out
      if ((!this.grounded && abs(this.naturalVel.y) > 0.00001) || (frameCount - this.dashTime >= this.dashDuration + this.hangtime && frameCount - this.airborneTime > this.hangtime)){
        //print(frameCount - this.airborneTime);
        if (this.naturalVel.y < 8){this.naturalVel.y += 0.3;}
        if (this.naturalVel.y > 8){this.naturalVel.y = 8;}
      }
    }
    // Acceleration/decceleration applied if player is dashing:
    else{
      this.controlledVel.x *= 0.95;
      this.controlledVel.y *= 0.95;
    }
  }

  modifyPosition(){
    if (this.grounded){this.naturalVel.y = 0;}
    this.realPos.add(this.controlledVel);
    this.realPos.add(this.naturalVel);
    
    // Check collision here
    // Grounded state is checked at the end of the frame. airborneTime is set on the frame at which the player is no longer grounded.
    if (this.realPos.y >= 190){this.grounded = true; this.realPos.y = 190; this.dashes = 2; this.airborneTime = frameCount;}
    else{this.grounded = false;}

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = round(this.realPos.x);
    this.pos.y = round(this.realPos.y);
    this.checkCollision()
  }

  checkCollision(){
    let rayOrigin = 0
    fill(255)
    noStroke()
    rect(mouseX, mouseY, this.sX*scaling, this.sY*scaling);
    stroke(255, 50, 50);
    strokeWeight(3);

    if ((mouseX - this.realPos.x*scaling) * (mouseY - this.realPos.y*scaling) > 0){rayOrigin = 1}
    let offSetX = rayOrigin * this.sX * scaling

    line(this.realPos.x*scaling + offSetX, this.realPos.y*scaling, mouseX + offSetX, mouseY)
    line((this.realPos.x+this.sX)*scaling - offSetX, (this.realPos.y+this.sY)*scaling, mouseX+this.sX*scaling - offSetX, mouseY+this.sY*scaling)
  }

  update(){
    // airborne time
    if (!this.triggerDash){this.checkMovement();}
    if (!this.dashing){this.move();}

    // Movement decceleration and gravitational acceleration are applied as needed.
    this.modifyVelocity()

    if (this.dashing && frameCount - this.dashTime === this.dashDuration){this.dashing = false; this.movespeed = this.regularMovespeed; this.controlledVel.x = 0; this.controlledVel.y = 0;}
    this.triggerDash = false;

    this.modifyPosition();
    //if (this.realPos.y < 128){print(this.dashing); print('pos:', this.realPos.y); print('vel:', this.naturalVel.y + this.controlledVel.y);}
  }

  display(){
    noStroke();
    if (this.dashing){fill(50,180,255);}
    else{fill(100,200,100);}
    rect(this.realPos.x, this.realPos.y, this.sX, this.sY); // real hitbox (fake would be ~10x17)
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


// Collision Function:
function collision(){
  // raycast from old pos (corners) to new pos (corners)
}
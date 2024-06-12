// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player, screens = [], tiledScreens = [], playerSpawns = [], currentScreen = 0, spawnFrame = 0;
let scaling; // How much the entire canvas is scaled.
let paused = false, controlpause = true; // Whether the game is paused and whether controlling the player is paused respectively.
let countedFrames = 0; // Like frameCount but only counts unpaused frames.
const tileSide = 8, tiledWidth = 40, tiledHeight = 22;

function preload(){
  const basePath = "screens/screen"
  for (let i = 0; i <= 0; i++){
    let path = basePath + i.toString() + '.txt';
    print(path)
    loadStrings(path, loadScreens);
  }
}

function setup(){
  if (windowWidth/(tiledWidth*tileSide) < windowHeight/(tiledHeight*tileSide)){scaling = windowWidth/(tiledWidth*tileSide);}
  else{scaling = windowHeight/(tiledHeight*tileSide);}
  scaling -= scaling % (1/8);
  scaling *= 3

  createCanvas(tiledWidth*tileSide*scaling, tiledHeight*tileSide*scaling); //(320x180 real screen)
  //frameRate(2)
  spawnPlayer();
}

function draw(){
  background(20, 40, 60);
  if (frameCount > 30){
    if (!paused){
      countedFrames++;
      if(!controlpause){player.update();}
      else{
        player.spawnRise();
        if (countedFrames - spawnFrame === 20){controlpause = false; player.realPos.y = playerSpawns[currentScreen].y*tileSide;}
      }
    }

    displayAll();
    if (paused){pauseScreen();}
  }
}

// All calculations for the player, terrain, camera, and other entities are done here.
function updateAll(){
  player.update();
  for (let terrain of screens[currentScreen]){terrain.update();}
}

// Displays all enities and terrain using the camera.
function displayAll(){
  push();
  scale(scaling);
  for (let terrain of screens[currentScreen]){terrain.display();}
  player.display(); // Player displayed last so they are the frontmost object.
  pop();
}

function loadScreens(data){
  let screen = [];
  let tiledScreen = [];

  for (let y = 0; y < tiledHeight; y++){
    tiledScreen.push([])
    for (let x = 0; x < tiledWidth; x++){
      tiledScreen[y].push(0)
    }
  }
  
  for (let line of data){
    let type = line.substring(0,line.indexOf(':')); // the type of tile.
    line = line.replaceAll(" ", "")
    line.substring(line.indexOf('(')); // rest of the line excluding spaces.

    switch (type){
      case 'spawn':
        playerSpawns.push(createVector(int(line.substring(1+line.indexOf('('), line.indexOf(','))), int(line.substring(1+line.indexOf(','), line.indexOf(')')))));
        print(playerSpawns)
        break;
      case 'neutral':
        type = 1;
        // for loop to go through entire line
        let i = 0;
        while (line.indexOf(')', i+1) !== -1){
          let currentItem = line.substring(line.indexOf('(', i+1)+1, line.indexOf(')', i+1));
          
          let x = int(currentItem.substring(0, currentItem.indexOf(',')));
          let y = int(currentItem.substring(1+currentItem.indexOf(','), currentItem.indexOf(',',currentItem.indexOf(',')+1)));
          let sX = int(currentItem.substring(1+currentItem.indexOf(',',currentItem.indexOf(',')+1), currentItem.indexOf(',',currentItem.indexOf(',',currentItem.indexOf(',')+1)+1)));
          let sY = int(currentItem.substring(1+currentItem.indexOf(',',currentItem.indexOf(',',currentItem.indexOf(',')+1)+1)));

          screen.push(new NeutralTerrain(x, y, sX, sY));

          for (let h = sY; h > 0; h--){
            for (let w = sX; w > 0; w--){
              tiledScreen[y+h-1][x+w-1] = type;
            }
          }

          i = line.indexOf(')', i+1);
        }
        break;
      case 'spikes':
        type = 2;
        // for loop to go through entire line
        break;

    }
  }
  
  screens.push(screen);
  tiledScreens.push(tiledScreen);
  print(screen);
  print(tiledScreen);
}

function pauseScreen(){
  fill(30,180);
  rect(0,0,width,height);
}

function spawnPlayer(){
  spawnFrame = countedFrames;
  player = new Player(playerSpawns[currentScreen].x*tileSide, tiledHeight*tileSide);
}

function keyPressed(){ //runs at the end of the frame in the time between this frame and the next (essentially an in-between frame)
  // Checks first if it was a pause/unpause.
  if (keyCode === ESCAPE){
    print('pause triggered');
    paused = !paused; // Flips the pause state.
    if (paused){controlpause = true;}
    background(220)
  }
  // If it's not a pause/unpause then it checks if a movement ability was triggered.
  else if (!controlpause){player.checkAbility();}
}

class Player{
  // 8 x 12 hitbox
  constructor(x, y){
    this.realPos = createVector(x, y); // Current position of character.
    this.oldReal = createVector(x,y)
    this.oldPos = createVector(x, y); // Position of character last frame.
    this.pos = createVector(x, y); // Rounded position of character.
    this.sX = 9;
    this.sY = 7;

    // Two velocity vectors are implemented. Added together, they make up the total velocity of the player. They both have seperate ways in which they are accelerated/deccelerated.
    this.controlledVel = createVector(0, 0); // This velocity is only affected by dashing and running. This velocity is has a sharp rate of decceleration.
    this.naturalVel = createVector(0, 0); // This velocity is only affected by jumping and gravity. This velocity only has a value when the player is midair and has a lower rate of decceleration.

    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]}; // Keys the player can press for directional movement.
    this.specialKeys = {'dash':['k', 'e'], 'jump':['j', ' ']}; // Keys that the player can press for special movement.
    this.toMove = []; // A list that containins the directions that the player wishes to move each frame.

    this.triggerDash = false; // Is true when a dash is triggered.
    this.triggerJump = false; // Is true when a jump is triggered.
    this.dashing = false; // Whether the player is currently dashing.
    this.alive = true; // Self-explanatory
    this.state = 0; // The player's current state (airborne = 0, sliding = 1, grounded = 2).

    this.dashTime = -999; // The frame at which the last dash was triggered.
    this.airborneTime = -999; // The frame at which the player is no longer grounded.
    this.dashDuration = 12; // # of frames that a dash lasts.
    this.regularMovespeed = 1; // Player's regular walkspeed / movespeed.
    this.movespeed = this.regularMovespeed; // Player's current walkspeed / movespeed.
    this.facing = 1; // Direction that the player is facing (left = -1 and right = 1).
    this.hangtime = 4; // # of frames before gravity affects the player midair.
    this.regularDashes = 1
    this.dashes = 1; // # of dashes the player normally has.
  }

  spawnRise(){
    this.realPos.y -= (tiledHeight*tileSide - playerSpawns[currentScreen].y*tileSide)/20;
    this.pos.y = round(this.realPos.y);
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
          if (action === 'dash' && this.dashes > 0 && countedFrames - this.dashTime >= this.hangtime-1){this.triggerDash = true;}
          else if (action === 'jump' && this.state > 0){this.triggerJump = true;}
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
    this.dashTime = countedFrames+1; // 
    this.dashes--;
    this.movespeed = this.regularMovespeed*4.8;

    // Reset all velocities before dashing.
    this.naturalVel = createVector(0,0);
    this.controlledVel = createVector(0,0);
    
    if (this.toMove.length === 2){this.movespeed = sqrt(pow(this.movespeed,2)/2);}
    else if (this.toMove.length === 0){this.controlledVel.x += this.facing * this.movespeed;}
    this.move(1);
  }

  jump(){
    print('jump');
    this.state = 0;
    this.naturalVel.y -= this.regularMovespeed*4;

    // If a dash was interrupted in the first half of the dash, the horizontal velocity converted is based off the initial horizontal velocity of the dash.
    // This is to make getting the maximum speed from a dash interruption easier/more consistent.
    if (countedFrames - this.dashTime < 6 && this.controlledVel.x !== 0){this.controlledVel.x = this.facing * (this.movespeed);}

    // This function handles the case of an upwards diagonal dash interruption by slightly decreasing the initial horizontal velocity.
    // It's basically like a horizontal dash interruption but weaker.
    if (this.dashing && this.controlledVel.y < 0 && this.controlledVel.x !== 0){this.controlledVel.x *= 0.8}

    // If a downwards diagonal dash was interrupted then vertical dash speed is converted into some extra horizontal speed and your
    // original horizontal dash speed is slightly boosted, but the jump power is weaker.
    if (abs(this.controlledVel.x) > 0 && this.controlledVel.y > 0) {
      this.controlledVel.x *= 1.25; // Interrupting a diagonal dash grants you a small boost to your original horizontal speed.
      // This is the same check for if the dash was interrupted in the first half.
      if (countedFrames - this.dashTime < 6){this.controlledVel.y = this.facing * this.movespeed;}

      // 'facing' is used to check the direction which vertical speed will be converted to horizontal speed.
      this.naturalVel.x += this.facing * abs(this.controlledVel.y);
      this.naturalVel.y *= 0.9; // Jump power is reduced.
    }

    if (this.dashing){this.naturalVel.x += this.controlledVel.x; this.interrupted = true;}
    else if (this.toMove.length !== 0){this.naturalVel.x += 0.8*this.controlledVel.x; this.interrupted = false;}
    this.controlledVel.y = 0;
    this.dashing = false;
    this.movespeed = this.regularMovespeed;
    
    print(this.naturalVel.x, this.naturalVel.y);
  }

  // This function is responsible for directional movement based on player keypresses.
  move(runMultiplier){
    for (let action of this.toMove){
      if (action === 'right') {this.controlledVel.x += this.movespeed*runMultiplier; this.facing = 1;}
      else if (action === 'left') {this.controlledVel.x -= this.movespeed*runMultiplier; this.facing = -1;}
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
      if (abs(this.naturalVel.x) > 0.03){
        this.naturalVel.x *= 0.95;
        if ((!this.interrupted && this.toMove.length === 0) || this.state > 0){this.naturalVel.x = 0;}
      }
      else{this.naturalVel.x = 0;}

      // if already falling or hangtime is out
      if ((this.state === 0 && abs(this.naturalVel.y) > 0.00001) || (countedFrames - this.dashTime >= this.dashDuration + this.hangtime && countedFrames - this.airborneTime > this.hangtime)){
        //print(countedFrames - this.airborneTime);
        if (this.naturalVel.y < 5){this.naturalVel.y += 0.27;}
        if (this.naturalVel.y > 5){this.naturalVel.y = 5;}
      else if (this.state === 2){this.naturalVel.y = 0;}
      }
    }
    // Acceleration/decceleration applied if player is dashing:
    else{
      this.controlledVel.x *= 0.95;
      this.controlledVel.y *= 0.95;
    }
  }

  modifyPosition(){
    this.oldReal.x = this.realPos.x;
    this.oldReal.y = this.realPos.y;

    this.realPos.add(this.controlledVel);
    this.realPos.add(this.naturalVel);
    
    // Check collision here
    // Grounded state is checked at the end of the frame. airborneTime is set on the frame at which the player is no longer grounded.
    if (this.realPos.y + this.sY >= playerSpawns[currentScreen].y*tileSide){this.state = 2; this.realPos.y = playerSpawns[currentScreen].y*tileSide-this.sY; this.dashes = this.regularDashes; this.airborneTime = countedFrames; this.naturalVel.y = 0;}
    else{this.state = 0;}

    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.pos.x = round(this.realPos.x);
    this.pos.y = round(this.realPos.y);

    this.checkCollision();
  }

  checkCollision(){
    let rayOrigin = 0;
    fill(255);
    noStroke();
    rect(this.oldPos.x*scaling, this.oldPos.y*scaling, this.sX*scaling, this.sY*scaling);
    stroke(255, 50, 50);
    strokeWeight(3);

    if ((this.oldPos.x - this.pos.x) * (this.oldPos.y - this.pos.y) > 0){rayOrigin = 1;}
    let offSetX = rayOrigin * this.sX * scaling;

    line(this.pos.x*scaling + offSetX, this.pos.y*scaling, this.oldPos.x*scaling + offSetX, this.oldPos.y*scaling);
    line((this.pos.x+this.sX)*scaling - offSetX, (this.pos.y+this.sY)*scaling, (this.oldPos.x+this.sX)*scaling - offSetX, (this.oldPos.y+this.sY)*scaling);
    line((this.pos.x + this.sX/2)*scaling, (this.pos.y+ this.sY/2)*scaling, (this.oldPos.x + this.sX/2)*scaling, (this.oldPos.y + this.sY/2)*scaling);
    
    this.currentCollision(this.pos.y-this.oldPos.y, this.pos.x-this.oldPos.x);
  }

  currentCollision(changeY, changeX){
    // trace each line while checking each pixel on it or smthn
    let slope = changeY/changeX;
    if (slope===Infinity){slope = -999}
    else if(slope===-Infinity){slope = 999}
    let distance = dist(this.pos.x, this.pos.y, this.oldPos.x, this.oldPos.y);

    //this.slopeGraph()
  }

  slopeGraph(x, y, s){

  }

  update(){
    // airborne time
    this.checkMovement();
    if (this.triggerDash){this.dash(); this.triggerDash = false;}
    if (this.triggerJump){this.jump(); this.triggerJump = false;}
    if (!this.dashing){this.move(1.5);}

    // Movement decceleration and gravitational acceleration are applied as needed.
    this.modifyVelocity()

    if (this.dashing && countedFrames - this.dashTime === this.dashDuration){this.dashing = false; this.movespeed = this.regularMovespeed; this.controlledVel.x = 0; this.controlledVel.y = 0;}
    this.triggerDash = false;

    this.modifyPosition();
    //if (this.realPos.y < 128){print(this.dashing); print('pos:', this.realPos.y); print('vel:', this.naturalVel.y + this.controlledVel.y);}
  }

  display(){
    noStroke();
    if (this.dashing){fill(50,180,255);}
    else{fill(100,200,100);}
    rect(this.pos.x, this.pos.y, this.sX, this.sY); // real hitbox (fake would be ~10x17)
  }
}


class Terrain{
  constructor(x, y, sizeX, sizeY){
    this.x = x; this.y = y; this.sX = sizeX; this.sY = sizeY;
    this.collidable = true;
    this.touchable = true;
  }

  checkCollision(){
    if (this.x <= player.pos.x && player.pos.x <= this.x + this.sX &&
       this.y <= player.pos.y && player.pos.y <= this.y + this.sY) {this.onCollision();}
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
    super(x*tileSide, y*tileSide, sizeX*tileSide, sizeY*tileSide); 
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
// The 1000M Climb
// Adam Abouelela
// June 23, 2024

/*
This game was inspired by Celeste (PICO-8).
Your goal is to climb a trecherous mountain to the 1000m peak.
For each 100m you climb, you must clear one screen. In order to clear a screen, you need to reach the top of the window.
To aid you with your climb, you have a special 8-way dash ability that allows you to rush in a straight line in any of 8 directions for a short period of time.
You only have one dash, that can be recharged by touching the ground.
While dashing you are incapable of moving, except for jumping, which grants you a major horizontal speed boost when interrupting your dash.
Interrupting a downwards diagonal dash grants you even more speed at the cost of losing some of the jump height.
You are also able to slide on walls and wall jump when you are next to a wall (not on the ground).
With these skills you must clear a total of 10 screens to reach the summit.
The time it takes you to reach the summit, as well as your death toll, will be shown to you at the end.
Good luck!
*/

new p5(); // Needed to load screens file.

let player, clouds = []; // Hold player object and cloud objects respectively.
let currentScreen = 0, spawnFrame = 0; // Keep track of the current screen the player is on and the frame the player spawned last spawned on.
let rock, spikes, flag, jumpSound, deathSound, dashSounds = [], music; // Images and audio., currentScreen = 0, spawnFrame = 0;
let deaths = 0; // A death toll that increases every time the player dies.
let finalDeaths = 0, finalTime = 0; // Are used to display the player's stats at the end of the game.
let scaling; // How much the entire canvas is scaled.
let controlpause = true; // Whether controlling the player is paused.
let countedFrames = 0; // Like frameCount but only starts counting after the game starts.
let start = false; // Whether the game started.
let end = false; // Whether the game was finished.
const tileSide = 8, tiledWidth = 40, tiledHeight = 22; // These constants determine the size of a tile, as well as how many tiles the screen shoud fit.

function preload(){
  rock = loadImage('images/rock.png');
  spikes = loadImage('images/spikes.png');
  flag = loadImage('images/flag.png');

  music = loadSound('audio/Soundtrack.mp3'); // Music is from PICO-8 Celeste (inspiration for my project)
  jumpSound = loadSound('audio/Jump.mp3');
  deathSound = loadSound('audio/Death.wav');
  dashSounds.push(loadSound('audio/Dash_1.wav'));
  dashSounds.push(loadSound('audio/Dash_2.wav'));
  dashSounds.push(loadSound('audio/Dash_3.wav'));

  let masterVolume = 1;
  music.setVolume(masterVolume);
  jumpSound.setVolume(masterVolume/5);
  deathSound.setVolume(masterVolume*1.7);
  for (sound of dashSounds){sound.setVolume(masterVolume*1.6);}
}

function setup(){
  // The scaling is based on how big of a canvas with a specific aspect ratio can wholly fit in the window.
  if (windowWidth/(tiledWidth*tileSide) < windowHeight/(tiledHeight*tileSide)){scaling = windowWidth/(tiledWidth*tileSide);}
  else{scaling = windowHeight/(tiledHeight*tileSide);}
  scaling -= scaling % (1/2); // Displayed pixels don't line up properly without this.

  createCanvas(tiledWidth*tileSide*scaling, tiledHeight*tileSide*scaling); //(320x176 pixel screen)

  spawnPlayer(); // A player object is created.
  for (let i = 0; i < 20; i++){clouds.push(new Cloud());} // 20 clouds are created at the beginning.
}

function draw(){
  background(10, 15, 30);
  // If the game hasn't started a start screen is displayed.
  if (start){
    countedFrames++;
    if(!controlpause){player.update();}
    else{
      player.spawnRise();
      if (countedFrames - spawnFrame >= 20){controlpause = false; player.realPos.y = playerSpawns[currentScreen].y*tileSide - player.sY;}
    }
    displayAll();
  }
  else{startScreen();}
}

// Displays all enities and terrain using the camera.
function displayAll(){
  push();
  scale(scaling);
  
  for (let cloud of clouds){cloud.action();} // Display clouds

  for (let y in tiledScreens[currentScreen]){ // Display rocky terrain
    for (let x in tiledScreens[currentScreen][y]){
      if (tiledScreens[currentScreen][y][x] === 1){image(rock, x*tileSide, y*tileSide, 8, 8);}
    }
  }

  player.display(); // Player displayed

  for (let spike of spikesArray[currentScreen]){spike.display();} // Display spikes

  // Text is displayed if needed.
  if (currentScreen === 10){
    image(flag, 159, 6*tileSide-20, 14, 20);
    if (countedFrames - spawnFrame < 180 && !end){displayAltitude();}
    else{finalScreen(); end = true;}
  }
  else{
    if (countedFrames - spawnFrame < 90){displayAltitude();}
  if (currentScreen === 6){dashInterruptTip();}
  }

  pop();
}

// Displays a start screen with text.
function startScreen(){
  let h = height/100;
  let s = height/10;

  textAlign(CENTER);
  textFont('Roboto', s);
  fill(255);

  text('THE 1000M CLIMB', width/2, h*20);

  textSize(s/2);
  text('CONTROLS:', width/2, h*40);

  textSize(s*3/8);
  text('MOVE & AIM DASH - WASD/ARROW KEYS', width/2, h*47);
  text('JUMP & WALLJUMP - J/SPACEBAR', width/2, h*54);
  text('DASH (8-WAY) - K/E', width/2, h*61);
  text('RESET SCREEN - R', width/2, h*68);

  textSize(s*5/8);
  text('PRESS ANY KEY TO START', width/2, h*85);
}

function displayAltitude(){
  let height = currentScreen*100;
  rectMode(CENTER);
  fill(0);
  rect(tiledWidth*tileSide/2, tiledHeight*tileSide/2, tileSide*10, tileSide*4);
  rectMode(CORNER);

  textAlign(CENTER, CENTER);
  textFont('Roboto', 20);
  if (currentScreen !== 10){fill(255);} //white
  else{fill(212, 175, 55);} //gold

  text(height.toString()+'M', tiledWidth*tileSide/2, tiledHeight*tileSide/2);
}

function dashInterruptTip(){
  let h = height/100/scaling;
  let s = height/10/scaling;

  fill(255);
  textFont('Roboto', s/3);
  textAlign(LEFT, CENTER);

  text('Gap too big?', 10, h*10);
  text('Try interrupting a diagonal dash by diagonally dashing into the ground then jumping...', 10, h*16);
  text('Notice how you still have a dash while midair?', 10, h*22);
}

// Displays the final screen with final stats.
function finalScreen(){
  rectMode(CENTER);
  fill(0);
  rect(tiledWidth*tileSide/2, tiledHeight*tileSide/2, tileSide*5, tileSide*5);
  rectMode(CORNER);

  textAlign(CENTER, CENTER);
  textFont('Roboto', 12);
  fill(212, 175, 55);
  text('1000M', tiledWidth*tileSide/2, tiledHeight*tileSide*9/20-3);

  textSize(6);
  let secs = (finalTime%60);
  let mins = ((finalTime - secs)/60);
  if (secs > 9){secs = secs.toString();}
  else {secs = '0' + secs.toString();}
  if (mins > 9){mins = mins.toString();}
  else {mins = '0' + mins.toString();}

  text('DEATHS: ' + finalDeaths.toString(), tiledWidth*tileSide/2, tiledHeight*tileSide/2+3);
  text('TIME: ' + mins + ':' + secs, tiledWidth*tileSide/2, tiledHeight*tileSide/2+12);
}

// Resets the player object and starts the spawn animation.
function spawnPlayer(){
  spawnFrame = countedFrames;
  controlpause = true;
  player = new Player(playerSpawns[currentScreen].x*tileSide, tiledHeight*tileSide);
}

function keyPressed(){
  // Checks first whether the game started. First keypress always starts the game.
  if (start){
    if (key === 'r'){player.alive = false;}
    else if (!controlpause){player.checkAbility();}
  } // If controls aren't paused then it checks if a movement ability was triggered.
  else {start = true; music.loop(); noStroke();} // Starts the game and soundtrack.
}

// The player class... this took forever.
// You might notice that in some functions booleans and other variables are reset to the default, but aren't explained.
// Usually this is because acceleration and other properties are determined by variables that are constantly altered with actions from the player.
// Therfore, if a variable no longer represents whatever the player should be doing at the moment or would affect the player in an unintended way, 
// it gets set to default by certain functions.
class Player{
  constructor(x, y){
    // Player, character, and hitbox are used interchangibly in the comments.
    this.realPos = createVector(x, y);  // Current position of hitbox.
    this.oldReal = createVector(x,y)    // Position of hitbox last frame.
    this.oldPos = createVector(x, y);   // Rounded position of hitbox last frame.
    this.pos = createVector(x, y);      // Rounded position of hitbox.
    this.sX = 6; // Player hitbox width
    this.sY = 6; // Player hitbox height

    // Two velocity vectors are implemented. Added together, they make up the total velocity of the player. They both have seperate ways in which they are accelerated/deccelerated.
    this.controlledVel = createVector(0, 0); // This velocity is only affected by dashing and running. This velocity usually has a sharp rate of decceleration.
    this.naturalVel = createVector(0, 0); // This velocity is (usually) only affected by jumping, gravity, and air resistance. This velocity only has a value when the player is midair and has a lower rate of decceleration.
    
    this.tempVelX = 0; // This is an extra variable used to temporarily add velocity horizontally.

    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]}; // Keys the player can press for directional movement.
    this.specialKeys = {'dash':['k', 'e'], 'jump':['j', ' ']}; // Keys that the player can press for special movement.
    this.toMove = [];                       // An array that containins the directions that the player wishes to move each frame.

    this.triggerDash = false;               // Is true when a dash is triggered.
    this.triggerJump = false;               // Is true when a jump is triggered.
    this.triggerWallJump = false;           // Is true when a wall jump is triggered.
    this.dashing = false;                   // Whether the player is currently dashing.
    this.wallJumping = false;               // Whether the player recently wall jumped.
    this.interrupted = false;               // Whether the last jump caused a dash interruption.
    this.alive = true;                      // Self-explanatory.
    this.state = 0;                         // The player's current state (airborne = 0, sliding = 1, grounded = 2).

    this.dashTime = -999;                   // The frame at which the last dash was triggered.
    this.wallJumpTime = -999                // The frame at which a wall jump last happened.
    this.airborneTime = -999;               // The frame at which the player became airborne. Going airborne after sliding doesn't count.
    this.dashDuration = 12;                 // # of frames that a dash lasts.
    this.regularMovespeed = 1;              // Player's regular walkspeed / movespeed.
    this.movespeed = this.regularMovespeed; // Player's current walkspeed / movespeed.
    this.facing = 1;                        // Direction that the player is facing (left = -1 and right = 1).
    this.hangtime = 4;                      // Used to determine how long the player has to wait in order to be able to dash again.
    this.regularDashes = 1                  // # of dashes the player normally has.
    this.dashes = 1;                        // # of dashes the player currently has.
  }

  // The player moves 1/20 the distance between the bottom of the screen and their spawn position upwards.
  spawnRise(){
    this.realPos.y -= (tiledHeight*tileSide - playerSpawns[currentScreen].y*tileSide + this.sY)/20;
    this.pos.y = round(this.realPos.y);
  }

  // Checks for any keys pressed from keybinds. Adds the direction(s) the player wishes move to the array 'toMove'.
  checkMovement(){
    this.toMove = []; // Clears the array.

    // Checks for any keys pressed from keybinds and adds the direction to 'toMove' accordingly.
    for (let action in this.keybinds){
      for (let keyBind of this.keybinds[action]){
        if (keyIsDown(keyBind)){
          this.toMove.push(action);
          break;
        }
      }
    }

    // The array shouldn't hold opposing directions, so it removes any opposing directions.
    if (this.toMove.indexOf('left') !== -1 && this.toMove.indexOf('right') !== -1){
      this.toMove.splice(this.toMove.indexOf('left'), 1);
      this.toMove.splice(this.toMove.indexOf('right'), 1);
    }

    if (this.toMove.indexOf('up') !== -1 && this.toMove.indexOf('down') !== -1){
      this.toMove.splice(this.toMove.indexOf('up'), 1);
      this.toMove.splice(this.toMove.indexOf('down'), 1);
    }
  }

  // Works somewhat similarly to checkMovement() in terms of looping through keybinds to check if the player is trying to execute an action.
  // Instead of adding directions to an array, it activates the trigger for an ability to execute next frame.
  checkAbility(){
    if (!this.alive){return;} // Can't move if you're dead.
    for (let action in this.specialKeys){
      for (let keyBind of this.specialKeys[action]){
        if (key === keyBind){
          // If the player wants to dash they must have dashes left. The player also can't dash for a few frames if a dash was executed recently.
          if (action === 'dash' && this.dashes > 0 && countedFrames - this.dashTime >= this.hangtime-1){this.triggerDash = true; random(dashSounds).play();}
          // To jump the player must not be airborne. However, they can still jump midair if they were on the ground in the last few frames.
          else if (action === 'jump' && this.state === 2){this.triggerJump = true; jumpSound.play();}
          else if (action === 'jump' && this.state === 1 && !this.dashing && !this.triggerDash){this.triggerWallJump = true; jumpSound.play();}
          break;
        }
      }
    }
  }

  // This function allows the player to dash.
  dash(){
    this.dashing = true;
    this.wallJumping = false;
    this.tempVelX = 0;
    this.dashTime = countedFrames+1;
    this.dashes--;
    this.movespeed = this.regularMovespeed*4.8;

    // Reset all velocities before dashing.
    this.naturalVel = createVector(0,0);
    this.controlledVel = createVector(0,0);
    
    if (this.toMove.length === 2){this.movespeed = sqrt(pow(this.movespeed,2)/2);} // Modifies movespeed to account for a diagonal dash.
    else if (this.toMove.length === 0){this.controlledVel.x += this.facing * this.movespeed;} // If the player doesn't choose a direction to dash, then dash the direction the player is facing.
    this.move(1); // Move without a multiplier.
  }

  // This function allows the player to jump.
  jump(){
    this.wallJumping = false;
    this.tempVelX = 0;
    this.realPos.y = this.pos.y;
    this.state = 0;
    this.naturalVel.y = -this.regularMovespeed*4;

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

    if (this.dashing){this.naturalVel.x += this.controlledVel.x; this.interrupted = true; this.dashing = false; this.dashes = this.regularDashes;} // If the player was dashing, stop dashing and grant the player a major horizontal speed boost.
    else if (this.toMove.length !== 0){this.naturalVel.x += 0.8*this.controlledVel.x; this.interrupted = false;}

    this.controlledVel.y = 0; // A jump cancels all other vertical velocities.
    this.movespeed = this.regularMovespeed; // Movespeed returns to normal.
  }

  // Allows the player to walljump off a wall.
  wallJump(){
    this.wallJumping = true;
    this.wallJumpTime = countedFrames;
    this.interrupted = false;
    this.realPos.x = this.pos.x;
    this.state = 0;
    let direction = 1;
    if (this.pos.x % tileSide !== 0){direction = -1;}

    this.naturalVel.y = -this.regularMovespeed*4;
    this.naturalVel.x = this.regularMovespeed*5*direction;

    this.realPos.x += direction;
    this.pos.x += direction;

    this.controlledVel.y = 0; // A jump cancels all other vertical velocities.
    this.controlledVel.x = 0; // A jump cancels all other vertical velocities.
    this.movespeed = this.regularMovespeed;
  }

  // This function is responsible for directional movement using a multiplier.
  move(runMultiplier){
    for (let action of this.toMove){
      if (action === 'right') {this.controlledVel.x += this.movespeed*runMultiplier; this.facing = 1;} // Move and face right.
      else if (action === 'left') {this.controlledVel.x -= this.movespeed*runMultiplier; this.facing = -1;} // Move and face left.
      else if (action === 'up' && this.triggerDash) {this.controlledVel.y -= this.movespeed;} // Move up if dashing.
      else if (action === 'down' && this.triggerDash) {this.controlledVel.y += this.movespeed;} // Move down if dashing.
    }
  }

  // Applies decceleration and gravitational acceleration based on certain conditions.
  modifyVelocity(){
    // Acceleration/decceleration applied if player not dashing:
    if (!this.dashing){
      // Horizontal controlled velocity is halved every frame where player isn't dashing.
      if (abs(this.controlledVel.x) > 0.03){this.controlledVel.x *= 0.5;}
      else{this.controlledVel.x = 0;} // If horizontal controlled velocity is low enough, it's just set to 0.
      if (abs(this.naturalVel.x) > 0.03){
        if (this.controlledVel.x + this.naturalVel.x < this.naturalVel.x){this.naturalVel*0.8;}
        if (this.state === 2){this.naturalVel.x = 0;}
        else if (this.interrupted){this.naturalVel.x *= 0.95;}
        else{this.naturalVel.x *= 0.85;}
      }
      else{this.naturalVel.x = 0;}

      if (this.state !== 2){
        if(countedFrames >= this.dashTime + this.dashDuration + this.hangtime || this.interrupted || this.wallJumping){
          let terminalVel = 4;
          if (this.state === 1){terminalVel = 0.85;} // Lower due to friction from the wall.
          if (this.naturalVel.y < terminalVel){this.naturalVel.y += 0.27;}
          if (this.naturalVel.y > terminalVel){this.naturalVel.y = terminalVel;}
        }
      }

      // The player shouldn't be able to noramlly move after a walljump for short period of time. This is because they would be able to almost immediately return to the wall and walljump again, allowing them to gain height indefinetly.
      // The solution to this is to resist the player's regular movement in order to stop them from having enough time to come back to the wall at a point higher than the one they walljumped from.
      // The resistance gradually weakens with time, in order to make the transition from a wall jump back to regular movement more natural and smooth.
      if (this.wallJumping){this.tempVelX = -this.controlledVel.x * map(countedFrames - this.wallJumpTime, 0, 12, 1, 0.5);}
    }
    // Acceleration/decceleration applied if player is dashing:
    else{
      this.controlledVel.x *= 0.95;
      this.controlledVel.y *= 0.95;
    }
  }

  // This function updates the player's current position based on their velocities and whether they're colliding. It also checks their final state at the end.
  modifyPosition(){
    // The current positions are saved as the previous positions then they are updated.
    this.oldReal.x = this.realPos.x;
    this.oldReal.y = this.realPos.y;
    this.oldPos.x = this.pos.x;
    this.oldPos.y = this.pos.y;

    this.realPos.add(this.controlledVel);
    this.realPos.add(this.naturalVel);
    this.realPos.x = constrain(this.realPos.x += this.tempVelX, 0, tileSide*tiledWidth-this.sX);

    this.pos.x = round(this.realPos.x);
    this.pos.y = round(this.realPos.y);

    // If the player moved any number of pixels (based on rounded pos) this frame, then the game checks for collisions and determines the player's supposed state.
    if (this.pos.x !== this.oldPos.x || this.pos.y !== this.oldPos.y){
      // Collisions are checked for and handled by the following function.
      // The parameters passed in are changes in the x and y of the realPos and pos vectors this frame.
      this.checkCollision(this.naturalVel.y+this.controlledVel.y, this.naturalVel.x+this.controlledVel.x, this.pos.y-this.oldPos.y, this.pos.x-this.oldPos.x);
    }
    if (this.alive){this.determineState();} // Determine the player's current state should be.
  }

  // This function is responsible for checking and handeling collisions. The player is able to move multiple pixels in a single frame, which causes a chance for the player to phase through an obstacle if they are fast enough.
  // The function accounts for this by basically tracing the path or "line" that the player would have had to go through in order to get from point A (initial pos) to point B (final pos).
  // With each pixel movement along the "line", the game checks for a collision.
  // Collisions are checked and hangled in this order: Out of Bounds > Colliding with Rocks (neutral terrain) > Colliding with Spikes
  checkCollision(changeRY, changeRX, changeY, changeX){
    // Steps holds the longest number of pixels moved either vertically or horizontally.
    let steps;
    if (abs(changeX) >= abs(changeY)){steps = abs(changeX);}
    else {steps = abs(changeY);}

    let stepVel = createVector(changeRX/steps, changeRY/steps); // This would be the velocity of the player if they moved pixel by pixel along the "line". 
    let tempPos = createVector(this.oldPos.x, this.oldPos.y); // The rounded temporary position of player. It represents the pixel on the "line" where the player is.
    let tempReal = createVector(this.oldReal.x, this.oldReal.y); // The real temporary position of player. It represents where on the "line" the player really is.

    // For each step the player advances one pixel in any direction at the most.
    for (let i = 0; i < steps; i++){
      tempReal.add(stepVel);
      let prevPos = createVector(tempPos.x, tempPos.y); // The current position is saved as the previous position just before it is updated.

      if (i + 1 === steps){tempPos = createVector(this.pos.x, this.pos.y);} // If it's the last check, then tempPos is just set to the final position.
      else {tempPos = createVector(round(tempReal.x), round(tempReal.y));}

      if (tempPos.y < 0){ // Checks if the player has reached the top of the screen. If so, moves onto the next screen and respawns the player.
        if (currentScreen < tiledScreens.length-1){
          currentScreen++;
          if (currentScreen === tiledScreens.length-1){finalDeaths = deaths; finalTime = round(countedFrames/60);}
        }
        spawnPlayer();
        break;
      }
      else if (tempPos.y + this.sY > tileSide*tiledHeight){this.alive = false; break;} // If the player is even partially below the screen they die.

      if (this.intersecting(tempPos.x, tempPos.y, 1)){ // Collision is checked using the player's current poisiton on the "line".
        // If the player did originally intersect a tile with rocks then the program checks whether the collision should be handled as a horizontal, vertical, or double collision.
        // Vertical collision, moves back one pixel (to where they weren't colliding)
        if (!this.intersecting(tempPos.x, prevPos.y, 1)){
          this.pos.y = prevPos.y; this.realPos.y = prevPos.y; tempPos.y = prevPos.y; tempReal.y = prevPos.y;
          this.naturalVel.y = 0; stepVel.y = 0;
        }
        // Horizontal collision, moves back one pixel (to where they weren't colliding)
        else if (!this.intersecting(prevPos.x, tempPos.y, 1)){
          this.pos.x = prevPos.x; this.realPos.x = prevPos.x; tempPos.x = prevPos.x; tempReal.x = prevPos.x;
          this.naturalVel.x = 0; stepVel.x = 0;
        }
        // Double collision, player is moved back one pixel in both directions and then doesn't move any further at all.
        else {this.pos = createVector(prevPos.x, prevPos.y); this.realPos = createVector(prevPos.x, prevPos.y); this.naturalVel = createVector(0, 0); break;}
      }
      // Check if the player is colliding with spikes. If so, kill them.
      if (this.spikesColliding(tempPos.x, tempPos.y)){this.alive = false; break;}
    }
  }

  // This function checks if the player is currently intersecting (is within the same tile as) a certain type of terrain and returns a boolean as a result.
  // Keep in mind that intersecting doesn't necessarily mean colliding.
  intersecting(posX, posY, type){
    // Number of pixels that the player is away from being in the same top left corner position of the tile that the player's top left corner is in.
    let remainderX = posX % tileSide;
    let remainderY = posY % tileSide;

    // Position of the tile that the player's top left corner is in.
    let tileX = (posX - remainderX)/tileSide;
    let tileY = (posY - remainderY)/tileSide;

    let intersectX = 1; // Number of tiles the player is intersecting when following the x-axis starting from the top left corner of the player.
    let intersectY = 1; // Number of tiles the player is intersecting when following the y-axis starting from the top left corner of the player.
    if (remainderX + this.sX > tileSide){intersectX++;}
    if (remainderY + this.sY > tileSide){intersectY++;}

    // Check each tile the player is intersecting to see if any of them have the tile type in them.
    for (let y = tileY; y < tileY + intersectY; y++){
      for (let x = tileX; x < tileX + intersectX; x++){
        if (tiledScreens[currentScreen][y][x] === type){return true;} // The player is intersecting with the type of tile passed in.
      }
    }

    return false; // Player isn't intersecting the tile type.
  }

  // Checks whether the player is colliding with a spike, and returns a boolean accordingly.
  spikesColliding(posX, posY){
    if (!this.intersecting(posX, posY, 2)){return false;} // If the player isn't intersecting any tiles with spikes, returns false.

    // The player's hitbox is checked to see if it is colliding with the hitbox of any spike object using a for loop. Returns true if so.
    for (let spike of spikesArray[currentScreen]){if (this.collideRectRect(posX, posY, this.sX, this.sY, spike.pos.x, spike.pos.y, spike.sX, spike.sY)){return true;}}
    return false; // Player is intersecting a spike tile but isn't colliding with it, so it returns false.
  }

  // This function checks if two rectangles are colliding using their positions and sizes.
  collideRectRect(x, y, w, h, x2, y2, w2, h2) {
    if (x + w >= x2 &&    // r1 right edge past r2 left
        x <= x2 + w2 &&    // r1 left edge past r2 right
        y + h >= y2 &&    // r1 top edge past r2 bottom
        y <= y2 + h2) {    // r1 bottom edge past r2 top
          return true; // They're colliding
    }
    return false; // They're not colliding
  };

  // This function is used to determine whether the player is currently airborne, sliding, or grounded.
  determineState(){
    if (this.checkGrounded()){this.state = 2; this.realPos.y = this.pos.y; this.dashes = this.regularDashes; this.airborneTime = countedFrames;}
    else if (this.checkSliding()){this.state = 1;}
    else{this.state = 0;}
  }

  // This function checks if the player is currently right on top of solid ground by creating a hitbox right under the player's own hitbox.
  // The hitbox is one pixel high and as wide as the player's hitbox.
  checkGrounded(){
    let tileX = (this.pos.x - this.pos.x % tileSide)/tileSide;
    let tileY = (this.pos.y + this.sY)/tileSide;

    // If the made up hitbox isn't on the same vertical level as the first pixel of a tile within the screen then the player should be midair.
    // Therefore, since the player isn't grounded, the function returns false.
    if (tileY % 1 !== 0 || tileY >= tiledHeight){return false;}

    let intersectX = 1; // Number of tiles the hitbox is intersecting when following the x-axis starting from the leftmost pixel of the hitbox.
    if (this.pos.x % tileSide + this.sX > tileSide){intersectX++;}

    for (let x = tileX; x < tileX + intersectX; x++) {if (tiledScreens[currentScreen][tileY][x] === 1){return true;}} // If the hitbox is intersecting a rock, the functions returns true.
    return false; // The functions returns false if the hitbox isn't intersecting a neutral tile.
  }

  // Like checkGrounded() but it checks the left and right sides of the player instead.
  checkSliding(){
    let tileX;
    let wallSide = 1; // Used to determine the direction the player should face.
    let remainderX = this.pos.x % tileSide;

    // Checks to see which tile side the player is aligned against.
    if (remainderX === 0){tileX = (this.pos.x - remainderX)/tileSide - 1;}
    else if (remainderX + this.sX === tileSide){tileX = (this.pos.x - remainderX)/tileSide + 1; wallSide = -1;}
    else {return false;} // Player isn't aligned against the left or right side of a tile.

    // Position of the tile that the player's top left corner is in.
    let tileY = (this.pos.y - this.pos.y % tileSide)/tileSide;
    let intersectY = 1; // Number of tiles the hitbox is intersecting when following the y-axis starting from the upmost pixel of the hitbox.
    if (this.pos.y % tileSide + this.sY > tileSide){intersectY++;}

    // If the hitbox is intersecting a rock, the function returns true.
    for (let y = tileY; y < tileY + intersectY; y++) {if (tiledScreens[currentScreen][y][tileX] === 1){this.facing = wallSide; return true;}}
    return false;
  }

  // This function is the function called by draw to call most other functions.
  update(){
    if (!this.alive){spawnPlayer(); deaths++; deathSound.play(); return;}
    this.checkMovement();

    if (this.triggerDash){this.dash(); this.triggerDash = false;}
    if (this.triggerJump){this.jump(); this.triggerJump = false;}
    else if (this.triggerWallJump){this.wallJump(); this.triggerWallJump = false;}

    if (!this.dashing){this.move(1.5);}
    // Movement decceleration and gravitational acceleration are applied as needed.
    this.modifyVelocity();

    // Check to see whether a dash should end. Resets several movement related variables to their default if so.
    if (this.dashing && countedFrames - this.dashTime === this.dashDuration){this.dashing = false; this.movespeed = this.regularMovespeed; this.controlledVel.x = 0; this.controlledVel.y = 0;}
    // Check whether the player has spent enough time after a wall jump in order to stop resisting their movement.
    if (this.wallJumping && countedFrames - this.wallJumpTime === 12){this.wallJumping = false; this.tempVelX = 0;}

    this.modifyPosition();
  }

  display(){
    push()
    // Character is flipped based on the way they are facing.
    if (this.facing === -1){translate(2*this.pos.x + this.sX, 0); scale(-1,1)}

    this.drawPlayer(this.pos.x-1, this.pos.y-2); // The idle sprite is larger than the hitbox by 1 pixel on the right and left and 2 on top.
    pop()
  }

  drawPlayer(x, y){
    // Hair
    if (this.dashing){fill(150,0,250);}
    else if (this.dashes > 0){fill(224,54,116)}
    else{fill(50,150,255);}

    rect(x+3, y, 4, 2);
    rect(x+7, y+1, 1, 3);
    rect(x+1, y, 1, 6);
    rect(x+2, y, 1, 3);
    if(this.state === 1){square(x+7, y+4, 1); rect(x+8, y+1, 1, 3);}
    else{rect(x, y+1, 1, 6);}

    // Head
    fill(255, 249, 189);
    rect(x+2, y+3, 1, 2);
    rect(x+3, y+2, 4, 3);

    // Eyes
    fill(0);
    square(x+3, y+3, 1);
    square(x+6, y+3, 1);

    // Torso
    fill(34, 177, 76)
    rect(x+2, y+5, 4, 2);

    // Feet are drawn based on player's state.
    fill(255);
    if (this.state === 0){
      square(x+1, y+7, 1);
      square(x+6, y+7, 1);
    }
    
    else if(this.state === 1){
      square(x+1, y+6, 1);
      square(x+3, y+7, 1);
    }

    else{
      square(x+2, y+7, 1);
      square(x+5, y+7, 1);
    }
  }
}

// The spikes class contains the information needed to display the spikes properly and to determine their hitbox.
// Usually several spikes tiles in a row count as a singular spikes object with a collective hitbox.
// This is to decrease the number of checks needed to determine whether the player is colliding with a spikes object.
class Spikes{
  constructor(x, y, s, orientation){
    this.tileX = x*tileSide; this.tileY = y*tileSide;
    this.pos = createVector(this.tileX, this.tileY);
    this.length = s;
    this.orientation = orientation;

    // Orientation is used to determine the position and dimensions of the spike's hitbox.
    if (this.orientation % 2 === 0){this.sX = s*tileSide; this.sY = 5;}
    else{this.sX = 5; this.sY = s*tileSide;}

    if (this.orientation === 3){this.pos.x += tileSide-this.sX;}
    else if (this.orientation === 0){this.pos.y += tileSide-this.sY;}
  }

  // Translation and rotation are used to display the spikes object.
  display(){
    // A for loop is used to to display each spikes tile in a line independently.
    for (let i = 0; i < this.length; i++){
      push();
      let x = this.tileX;
      let y = this.tileY;
      if (this.orientation % 2 === 0){x+=i*tileSide;}
      else{y+=i*tileSide;}

      let offsetX = 0;
      let offsetY = 0;
      if (this.orientation === 1 || this.orientation === 2){offsetX += tileSide;}
      if (this.orientation === 3 || this.orientation === 2){offsetY += tileSide;}

      translate(x+offsetX, y+offsetY);
      rotate(PI/2*this.orientation);
      image(spikes, 0, 3, tileSide, 5);
      pop();
    }
  }
}

// This class is very similar to the Vehicle class from the Cars Cars Cars assignment.
// Each cloud has a random size and continually moves to the right at a random speed.
class Cloud{
  constructor(){
    // All initial properties of the cloud are randomized.
    this.xSpeed = int(random(1,5));
    this.sX = int(random(25,60));
    this.sY = int(random(7,14));
    this.x = int(random(320));
    this.y = int(random(180-this.sY));
  }

  move(){
    // The cloud moves a distance to the right based on its speed.
    this.x += this.xSpeed;
    
    // If a cloud passes the right edge of the screen, it will reposition behind the left edge of the screen, randomize its y-pos, and randomize its speed.
    if (this.x > 320){
      this.x = -this.sX;
      this.y = int(random(180-this.sY));
      this.xSpeed = int(random(1,5));
    }
  }

  // Displays the cloud as a blue rectangle using the cloud's randomized size.
  display(){
    fill(20,40,80);
    rect(this.x, this.y, this.sX, this.sY);
  }

  // Moves then displays the cloud.
  action(){ 
    this.move()
    this.display()
  }
}
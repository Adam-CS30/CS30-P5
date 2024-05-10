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
  if (keyCode === ESCAPE){
    print('hi')
    if (paused){paused = false}
    else{paused = true}
  }
}

class Player{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.keybinds = {'dash':[32, SHIFT], 'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83]}
    this.dashing = false;
    this.movespeed = 1;
    this.dashes = 3;
    this.alive = true;
  }

  determineMovement(){
    for (let action in this.keybinds){
      for (let keyBind of this.keybinds[action]){
        if (keyIsDown(keyBind)){
          this.move(action);
          break;
        }
      }
    }
  }

  move(action){
    if (action === 'dash' && this.dashes > 0) {this.vel.x = 0; this.dashing = true; this.movespeed = 30; this.dashes--;}
    if (action === 'left') {this.vel.x -= this.movespeed;}
    if (action === 'right') {this.vel.x += this.movespeed;}
    if (action === 'up') {this.vel.y -= this.movespeed;}
    if (action === 'down') {this.vel.y += this.movespeed;}
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.x *= 0.75;
    this.vel.y *= 0.75;
    this.acc.x = 0;
    this.acc.y = 0;

    this.dashing = false;
    this.movespeed = 1;
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
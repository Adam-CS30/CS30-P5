// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let player;

function setup() {
  player = new Player(50,50)
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  player.determineMovement();
  player.display();
}

class Player{
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.keybinds = {'left':[LEFT_ARROW, 65], 'right':[RIGHT_ARROW, 68], 'up':[UP_ARROW, 87], 'down':[DOWN_ARROW, 83], 'dash':[32, SHIFT]}
    this.dashing = false;
    this.dashes = 1
    this.alive = true;
  }

  determineMovement(){
    for (let action in this.keybinds){
      for (let keyBind of this.keybinds[action]){
        if (keyIsDown(keyBind)){
          this.move(action);
        }
      }
    }
  }

  move(action){
    if (action === 'left' && this.vel.x > -6) {this.vel.x -= 1.5;}
    if (action === 'right' && this.vel.x < 6) {this.vel.x += 1.5;}
    if (action === 'up' && this.vel.y > -6) {this.vel.y -= 1.5;}
    if (action === 'down' && this.vel.y < 6) {this.vel.y += 1.5;}
    if (action === 'dash' && !this.dashing) {this.vel.x = 20; this.dashing = true;}
  }

  display(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.x *= 0.8;
    this.vel.y *= 0.8;
    this.acc.x = 0;
    this.acc.y = 0;
    circle(this.pos.x, this.pos.y, 20)
  }
}

class Terrain{
  constructor(x, y, size){
    this.x = x; this.y = y; this.size = size;
  }
}
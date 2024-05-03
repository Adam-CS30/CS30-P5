// Capstone?
// Adam Abouelela
// May 2, 2024
// Experimental capstone idea

let keybinds = {}, player;

function setup() {
  keybinds = {'left':[LEFT_ARROW, 'a'], 'right':[RIGHT_ARROW, 'd'], 'up':[UP_ARROW, 'w'], 'down':[DOWN_ARROW, 's'], 'dash':[' ', SHIFT]}
  player = new Player(50, 50)
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  player.determineMovement();
}

class Player{
  constructor(x, y){
    this.pos = createVector(x,y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.alive = true;
  }

  determineMovement(){
    for (let action in keybinds){
      for (let keyBind of keybinds[action]){
        if (keyIsDown('a')){
          this.move(action);
          break;
        }
      }
    }
  }

  move(action){
    print(action);
  }
}
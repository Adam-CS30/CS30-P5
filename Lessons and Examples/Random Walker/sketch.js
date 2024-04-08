// Classes and Objects
// Adam Abouelela
// April 8th, 2024
// A first look at making our own classes

let walkers = []; //objects can't be created before setup()
const NUM_WALKERS = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);
  for(let i = 0; i < NUM_WALKERS; i++){
    let c = color(random(255),random(255),random(255))
    walkers.push(new Walker(width/2, height/2, c, i/2))
  }
}

function draw() {
  //background(220);
 for (let walker of walkers){
    walker.move()
    walker.display()
 }
}

class Walker {
  // Constructor
  constructor(x, y, c, s){
    this.x = x; this.y = y; this.c = c, this.speed = s;
  }

  // Methods
  display() {
    rectMode(CENTER);
    fill(this.c);
    square(this.x, this.y, this.speed);
  }

  move() {
    let n = random();
    if (n > 0.75){this.y -= this.speed;}
    else if (n > 0.5){this.y += this.speed;}
    else if (n > 0.25){this.x -= this.speed;}
    else{this.x += this.speed;}
  }
}
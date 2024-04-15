// Cars Cars Cars
// Adam Abouelela
// April 15, 2024
// 

let westbound = [], eastbound = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  for (let i = 0; i < 20; i++){eastbound.push(new Vehicle(0, random(height*0.52, height*0.63), random(5, 10)));}
  for (let i = 0; i < 20; i++){westbound.push(new Vehicle(width, random(height*0.37, height*0.48), random(-5, -10)));}
}

function draw() {
  background(220);
  drawRoad();
  for (let v of eastbound){v.action();}
  for (let v of westbound){v.action();}
}

function drawRoad(){
  fill(0);
  rect(width/2, height/2, width, height*0.3);
  fill(255);
  for (let x = 0; x <= width; x+=50){rect(x, height/2, 30, 5);}
}

class Vehicle{
  constructor(x, y, speed){
    this.type = 0; this.x = x; this.y = y; this.xSpeed = speed; this.color = color(random(255),random(255),random(255))
  }

  display(){
    fill(this.color);
    rect(this.x+25, this.y, 50, 20);
    fill(255);
    rect(this.x+8, this.y-12, 10, 3)
    rect(this.x+8, this.y+12, 10, 3)
    rect(this.x+42, this.y-12, 10, 3)
    rect(this.x+42, this.y+12, 10, 3)
  }
  move(){this.x += this.xSpeed;}
  speedUp(){this.xSpeed++;}
  speedDown(){this.xSpeed--;}
  changeColor(){this.color = color(random(255),random(255),random(255))}
  action(){
    let r = random();
    this.move();
    if (r < 0.01){this.speedUp();}
    else if (r < 0.02){this.speedDown();}
    if (random() < 0.01){this.changeColor();}
    this.display();
  }
}
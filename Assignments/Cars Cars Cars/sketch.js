// Cars Cars Cars
// Adam Abouelela
// April 15, 2024
// 

let westbound = [], eastbound = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  for (let i = 0; i < 20; i++){eastbound.push(new Vehicle(0, random(height*0.52, height*0.63)));}
  for (let i = 0; i < 20; i++){westbound.push(new Vehicle(width, random(height*0.37, height*0.48)));}
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
  constructor(x, y){
    this.type = int(random(2)); this.x = width-20; this.y = y; this.xSpeed = 1; this.color = color(random(255),random(255),random(255))
    if (this.y < height/2){this.reflect = -1}
    else {this.reflect = 1}
  }

  display(){
    fill(this.color);
    if (this.type){
      rect(this.x+20*this.reflect, this.y, 40, 30);
      rect(this.x+45*this.reflect, this.y, 10, 30);
    }

    else{
      rect(this.x+25*this.reflect, this.y, 50, 20);
      fill(255);
      rect(this.x+8*this.reflect, this.y-12, 10, 3);
      rect(this.x+8*this.reflect, this.y+12, 10, 3);
      rect(this.x+42*this.reflect, this.y-12, 10, 3);
      rect(this.x+42*this.reflect, this.y+12, 10, 3);
    }
  }

  move(){
    this.x += this.xSpeed*this.reflect;
    if (this.x > width){this.x=0}
  }

  speedUp(){if (this.xSpeed < 15){this.xSpeed++};}
  speedDown(){if (this.xSpeed > 0){this.xSpeed--;}}
  changeColor(){this.color = color(random(255),random(255),random(255));}

  action(){
    let r = random();
    this.move();
    //if (r < 0.01){this.speedUp();}
    //else if (r < 0.02){this.speedDown();}
    if (random() < 0.01){this.changeColor();}
    this.display();
  }
}
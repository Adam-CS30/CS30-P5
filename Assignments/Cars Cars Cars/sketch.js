// Cars Cars Cars
// Adam Abouelela
// April 15, 2024
// 

let westbound = [], eastbound = [], trafficLight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  ellipseMode(CENTER);
  for (let i = 0; i < 20; i++){eastbound.push(new Vehicle(0, random(height*0.52, height*0.63)));}
  for (let i = 0; i < 20; i++){westbound.push(new Vehicle(width, random(height*0.37, height*0.48)));}
  trafficLight = new TrafficLight();
}

function draw() {
  background(220);
  drawRoad();
  trafficLight.action();
  for (let v of eastbound){v.action();}
  for (let v of westbound){v.action();}
}

function drawRoad(){
  fill(0);
  rect(width/2, height/2, width, height*0.3);
  fill(255);
  for (let x = 0; x <= width; x+=50){rect(x, height/2, 30, 5);}
}

function mousePressed(){
  if (mouseButton === LEFT){
    if (keyCode === SHIFT){westbound.push(new Vehicle(width, random(height*0.37, height*0.48)));}
    else{eastbound.push(new Vehicle(0, random(height*0.52, height*0.63)));}
  }
}

function keyPressed(){trafficLight.switchLight()}

class Vehicle{
  constructor(x, y){
    this.type = int(random(2)); this.x = x; this.y = y; this.xSpeed = int(random(5,9)); this.color = color(random(255),random(255),random(255))
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
    if (this.x > width && this.reflect === 1){this.x=-50}
    else if (this.x < 0 && this.reflect === -1){this.x=width+50}
  }

  speedUp(){if (this.xSpeed < 15){this.xSpeed++};}
  speedDown(){if (this.xSpeed > 0){this.xSpeed--;}}
  changeColor(){this.color = color(random(255),random(255),random(255));}

  action(){
    let r = random();
    this.move();
    if (r < 0.01){this.speedUp();}
    else if (r < 0.02){this.speedDown();}
    if (random() < 0.01){this.changeColor();}
    this.display();
  }
}

class TrafficLight{
  constructor(){
    this.light = 0; this.timer = -120;
  }

  switchLight(){
    if (key === ' '){
      this.light = 1;
      this.timer = frameCount;
    }
  }

  display(){
    fill(60);
    rect(width/2, height/4, 400, 120);

    if (this.light === 0){fill(100,20,20)}
    else{fill(255,50,50)}

    circle(width/2 - 125, height/4, 100);
    fill(100, 50, 0);
    circle(width/2, height/4, 100);

    if (this.light === 1){fill(20,100,20)}
    else{fill(50,200,50)}

    circle(width/2 + 125, height/4, 100);
  }

  action(){
    if (frameCount-this.timer >= 120){this.light = 0;}
    this.display();
  }
}
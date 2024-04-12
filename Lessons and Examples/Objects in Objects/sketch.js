// Objects in Objects
// Adam Abouelela
// April 12, 2024
// Storing objects in objects, overwriting objects, basic transformations.

let myPlanet;

function setup() {
  createCanvas(windowWidth, windowHeight);
  myPlanet = new Planet(width/2,height/2);
  angleMode(DEGREES);
}

function draw() {
  background(5);
  myPlanet.display();
}

function mouseClicked(){
  if (keyIsPressed && keyCode === SHIFT){myPlanet.relocate();}
  else{myPlanet.createMoon();}
}

class Planet{
  constructor(x,y){
    this.x = x; this.y = y; this.s = 100;
    this.moons = [];
    //for (let i = random(1,5); i > 0; i-=1){this.moons.push(new Moon(this.x,this.y))}
  }

  relocate(){
    this.x = mouseX;
    this.y = mouseY;
    for (let moon of this.moons){
      moon.x = mouseX; 
      moon.y = mouseY;
    }
  }

  display(){
    fill(190);
    circle(this.x,this.y,this.s);
    for (let moon of this.moons){moon.update()}
  }

  createMoon(){
    this.moons.push(new Moon(this.x,this.y));
  }
}

class Moon{
  constructor(x,y){
    this.x = x; this.y = y; this.speed = random(1, 4); this.angle = 0; this.orbitRadius = random(100,350); this.s = 25;
  }

  update(){
    this.move();
    this.display();
  }

  move(){
    this.angle += this.speed;
  }

  display(){
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(100);
    circle(this.orbitRadius, 0, this.s);
    pop();
  }
}
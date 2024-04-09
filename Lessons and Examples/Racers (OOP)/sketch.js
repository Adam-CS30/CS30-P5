// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let racer1, racer2, racer3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER)
  racer1 = new RoundRacer(height*0.3, color('blue'))
  racer2 = new RoundRacer(height*0.5, color('green'))
  racer3 = new RoundRacer(height*0.7, color('red'))
}

function draw() {
  background(0);
  racer1.move()
  racer2.move()
  racer3.move()
  racer1.display()
  racer2.display()
  racer3.display()
}

class RoundRacer{
  constructor (y, color){
    this.x = 0; this.y = y; this.speed = random(3,15); this.color = color;
  }

  display(){
    fill(this.color);
    circle(this.x,this.y,10);
  }

  move(){
    this.x += this.speed;
    if (this.x >= width+5){this.x = 0}
  }
}
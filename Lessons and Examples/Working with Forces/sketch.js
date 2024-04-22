// Working with Forces
// Adam Abouelela
// April 22, 2024
// Making a simple particle system (using vectors)

let particles = [];
let acc;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  ellipseMode(CENTER);
  acc = createVector(0,0.03);
}

function draw() {
  background(220);
  particles.push(new Particle(mouseX, mouseY));
  for (p in particles){
    particles[p].action();
    if (! particles[p].alive){
      particles.splice(p,1);
      p--;
    }
  }
}

class Particle{
  constructor(x, y){
    this.pos = createVector(x,y);
    this.vel = createVector(random(-3,3),random(-5,-3));
    this.s = 20;
    this.c = color(0, 100, random(150,225), 100);
    this.alive = true;
  }

  move(){
    this.vel.add(acc);
    this.pos.add(this.vel);

    if (this.pos.x <= 0){
      this.pos.x = 0;
      this.vel.x *= -1
    }

    if (this.pos.x >= width){
      this.pos.x = width;
      this.vel.x *= -1
    }
  }

  display(){
    fill(this.c);
    push();
    translate(this.pos.x, this.pos.y)
    circle(0,0,this.s);
    pop();
  }

  action(){
    this.move();
    this.display();
    if (this.pos.y > height){this.alive = false;}
  }
}
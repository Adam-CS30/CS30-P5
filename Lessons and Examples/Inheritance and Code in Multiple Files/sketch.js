// Inheritance and Code in Multiple Files
// Adam Abouelela
// May 9, 2024

let objects = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++){
    objects.push(new AnimatedObject(random(width), random(height)));
    objects.push(new CircleObj(random(width), random(height)));
    objects.push(new LineObj());
  }
}

function draw() {
  background(220);
  for (let o of objects){o.move(); o.display();}
}
function setup() {
  createCanvas(500, 400);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  background(220);
  scale(1.5)
  let x = 200;
  let y = 200;

  //translate(2*x, 0)
  //scale(-1, 1)

  fill(200,50,50)
  rect(x-20, y, 40, 80);
  fill(50,200,50)
  rect(x+20, y, 40, 80);
  fill(50,50,200)
  rect(x, y-65, 80, 50)
}

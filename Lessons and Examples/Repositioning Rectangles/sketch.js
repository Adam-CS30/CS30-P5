// Repositioning Rectangles
// Adam Abouelela
// March 6, 2024
// Creating some geometry that can be picked up and moved around.

let x, y;
let held = false;
let w = 100;
let l = 200;
let toggle = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  x = width/2;
  y = height/2
}

function draw() {
  background(220);
  let inRect = mouseInRect();
  drawRect(inRect);
}

function mouseInRect(){
  if (mouseX >= x - l/2 && mouseX <= x + l/2 && mouseY >= y - w/2 && mouseY <= y + w/2) {return true}
  {return false}
}

function drawRect(within){
  if ((within || toggle) && held){
    fill(110,255,110);
    toggle = true;
    x = mouseX;
    y = mouseY;
  }
  else {
    fill(255,110,110);
    toggle = false;
  }

  rect(x,y,l,w);
}

function mousePressed(){held = true}
function mouseReleased(){held = false}
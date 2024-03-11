// Terrain Generation Starter
// Adam Abouelela
// March 11, 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let t = 0;
let w = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  background(220);
  drawRects();
}

function draw() {
  t += 0.1;
}

function drawRects(){
  fill(0);
  //let h = 10;
  for (let x = w/2; x < width; x+=w){
    let h = random(30,600)
    rect(x,height/2,w,h);
    //h += 5;
  }
}
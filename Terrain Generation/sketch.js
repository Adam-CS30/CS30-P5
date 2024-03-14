// Terrain Generation Starter
// Adam Abouelela
// March 11, 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let w = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNERS);
  strokeWeight(0);
}

function draw() {
  background(220);
  generateTerrain();
}

function keyPressed(){
  if (keyCode === LEFT_ARROW && w !== 1){w--;}
  else if (keyCode === RIGHT_ARROW && w !== 50){w++;}
}

function generateTerrain(){
  fill(0);
  let t = 0;
  let peakY = height;
  let peakX;

  for (let x = 0; x < width; x+=w){
    let y = height - map(noise(t), 0, 1, height*0.8, height*0.2);
    rect(x, height, x+w, y);

    if (y < peakY){
      peakX = x + w/2;
      peakY = y;
    }

    t += 0.01;
  }

  drawFlag(peakX, peakY);
}

function drawFlag(x, y){
  let tall = 30;
  strokeWeight(1);
  fill(150);
  line(x,y,x,y-tall);
  triangle(x, y-tall, x, y-tall/1.8, x+tall/3, y-(tall*2/3.6))
  strokeWeight(0);
}
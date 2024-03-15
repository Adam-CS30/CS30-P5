// Terrain Generation Starter
// Adam Abouelela
// March 11, 2024
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let w = 10;
let time = 0;

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
  let time_added = 0;
  let peakY = height;
  let peakX = 0;
  let total_height = 0;
  let heights = [];

  for (let x = 0; x < width; x+=w){
    let y = height - map(noise(time), 0, 1, height*0.2, height*0.8);
    rect(x, height, x+w, y);
    heights.push(y);
    time += 0.01;
    time_added += 0.01;

    if (y < peakY){
      peakX = x + w/2;
      peakY = y;
      print(peakX);
    }
  }

  for (y of heights){total_height += y;}
  //if (peakX > width){print(peakX)}
  avg_height = total_height/heights.length;

 if (peakX < width){peakX-=w/2}
  drawBand(avg_height);
  drawFlag(peakX, peakY);
  time -= time_added*0.99
}

function drawBand(y){
  fill(255,50,50,100);
  rect(0,y-5,width,y+10);
  fill(0);
}

function drawFlag(x, y){
  let tall = 30;
  strokeWeight(1);
  fill(150);
  line(x,y,x,y-tall);
  triangle(x, y-tall, x, y-tall/1.8, x+tall/2.5, y-(tall+tall/1.8)/2);
  strokeWeight(0);
}
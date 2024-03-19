// Terrain Generation
// Adam Abouelela
// March 11, 2024
// Draws a panning terrain landscape. Additionally, it draws a flag at the highest point of the terrain and a red band at the average height.

let rec_width = 10; //Keep track of the rectangle width.
let time = 0; //Keeps track of the time used for perlin noise respectively.

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNERS);
  strokeWeight(0);
}

function draw() {
  background(220);
  // Draw the terrain.
  generateTerrain();
}

// Changes the width of the rectangles based on the arrow key pressed as long as the width is within set bound.
function keyPressed(){
  if (keyCode === LEFT_ARROW && rec_width !== 1){rec_width--;}
  else if (keyCode === RIGHT_ARROW && rec_width !== 30){rec_width++;}
}

// This function is responsible for drawing the terrain and panning the scene.
function generateTerrain(){
  fill(0);
  let time_added = 0; //Keeps track of all the time added this frame.
  // These two variables keep track of the location of the highest peak.
  let peakY = height;
  let peakX = 0;
  let heights = []; //Keeps track of the all the rectangle heights generated in an array.
  let total_height = 0;

  // Draw a series of rectangles based on the current set rectangle width and a height determined by perlin noise.
  for (let x = 0; x < width; x+=rec_width){
    let y = height - map(noise(time), 0, 1, height*0.2, height*0.8);
    rect(x, height, x+rec_width, y);
    heights.push(y);
    time += 0.01;
    time_added += 0.01;

    // Checks to see if the current rectangle drawn is taller than the current tallest. If so, it makes it the new tallest rectangle.
    if (y < peakY){
      peakX = x + rec_width/2;
      peakY = y;
    }
  }

  // Ensures that the flag doesn't go completely offscreen by not allowing it's x-pos to be greater than the screen width.
  if (peakX > width){peakX-=rec_width/2;}

  // Calculate the average height from an array of heights by adding all the heights then dividing them by the number of heights.
  for (y of heights){total_height += y;}
  avg_height = total_height/heights.length;

  // Call the functions that draw the red band and the flag.
  drawBand(avg_height);
  drawFlag(peakX, peakY);

  // Ssubtracts most of the time added this frame from the total time, which cause a panning effect.
  time -= time_added*0.99;
}

// This function draws a red band on the average height of the terrain.
function drawBand(y){
  fill(255,50,50,100);
  rect(0,y-5,width,y+10);
  fill(0);
}

// This function draws a flag at the highest point of the terrain.
function drawFlag(x, y){
  let tall = 30; //The size of the flag.
  strokeWeight(1);
  fill(150);
  line(x,y,x,y-tall);
  triangle(x, y-tall, x, y-tall/1.8, x+tall/2.5, y-(tall+tall/1.8)/2);
  strokeWeight(0);
}
// Art Replication Warm-up
// Adam Abouelela
// March 26, 2024
// Trying to replicate “Ninety Parallel Sinusoids With Linearly Increasing Period”


function setup() {
  createCanvas(700, 700);
  strokeWeight(1.5);
  background(220);
  // Draw 99 sinusoids stacked on top of each other (4 pixels apart).
  for (let y = 0; y < 99; y++){sinusoid(y*4+height*0.2)}
}

function sinusoid(y){
  // This loop draws a bunch of points in a way where it graphs a portion of the function A*sin(B*x),
  // where A is the amplitude and B is the change in the period.
  for (let x = width*0.1; x <= width*0.9; x++){
    let xValue = map(x, width*0.1, width*0.9, 0, 4.4); // xValue is the x-pos of the points mapped to the interval [0,4.5]
    let B = map(xValue, 0, 4.5, -1, 4.35); // The period changes linearly as the x-vals increase.
    point(x, y + (-25*sin(B*(xValue)))); // Draws a point based on the function A*sin(B*x).
  }
 }
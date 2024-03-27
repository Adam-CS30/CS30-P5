// Art Replication Warm-up
// Adam Abouelela
// March 26, 2024
// Trying to replicate “Ninety Parallel Sinusoids With Linearly Increasing Period”


function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1.5);
  background(220);
  for (let y = 0; y < 99; y++){sinusoid(y*3+300)}
}

function sinusoid(y){
  for (let x = width*0.1; x <= width*0.9; x++){
    let sinx = map(x,width*0.1,width*0.9,0,5);
    let B = map(x,width*0.1,width*0.9,0,5);
    point(x,y+20*sin(B*(sinx+1.5)));
  }
 }
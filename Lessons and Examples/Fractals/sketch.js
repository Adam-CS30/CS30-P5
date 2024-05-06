// Creating Fractals
// Adam Abouelela
// May 6, 2024


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  //concentricCircles(width, 0);
  //cantor(width*0.1, height*0.1, width*0.8, 7)
  circleFractal(width/2, height/2, width/2, 8)
}

// Concentric Circles (Recursive 1)
function concentricCircles(diameter, depth){
  ellipseMode(CENTER);
  if (diameter > 0){
    circle(width/2, height/2, diameter);
    concentricCircles(diameter - 10);
  }
  else if (depth > 0){
    depth++;
    concentricCircles(diameter, depth);
  }
}

function circleFractal(x, y, diameter, depth){
  ellipseMode(CENTER);
  noFill();
  
  circle(x, y, diameter);
  
  if (depth > 1){
    circleFractal(x-diameter/2, y, diameter/2, depth-1);
    circleFractal(x+diameter/2, y, diameter/2, depth-1);
    circleFractal(x, y+diameter/2, diameter/2, depth-1);
  }
}

function cantor(x, y, len, depth){
  if (depth > 1){
    rect(x,y,len,10);
    y += 20;
    cantor(x, y, len/3, depth-1);
    cantor(x+len*2/3, y, len/3, depth-1);
  }
}
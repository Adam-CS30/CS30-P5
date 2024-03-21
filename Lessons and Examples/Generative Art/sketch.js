// Generative Art

let spacing = 20;

function setup() {
  createCanvas(800,800);
  strokeWeight(2);

}

function draw() {
  background(220);
  randomSeed(1);
  spacing = map(mouseX,0,width,60,10)
  drawLines();
}

function drawLines(){
  for (let x = 0; x<width; x += spacing){
    for (let y = 0; y<height; y += spacing){
      if (int(random(2)) == 0) {diagonalAsc(x,y)}
      else {diagonalDesc(x,y)}
    }
  }
}

function diagonalAsc(x,y){line(x-spacing/2, y+spacing/2, x+spacing/2, y-spacing/2)}
function diagonalDesc(x,y){line(x+spacing/2, y+spacing/2, x-spacing/2, y-spacing/2)}
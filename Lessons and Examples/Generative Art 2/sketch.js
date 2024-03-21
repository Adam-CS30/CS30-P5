// Generative Art 2

let spacing = 30;

function setup() {
  createCanvas(600, 900);
  rectMode(CENTER);
  drawDisarray();
}

function draw() {}

function drawDisarray(){
  for (let x = spacing/2; x<width; x+=spacing){
    for (let y = spacing/2; y<height; y+=spacing){
      push();
      translate(x,y)
      let rAmount = map(y,0,height,0,PI/4);
      rotate(random(-rAmount,rAmount));
      let offset = map(y,0,height,0,15)
      square(random(-offset,offset),random(-offset,offset),spacing);
      pop();
    }
  }
}
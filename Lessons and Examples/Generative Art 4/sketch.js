// Generative Art 4 - HSB and Custom Palettes

let rectWidth = 50, rectHeight = 10;
let colors = ['#5E9FA3', '#DCD1B4', '#FAB87F', '#F87E7B', '#B05574'];

function setup() {
  createCanvas(600, 900);
  noStroke();
  noLoop();
}

function draw() {
  background(220);
  drawRGB(width*0.1);
  drawHSB(width*0.3);
  drawCustom(width*0.5);
  drawCustom2(width*0.7);
}

function drawRGB(x){
  // draw a stack of rectangles at x = x using random RGB
  colorMode(RGB);
  for (let y = 0; y < height; y+=rectHeight){
    fill(random(255), random(255), random(255));
    rect(x,y,rectWidth,rectHeight);
  }
}

function drawHSB(x){
  // draw a stack of rectangles at x = x  cycling through HSB
  colorMode(HSB);
  for (let y = 0; y < height; y+=rectHeight){
    fill(map(y,0,height,0,360), 360, 300);
    rect(x,y,rectWidth,rectHeight);
  }
}

function drawCustom(x){
  // draw a stack of rectangles at x = x  cycling through HSB
  colorMode(RGB);
  let i = 0;
  for (let y = 0; y < height; y+=rectHeight){
    fill(colors[i % colors.length]);
    rect(x,y,rectWidth,rectHeight);
    i++;
  }
}

function drawCustom2(x){
  // draw a stack of rectangles at x = x  cycling through HSB
  colorMode(RGB);
  let i = 0;
  for (let y = 0; y < height; y+=rectHeight){
    fill(colors[int(random(colors.length))]);
    rect(x,y,rectWidth,rectHeight);
    i++;
  }
}
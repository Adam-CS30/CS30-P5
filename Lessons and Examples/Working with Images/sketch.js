// Working with Images
// Adam Abouelela
// March 14, 2024
//
// LOading and Displaying images / animations

let lionL, lionR;
let pinImages = [];
let counter = 0;

function preload(){
  lionL = loadImage("assets/lion-left.png");
  lionR = loadImage("assets/lion-right.png");
  for (let n=0; n<9; n++){
    pinImages.push(loadImage("assets/pin-0"+n+".png"))
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(220);
  //image(lionL,mouseX,mouseY,lionL.width/2,lionL.height/2);
  pinwheel(counter%9);
  counter++;
  if (counter===9){counter=0;}
}

function pinwheel(i){
  image(pinImages[i],width/2,height/2);
}
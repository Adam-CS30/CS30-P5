// Local Storage, Sound, CSS Centering
// Adam Abouelela
// May 7, 2024

let music, bounceSound;
let started = false;
let pos, vel;
let totalBounces;

function preload(){
  music = loadSound("assets/background.mp3");
  bounceSound = loadSound("assets/bounceSound.wav");
}

function setup() {
  createCanvas(400, 300);
  pos = createVector(width/2, height/2);
  vel = createVector(5,3);
  textSize(30);
  textAlign(CENTER);
  if (getItem("bounces")===null){storeItem("bounces", 0);}
  totalBounces = int(getItem('bounces'));
}

function draw() {
  background(220);
  if (started === false){
    text("Click to begin.", width/2, height/2);
    if (mouseIsPressed){
      started = true;
      music.setVolume(0.3);
      music.loop();
    }
  }
  else{updateBall(); text(totalBounces, width/2, height/2);}
}

function updateBall(){
  pos.add(vel);
  bounceSound.setVolume(0.9);
  if (pos.x < 0 || pos.x > width){vel.x *= -1; bounceSound.play(); totalBounces++; storeItem("bounces", totalBounces);}
  if (pos.y < 0 || pos.y > height){vel.y *= -1; bounceSound.play(); totalBounces++; storeItem("bounces", totalBounces);}
  circle(pos.x, pos.y, 20);
}
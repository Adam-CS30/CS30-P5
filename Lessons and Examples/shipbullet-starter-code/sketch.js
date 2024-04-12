// OOP Pair Programming Starter Code
// Your Names
// The Date


// ------------------------------------------------------------------------- //
// You don't need to edit this section...

let enterprise, bullets = [];
let shipImage, bulletImage;

function preload() {
  shipImage = loadImage("assets/enterprise.png");
  bulletImage = loadImage("assets/laser-shot.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  enterprise = new Ship(width/2, height/2, shipImage);
}

function draw() {
  background("black");
  enterprise.update();
  enterprise.display();
}

function keyPressed() {
  enterprise.handleKeyPress();
}


// ------------------------------------------------------------------------- //
// Start editing here!

class Ship {
  constructor(x, y, theImage) {
    this.x = x; this.y = y; this.size = 50; this.shipImg = theImage;
  }

  update() {
    // move ship -- you might want to use the keyIsDown() function here
    if (keyIsDown(LEFT_ARROW)){this.x-=3}
    if (keyIsDown(RIGHT_ARROW)){this.x+=3}
    if (keyIsDown(UP_ARROW)){this.y-=3}
    if (keyIsDown(DOWN_ARROW)){this.y+=3}
    
    // if doing extra for experts, show bullet(s)
    for (let bullet of bullets){
      bullet.update();
      bullet.display();
    }
  }

  display() {
    // show the ship
    image(this.shipImg, this.x, this.y, this.size, this.size);
  }

  handleKeyPress() {
    // you only need to use this if you are doing the extra for experts...
    // if you are, you should make a bullet if the space key was pressed
    if (keyPressed){
      print(key)
      if (key == ' '){
        bullets.push(new Bullet(this.x+10, this.y-this.size/2, bulletImage));
      }
    }
  }
}

// ------------------------------------------------------------------------- //

// Extra for Experts 
//  - you can instantiate a bullet (or a bullet array) within the Ship class,
//    and call the display and update functions in the logical location of the 
//    Ship class. If you create an array of bullets, you might want to think about
//    when the bullets should be removed from the array...

class Bullet {
  constructor(x, y) {
    // define the variables needed for the bullet here
    this.x = x; this.y = y; this.size = 30;
  }

  update() {
    // what does the bullet need to do during each frame? how do we know if it is off screen?
    this.y -= 10
  }

  display() {
    // show the bullet
    image(bulletImage, this.x, this.y, this.size, this.size);
  }

  isOnScreen() {
    // check if the bullet is still on the screen
    if (this.y < -5){bullets = bullets.shift()}
  }
}


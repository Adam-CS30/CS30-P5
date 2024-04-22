// Cars Cars Cars
// Adam Abouelela
// April 15, 2024

// A two way road for vehicles to travel on.
// Vehicles can be stopped by turning the traffic light red using the spacebar.
// Eastbound vehicles can be added with a left-click, while westbound vehicles are added with a shift + left click. 

// westbound holds vehicles traveling at the top to the left, while eastbound holds vehicles traveling at the bottom to the right.
let westbound = [], eastbound = [], trafficLight;

function setup() {
  // Works best on 900+ height.
  createCanvas(windowWidth, 900);
  rectMode(CENTER);
  ellipseMode(CENTER);

  // Pushes 20 vehicles into each array.
  // Eastbound vehicles spawn at the left, while westbound vehicles spawn to the right.
  // Vehicles have a semi-random starting y-pos, as their y-pos is confined to their lane.
  for (let i = 0; i < 20; i++){eastbound.push(new Vehicle(0, random(height/2 + 20, height*0.65 - 20)));}
  for (let i = 0; i < 20; i++){westbound.push(new Vehicle(width, random(height*0.35 + 20, height/2 - 20)));}

  // Creates a traffic light.
  trafficLight = new TrafficLight();
}

function draw() {
  background(220);
  // Draws the road.
  drawRoad();

  // Updates and draws the traffic light as well as all vehicles every frame.
  trafficLight.action();
  for (let v of eastbound){v.action();}
  for (let v of westbound){v.action();}
}

// This function draws the road.
function drawRoad(){
  // Draws the black rectangle.
  fill(0);
  rect(width/2, height/2, width, height*0.3);
  
  // Draws the white dashes.
  fill(255);
  for (let x = 0; x <= width; x+=50){rect(x, height/2, 30, 5);}
}

function mousePressed(){
  // Spawn a vehicle when the left mouse button is pressed.
  if (mouseButton === LEFT){
    // If shift was held down during the mouse click, then the vehicle is westbound, otherwise the vehicle is eastbound.
    if (keyCode === SHIFT){westbound.push(new Vehicle(width, random(height*0.37, height*0.48)));}
    else{eastbound.push(new Vehicle(0, random(height*0.52, height*0.63)));}
  }
}

function keyPressed(){
  // If the spacebar was pressed set the traffic light color to red.
  if (key === ' '){trafficLight.switchLight()}
}

class Vehicle{
  constructor(x, y){
    // The x and y positions.
    this.x = x; this.y = y;

    // Randomizes the type of vehicle, its initial speed, and color.
    this.type = int(random(2)); this.xSpeed = int(random(5,10)); this.color = color(random(255),random(255),random(255))
    
    // 'reflect' will flip the way the vehicle is drawn if they travel west.
    if (this.y < height/2){this.reflect = -1;}
    else {this.reflect = 1;}
  }

  // Draws the vehicle based on its type, direction, and color.
  display(){
    fill(this.color);

    if (this.type){
      // Truck
      rect(this.x+20*this.reflect, this.y, 40, 30);
      rect(this.x+45*this.reflect, this.y, 10, 30);
    }

    else{
      // Car
      rect(this.x+25*this.reflect, this.y, 50, 20);
      fill(255);
      rect(this.x+8*this.reflect, this.y-12, 10, 3);
      rect(this.x+8*this.reflect, this.y+12, 10, 3);
      rect(this.x+42*this.reflect, this.y-12, 10, 3);
      rect(this.x+42*this.reflect, this.y+12, 10, 3);
    }
  }

  move(){
    // Modify the position of the vehicle based on its speed and direction.
    this.x += this.xSpeed*this.reflect;
    
    // If an eastbound vehicle passes the right edge of the screen, it will reposition behind the left edge of the screen.
    if (this.x > width && this.reflect === 1){this.x=-50}
    // If an westbound vehicle passes the left edge of the screen, it will reposition behind the right edge of the screen.
    else if (this.x < 0 && this.reflect === -1){this.x=width+50}
  }

  // Increase the speed of the vehicle by 1 up to a max of 15.
  speedUp(){if (this.xSpeed < 15){this.xSpeed++;}}
  // Decrease the speed of the vehicle by 1 down to a minimum of 0.
  speedDown(){if (this.xSpeed > 0){this.xSpeed--;}}
  
  // Change the color of the vehicle to a random RGB color.
  changeColor(){this.color = color(random(255),random(255),random(255));}

  action(){ 
    // A vehicle can only move and change speed if the traffic light is green.
    if (trafficLight.light === 0){
      this.move();
      
      // A vehicle has a 1% chance to speed up and a 1% chance to slow down once per frame. A vehicle can't speed up and slow down on the same frame.
      if (random() < 0.01){this.speedUp();}
      else if (random() < 0.01){this.speedDown();}
    }
    
    // A vehicle has a 1% chance to change its color.
    if (random() < 0.01){this.changeColor();}
    
    // Display the vehicle.
    this.display();
  }
}

class TrafficLight{
  constructor(){
    // 'light' is the state of the traffic light (red = 1, green = 0). 
    //'timer' helps to keep track of the number of frames that have passed since 'space' was last pressed.
    this.light = 0; this.frames = 0;
  }

  // Gets called when the spacebar is pressed.
  switchLight(){
    // Sets the light to 1 (red) and sets 'frames' to the current frame count.
    this.light = 1;
    this.frames = frameCount;
  }

  // Draws the traffic light.
  display(){
    // Draws the grey rectangle of the traffic light.
    fill(60);
    rect(width/2, height/2-225, 400, 120);

    // Draws the red light (on when 'light' is set to 1).
    if (this.light === 0){fill(100,20,20)}
    else{fill(255,50,50)}
    circle(width/2 - 125, height/2-225, 100);

    // Draws the amber light (this never turns on).
    fill(100, 50, 0);
    circle(width/2, height/2-225, 100);

    // Draws the green light (on when 'light' is set to 0).
    if (this.light === 1){fill(20,100,20)}
    else{fill(50,200,50)}
    circle(width/2 + 125, height/2-225, 100);
  }

  // Checks and corrects the state of 'light' and then draws the traffic light.
  action(){
    // If the light is red and at least 120 frames have passed since the user last pressed the spacebar, then turn the light green.
    if (this.light === 1 && frameCount - this.frames >= 120){this.light = 0;}

    // Display the traffic light.
    this.display();
  }
}

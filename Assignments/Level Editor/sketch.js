let rock, spikesImg;
let type = 1;
let orient = 0;
let scaling;
let shiftPos = false;
const tileSide = 8, tiledWidth = 40, tiledHeight = 22;

let spikes = '[]';
let spikeArray = [];
let tiledScreen = [];
let spawn;

function preload(){
  rock = loadImage('images/rock.png');
  spikesImg = loadImage('images/spikes.png');
}

function setup() {
  // The scaling is based on how big of a canvas with a specific aspect ratio can wholly fit in the window.
  if (windowWidth/(tiledWidth*tileSide) < windowHeight/(tiledHeight*tileSide)){scaling = windowWidth/(tiledWidth*tileSide);}
  else{scaling = windowHeight/(tiledHeight*tileSide);}
  scaling -= scaling % (1/8); // Dispayed tiles don't line up properly without this.

  createCanvas(tiledWidth*tileSide*scaling, tiledHeight*tileSide*scaling); //(320x180 real screen)
  noStroke();

  for (let y = 0; y < tiledHeight; y++){
    tiledScreen.push([]);
    for (let x = 0; x < tiledWidth; x++){
      tiledScreen[y].push(0);
    }
  }

  //spikes = '[new Spikes(2, 8, 4, 0), new Spikes(1, 14, 4, 0), new Spikes(13, 17, 1, 0), new Spikes(13, 19, 1, 2), new Spikes(12, 18, 1, 3), new Spikes(14, 18, 1, 1), new Spikes(21, 17, 1, 1), new Spikes(27, 17, 1, 1), new Spikes(27, 12, 1, 1), new Spikes(26, 11, 1, 0), new Spikes(26, 16, 1, 0), new Spikes(25, 17, 1, 3), new Spikes(26, 18, 1, 2), new Spikes(20, 18, 1, 2), new Spikes(20, 13, 1, 2), new Spikes(13, 14, 1, 2), new Spikes(12, 13, 1, 3), new Spikes(19, 12, 1, 3), new Spikes(19, 17, 1, 3), new Spikes(25, 12, 1, 3), new Spikes(26, 13, 1, 2), new Spikes(20, 11, 1, 0), new Spikes(13, 12, 1, 0), new Spikes(21, 12, 1, 1), new Spikes(14, 13, 1, 1), new Spikes(20, 16, 1, 0), new Spikes(8, 2, 14, 1), new Spikes(21, 4, 19, 2)]';
  //spikeArray = [new Spikes(2, 8, 4, 0), new Spikes(1, 14, 4, 0), new Spikes(13, 17, 1, 0), new Spikes(13, 19, 1, 2), new Spikes(12, 18, 1, 3), new Spikes(14, 18, 1, 1), new Spikes(21, 17, 1, 1), new Spikes(27, 17, 1, 1), new Spikes(27, 12, 1, 1), new Spikes(26, 11, 1, 0), new Spikes(26, 16, 1, 0), new Spikes(25, 17, 1, 3), new Spikes(26, 18, 1, 2), new Spikes(20, 18, 1, 2), new Spikes(20, 13, 1, 2), new Spikes(13, 14, 1, 2), new Spikes(12, 13, 1, 3), new Spikes(19, 12, 1, 3), new Spikes(19, 17, 1, 3), new Spikes(25, 12, 1, 3), new Spikes(26, 13, 1, 2), new Spikes(20, 11, 1, 0), new Spikes(13, 12, 1, 0), new Spikes(21, 12, 1, 1), new Spikes(14, 13, 1, 1), new Spikes(20, 16, 1, 0), new Spikes(8, 2, 14, 1), new Spikes(21, 4, 19, 2)];
  tiledScreen = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[1,1,1,1,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,2,2,2,2,1,1,2,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,1,1,1,1,1,1,2,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,1,2,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,1,1,2,0,0,0,0,2,0,0,0,0,0,2,1,2,0,0,0,2,1,2,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,1,1,2,0,0,0,2,1,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,2,2,2,2,0,1,1,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,0,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,2,1,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1]];
  //spawn = 'createVector(2, 19)';

  for (let y = 0; y < tiledHeight; y++){
    for (let x = 0; x < tiledWidth; x++){
      if (tiledScreen[y][x] === 2){(tiledScreen)[y][x] = 0}
    }
  }
}

function draw(){
  if (!keyIsDown(SHIFT)){shiftPos = false;}
  scale(scaling)
  background(10, 15, 30);

  display();
  tileOverlay(int(constrain(mouseX/tileSide/scaling, 0, tiledWidth-1)), int(constrain(mouseY/tileSide/scaling, 0, tiledHeight-1)));
}

function display(){
  for (let y in tiledScreen){
    for (let x in tiledScreen[y]){
      if (tiledScreen[y][x] === 3){fill(200,50,50); square(x*tileSide, y*tileSide, tileSide);}
      else if (tiledScreen[y][x] === 1){image(rock, x*tileSide, y*tileSide, tileSide, tileSide);}
    }
  }

  for (let spike of spikeArray){spike.display();}
}

function tileOverlay(x, y){
  tint(255, 150);

  if (type === 2 && shiftPos){
    if (orient % 2 === 0){y = shiftPos.y;}
    else{x = shiftPos.x;}
  }

  if (shiftPos){rectMode(CORNERS); fill(100, 150); rect(shiftPos.x*tileSide, shiftPos.y*tileSide, (x+1)*tileSide, (y+1)*tileSide); rectMode(CORNER);}

  if (type === 0){fill(255,150); square(x*tileSide, y*tileSide, tileSide);}
  else if (type === 3){fill(200,50,50,150); square(x*tileSide, y*tileSide, tileSide);}
  else if (type === 1){image(rock, x*tileSide, y*tileSide, tileSide, tileSide);}
  else{
    push();
    let offsetX = 0;
    let offsetY = 0;
    if (orient === 1 || orient === 2){offsetX++;}
    if (orient === 3 || orient === 2){offsetY++;}

    translate((x+offsetX)*tileSide, (y+offsetY)*tileSide);
    rotate(PI/2*orient);
    image(spikesImg, 0, 3, tileSide, 5);
    pop();
  }

  noTint();
}

function place(x, y){
  if (keyIsDown(SHIFT) && type !== 3){
    if (!shiftPos){shiftPos = createVector(x, y); return;}
    else{placeRec(x, y, shiftPos.x, shiftPos.y); shiftPos = false; return;}
  }
  else{shiftPos = false;}

  fill(50, 220, 100, 150);

  if (type === 2){
    spikeArray.push(new Spikes(x, y, 1, orient));
    spikes = spikes.slice(0, spikes.length-1) + 'new Spikes(' + x.toString() + ', ' + y.toString() + ', ' + (1).toString() + ', ' + orient.toString() + '), ]';
  }

  if (type === 3){
    for (let y in tiledScreen){
      for (let x in tiledScreen[y]){
        if (tiledScreen[y][x] === 3){tiledScreen[y][x] = 0;}
      }
    }
  }

  if (type === 3){spawn = 'createVector(' + x.toString() + ', ' + (y+1).toString() + ')'; tiledScreen[y][x] = 3; print(spawn);}
  else{tiledScreen[y][x] = type;}
}

function placeRec(x2, y2, x1, y1){
  if (x2 < x1 || y2 < y1){return;}

  if (type === 2){
    if (orient % 2 === 0){y2 = shiftPos.y;}
    else{x2 = shiftPos.x;}
  }

  for (let h = y2-y1; h >= 0; h--){
    for (let w = x2-x1; w >= 0; w--){
      tiledScreen[y1+h][x1+w] = type;
    }
  }

  if (type === 2){
    spikeArray.push(new Spikes(x1, y1, max(x2-x1, y2-y1) + 1, orient));
    spikes = spikes.slice(0, spikes.length-1) + 'new Spikes(' + x1.toString() + ', ' + y1.toString() + ', ' + (max(x2-x1, y2-y1) + 1).toString() + ', ' + orient.toString() + '), ]';
  }
}

function keyPressed(){
  print(shiftPos)
  if (keyIsDown(SHIFT)){return;}
  if (key === '0' || key === '1' || key === '2' || key === '3'){type = int(key); orient = 0;}
  else if (key === 'r' && type === 2){orient++; if (orient > 3){orient = 0;}}
  else if (key === 'c'){
    spawn = null;
    spikeArray = [];
    spikes = '[]';

    for (let y = 0; y < tiledHeight; y++){
      for (let x = 0; x < tiledWidth; x++){
        tiledScreen[y][x] = 0;
      }
    }
  }
  else if (key === 's'){
    for (let y in tiledScreen){
      for (let x in tiledScreen[y]){
        if (tiledScreen[y][x] === 3){tiledScreen[y][x] = 0;}
      }
    }

    print(spawn);
    if (spikes.length > 2){print(spikes.slice(0, spikes.length-3) + ']');}
    else {print(spikes);}
    saveTiles(tiledScreen);
  }
}

function saveTiles(tiles){
  // Create a temporary URL for the Blob
  let url = URL.createObjectURL(new Blob([JSON.stringify(tiles)], { type: 'text/plain' }));

  // Create a hidden anchor element
  let a = document.createElement('a');
  a.href = url;
  a.download = 'tiledScreen.txt'; // Set the filename
  document.body.appendChild(a);
  a.click();

  // Clean up: Remove the anchor element and revoke the Blob URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function mousePressed(){
  place(int(constrain(mouseX/tileSide/scaling, 0, tiledWidth-1)), int(constrain(mouseY/tileSide/scaling, 0, tiledHeight-1)));
}

class Spikes{
  // 3:5 h:d
  constructor(x, y, s, orientation){
    this.tileX = x*tileSide; this.tileY = y*tileSide;
    this.pos = createVector(this.tileX, this.tileY);
    this.length = s;
    this.orientation = orientation;

    if (this.orientation % 2 === 0){this.sX = s*tileSide; this.sY = 5;}
    else{this.sX = 5; this.sY = s*tileSide;}

    if (this.orientation === 3){this.pos.x += tileSide-this.sX;}
    else if (this.orientation === 0){this.pos.y += tileSide-this.sY;}
  }

  display(){
    for (let i = 0; i < this.length; i++){

      push();
      let x = this.tileX;
      let y = this.tileY;
      if (this.orientation % 2 === 0){x+=i*tileSide;}
      else{y+=i*tileSide;}

      let offsetX = 0;
      let offsetY = 0;
      if (this.orientation === 1 || this.orientation === 2){offsetX += tileSide;}
      if (this.orientation === 3 || this.orientation === 2){offsetY += tileSide;}

      translate(x+offsetX, y+offsetY);
      rotate(PI/2*this.orientation);
      image(spikesImg, 0, 3, tileSide, 5);
      pop();
    }
  }
}
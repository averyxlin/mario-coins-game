/* ____    ___       _      _       ____  
  / ___|  / _ \     / \    | |     / ___| 
 | |  _  | | | |   / _ \   | |     \___ \ 
 | |_| | | |_| |  / ___ \  | |___   ___) |
  \____|  \___/  /_/   \_\ |_____| |____/ 
                       
-- Let's come up with goals together! --
1) Make the time count down
2) Figured out how to bring in a library
3) Check if the mouse hits the coin
3a) Move the coin somewhere else
3b) Update the score
4) stop the game when time is up
5) Show 'game over' or something similar

  ____    _____   ____    _____   _____    ____   _   _ 
 / ___|  |_   _| |  _ \  | ____| |_   _|  / ___| | | | |
 \___ \    | |   | |_) | |  _|     | |   | |     | |_| |
  ___) |   | |   |  _ <  | |___    | |   | |___  |  _  |
 |____/    |_|   |_| \_\ |_____|   |_|    \____| |_| |_|

1)  Multiple coins on the screen at a time
2)  Coins of varying values
3)  Colors and decorations for coins
4)  Time-extending power-ups
5)  Coins that expire / move after a certain length of time.
6)  A player token that grows or shrinks as coins are collected.
7)  Coins that bounce around screen like the DVD logo did.
8)  Coins that simulate the rotating motion of Mario coins.
9)  A “restart” button or click function.
10) A larger, more pronounced “game over” proclamation.
11) A score rater (i.e. okay, good, great, outstanding!)
12) A high score over multiple plays.

*/

// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, WEBGL,
 *    colorMode,
 *    HSB,
 *    random,
 *    width,
 *    height,
 *    background,
 *    ellipse,
 *    mouseX,
 *    mouseY,
 *    createCanvas,
 *    text,
 *    collideCircleCircle,
 *    circle,
 *    loadImage, loadFont, textFont, textSize,
 *    image, tint,
 *    fill,
 *    WEBGL,
 *    textAlign, RIGHT, LEFT,
 *    rotateY, translate, angleMode, DEGREES,
 */

let backgroundImage;

let score, time, gameIsOver;
let coin1X, coin1Y, coin1Rotation;
let coin2X, coin2Y, coin2Rotation;
let coin3X, coin3Y, coin3Rotation;
let mushroomX, mushroomY, shouldDrawMushroom;
let marioSize, coinSize, mushroomSize, maxMarioSize;

let marioImage, coinImage, mushroomImage;
let productSansFont;

function preload() {
  backgroundImage = loadImage('https://cdn.glitch.com/3a489548-02ed-4b83-aa36-a81617fdea0a%2Fbackground_img.png?v=1594681039623');
  marioImage = loadImage('https://cdn.glitch.com/3a489548-02ed-4b83-aa36-a81617fdea0a%2FPaper-Mario-icon.png?v=1594675429292');
  coinImage = loadImage('https://cdn.glitch.com/3a489548-02ed-4b83-aa36-a81617fdea0a%2Fcoin.png?v=1594677304311');
  mushroomImage = loadImage('https://cdn.glitch.com/3a489548-02ed-4b83-aa36-a81617fdea0a%2Fmushroom.png?v=1594681222171');
  productSansFont = loadFont('https://cdn.glitch.com/3a489548-02ed-4b83-aa36-a81617fdea0a%2FProductSans-Regular.ttf?v=1594678726380');
}

function setup() {
  const backgroundImageAspectRatio = 970/647; // Image dimensions.
  const canvasWidth = Math.min(window.innerWidth - 20, 768);
  const canvasHeight = canvasWidth / backgroundImageAspectRatio;
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  
  angleMode(DEGREES);
  coin1X = random(width);
  coin1Y = random(height);
  coin1Rotation = random(360);
  coin2X = random(width);
  coin2Y = random(height);
  coin2Rotation = random(360);
  coin3X = random(width);
  coin3Y = random(height);
  coin3Rotation = random(360);
  
  shouldDrawMushroom = true;
  mushroomX = random(width);
  mushroomY = random(height);
  
  mushroomSize = 24;
  marioSize = 24;
  maxMarioSize = 96;
  coinSize = 20;

  textFont(productSansFont);
  textSize(15);
  time = 1000;
  gameIsOver = false;
  score = 0;
}

function draw() {
  image(backgroundImage, -width / 2, -height / 2, width, height);
  
  drawGameData();
  
  if (!gameIsOver) {
    drawCoins();

    if (shouldDrawMushroom) {
      drawMushroom();
    }
  }

  drawMario();
}

function drawGameData() {
  fill('white');
  textAlign(LEFT);
  text(`Time remaining: ${time}`, 10 - width / 2, 20 - height / 2);
  textAlign(RIGHT);
  text(`Score: ${score}`, width / 2 - 10, 20 - height / 2);

  if (time > 0) {
    time = time - 2;
  }
  
  if (time == 0) {
    gameIsOver = true;
  }
}

function drawCoins() {
  // Draw each coin; if Mario is hitting it, move it and update the score.

  drawCoin(coin1X, coin1Y, coin1Rotation);
  coin1Rotation -= 5; 
  if (collideCircleCircle(mouseX, mouseY, marioSize, coin1X, coin1Y, coinSize)) {
    coin1X = random(width);
    coin1Y = random(height);
    coin1Rotation = 0;
    score++;
  }

  drawCoin(coin2X, coin2Y, coin2Rotation);  
  coin2Rotation -= 5; 
  if (collideCircleCircle(mouseX, mouseY, marioSize, coin2X, coin2Y, coinSize)) {
    coin2X = random(width);
    coin2Y = random(height);
    coin2Rotation = 0;
    score++;
  }

  drawCoin(coin3X, coin3Y, coin3Rotation); 
  coin3Rotation -= 5;
  if (collideCircleCircle(mouseX, mouseY, marioSize, coin3X, coin3Y, coinSize)) {
    coin3X = random(width);
    coin3Y = random(height);
    coin3Rotation = 0;
    score++;
  }
}

function drawCoin(x, y, rotation) {
  // We want the image to be centered over its coordinates.
  let coinImageX = x - width / 2 - coinSize / 2;
  let coinImageY = y - height / 2 - coinSize / 2;
  
  // translate coinSize/2 in the z direction. Because of the y-rotation
  // half the coin was going behind the background image.
  translate(coinImageX, coinImageY, coinSize / 2);
  rotateY(rotation);
  
  image(coinImage, -coinSize / 2, -coinSize / 2, coinSize, coinSize);
  
  rotateY(-rotation);
  translate(-coinImageX, -coinImageY, -coinSize / 2);
}

function drawMario() {
  // We want the image to be centered over the mouse.
  let marioX = mouseX - width / 2 - marioSize / 2;
  let marioY = mouseY - height / 2 - marioSize / 2;
  image(marioImage, marioX, marioY, marioSize, marioSize);
}

function drawMushroom() {
  let mushroomImageX = mushroomX - width / 2 - mushroomSize / 2;
  let mushroomImageY = mushroomY - height / 2 - mushroomSize / 2;
  
  image(mushroomImage, mushroomImageX, mushroomImageY, mushroomSize, mushroomSize);
  
  if (collideCircleCircle(mouseX, mouseY, marioSize, mushroomX, mushroomY, mushroomSize)) {
    // Move the mushroom.
    mushroomX = random(width);
    mushroomY = random(height);
    
    // Grow Mario.
    marioSize += 10;
    if (marioSize > maxMarioSize) {
      marioSize = maxMarioSize;
      shouldDrawMushroom = false;
    }
    
    // Get more time.
    time += 150;
  }
}
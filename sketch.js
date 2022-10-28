var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var score;

var gameOver, gameOverImage, restart, restartImage;

var checkpointSound, dieSound, jumpSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImage = loadImage("gameOver.png");

  restartImage = loadImage("restart.png");

  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(600, 200);

  //creating trex
  trex = createSprite(50, 180, 20, 20);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  //creating ground
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  //creating game over
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  //creating restart
  restart = createSprite(300, 140);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;

  //creating invisble ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //creating obstacles, clouds group
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //cretaing a message
  console.log("Hello" + 5);

  //giving the vale of score
  score = 0;

  //trex debug, collider
  trex.debug = true;
  trex.setCollider("circle", 0, 0, 45);

  var message = "trex game";
  //console.log(message);
}

function draw() {
  background(180);

  text("Score: " + score, 520, 40);

  if (gameState === PLAY) {
    ground.velocityX = -(4 + score / 100);

    score = score + Math.round(getFrameRate()/ 60);

    if (ground.x < 0) {
      ground.x = ground.width / 4;
    }

    if (keyDown("space") && trex.y >= 150) {
      trex.velocityY = -10;
      jumpSound.play();
    }

    if (score > 0 && score % 100 === 0) {
      checkpointSound.play();
    }

    trex.velocityY = trex.velocityY + 0.5;

    spawnClouds();

    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play(); 
      //trex.velocityY = -10;
      //jumpSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;

    ground.velocityX = 0;

    obstaclesGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);

    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  trex.collide(invisibleGround);

  //console.log(message)

  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 300;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }
}

function reset() {
  gameState = PLAY
  score = 0

  obstaclesGroup.destroyEach ();
  cloudsGroup.destroyEach ();

  gameOver.visible = false
  restart.visible = false

  trex.changeAnimation("running", trex_running);
  
}

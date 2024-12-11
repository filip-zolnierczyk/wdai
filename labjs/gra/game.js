const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bgImage = new Image();
bgImage.src = "./images/board-bg.jpg";

const zombieSprite = new Image();
zombieSprite.src = "./images/walkingdead.png";

const heartImage = new Image();
heartImage.src = "./images/full_heart.png";

const emptyHeartImage = new Image();
emptyHeartImage.src = "./images/empty_heart.png";

const crosshairImage = new Image();
crosshairImage.src = "./images/aim.png";

const sadMusic = new Audio("./images/sad-music.mp3");

const crosshair = { x: 0, y: 0 };

let maxLives = 3;
let lives = 3;
let score = 0;

const zombies = [];
const zombieSpriteParams = {
  frameWidth: 200,
  frameHeight: 312,
  frameCount: 10,
  currentFrame: 0,
  animationSpeed: 5,
  tickCount: 0,
};

canvas.style.cursor = "none";

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  crosshair.x = event.clientX - rect.left;
  crosshair.y = event.clientY - rect.top;
});

canvas.addEventListener("click", () => {
  let hit = false;
  zombies.forEach((zombie, index) => {
    if (
      crosshair.x >= zombie.x &&
      crosshair.x <= zombie.x + zombie.width &&
      crosshair.y >= zombie.y &&
      crosshair.y <= zombie.y + zombie.height
    ) {
      zombies.splice(index, 1);
      score += 20;
      hit = true;
    }
  });
  if (!hit) {
    score -= 5;
  }
});

function spawnZombie() {
  const scale = Math.random() * 0.5 + 0.75;
  const zombie = {
    x: canvas.width,
    y: Math.random() * (canvas.height - zombieSpriteParams.frameHeight * scale),
    speed: Math.random() * 2 + 1,
    width: zombieSpriteParams.frameWidth * scale,
    height: zombieSpriteParams.frameHeight * scale,
  };
  zombies.push(zombie);
}

function drawZombie(zombie) {
  const params = zombieSpriteParams;
  params.tickCount++;
  if (params.tickCount > params.animationSpeed) {
    params.tickCount = 0;
    params.currentFrame = (params.currentFrame + 1) % params.frameCount;
  }
  const sx = params.currentFrame * params.frameWidth;
  ctx.drawImage(
    zombieSprite,
    sx,
    0,
    params.frameWidth,
    params.frameHeight,
    zombie.x,
    zombie.y,
    zombie.width,
    zombie.height
  );
  zombie.x -= zombie.speed;
  if (zombie.x < -zombie.width) {
    zombies.splice(zombies.indexOf(zombie), 1);
    lives -= 1;
    if (lives <= 0) {
      endGame();
    }
  }
}

function drawHearts() {
  const heartSize = 40;
  const margin = 10;
  for (let i = 0; i < maxLives; i++) {
    if (i < lives) {
      ctx.drawImage(heartImage, 10 + i * (heartSize + margin), 10, heartSize, heartSize);
    } else {
      ctx.drawImage(emptyHeartImage, 10 + i * (heartSize + margin), 10, heartSize, heartSize);
    }
  }
}

function drawScore() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "white";
  const text = "Score: " + score;
  const textWidth = ctx.measureText(text).width;
  ctx.fillText(text, canvas.width - textWidth - 20, 60);
}

function drawBackground() {
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

function drawCrosshair() {
  const crosshairSize = 320;
  ctx.drawImage(
    crosshairImage,
    crosshair.x - crosshairSize / 2,
    crosshair.y - crosshairSize / 2,
    crosshairSize,
    crosshairSize
  );
}

function endGame() {
  sadMusic.play();
  sadMusic.loop = false;
  alert("Game Over! Your score: " + score);
  sadMusic.pause();
  sadMusic.currentTime = 0;
  lives = maxLives;
  score = 0;
  zombies.length = 0;
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawHearts();
  drawScore();
  zombies.forEach(drawZombie);
  drawCrosshair();
  requestAnimationFrame(updateGame);
}

setInterval(spawnZombie, 2000);
updateGame();

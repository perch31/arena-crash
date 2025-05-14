
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 550, width: 40, height: 40 };
let bullets = [];
let enemies = [];
let score = 0;

const shootSound = new Audio("shoot.wav");

function drawPlayer() {
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(b => {
    ctx.fillRect(b.x, b.y, b.width, b.height);
    b.y -= 5;
  });
  bullets = bullets.filter(b => b.y > 0);
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
    e.y += 2;
  });
  enemies = enemies.filter(e => e.y < canvas.height);
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width &&
          b.x + b.width > e.x &&
          b.y < e.y + e.height &&
          b.y + b.height > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score++;
        document.getElementById("score").textContent = score;
      }
    });
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  detectCollisions();
  requestAnimationFrame(gameLoop);
}

function shoot() {
  bullets.push({ x: player.x + 16, y: player.y, width: 8, height: 10 });
  shootSound.currentTime = 0;
  shootSound.play();
}
function moveLeft() {
  player.x -= 10;
}
function moveRight() {
  player.x += 10;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === " " || e.key === "Spacebar") shoot();
});

setInterval(() => {
  let x = Math.random() * (canvas.width - 40);
  enemies.push({ x: x, y: 0, width: 40, height: 40 });
}, 1000);

gameLoop();

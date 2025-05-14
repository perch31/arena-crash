const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let sensitivity = 1.5;
let player = { x: canvas.width / 2 - 20, y: canvas.height - 80, width: 40, height: 40 };
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
    b.y -= 10;
  });
  bullets = bullets.filter(b => b.y > 0);
}

function drawEnemies() {
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
    e.y += e.speed;
  });
  enemies = enemies.filter(e => e.y < canvas.height);
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += e.points;
      }
    });
  });
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 30);
  const speed = 2 + Math.random() * 3;
  const colors = ["red", "blue", "green", "orange", "purple"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const points = { red: 1, blue: 2, green: 3, orange: 4, purple: 5 }[color];
  enemies.push({ x, y: -30, width: 30, height: 30, speed, color, points });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawSettings() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(10, canvas.height - 80, 160, 70);
  ctx.fillStyle = "white";
  ctx.fillText("Sensitivity: " + sensitivity.toFixed(1), 20, canvas.height - 50);
  ctx.fillText("Use +/- keys", 20, canvas.height - 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawEnemies();
  detectCollisions();
  drawScore();
  drawSettings();
  requestAnimationFrame(gameLoop);
}

// Klavye ile kontrol (masaüstü için)
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
    shootSound.play();
  }
  if (e.key === "+") sensitivity += 0.1;
  if (e.key === "-") sensitivity = Math.max(0.1, sensitivity - 0.1);
});

// Dokunmatik kontroller (mobil)
canvas.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  player.x = touch.clientX - player.width / 2;
});

canvas.addEventListener("touchstart", (e) => {
  bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
  shootSound.play();
});

setInterval(spawnEnemy, 800);
gameLoop();

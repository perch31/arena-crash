const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameState = "menu";
let sensitivity = 1.5;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let bullets = [];
let enemies = [];
let soundOn = true;
let isTouching = false;
let shootInterval;
let player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 80,
  width: 40,
  height: 40
};
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
    if (e.shape === "circle") {
      ctx.beginPath();
      ctx.arc(e.x + e.width/2, e.y + e.height/2, e.width/2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(e.x, e.y, e.width, e.height);
    }

    e.y += e.speed;

    if (
      e.y + e.height > player.y &&
      e.x < player.x + player.width &&
      e.x + e.width > player.x
    ) {
      endGame();
    }
  });
  enemies = enemies.filter(e => e.y < canvas.height);
}

function detectCollisions() {
  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      let hit = false;
      if (e.shape === "circle") {
        const dx = b.x + b.width / 2 - (e.x + e.width / 2);
        const dy = b.y + b.height / 2 - (e.y + e.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < e.width / 2 + b.width / 2) hit = true;
      } else {
        if (
          b.x < e.x + e.width &&
          b.x + b.width > e.x &&
          b.y < e.y + e.height &&
          b.y + b.height > e.y
        ) hit = true;
      }
      if (hit) {
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
  const shape = Math.random() < 0.5 ? "square" : "circle";
  enemies.push({ x, y: -30, width: 30, height: 30, speed, color, points, shape });
}

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y,
    width: 4,
    height: 10
  });
  if (soundOn) shootSound.play();
}

function drawMenu() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Arena Clash", canvas.width / 2, canvas.height / 2 - 100);
  drawButton("Başla", canvas.width / 2, canvas.height / 2);
  drawButton("Ayarlar", canvas.width / 2, canvas.height / 2 + 80);
}

function drawSettings() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Ayarlar", canvas.width / 2, 100);
  ctx.fillText("Hassasiyet: " + sensitivity.toFixed(1), canvas.width / 2, 180);
  ctx.fillText("Ses: " + (soundOn ? "Açık" : "Kapalı"), canvas.width / 2, 230);
  drawButton("+", canvas.width / 2 - 60, 280, 50);
  drawButton("-", canvas.width / 2 + 60, 280, 50);
  drawButton("Sesi " + (soundOn ? "Kapat" : "Aç"), canvas.width / 2, 350);
  drawButton("Geri", canvas.width / 2, canvas.height - 80);
  drawButton("Çık", canvas.width / 2, canvas.height - 20);
}

function drawGameOver() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "35px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Oyun Bitti", canvas.width / 2, canvas.height / 2 - 80);
  ctx.fillText("Skor: " + score, canvas.width / 2, canvas.height / 2);
  ctx.fillText("En Yüksek Skor: " + highScore, canvas.width / 2, canvas.height / 2 + 40);
  drawButton("Menüye Dön", canvas.width / 2, canvas.height / 2 + 120);
}

function drawButton(text, x, y, width = 160, height = 50) {
  ctx.fillStyle = "#333";
  ctx.fillRect(x - width / 2, y - height / 2, width, height);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y + 8);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Score: " + score, 10, 30);
}

function endGame() {
  gameState = "gameover";
  highScore = Math.max(highScore, score);
  localStorage.setItem("highScore", highScore);
}

function startGame() {
  gameState = "playing";
  score = 0;
  bullets = [];
  enemies = [];
  player.x = canvas.width / 2 - 20;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameState === "menu") drawMenu();
  else if (gameState === "settings") drawSettings();
  else if (gameState === "gameover") drawGameOver();
  else if (gameState === "playing") {
    drawPlayer();
    drawBullets();
    drawEnemies();
    detectCollisions();
    drawScore();
  }
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  if (gameState === "menu") {
    if (isInButton(x, y, canvas.width / 2, canvas.height / 2)) startGame();
    else if (isInButton(x, y, canvas.width / 2, canvas.height / 2 + 80)) gameState = "settings";
  } else if (gameState === "settings") {
    if (isInButton(x, y, canvas.width / 2 - 60, 280, 50)) sensitivity += 0.1;
    else if (isInButton(x, y, canvas.width / 2 + 60, 280, 50)) sensitivity = Math.max(0.1, sensitivity - 0.1);
    else if (isInButton(x, y, canvas.width / 2, 350)) soundOn = !soundOn;
    else if (isInButton(x, y, canvas.width / 2, canvas.height - 80)) gameState = "menu";
    else if (isInButton(x, y, canvas.width / 2, canvas.height - 20)) location.reload();
  } else if (gameState === "gameover") {
    if (isInButton(x, y, canvas.width / 2, canvas.height / 2 + 120)) gameState = "menu";
  } else if (gameState === "playing") {
    isTouching = true;
    player.x = x - player.width / 2;
    shoot();
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (gameState === "playing") {
    const touch = e.touches[0];
    player.x = touch.clientX - player.width / 2;
  }
});

canvas.addEventListener("touchend", () => {
  isTouching = false;
});

function isInButton(tx, ty, bx, by, bw = 160, bh = 50) {
  return (
    tx > bx - bw / 2 &&
    tx < bx + bw / 2 &&
    ty > by - bh / 2 &&
    ty < by + bh / 2
  );
}

setInterval(() => {
  if (gameState === "playing" && isTouching) {
    shoot();
  }
}, 300);

setInterval(() => {
  if (gameState === "playing") spawnEnemy();
}, 800);

gameLoop();

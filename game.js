const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  size: 30,
  color: 'lime',
  bullets: [],
};

const enemies = [];
let score = 0;

function shootBullet(x, y) {
  player.bullets.push({ x, y, size: 5 });
}

function spawnEnemy() {
  const x = Math.random() * (canvas.width - 30);
  enemies.push({ x, y: 0, size: 30 });
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

  // Update bullets
  player.bullets.forEach((b, i) => {
    b.y -= 10;
    ctx.fillStyle = 'yellow';
    ctx.fillRect(b.x - b.size / 2, b.y - b.size / 2, b.size, b.size);
    if (b.y < 0) player.bullets.splice(i, 1);
  });

  // Update enemies
  enemies.forEach((e, ei) => {
    e.y += 3;
    ctx.fillStyle = 'red';
    ctx.fillRect(e.x, e.y, e.size, e.size);

    // Collision
    player.bullets.forEach((b, bi) => {
      if (b.x > e.x && b.x < e.x + e.size && b.y > e.y && b.y < e.y + e.size) {
        enemies.splice(ei, 1);
        player.bullets.splice(bi, 1);
        score++;
      }
    });
  });

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText("Score: " + score, 10, 30);

  requestAnimationFrame(updateGame);
}

// Controls
canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  const x = touch.clientX;
  player.x = x;
  shootBullet(player.x, player.y);
});

setInterval(spawnEnemy, 1000);
updateGame();

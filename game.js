// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Bullet Setup
const bullets = [];
const bulletSpeed = 8 ;

// Player Setup
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  speed: 5,
  color: 'blue',
  bullets: []
};

// Shoot Bullet Function
function shootBullet() {
    bullets.push({
      x: player.x + player.width / 2 - 2.5, // Center bullet
      y: player.y,
      width: 5,
      height: 10,
      color: 'yellow'
    });
  }

  // Update and Draw Bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
      bullet.y -= bulletSpeed; // Move bullet up
      if (bullet.y < 0) bullets.splice(index, 1); // Remove off-screen bullets
  
      // Draw Bullet
      ctx.fillStyle = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }


// Control Player Movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.x -= player.speed;
  if (e.key === 'ArrowRight') player.x += player.speed;
  if (e.key === ' ') shootBullet();
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
});

// Main Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  updateBullets();

  requestAnimationFrame(gameLoop);
}

gameLoop();
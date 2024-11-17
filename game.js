// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Bullet Setup
const bullets = [];
const bulletSpeed = 8 ;

// Enemy Setup
const enemies = [];
const enemySpeed = 2;
const enemySpawnInterval = 1000; // Spawn every second

// Track Key States
const keys = {
    left: false,
    right: false,
  };

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

// Function to Spawn Enemies
function spawnEnemy() {
    enemies.push({
      x: Math.random() * (canvas.width - 30), // Random horizontal position
      y: -30, // Start above the canvas
      width: 30,
      height: 30,
      color: 'red'
    });
  }

  // Update and Draw Enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
      enemy.y += enemySpeed; // Move enemy down
  
      // Remove enemies that move off the screen
      if (enemy.y > canvas.height) enemies.splice(index, 1);
  
      // Draw Enemy
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
  }

  setInterval(spawnEnemy, enemySpawnInterval);


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


  // Update Player Position Based on Key States
function updatePlayer() {
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
  
    // Keep Player Within Canvas Bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  
    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
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


  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });

// Control Player Movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ') shootBullet();
});

// Main Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  updateBullets();
  updateEnemies();
  updatePlayer();

  requestAnimationFrame(gameLoop);
}

gameLoop();
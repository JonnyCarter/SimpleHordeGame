// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game State
let score = 0;
let gameOver = false;

// Player Setup
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 30,
  speed: 5,
  color: 'blue',
  bullets: []
};

// Bullet Setup
const bullets = [];
const bulletSpeed = 8;

// Enemy Setup
const enemies = [];
const initialEnemySpawnInterval = 1000;
let enemySpawnInterval = initialEnemySpawnInterval;
let timeSinceLastSpawn = 0;

// Track Key States for Smooth Movement
const keys = {
  left: false,
  right: false,
};

// Set Keydown and Keyup Events
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ') shootBullet(); // Space to shoot
  if (e.key === 'r' && gameOver) restartGame(); // R to restart on game over
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
});

// Function to Shoot Bullet
function shootBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5, // Center bullet
    y: player.y,
    width: 10,
    height: 10,
    color: 'yellow'
  });
}

// Update Player Position and Draw Player
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

// Function to Spawn Enemy
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 50,
    height: 30,
    color: 'red',
    speed: 1
 //   speed: 1 + Math.random() * 2 // Random speed between 1 and 3
  });
}

// Update Enemies and Check for Game Over
function updateEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed; // Move enemy down

    // Check if enemy has reached player (Game Over)
    if (enemy.y + enemy.height >= player.y) {
      gameOver = true;
    }

    // Remove off-screen enemies
    if (enemy.y > canvas.height) enemies.splice(index, 1);

    // Draw Enemy
    if (!gameOver) {
      ctx.fillStyle = enemy.color;
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

// Detect Collisions Between Bullets and Enemies
function detectCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      // Check for collision
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Remove bullet and enemy on collision
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10; // Increase score
      }
    });
  });
}

// Display Current Score
function displayScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Display Game Over Screen
function displayGameOver() {
  ctx.fillStyle = 'white';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 60);
}

// Restart Game Function
function restartGame() {
  gameOver = false;
  score = 0;
  enemies.length = 0;
  bullets.length = 0;
  enemySpawnInterval = initialEnemySpawnInterval;
  timeSinceLastSpawn = 0;
  player.x = canvas.width / 2 - player.width / 2; // Reset player position
  gameLoop();
}

// Main Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    updatePlayer();
    updateBullets();
    updateEnemies();
    detectCollisions();
    displayScore();

    // Adjust enemy spawn rate over time
    timeSinceLastSpawn += 16; // Approximate frame time
    if (timeSinceLastSpawn > enemySpawnInterval) {
      spawnEnemy();
      timeSinceLastSpawn = 0;
      enemySpawnInterval = Math.max(400, enemySpawnInterval - 10); // Decrease interval but don’t go below 400ms
    }
  } else {
    displayGameOver();
  }

  requestAnimationFrame(gameLoop);
}

// Start Game Loop
gameLoop();

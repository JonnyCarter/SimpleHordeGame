// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game State
let score = 0;
let gameOver = false;
let gameTime = 0;

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

// Boost Setup
const boost = {
  x: Math.random() * (canvas.width - 30),
  y: -30,
  width: 30,
  height: 30,
  color: 'green',
  active: false,
  hitCount: 0 // Tracks the number of times boost is hit
};

const maxBoostWidth = 150; // Set maximum boost width limit

let boostActive = false;
let boostEndTime = 0;

let clones = [];
const cloneOffset = 60; // Distance between main player and each clone

// Spawn Boost Function (at random intervals)
function spawnBoost() {
  if (!boost.active && Math.random() < 0.01) { // Small chance per frame to spawn
    boost.x = Math.random() * (canvas.width - boost.width);
    boost.y = -boost.height;
    boost.active = true;
    boost.hitCount = 0; // Reset hit count each time a new boost appears
  }
}

// Update and Draw Boost
function updateBoost() {
  if (boost.active) {
    boost.y += 2; // Move boost down

    // Check for collection by player
    if (
      player.x < boost.x + boost.width &&
      player.x + player.width > boost.x &&
      player.y < boost.y + boost.height &&
      player.y + player.height > boost.y
    ) {
      activateBoost();
      boost.active = false; // Deactivate boost after collection
    }

    // Remove boost if off-screen
    if (boost.y > canvas.height) boost.active = false;

    // Draw Boost with dynamic width based on hit count
    ctx.fillStyle = boost.color;
    ctx.fillRect(boost.x, boost.y, boost.width, boost.height);
  }
}

// Activate Boost Effect
function activateBoost() {
  boostActive = true;
  boostEndTime = Date.now() + 5000; // Boost lasts 5 seconds
  if(boost.hitCount >10){
    createClones(5); // Create clones based on the hit count

  } else{
    createClones(boost.hitCount); // Create clones based on the hit count

  }
}

// Create Clones Based on Hit Count
function createClones(hitCount) {
  clones = [];
  for (let i = 1; i <= hitCount; i++) {
    clones.push({
      x: player.x + i * cloneOffset,
      y: player.y,
      width: player.width,
      height: player.height,
      color: 'blue'
    });
  }
}

// Increase Boost Width When Hit (with upper limit)
function hitBoost() {
  boost.hitCount += 1;
  boost.width = Math.min(boost.width + 10, maxBoostWidth); // Increase width but cap at maxBoostWidth
}

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

// Shoot Bullet Function (shoots from player and clones)
function shootBullet() {
  const allShooters = [player, ...clones];
  allShooters.forEach((shooter) => {
    bullets.push({
      x: shooter.x + shooter.width / 2 - 2.5,
      y: shooter.y,
      width: 10,
      height: 10,
      color: 'yellow'
    });
  });
}

// Update Player Position and Draw Player
function updatePlayer() {
  if (keys.left) player.x -= player.speed;
  if (keys.right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Draw Main Player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw and position clones if boost is active
  clones.forEach((clone, index) => {
    clone.x = player.x + (index - Math.floor(clones.length / 2)) * cloneOffset;
    ctx.fillStyle = clone.color;
    ctx.fillRect(clone.x, clone.y, clone.width, clone.height);
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

    // Check if bullet hits boost
    if (
      boost.active &&
      bullet.x < boost.x + boost.width &&
      bullet.x + bullet.width > boost.x &&
      bullet.y < boost.y + boost.height &&
      bullet.y + bullet.height > boost.y
    ) {
      hitBoost(); // Increase width when hit
      bullets.splice(index, 1); // Remove bullet after hit
    }
  });
}

// Function to Spawn Enemy
function spawnEnemy() {
  let speed=0.5;
  if(gameTime> 500){
    speed=1;
  }else if(gameTime> 1000){
    speed=2
  }
  enemies.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 50,
    height: 30,
    color: 'red',
    speed: speed
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
  clones = []; // Clear clones on restart
  boost.hitCount = 0; // Reset hit count
  boost.width = 30; // Reset boost width
  gameLoop();
}

// Main Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    gameTime += 1;
    updatePlayer();
    updateBullets();
    updateEnemies();
    updateBoost(); // Update boost appearance and collection

    detectCollisions();
    displayScore();

    // Adjust enemy spawn rate over time
    timeSinceLastSpawn += 16; // Approximate frame time
    if (timeSinceLastSpawn > enemySpawnInterval) {
      spawnEnemy();
      timeSinceLastSpawn = 0;
      enemySpawnInterval = Math.max(400, enemySpawnInterval - 10); // Decrease interval but don’t go below 400ms
   
 }
    spawnBoost();

  } else {
    displayGameOver();
  }

  requestAnimationFrame(gameLoop);
}

// Start Game Loop
gameLoop();

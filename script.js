const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const gameContainer = document.getElementById("gameContainer");
const homeScreen = document.getElementById("homeScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const levelSelect = document.getElementById("levelSelect");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let speed;
let gameInterval;


// Detect swipe gestures for mobile users
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

// document.body.addEventListener("touchmove", (event) => {
//     event.preventDefault(); // Stops accidental page scrolling
// }, { passive: false });

canvas.addEventListener("touchmove", (event) => {
    event.preventDefault(); // Prevent screen movement during swipes

    let touchEndX = event.touches[0].clientX;
    let touchEndY = event.touches[0].clientY;

    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (diffX < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (diffY > 0 && direction !== "UP") direction = "DOWN";
        else if (diffY < 0 && direction !== "DOWN") direction = "UP";
    }
});

// Load sounds
const beep = new Audio("https://www.myinstants.com/media/sounds/game-over.mp3");
const gulp = new Audio("https://www.myinstants.com/media/sounds/pop-sound-effect.mp3");

// Start Game
function startGame() {
    speed = levelSelect.value * 100;
    homeScreen.style.display = "none";
    gameContainer.style.display = "block";
    gameOverScreen.style.display = "none"; // FIX: Properly hide Game Over screen when restarting
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    scoreDisplay.textContent = `Score: 0`;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
}

// Change direction
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Update Game
function updateGame() {
    if (isPaused) return; // Pause functionality

    let head = { x: snake[0].x, y: snake[0].y };

    // Move Snake
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Check collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        endGame();
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
        }
    }

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        gulp.play(); // Play gulp sound
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        snake.pop();
    }

    snake.unshift(head);
    drawGame();
}

// Pause Game
document.addEventListener("keydown", (event) => {
    if (event.key === "p" || event.key === "P") {
        togglePause(); // Press 'P' to pause or resume
    }
});

function togglePause() {
    if (!isPaused) {
        clearInterval(gameInterval); // Pause game
        isPaused = true
        document.getElementById("pauseBtn").textContent = "Resume"
    } else {
        gameInterval = setInterval(updateGame, speed); // Resume game
        isPaused = false
        document.getElementById("pauseBtn").textContent = "Pause"
    }
}


// const snakeImg = new Image();
// snakeImg.src = "snake.png"; // Add your snake image file

// const foodImg = new Image();
// foodImg.src = "food.png"; // Add your food image file


// Draw Game Elements
function drawGame() {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green"
        ctx.fillRect(segment.x, segment.y, box, box)
    })

    // Draw Food
    ctx.fillStyle = "red"
    ctx.fillRect(food.x, food.y, box, box)
}


// function drawGame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw Snake
//     snake.forEach((segment, index) => {
//         if (index === 0) {
//             ctx.drawImage(snakeImg, segment.x, segment.y, box, box); // Snake head
//         } else {
//             ctx.fillStyle = "green"; // Optional: keep tail styled
//             ctx.fillRect(segment.x, segment.y, box, box);
//         }
//     });

//     // Draw Food
//     ctx.drawImage(foodImg, food.x, food.y, box, box);
// }



// End Game
function endGame() {
    clearInterval(gameInterval)
    beep.play() // Play game over sound
    gameOverScreen.style.display = "block"
}

// Pause Functionality
let isPaused = false
function togglePause() {
    isPaused = !isPaused
}

// Restart Game
function resetGame() {
    snake = [{ x: 200, y: 200 }]
    direction = "RIGHT"
    score = 0
    scoreDisplay.textContent = `Score: 0`
    gameOverScreen.style.display = "none"
    gameInterval = setInterval(updateGame, speed)
}

// Quit to Home
function goHome() {
    // Hide game elements
    gameOverScreen.style.display = "none"
    gameContainer.style.display = "none"
    homeScreen.style.display = "block"

    // Reset game state
    snake = [{ x: 200, y: 200 }]
    direction = "RIGHT"
    score = 0
    scoreDisplay.textContent = `Score: 0`

    // Clear game interval to stop execution
    clearInterval(gameInterval)
    isPaused = false // Ensure pause state resets
}
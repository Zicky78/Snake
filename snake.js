//Links to the canvas tag in the html file
const CANVAS = document.getElementById('canvas');
const CTX = canvas.getContext('2d');

//Function to draw the canvas
function drawCanvas() {
    //Sets the size and bg color
    CTX.fillStyle = 'skyblue';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
    //Sets the border color and size
    CTX.strokeStyle = 'black';
    CTX.lineWidth = 50;
    CTX.strokeRect(0, 0, CANVAS.width, CANVAS.height);
}

// * Variables *

var dx = 0; //Horizontal movement
var dy = 0; //Vertical movement
var gameover = false;
var score = 0;
var min = 34; //min is used for posistion adjustment and in the random generation
var max = 25; //max is the number of grid squares in the game

var snake = { x: 34, y: 34 }; //These are the squares that make up the snake

//console.log('Snake.x',snake.x)

var snakeArray = []; //Array of all the snake squares 

snakeArray.push(snake); //Pushes the first snake into the array

//console.log('SnakeArray[0].x', snakeArray[0].x)

//Grows the snake, called when an apple is eaten
function snakeGrow(score) {
    //Sets the x and y of the new square to the whatever is in front of it in the array
    snake = { x: snakeArray[score - 1].x, y: snakeArray[score - 1].y };
    snakeArray.push(snake);

    //console.log(score, 'snake', snakeArray[score].x)
}

//Function that draws the snake on the canvas
function drawSnake(score) {
    //Clears the canvas so the snake isn't permanently drawn
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    drawCanvas();

    //Draws a snake for every score point
    for (i = 0; i <= score; i++) {
        CTX.fillStyle = 'green';
        CTX.fillRect(snakeArray[i].x - 9, snakeArray[i].y - 9, 25, 25);
        CTX.strokeStyle = 'lightgreen';
        CTX.lineWidth = 2;
        CTX.strokeRect(snakeArray[i].x - 9, snakeArray[i].y - 9, 25, 25);
    }
}

//Function that moves the snake
function snakeUpdate(score) {
    //Starting at the end of the array, each square moves to the position of the previous one,
    //allowing everything to trail behind the head of the snake
    for (i = score; i >= 1; i--) {
        snakeArray[i].x = snakeArray[i - 1].x;
        snakeArray[i].y = snakeArray[i - 1].y;
        //console.log('SNAKE ', i, snakeArray[i].x)
    }
}

//Function that allows the head to move
function animateSnake(score) {
    snakeArray[0].x += dx;
    snakeArray[0].y += dy;

}

//Apple
const APPLE_CONFIG = {
    x: 250+34,
    y: 250+34,
    w: '25px',
    h: '25px',
    bgc: 'red',
}

//Creates a div called apple
const APPLE = document.createElement('div');

//Appends the apple to the document
document.body.appendChild(APPLE);

//Function that draws the apple
function drawApple() {
    APPLE.style.width = APPLE_CONFIG.w;
    APPLE.style.height = APPLE_CONFIG.h;
    APPLE.style.backgroundColor = APPLE_CONFIG.bgc;
    APPLE.style.position = 'absolute';

    //Calls the random generation
    randomInRange(min, max);
    APPLE.style.left = APPLE_CONFIG.x + 'px';
    APPLE.style.top = APPLE_CONFIG.y + 'px';
}

//Function that generates the apple in a random square on the canvas
function randomInRange(min, max) {
    APPLE_CONFIG.x = (Math.floor(Math.random() * Math.floor(max - 1)) * max) + min;
    //console.log(APPLE_CONFIG.x);
    APPLE_CONFIG.y = (Math.floor(Math.random() * Math.floor(max - 1)) * max) + min;
}

//Functions that change the snake head's movement when the arrow keys are pressed
function moveUp() {
    dy = -25;
}

function moveDown() {
    dy = 25;
}

function moveRight() {
    dx = 25;
}

function moveLeft() {
    dx = -25;
}

function stopDY() {
    dy = 0;
}

function stopDX() {
    dx = 0;
}

//Function that checks if the snake collides with the wall or itself
function checkCollision(score) {

    //This checks if it goes out of bounds
    if (snakeArray[0].x < 34 || snakeArray[0].x > 634 || snakeArray[0].y < 34 || snakeArray[0].y > 634) {
        stopDX();
        stopDY();
        gameover = true;
    }

    //This checks if the snake head hits any other part of the snake
    for (i = score; i > 0; i--) {
        if ((snakeArray[0].x == snakeArray[i].x) && (snakeArray[0].y == snakeArray[i].y)) {
            stopDX();
            stopDY();
            gameover = true;
        }
    }
}

//Function that checks if the snake eats the apple
function detectApple() {
    if (snakeArray[0].x === APPLE_CONFIG.x && snakeArray[0].y === APPLE_CONFIG.y) {
        //console.log('Apple Detected');
        drawApple();
        score++;
        //console.log('Score: ', score);
        snakeGrow(score);
    }
}

//Function that writes gameover
function writeGameOver(score) {
    document.write('*Game Over* Score: ' + score);
}

//Function that displays the score
function displayScore(score) {
    CTX.fillStyle = 'white';
    CTX.textBaseline = 'middle';
    CTX.textAlign = 'center';
    CTX.font = 'normal bold 20px serif';

    CTX.fillText('Score: ' + score, 50, 13);
}

//See interval first
//Main function
function main() {
    detectApple();
    animateSnake();
    checkCollision(score);
    drawSnake(score);
    snakeUpdate(score);
    displayScore(score);

    document.addEventListener('keydown', (e) => {
        //console.log(e);
        if (e.code === 'ArrowUp' && dy != 25) {
            moveUp();
            stopDX();
            //animateSnake();
        }

        if (e.code === 'ArrowDown' && dy != -25) {
            moveDown();
            stopDX();
            //animateSnake();
        }

        if (e.code === 'ArrowRight' && dx != -25) {
            moveRight();
            stopDY();
            //animateSnake();
        }

        if (e.code === 'ArrowLeft' && dx != 25) {
            moveLeft();
            stopDY();
            //animateSnake();
        }
    })
}

// * Program *

drawCanvas();
drawApple();

interval = setInterval(() => {
    main();
    if (gameover === true) {
        clearInterval(interval);
        writeGameOver(score);
    }
}, 125);
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball
class Ball {
    constructor(x, y, radius, speedX, speedY, color = 'white') {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // ColisiÃ³n con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia direcciÃ³n al resetear
    }
}

// Paddle
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false, color = 'white') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
        this.direction = 1;
        this.color = color;
    }

    draw() {
        if (this.isPlayerControlled) {
            ctx.fillStyle = this.color = "rgb(22, 22, 228)"; 
            
            this.height = this.height;
        } else {
            ctx.fillStyle = this.color = "rgb(228, 22, 22)"; 
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    // Move the CPU paddle between the top and bottom edges.
    autoMove() {
        if (this.y <= 0) {
            this.direction = 1;
        } else if (this.y + this.height >= canvas.height) {
            this.direction = -1;
        }

        this.y += this.speed * this.direction;
    }
}

// Game
class Game {
    constructor() {
        this.balls = [
            new Ball(100, 2, 10, 4, 3, 'red'),
            new Ball(100, 2, 30, 3, 3, 'blue'),
            new Ball(100, 2, 50, 2, 2, 'green'),
            new Ball(100, 2, 5, 5, 4, 'yellow'),
            new Ball(100, 2, 15, 4, 3, 'purple')
        ];
        this.paddle1 = new Paddle(0, canvas.height / 2 - 100, 10, 200, true); // jugador
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100); // CPU
        this.keys = {}; // Para capturar las teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw());
        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        this.balls.forEach(ball => ball.move());

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (Controlada por IA)
        this.paddle2.autoMove();

        this.balls.forEach(ball => {
            // Paddle collisions
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }

            // Reset the ball when it leaves the canvas
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        });
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Start the game
const game = new Game();
game.run();
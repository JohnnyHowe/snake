
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}

class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

let gridSize = new Size(10, 10);
let gameViewRect;
let gameAreaScale;

function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function randint(max) {
    return Math.floor(Math.random() * max)
}

function drawLine(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function setUpBackground() {

    // Window background
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game Area
    let widthScale = (canvas.width / gridSize.width) / (canvas.height / gridSize.height);

    if (widthScale >= 1) {
        let gameViewSize = new Size(canvas.width / widthScale, canvas.height)
        gameViewRect = new Rect((canvas.width - gameViewSize.width) / 2, 0, gameViewSize.width, gameViewSize.height);
    } else {
        let gameViewSize = new Size(canvas.width, canvas.height * widthScale)
        gameViewRect = new Rect(0, (canvas.height - gameViewSize.height) / 2, gameViewSize.width, gameViewSize.height);
    }

    gameAreaScale = new Size(gameViewRect.width / gridSize.width, gameViewRect.height / gridSize.height);

    ctx.fillStyle = "#333";
    ctx.fillRect(gameViewRect.x, gameViewRect.y, gameViewRect.width, gameViewRect.height);
}

function drawGrid() {

    // Vertical
    for (column = 1; column < gridSize.width; column += 1) {
        x = column * gameAreaScale.width

        startPos = new Coordinate(x + gameViewRect.x, gameViewRect.y);
        endPos = new Coordinate(x + gameViewRect.x, gameViewRect.y + gameViewRect.height);

        drawLine(startPos, endPos);
    }

    // Horizontal
    for (row = 1; row < gridSize.height; row += 1) {
        y = row * gameAreaScale.height

        startPos = new Coordinate(gameViewRect.x, y + gameViewRect.y);
        endPos = new Coordinate(gameViewRect.x + gameViewRect.width, y + gameViewRect.y);

        drawLine(startPos, endPos);
    }
}

class Snake {
    constructor() {
        this.pos = new Coordinate(Math.floor(gridSize.width / 2), gridSize.height - 2);
        this.length = 1;
        this.oldPositions = [new Coordinate(Math.floor(gridSize.width / 2), gridSize.height - 1)];
    }

    move() {

        let lastPos = Object.assign({}, this.pos)

        this.oldPositions.push(lastPos);
        this.oldPositions = this.oldPositions.slice(this.oldPositions.length - this.length, this.oldPositions.length);

        if (lastKey === "up") {
            this.pos.y -= 1;
        } else if (lastKey === "down") {
            this.pos.y += 1;
        } else if (lastKey === "left") {
            this.pos.x -= 1;
        } else if (lastKey === "right") {
            this.pos.x += 1;
        }
    }

    eat() {
        if (foodHandler.pos) {
            if (this.pos.x === foodHandler.pos.x && this.pos.y === foodHandler.pos.y) {
                this.length += 1;
                foodHandler.spawn();
            }
        }
    }

    dead() {
        return (!this.onGrid() || this.touchingSelf());
    }

    onGrid() {
        return (this.pos.x >= 0 && this.pos.x < gridSize.width && this.pos.y >= 0 && this.pos.y < gridSize.height);
    }

    touchingSelf() {
        for (let pos of this.oldPositions) {
            if (pos.x === this.pos.x && pos.y === this.pos.y) {
                return true;
            }
        }
    }

    show() {
        this.showHead();
        this.showBody();
    }

    showBody() {

        for (let pos of this.oldPositions) {
            let area = new Rect(pos.x * gameAreaScale.width + gameViewRect.x, pos.y * gameAreaScale.height + gameViewRect.y, gameAreaScale.width, gameAreaScale.height);

            ctx.fillStyle = "rgb(50, 150, 50)";
            ctx.fillRect(area.x, area.y, area.width, area.height);
        }
    }

    showHead() {
        let area = new Rect(this.pos.x * gameAreaScale.width + gameViewRect.x, this.pos.y * gameAreaScale.height + gameViewRect.y, gameAreaScale.width, gameAreaScale.height);

        ctx.fillStyle = "rgb(50, 255, 50)";
        ctx.fillRect(area.x, area.y, area.width, area.height);
    }
}

class FoodHandler {
    constructor() {}

    spawn() {

        // Making list of avaliable positions
        let avaliablePositions = [];

        for (let x = 0; x < gridSize.width; x += 1) {
            for (let y = 0; y < gridSize.height; y += 1) {

                // Is this position already in use?
                let inUse = false;
                for (let pos of snake.oldPositions) {
                    if (pos.x === x && pos.y === y) {
                        inUse = true;
                        break
                    }
                }

                if (x === snake.pos.x && y === snake.pos.y) {
                    inUse = true;
                }

                if (!inUse) {
                    avaliablePositions.push(new Coordinate(x, y));
                }
            }
        }

        // Choose
        this.pos = avaliablePositions[randint(avaliablePositions.length)];
    }

    update() {
        if (!this.pos) {
            this.spawn();
        }
    }

    show() {
        if (this.pos) {
            let area = new Rect(this.pos.x * gameAreaScale.width + gameViewRect.x, this.pos.y * gameAreaScale.height + gameViewRect.y, gameAreaScale.width, gameAreaScale.height);

            ctx.fillStyle = "rgb(150, 150, 20)";
            ctx.fillRect(area.x, area.y, area.width, area.height);
        }
    }
}

let lastKey = 'up';
let lastUpdateKey = lastKey;

function updatePlayerInput() {
    let keys = ['down', 'left', 'right', 'up'];

    for (let keyCode of keys) {
        if (key.isPressed(keyCode)) {
            if (!badInput(keyCode)) {
                lastKey = keyCode;
            }
        }
    }
}

function badInput(keyCode) {
    return ((lastUpdateKey === 'up' || lastUpdateKey === 'down') && (keyCode === 'up' || keyCode === 'down')) || 
           ((lastUpdateKey === 'left' || lastUpdateKey === 'right') && (keyCode === 'right' || keyCode === 'left'));
}

let snake = new Snake();
let foodHandler = new FoodHandler();

let lastFrameUpdate = performance.now();
let gameSpeed = 1000; // time between game updates (ms)

function gameLoop() {

    // Window setup
    updateCanvasSize();
    setUpBackground();
    
    drawGrid();

    if (performance.now() >= lastFrameUpdate + gameSpeed) {
        // Update

        foodHandler.update();

        snake.move();
        snake.eat();

        lastFrameUpdate = performance.now();
        lastUpdateKey = lastKey;
    }

    snake.show();
    foodHandler.show();

    if (snake.dead()) {
        snake = new Snake();
        foodHandler.spawn();

        lastKey = 'up';
        lastUpdateKey = lastKey;
    }

    updatePlayerInput();
    requestAnimationFrame(gameLoop)
}

gameLoop();
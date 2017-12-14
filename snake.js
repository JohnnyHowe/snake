let gridSize = new Size(10, 10);
let gameViewRect
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

    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Game Area
    let widthScale = (canvas.width / gridSize.width) / (canvas.height / gridSize.height);

    if (widthScale > 1) {
        let gameViewSize = new Size(canvas.width / widthScale, canvas.height)
        gameViewRect = new Rect((canvas.width - gameViewSize.width) / 2, 0, gameViewSize.width, gameViewSize.height);
    } else {
        let gameViewSize = new Size(canvas.width, canvas.height * widthScale)
        gameViewRect = new Rect(0, (canvas.height - gameViewSize.height) / 2, gameViewSize.width, gameViewSize.height);
    }

    gameAreaScale = new Size(gameViewRect.width / gridSize.width, gameViewRect.height / gridSize.height);

    // ctx.fillStyle = "#333";
    // ctx.fillRect(gameViewRect.x, gameViewRect.y, gameViewRect.width, gameViewRect.height);

    showBackground()
}

function showBackground() {
    let image = images.backgrounds.grass;
    let xScale = Math.round((gameViewRect.width / image.width) / (gameViewRect.height / image.height) * 1000) / 1000;

    if (xScale > 1) {
        ctx.drawImage(image, gameViewRect.x, gameViewRect.y, gameViewRect.width, gameViewRect.height * xScale);

        // Window background
        ctx.fillStyle = "#555";
        ctx.fillRect(0, 0, canvas.width, (canvas.height - gameViewRect.height) / 2); // Top
        ctx.fillRect(0, gameViewRect.y + gameViewRect.height, canvas.width, (canvas.height - gameViewRect.height) / 2); // Top

    } else if (xScale < 1) {
        ctx.drawImage(image, gameViewRect.x, gameViewRect.y, gameViewRect.width / xScale, gameViewRect.height);

        // Window background
        ctx.fillStyle = "#555";
        ctx.fillRect(0, 0, (canvas.width - gameViewRect.width) / 2, canvas.height); // Left
        ctx.fillRect(gameViewRect.x + gameViewRect.width, 0, (canvas.width - gameViewRect.width) / 2, canvas.height); // Right

    } else {
        ctx.fillStyle = "#555";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image, gameViewRect.x, gameViewRect.y, gameViewRect.width, gameViewRect.height);
    }

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
        this.pos = new Coordinate(Math.floor(gridSize.width / 2), Math.floor(gridSize.height / 2));
        this.length = 1;

        let tail = this.pos.copy();
        tail.y += 1;

        this.oldPositions = [tail];
        this.oldMovements = [];
    }

    move() {

        let lastPos = this.pos.copy();

        this.oldPositions.push(lastPos);
        this.oldMovements.push(lastKey);
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
        this.showBody();
        this.showHead();
        this.showTail();
    }

    showBody() {
        let oldPositions = this.oldPositions.concat([this.pos]);

        for (let index = 1; index < oldPositions.length - 1; index += 1) {
            let last = oldPositions[index - 1];
            let next = oldPositions[index + 1];

            let pos = oldPositions[index];
            let area = new Rect(pos.x * gameAreaScale.width + gameViewRect.x, pos.y * gameAreaScale.height + gameViewRect.y, gameAreaScale.width, gameAreaScale.height);

            let change = [last.x - next.x, last.y - next.y];

            // Straight
            if (change[1] === 2 || change[1] === -2) {
                drawRotatedImage(images.snake.straight, area, 0);
                continue
            } else if (change[0] === 2 || change[0] === -2) {
                area.x += gameAreaScale.width;
                drawRotatedImage(images.snake.straight, area, Math.PI / 2);
                continue
            }

            // Corner
            if (last.y > pos.y) { // Last down
                if (next.x > pos.x) { // Next Right
                    area.y += gameAreaScale.height;
                    drawRotatedImage(images.snake.corner, area, -Math.PI / 2);
                } else {
                    drawRotatedImage(images.snake.corner, area, 0);
                }
            } else if (last.y < pos.y) { // Last up
                if (next.x > pos.x) { // Next Right
                    area.y += gameAreaScale.height;
                    area.x += gameAreaScale.width;
                    drawRotatedImage(images.snake.corner, area, Math.PI);
                } else { // Next Left
                    area.x += gameAreaScale.width;
                    drawRotatedImage(images.snake.corner, area, Math.PI / 2);
                }
            } else if (last.x < pos.x) { // Last left
                if (next.y > pos.y) { // Next down
                    drawRotatedImage(images.snake.corner, area, 0);
                } else { // Next up
                    area.x += gameAreaScale.width;
                    drawRotatedImage(images.snake.corner, area, Math.PI / 2);
                }
            } else if (last.x > pos.x) { // Last right
                if (next.y > pos.y) { // Next down
                    area.y += gameAreaScale.height;
                    drawRotatedImage(images.snake.corner, area, -Math.PI / 2);
                } else { // Next up
                    area.y += gameAreaScale.height;
                    area.x += gameAreaScale.width;
                    drawRotatedImage(images.snake.corner, area, Math.PI);
                }
            }
        }
    }

    showHead() {
        let area = new Rect(this.pos.x * gameAreaScale.width + gameViewRect.x, this.pos.y * gameAreaScale.height + gameViewRect.y, gameAreaScale.width, gameAreaScale.height);

        if (lastUpdateKey === 'up') {
            ctx.drawImage(images.snake.head, area.x, area.y, area.width, area.height);
        } else if (lastUpdateKey === 'right') {
            area.x += gameAreaScale.width;
            drawRotatedImage(images.snake.head, area, Math.PI / 2);
        } else if (lastUpdateKey === 'down') {
            area.x += gameAreaScale.width;
            area.y += gameAreaScale.height;
            drawRotatedImage(images.snake.head, area, Math.PI);
        } else if (lastUpdateKey === 'left') {
            area.y += gameAreaScale.height;
            drawRotatedImage(images.snake.head, area, -Math.PI / 2);
        }
    }

    showTail() {
        let pos = this.oldPositions[0];
        let previous = this.oldPositions[1];

        if (!previous) {
            previous = this.pos;
        }

        let change = [pos.x - previous.x, pos.y - previous.y];
        let area = new Rect(pos.x * gameAreaScale.width + gameViewRect.x, pos.y * gameAreaScale.height + gameViewRect.y, gameAreaScale.width, gameAreaScale.height);

        if (change[0] === 1) {
            area.y += gameAreaScale.height;
            drawRotatedImage(images.snake.tail, area, -Math.PI / 2);
        } else if (change[0] === -1) {
            area.x += gameAreaScale.width;
            drawRotatedImage(images.snake.tail, area, Math.PI / 2);
        } else if (change[1] === 1) {
            drawRotatedImage(images.snake.tail, area, 0);
        } else if (change[1] === -1) {
            area.x += gameAreaScale.width;
            area.y += gameAreaScale.height;
            drawRotatedImage(images.snake.tail, area, Math.PI);
        }
    }
}

function drawRotatedImage(image, rect, rotation) {

    ctx.translate(rect.x, rect.y);
    ctx.rotate(rotation);

    ctx.drawImage(image, 0, 0, rect.width, rect.height);

    ctx.rotate(-rotation);
    ctx.translate(-rect.x, -rect.y);
}

class FoodHandler {
    constructor() { }

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
            drawRotatedImage(images.food.apple, area, 0);

            // ctx.fillStyle = "rgb(150, 150, 20)";
            // ctx.fillRect(area.x, area.y, area.width, area.height);
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
    paused = false;
    return ((lastUpdateKey === 'up' || lastUpdateKey === 'down') && (keyCode === 'up' || keyCode === 'down')) ||
        ((lastUpdateKey === 'left' || lastUpdateKey === 'right') && (keyCode === 'right' || keyCode === 'left'));
}

let snake = new Snake();
let foodHandler = new FoodHandler();

let lastFrameUpdate = performance.now();
let gameSpeed = 40000 / (gridSize.width * gridSize.height); // time between game updates (ms)

let paused = true;
foodHandler.update();

function gameLoop() {

    // Window setup
    updateCanvasSize();
    setUpBackground();

    // drawGrid();

    if (performance.now() >= lastFrameUpdate + gameSpeed && !paused) {
        // Update

        foodHandler.update();

        snake.move();
        snake.eat();

        lastFrameUpdate = performance.now();
        lastUpdateKey = lastKey;
    }

    if (snake.dead()) {
        snake = new Snake();
        foodHandler.spawn();

        lastKey = 'up';
        lastUpdateKey = lastKey;
        paused = true;
    }

    snake.show();
    foodHandler.show();

    showArrows();

    showScore();
    showHighScore();

    updatePlayerInput();
    requestAnimationFrame(gameLoop)
}

gameLoop();
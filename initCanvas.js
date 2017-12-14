// if (navigator.serviceWorker) {
// navigator.serviceWorker.register('service-worker.js');
// }

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Coordinate(this.x, this.y);
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

function touching(rect1, rect2) {
    return rect1.x + rect1.width > rect2.x &&
        rect1.x < rect2.x + rect2.width &&
        rect1.y + rect1.height > rect2.y &&
        rect1.y < rect2.y + rect2.height;
}

function showScore() {
    let fontSize = canvas.width / 15;
    let fontString = Math.round(fontSize).toString() + 'px scoreFont';
    ctx.font = fontString;

    let margin = 10;
    let gap = 5;

    ctx.textAlign = "left";

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(snake.length - 1, margin + gap, margin + gap + fontSize * 1.5);
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillText(snake.length - 1, margin, margin + fontSize * 1.5);
}

function showHighScore() {
    if (!localStorage.highScore) {
        localStorage.highScore = snake.length - 1;
    } else {
        localStorage.highScore = Math.max(localStorage.highScore, snake.length - 1);
    }

    let fontSize = canvas.width / 15;
    let fontString = Math.round(fontSize).toString() + 'px scoreFont';
    ctx.font = fontString;

    let margin = 10;
    let gap = 5;

    ctx.textAlign = "left";

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText(localStorage.highScore, margin + gap, canvas.height - (margin + gap));
    ctx.fillStyle = 'rgba(200, 200, 200, 1)';
    ctx.fillText(localStorage.highScore, margin, canvas.height - (margin + gap));
}
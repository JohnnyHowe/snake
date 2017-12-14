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
    getList() {
        return [this.x, this.y];
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
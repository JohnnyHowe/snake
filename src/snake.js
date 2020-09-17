import Draw from "./draw.js";


/**
 * Class to handle snake
 */
export default class Snake {

    /**
     * Make the snake
     * Put it at the start position
     * @param {{x, y}} startPosition 
     */
    constructor(startPosition, gridSize) {
        this.gridSize = gridSize;

        this.positions = [startPosition];
        this.length = 1;

        // TODO convert keys to enum
        this.controls = {
            "left": { change: { x: -1, y: 0 }, controls: ["ArrowLeft", "a"] },
            "right": { change: { x: 1, y: 0 }, controls: ["ArrowRight", "d"] },
            "up": { change: { x: 0, y: -1 }, controls: ["ArrowUp", "w"] },
            "down": { change: { x: 0, y: 1 }, controls: ["ArrowDown", "s"] },
        }
        this.direction = "up"; // What was the last key pressed = travel direction
        this.addKeyListener();
    }

    /**
     * Add a key up listener
     * on key up, if the key is one of the controls, then set this.direction
     */
    addKeyListener() {
        document.addEventListener("keyup", (e) => {
            for (let direction in this.controls) {
                for (let keyCode of this.controls[direction].controls) {
                    if (keyCode === e.key) {
                        this.direction = direction;
                    }
                }
            }
        })
    }

    /**
     * Move the snake according to the last input (lastKeyPressed)
     */
    move() {
        let lastPosition = this.positions[0];
        let change = this.controls[this.direction].change;
        let newPosition = fixPosition({ x: lastPosition.x + change.x, y: lastPosition.y + change.y }, this.gridSize);
        this.addPosition(newPosition);
    }

    /**
     * Has the snake eaten itself?
     * Checks whether the head position is repeated in the positions
     */
    isDead() {
        return this.isPositionTaken(this.positions[0]);
    }

    /**
     * Is the position already taken up by the snake?
     * Doesn't check the head
     * @param {{int, int}} position 
     * @returns whether the position is taken
     */
    isPositionTaken(position) {
        for (let snakePosition of this.positions.slice(1, this.length)) {
            if (position.x == snakePosition.x && position.y == snakePosition.y) {
                return true;
            }
        }
        return false;
    }

    /**
     * Move the head to a new position
     * @param {{x, y}} newPosition 
     */
    addPosition(newPosition) {
        this.positions.unshift(newPosition);
    }

    /**
     * Show the snake as a gray gradient (black = head)
     * 
     */
    show() {
        // for (let position of this.getPositions()) {
        for (let i = 0; i < this.length; i++) {
            let light = Math.floor((i / this.length) * 9).toString();
            let color = "#" + light + light + light;
            Draw.fillCell(this.positions[i], color);
        }
    }

    /**
     * Increase the length of the snake by 1
     */
    increaseLength() {
        this.length += 1;
    }

    /**
     * Get an array of the current positions of the snake
     * Head is at index 0
     */
    getPositions() {
        return this.positions.slice(0, this.length);
    }
}


/**
 * Fix the position so its on the grid
 * Just does an unsigned modulo on the attributes of position
 * @param {*} position 
 * @param {*} gridSize 
 */
function fixPosition(position, gridSize) {
    return { x: unsignedModulo(position.x, gridSize.x), y: unsignedModulo(position.y, gridSize.y) }
}


/**
 * TODO put somewhere else so it doesn't have to be in snake.js and draw.js
 * returns value % mod
 * BUT value is never negative.
 * 0 <= value <= mod rather than -mod < value < mod
 * @param {float} value to find mod of
 * @param {int} mod
 */
function unsignedModulo(value, mod) {
    let remainder = value % mod;
    if (remainder < 0) {
        remainder += mod;
    }
    return remainder;
}
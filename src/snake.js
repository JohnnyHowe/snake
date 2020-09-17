import Draw from "./draw.js";


export default class Snake {

    /**
     * Make the snake
     * Put it at the start position
     * @param {{x, y}} startPosition 
     */
    constructor(startPosition) {
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
        let newPosition = { x: lastPosition.x + change.x, y: lastPosition.y + change.y }
        this.addPosition(newPosition);
    }

    /**
     * Move the head to a new position
     * @param {{x, y}} newPosition 
     */
    addPosition(newPosition) {
        this.positions.unshift(newPosition);
    }

    show() {
        Draw.fillCell(this.positions[0], "#000");
    }
}
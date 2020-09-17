import Display from "./display.js";
import Draw from "./draw.js";
import Snake from "./snake.js";


export default class Game {

    constructor() {
        this.gridSize = { x: 10, y: 10 };

        this.frameTime = 500; // Time between every game update (ms) = snake move speed
        this.lastFrameTime = Date.now();

        Draw.setGridSize(this.gridSize); // Let the drawer know what the grid size is
        this.snake = new Snake({ x: Math.floor(this.gridSize.x / 2), y: Math.floor(this.gridSize.y / 2) });
    }

    /**
     * Initiates the main game loop
     * Run Game.update every frameTime seconds
     */
    loop() {

        let currentTime = Date.now();
        if (this.lastFrameTime + this.frameTime <= currentTime) {
            this.update();
            this.lastFrameTime = currentTime;
        }

        window.requestAnimationFrame(() => this.loop());
    }

    /**
     * Run one game update
     * Move the snake etc
     */
    update() {
        Display.resizeToWindow();
        Draw.fillBackground("#EEE");
        Draw.drawGameRect("#DDD");

        this.snake.show();
        this.snake.move();
    }
}
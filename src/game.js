import Display from "./display.js";
import Draw from "./draw.js";
import Snake from "./snake.js";
import FoodHandler from "./foodHandler.js";


export default class Game {

    constructor() {
        this.gridSize = { x: 25, y: 25 };
        Draw.setGridSize(this.gridSize);
        this.frameTime = 100; // Time between every game update (ms) = snake move speed
        this.start()
    }

    start() {
        this.lastFrameTime = -1;
        this.snake = new Snake({ x: Math.floor(this.gridSize.x / 2), y: Math.floor(this.gridSize.y / 2) }, this.gridSize);
        this.foodHandler = new FoodHandler(this.gridSize);
        this.foodHandler.spawn(this.snake.positions); // Make a food right off the bat
    }

    /**
     * Initiates the main game loop
     * Run Game.update every frameTime seconds
     */
    loop() {
        let currentTime = Date.now();
        if (this.lastFrameTime + this.frameTime <= currentTime || this.lastFrameTime == -1) {
            this.lastFrameTime = currentTime;
            this.update();

            // Is snake dead? if so, restart game
            if (this.snake.isDead()) {
                this.start() // restarts game
            }
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

        this.snake.move();
        this.foodHandler.update(this.snake);

        this.foodHandler.show();
        this.snake.show();

    }
}
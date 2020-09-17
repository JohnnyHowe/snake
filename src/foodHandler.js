import Food from "./food.js"


/**
 * Class to handle the food things
 */
export default class FoodHandler {

    /**
     * @param {{x, y}} gridSize game board size
     */
    constructor(gridSize) {
        this.currentFood = null;
        this.gridSize = gridSize
    }

    /**
     * Update the food handler
     * If the snake is over the food, increase the snake length, delete old food and make a new one
     * @param {Snake} snake object to handle food with
     */
    update(snake) {
        if (this.isSnakeOnFood(snake.getPositions()[0])) {
            this.spawn(snake.getPositions());
            snake.increaseLength();
        }
    }

    /**
     * Show the food
     * calls food.show()
     */
    show() {
        if (this.currentFood) {
            this.currentFood.show();
        }
    }

    /**
     * Spawn a new food and set it to currentFood;
     * @param {array} snakePositions array of positions ({x, y}) of the snake
     */
    spawn(snakePositions) {
        this.currentFood = new Food(this.chooseFoodPosition(snakePositions))
    }

    /**
     * Choose a new position to spawn the food
     * Must be in empty cell
     * Very innefficient but only called very occasionally
     * @param {array} snakePositions array of positions ({x, y}) of the snake
     * @returns {{x, y}} new position to place a food
     */
    chooseFoodPosition(snakePositions) {
        // Make array of avaliable positions
        let positions = [];
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                // is the position in the snake positions?
                for (let snakePosition of snakePositions) {
                    if (snakePosition.x != x || snakePosition.y != y) {
                        positions.push({ x, y });
                    }
                }
            }
        }
        return randomChoice(positions);
    }

    /**
     * Is the head of the snake in the same cell as the food?
     * @param {{int, int}} snakeHeadPosition
     * @returns whether the snakeHeadPosition equals the food position
     */
    isSnakeOnFood(snakeHeadPosition) {
        return snakeHeadPosition.x == this.currentFood.position.x && snakeHeadPosition.y == this.currentFood.position.y;
    }
}


/**
 * Choose a random item from items
 * @param {array} items to choose from
 * @returns {Object} random object from items
 */
function randomChoice(items) {
    let index = Math.floor(Math.random() * items.length);
    return items[index];
}
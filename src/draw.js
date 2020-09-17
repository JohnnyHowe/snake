import Display from "./display.js";


/**
 * Drawer object
 * Controls all drawing things to individual objects dont have to
 */
class Draw {

    /**
     * Let the drawer know what the grid size is.
     * Must be done before any drawing (minus fillBackground)
     * @param {{x, y}} gridSize 
     */
    setGridSize(gridSize) {
        this.gridSize = gridSize;
    }

    /**
     * Fill the background of the canvas
     * @param {string} color to set background to
     */
    fillBackground(color) {
        Display.ctx.fillStyle = color;
        Display.ctx.fillRect(0, 0, Display.canvas.width, Display.canvas.height);
    }

    /**
     * Draw a solid rect with the ratio of the game grid size centered in the window.
     */
    drawGameRect(color) {
        let gameRect = this.getGameRect();
        Display.ctx.fillStyle = color;
        Display.ctx.fillRect(gameRect.x, gameRect.y, gameRect.w, gameRect.h);
    }

    /**
     * Fill a cell with a solid color
     * @param {{x, y}} cell to fill 
     * @param {string} color 
     */
    fillCell(cell, color) {
        Display.ctx.fillStyle = color;
        let cellRect = this.getCellRect(cell);
        Display.ctx.fillRect(cellRect.x, cellRect.y, cellRect.w, cellRect.h);
    }

    /**
     * Get the rect of the mentioned cell in pixels
     * Converts a position on the game board to position and size on screen
     * @param {{x, y}} cell to get rect
     * @returns {{x, y, w, h}} in pixels (x, y are top left of cell)
     */
    getCellRect(cell) {
        let gameRect = this.getGameRect();
        let cellSize = gameRect.w / this.gridSize.x;
        return {
            x: gameRect.x + unsignedModulo(cell.x / this.gridSize.x, 1) * gameRect.w,
            y: gameRect.y + unsignedModulo(cell.y / this.gridSize.y, 1) * gameRect.h,
            w: cellSize,
            h: cellSize,
        }
    }

    /**
     * What's the game rect?
     * The playable area of the screen
     */
    getGameRect() {
        let scale = Math.min(Display.canvas.width / this.gridSize.x, Display.canvas.height / this.gridSize.y);
        let gameRect = { x: 0, y: 0, w: this.gridSize.x * scale, h: this.gridSize.y * scale };
        gameRect.x = (Display.canvas.width - gameRect.w) / 2;
        gameRect.y = (Display.canvas.height - gameRect.h) / 2;
        return gameRect;
    }
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


const instance = new Draw();
export default instance;
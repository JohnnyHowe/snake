import Draw from "./draw.js";


/**
 * Class representing food
 */
export default class Food {

    constructor(position) {
        this.position = position;
    }

    /**
     * Show the food as an orange block of color
     */
    show() {
        Draw.fillCell(this.position, "#F90")
    }
}
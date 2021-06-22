class Display {

    canvas = null;
    ctx = null;

    /**
     * Set the canvas of the Display
     * @param {Canvas} canvas to display on
     */
    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Resize the canvas to the full window size
     */
    resizeToWindow() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    isFocused() {
        return document.hasFocus(); 
    }
}


const instance = new Display();
export default instance;
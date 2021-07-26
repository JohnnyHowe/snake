import Display from "./display.js";
import Draw from "./draw.js";
import Game from "./game.js";


Display.setCanvas(document.getElementById("canvas"));

let game = new Game();
game.loop();
import Tetris from "./tetris.js";
import GUI from "./GUI.js"

const WIDTH = 300
const HEIGHT = 600
const ROWS = 20
const COLUMNS = 10

const LEFT = 37 
const RIGHT = 39
const DROP = 40
const ROT = 38

export default class Manager {
    constructor(elem) {
        this.GUI = new GUI(elem, WIDTH, HEIGHT, ROWS, COLUMNS)
        self.GUI = this.GUI


        this.Tetris = new Tetris(WIDTH, HEIGHT, ROWS, COLUMNS)
        self.Tetris = this.Tetris

        this.GUI.GenerateField(self.Tetris.GetField(), self.Tetris.mActiveBlock.mColor)
    }


    Start() {
        
    }

    ReactToPress(event) {
        switch (event.keyCode) {
            case RIGHT:
                self.Tetris.Right()
                break
            case LEFT:
                self.Tetris.Left()
                break
            case DROP:
                self.Tetris.Drop()
                break
            case ROT:
                self.Tetris.Rotate()
                break
        }
        self.GUI.GenerateField(self.Tetris.GetField(), self.Tetris.mActiveBlock.mColor)
    }
    

}

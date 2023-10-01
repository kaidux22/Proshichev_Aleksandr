import Tetris from "./tetris.js";
import GUI from "./GUI.js"
import * as consts from "./const.js"


export default class Manager {
    constructor(elem) {
        this.GUI = new GUI(elem, consts.WIDTH, consts.HEIGHT, consts.ROWS, consts.COLUMNS)
        self.GUI = this.GUI
        this.mLevel = 1 


        this.Tetris = new Tetris(consts.WIDTH, consts.HEIGHT, consts.ROWS, consts.COLUMNS)
        self.Tetris = this.Tetris

        this.GUI.GenerateField(this.Tetris.mField, this.Tetris.mLevels, this.Tetris.mScore, this.Tetris.mNextBlock)

        this.StartTimer()
    }

    CheckSpeed() {
        return this.mLevel == this.Tetris.mLevels
    }

    StartTimer() {
        if (!this.Interval) {
            this.Interval = setInterval(() => {
                self.Tetris.Down()
                self.GUI.GenerateField(self.Tetris.mField, self.Tetris.mLevels, self.Tetris.mScore, self.Tetris.mNextBlock)
                if (!this.CheckSpeed()) {
                    this.TimerManager()
                }
            }, 1000 / (2 * this.mLevel / 3)) 
        }
    }

    StopTimer() {
        if (this.Interval) {
            clearInterval(this.Interval)
            this.Interval = null
        }
    }

    TimerManager() {
        this.StopTimer()
        this.mLevel = this.Tetris.mLevels
        this.StartTimer()

    }




    ReactToPress(event) {
        switch (event.keyCode) {
            case consts.RIGHT:
                self.Tetris.Right()
                break
            case consts.LEFT:
                self.Tetris.Left()
                break
            case consts.DROP:
                self.Tetris.Drop()
                break
            case consts.ROT:
                self.Tetris.Rotate()
                break
        }
        self.GUI.GenerateField(self.Tetris.mField, self.Tetris.mLevels, self.Tetris.mScore, self.Tetris.mNextBlock)
    }
    

}

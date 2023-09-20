import "./block";

export default class Tetris {
    mScore = 0
    mLevels = 1

    constructor() {
        this.mField = new Array(20);

        for (let i = 0; i < 20; i++) {
            this.mField[i] = new Array(10)
            for (let j = 0; j < 10; j++) {
                this.mField[i][j] = 0
            }
        }
        this.mActiveBlock = new Block()
        this.mNextBlock = new Block()


    }



    Left() {
        this.mActiveBlock.posX -= 1
    }
}




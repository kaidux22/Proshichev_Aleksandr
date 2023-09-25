import * as blocks from "./block.js"

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
        this.mActiveBlock = new blocks.Hero()
        this.mNextBlock = new blocks.Smashboy()
        this.FillSpace(true)
    }

    IsInField() {
        const gameField = this.mField
        const { posX, posY, mSize, mField } = this.mActiveBlock
        for (let i = 0; i < mSize; i++) {
            for (let j = 0; j < mSize; j++) {
                if (mField[i][mSize - j - 1] && (posX - j < 0 || posX - j >= 10)) {
                    return false
                }
            }
        }
        return true
    }

    Left() {
        this.FillSpace(false)
        this.mActiveBlock.posX -= 1
        if (!this.IsInField()) {
            this.mActiveBlock.posX += 1
        }
        this.FillSpace(true)
    }

    Right() {
        this.FillSpace(false)
        this.mActiveBlock.posX += 1
        if (!this.IsInField()) {
            this.mActiveBlock.posY -= 1
        }
        this.FillSpace(true)
    }

    Drop() {

    }

    FillSpace(draw) {
        if (draw) {
            for (let i = 0; i < this.mActiveBlock.mSize; i++) {
                for (let j = 0; j < this.mActiveBlock.mSize; j++) {
                    if (this.mField[this.mActiveBlock.posY + j][this.mActiveBlock.posX - i] != undefined) {
                        this.mField[this.mActiveBlock.posY + j][this.mActiveBlock.posX - i] = this.mActiveBlock.mField[j][this.mActiveBlock.mSize - i - 1]
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.mActiveBlock.mSize; i++) {
                for (let j = 0; j < this.mActiveBlock.mSize; j++) {
                    if (this.mField[this.mActiveBlock.posY + j][this.mActiveBlock.posX - i] != undefined)
                        this.mField[this.mActiveBlock.posY + j][this.mActiveBlock.posX - i] = 0;
                }
            }
        }

    }

    ViewPos() {
        console.log(this.mField[this.mActiveBlock.posY][this.mActiveBlock.posX])
    }
}


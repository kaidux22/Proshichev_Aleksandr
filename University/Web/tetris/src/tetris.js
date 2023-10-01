import Block, * as blocks from "./block.js"
import * as consts from "./const.js"

export default class Tetris {
    mScore = 0
    mLevels = 1
    mLines = 0

    constructor(w, h, rows, colms) {
        this.mRows = rows
        this.mColumns = colms

        this.mGameStatus = true

        this.mField = new Array(this.mRows);

        for (let i = 0; i < this.mRows; i++) {
            this.mField[i] = new Array(this.mColumns)
            for (let j = 0; j < this.mColumns; j++) {
                this.mField[i][j] = 0
            }
        }
        this.mActiveBlock = this.CreateBlock()
        this.mNextBlock = this.CreateBlock()
        this.FillSpace(true)
    }

    CrashInto() {
        const gameField = this.mField
        const { posX, posY, mSize, mMatrix } = this.mActiveBlock
        for (let i = 0; i < mSize; i++) {
            for (let j = 0; j < mSize; j++) {
                if (mMatrix[i][mSize - j - 1] && (gameField[posY + i][posX - j] || posY + i >= this.mRows)) {
                    return true
                }
            }
        }
        return false
    }

    MayMoveOn() {
        const gameField = this.mField
        const { posX, posY, mSize, mMatrix } = this.mActiveBlock
        for (let i = 0; i < mSize; i++) {
            for (let j = 0; j < mSize; j++) {
                if (mMatrix[i][mSize - j - 1] && ((posX - j < 0 || posX - j >= this.mColumns || posY + i >= this.mRows) || gameField[posY + i][posX - j])) {
                    return false
                }
            }
        }
        return true
    }

    Left() {
        this.FillSpace(false)
        this.mActiveBlock.posX -= 1
        if (!this.MayMoveOn()) {
            this.mActiveBlock.posX += 1
            if (this.CrashInto()) {
                this.FillSpace(true)
                this.ChangeActiveBlock()
            }
        }
        this.FillSpace(true)
    }

    Right() {
        this.FillSpace(false)
        this.mActiveBlock.posX += 1
        if (!this.MayMoveOn()) {
            this.mActiveBlock.posX -= 1
            if (this.CrashInto()) {
                this.FillSpace(true)
                this.ChangeActiveBlock()
            }
        }
        this.FillSpace(true)
    }

    Down() {
        this.FillSpace(false)
        this.mActiveBlock.posY += 1
        if (!this.MayMoveOn()) {
            this.mActiveBlock.posY -= 1
            this.FillSpace(true)
            this.ChangeActiveBlock()
        }
        this.FillSpace(true)
    }


    Drop() {
        this.FillSpace(false)
        while (this.MayMoveOn()) {
           this.mActiveBlock.posY += 1
        }
        this.mActiveBlock.posY -= 1
        this.FillSpace(true)
        this.ChangeActiveBlock()
        this.FillSpace(true)
    }

    Rotate() {
        this.FillSpace(false)
        this.mActiveBlock.Rotate(true)
        if (!this.MayMoveOn()) {
            this.mActiveBlock.Rotate(false)
        }
        this.FillSpace(true)
    }

    

    FillSpace(draw) {
        if (draw) {
            for (let i = 0; i < this.mActiveBlock.mSize; i++) {
                for (let j = 0; j < this.mActiveBlock.mSize; j++) {
                    if (this.mActiveBlock.posY + j < this.mRows && this.mActiveBlock.posX - i >= 0 && this.mActiveBlock.posX - i < this.mColumns && this.mActiveBlock.mMatrix[j][this.mActiveBlock.mSize - i - 1]) {
                        this.mField[this.mActiveBlock.posY + j][this.mActiveBlock.posX - i] = this.mActiveBlock.mMatrix[j][this.mActiveBlock.mSize - i - 1]
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.mActiveBlock.mSize; i++) {
                for (let j = 0; j < this.mActiveBlock.mSize; j++) {
                    if (this.mActiveBlock.posY + j < this.mRows && this.mActiveBlock.posX - i >= 0 && this.mActiveBlock.posX - i < this.mColumns && this.mActiveBlock.mMatrix[j][this.mActiveBlock.mSize - i - 1])
                        this.mField[this.mActiveBlock.posY + j][this.mActiveBlock.posX - i] = 0;
                }
            }
        }
        
    }

    GetRandomInt(max) {
        return Math.floor(Math.random() * max) + 1
    }

    CreateBlock() {
        switch (this.GetRandomInt(consts.COUNT)) {
            case consts.HERO:
                return new blocks.Hero()
            case consts.BLUERICKY:
                return new blocks.BlueRicky()
            case consts.ORANGERICKY:
                return new blocks.OrangeRicky()
            case consts.CLEVELANDZ:
                return new blocks.ClevelandZ()
            case consts.RHODEISLANDZ:
                return new blocks.RhodeIslandZ()
            case consts.TEEWEE:
                return new blocks.Teewee()
            case consts.SMASHBOY:
                return new blocks.Smashboy()

        }
    }

    ChangeActiveBlock() {
        this.mScore += consts.BLOCK_COST * this.mLevels
        this.mActiveBlock = this.mNextBlock
        this.mNextBlock = this.CreateBlock()
        if (this.CrashInto()) {
            this.GameOver()    
        }
        this.RemoveLine()
    }

    isLine(line) {
        for (let x = 0; x < this.mColumns; x++) {
            if (!line[x]) {
                return false
            }
        }
        return true
    }

    RemoveLine() {
        for (let y = 0; y < this.mRows; y++) {
            if (this.isLine(this.mField[y])) {
                this.mLines += 1
                this.mLevels = Math.floor(this.mLines * 0.2) + 1
                this.mScore += consts.LINE_COST * this.mLevels
                this.mField.splice(y, 1)
                this.mField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            }
        }
    }

    GameOver() {
        this.mGameStatus = false
        localStorage[localStorage.length] = this.mScore
        window.location.replace('../finish.html')
    }

}


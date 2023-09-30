import Block, * as blocks from "./block.js"

export default class Tetris {
    mScore = 0
    mLevels = 1

    constructor(w, h, rows, colms) {
        this.mRows = rows
        this.mColumns = colms

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
            if (this.CrashInto()) {
                this.FillSpace(true)
                this.ChangeActiveBlock()
            }
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

    GetField() {
        return this.mField
    }

    GetRandomInt(max) {
        return Math.floor(Math.random() * max)
    }

    CreateBlock() {
        switch (this.GetRandomInt(blocks.COUNT)) {
            case blocks.HERO:
                return new blocks.Hero()
            case blocks.BLUERICKY:
                return new blocks.BlueRicky()
            case blocks.ORANGERICKY:
                return new blocks.OrangeRicky()
            case blocks.CLEVELANDZ:
                return new blocks.ClevelandZ()
            case blocks.RHODEISLANDZ:
                return new blocks.RhodeIslandZ()
            case blocks.TEEWEE:
                return new blocks.Teewee()
            case blocks.SMASHBOY:
                return new blocks.Smashboy()

        }
    }

    ChangeActiveBlock() {
        this.mActiveBlock = this.mNextBlock
        this.mNextBlock = this.CreateBlock()
    }
}


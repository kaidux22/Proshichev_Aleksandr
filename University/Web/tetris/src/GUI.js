import * as consts from "./const.js"

export default class GUI {

    static COLORS = {
        1: 'yellow',
        2: 'pink',
        3: 'cyan',
        4: 'red',
        5: 'green',
        6: 'blue',
        7: 'orange'
    }

    constructor(elem, w, h, rows, colms) {
        this.mElement = elem
        this.mWidth = w
        this.mHeight = h
        this.mRows = rows
        this.mColumns = colms

        this.mField = document.createElement('canvas')
        this.mContext = this.mField.getContext('2d')

        this.mField.width = this.mWidth
        this.mField.height = this.mHeight

        
        this.mFieldBorderWidth = consts.FIELD_BORDER_WIDTH
        this.mFieldPosX = consts.FIELD_POS_X
        this.mFieldPosY = consts.FIELD_POS_Y
        this.mFieldWidth = this.mWidth * consts.PROPORTION
        this.mFieldHeight = this.mHeight
        this.mFieldInnerWidth = this.mFieldWidth - this.mFieldBorderWidth * 2
        this.mFieldInnerHeight = this.mFieldHeight - this.mFieldBorderWidth * 2

        this.mBlockWidth = this.mFieldInnerWidth / this.mColumns
        this.mBlockHeight = this.mFieldInnerHeight / this.mRows

        this.mPanelPosX = this.mFieldWidth + consts.OFFSET
        this.mPanelPosY = 0
        this.mPanelWidth = this.mWidth * (1 - consts.PROPORTION)
        this.mPanelHeight = this.mHeight

        this.mElement.appendChild(this.mField)
    }

    GenerateField(field, level, score, nextBlock) {
        this.mContext.clearRect(0, 0, this.mWidth, this.mHeight)
        this.GenerateInfoTable(level, score, nextBlock)
        for (let y = 0; y < this.mRows; y++) {
            for (let x = 0; x < this.mColumns; x++) {
                if (field[y][x]) {
                    this.GenerateBlock(this.mFieldPosX+ x * this.mBlockWidth, this.mFieldPosY + y * this.mBlockHeight, GUI.COLORS[field[y][x]])
                }
            }
        }
        this.mContext.strokeStyle = 'black'
        this.mContext.lineWidth = this.mFieldBorderWidth
        this.mContext.strokeRect(0, 0, this.mFieldWidth, this.mFieldHeight)
    }

    GenerateBlock(posX, posY, color) {
        this.mContext.fillStyle = color
        this.mContext.strokeStyle = 'black'
        this.mContext.lineWidth = 3

        this.mContext.fillRect(posX, posY, this.mBlockWidth, this.mBlockHeight)
        this.mContext.strokeRect(posX, posY, this.mBlockWidth, this.mBlockHeight)
    }

    GenerateInfoTable(level, score, nextBlock) {
        this.mContext.textAlign = 'start'
        this.mContext.textBaseline = 'top'
        this.mContext.fillStyle = "black"
        this.mContext.font = "20px 'Press Start 2P'"

        this.mContext.fillText('Level:' + level, this.mPanelPosX, this.mPanelPosY)
        this.mContext.fillText('Score:' + score, this.mPanelPosX, this.mPanelPosY + this.mBlockWidth)
        this.mContext.fillText('Next Block:', this.mPanelPosX, this.mPanelPosY + 2 * this.mBlockWidth)

        for (let y = 0; y < nextBlock.mSize; y++) {
            for (let x = 0; x < nextBlock.mSize; x++) {
                if (nextBlock.mMatrix[y][x]) {
                    this.GenerateBlock(this.mPanelPosX + x * this.mBlockWidth, this.mPanelPosY + y * this.mBlockHeight + 3 * this.mBlockWidth, GUI.COLORS[nextBlock.mMatrix[y][x]])
                }
            }
        }
    }
}
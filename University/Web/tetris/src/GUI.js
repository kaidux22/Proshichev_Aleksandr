export default class GUI {
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

        this.mBlockWidth = this.mField.width / this.mColumns
        this.mBlockHeight = this.mField.height / this.mRows

        this.mElement.appendChild(this.mField)
    }

    GenerateField(field, color) {
        this.mContext.clearRect(0, 0, this.mWidth, this.mHeight)
        for (let y = 0; y < this.mRows; y++) {
            for (let x = 0; x < this.mColumns; x++) {
                if (field[y][x]) {
                    this.GenerateBlock(x * this.mBlockWidth, y * this.mBlockHeight, color)

                }
            }
        }
    }

    GenerateBlock(posX, posY, color) {
        this.mContext.fillStyle = color
        this.mContext.strokeStyle = 'black'
        this.mContext.lineWidth = 3

        this.mContext.fillRect(posX, posY, this.mBlockWidth, this.mBlockHeight)
        this.mContext.strokeRect(posX, posY, this.mBlockWidth, this.mBlockHeight)
    }
}
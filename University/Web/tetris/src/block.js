export default class Block {
    mMatrix
    mSize
    posX = 5
    posY = 0

    Rotate(dir) {
        const oldMatrix = JSON.parse(JSON.stringify(this.mMatrix))

        if (dir) {
            for (let i = 0; i < this.mSize; i++) {
                for (let j = 0; j < this.mSize; j++) {
                    this.mMatrix[j][this.mSize - i - 1] = oldMatrix[i][j]
                }
            }
        }
        else {
            for (let i = 0; i < this.mSize; i++) {
                for (let j = 0; j < this.mSize; j++) {
                    this.mMatrix[i][j] = oldMatrix[j][this.mSize - i - 1]
                }
            }
        }
    }
}

export class Smashboy extends Block {
    mMatrix = [[1, 1], [1, 1]]
    mSize = 2
}

export class Teewee extends Block {
    mMatrix = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
    mSize = 3
}

export class Hero extends Block {
    mMatrix = [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]]
    mSize = 4
}

export class ClevelandZ extends Block {
    mMatrix = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
    mSize = 3
}

export class RhodeIslandZ extends Block {
    mMatrix = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
    mSize = 3
}

export class BlueRicky extends Block {
    mMatrix = [[1, 1, 1], [0, 0, 1], [0, 0, 0]]
    mSize = 3
}

export class OrangeRicky extends Block {
    mMatrix = [[1, 1, 1], [1, 0, 0], [0, 0, 0]]
    mSize = 3
}




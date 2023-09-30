export const COUNT = 7

export const SMASHBOY = 0
export const TEEWEE = 1
export const HERO = 2
export const CLEVELANDZ = 3
export const RHODEISLANDZ = 4
export const BLUERICKY = 5
export const ORANGERICKY = 6


export default class Block {
    mMatrix
    mSize
    mColor
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
    mColor = 'yellow'
}

export class Teewee extends Block {
    mMatrix = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
    mSize = 3
    mColor = 'pink'

}

export class Hero extends Block {
    mMatrix = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]]
    mSize = 4
    mColor = 'light-blue'
}

export class ClevelandZ extends Block {
    mMatrix = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
    mSize = 3
    mColor = 'red'
}

export class RhodeIslandZ extends Block {
    mMatrix = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
    mSize = 3
    mColor = 'green'
}

export class BlueRicky extends Block {
    mMatrix = [[1, 1, 1], [0, 0, 1], [0, 0, 0]]
    mSize = 3
    mColor = 'blue'
}

export class OrangeRicky extends Block {
    mMatrix = [[1, 1, 1], [1, 0, 0], [0, 0, 0]]
    mSize = 3
    mColor = 'orange'
}




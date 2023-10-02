import * as consts from './const.js'

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
    mMatrix = [[consts.SMASHBOY, consts.SMASHBOY], [consts.SMASHBOY, consts.SMASHBOY]]
    mSize = 2
}

export class Teewee extends Block {
    mMatrix = [[consts.TEEWEE, consts.TEEWEE, consts.TEEWEE], [0, consts.TEEWEE, 0], [0, 0, 0]]
    mSize = 3
}

export class Hero extends Block {
    mMatrix = [[0, 0, 0, 0], [consts.HERO, consts.HERO, consts.HERO, consts.HERO], [0, 0, 0, 0], [0, 0, 0, 0]]
    mSize = 4
}

export class ClevelandZ extends Block {
    mMatrix = [[consts.CLEVELANDZ, consts.CLEVELANDZ, 0], [0, consts.CLEVELANDZ, consts.CLEVELANDZ], [0, 0, 0]]
    mSize = 3
}

export class RhodeIslandZ extends Block {
    mMatrix = [[0, consts.RHODEISLANDZ, consts.RHODEISLANDZ], [consts.RHODEISLANDZ, consts.RHODEISLANDZ, 0], [0, 0, 0]]
    mSize = 3
}

export class BlueRicky extends Block {
    mMatrix = [[consts.BLUERICKY, consts.BLUERICKY, consts.BLUERICKY], [0, 0, consts.BLUERICKY], [0, 0, 0]]
    mSize = 3
}

export class OrangeRicky extends Block {
    mMatrix = [[consts.ORANGERICKY, consts.ORANGERICKY, consts.ORANGERICKY], [consts.ORANGERICKY, 0, 0], [0, 0, 0]]
    mSize = 3
}




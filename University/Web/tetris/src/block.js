export default class Block {
    mField
    mSize
    posX = 5
    posY = 0
}

export class Smashboy extends Block {
    mField = [[1, 1], [1, 1]]
    mSize = 2
}

export class Teewee extends Block {
    mField = [[1, 1, 1], [0, 1, 0], [0, 0, 0]]
    mSize = 3
}

export class Hero extends Block {
    mField = [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    mSize = 4
}

export class ClevelandZ extends Block {
    mField = [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
    mSize = 3
}

export class RhodeIslandZ extends Block {
    mField = [[0, 1, 1], [1, 1, 0], [0, 0, 0]]
    mSize = 3
}

export class BlueRicky extends Block {
    mField = [[1, 1, 1], [0, 0, 1], [0, 0, 0]]
    mSize = 3
}

export class OrangeRicky extends Block {
    mField = [[1, 1, 1], [1, 0, 0], [0, 0, 0]]
    mSize = 3
}




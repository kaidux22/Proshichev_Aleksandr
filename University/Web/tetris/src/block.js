export default class Block {
    mField
    mSize
    posX = 5
    posY = 3
}

export default class Smashboy extends Block {
    mField = [[1, 1], [1, 1]]
    mSize = 2
}

export default class Teewee extends Block {
    mField = [[0, 0, 0], [0, 1, 0], [1, 1, 1]]
    mSize = 3
}

export default class Hero extends Block {
    mField = [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
    mSize = 4
}

export default class RhodeIslandZ extends Block {
    mField = [[0, 0, 0], [0, 1, 1], [1, 1, 0]]
    mSize = 3
}

export default class ClevelandZ extends Block {
    mField = [[0, 0, 0], [1, 1, 0], [0, 1, 1]]
    mSize = 3
}

export default class BlueRicky extends Block {
    mField = [[0, 0, 0], [1, 0, 0], [1, 1, 1]]
    mSize = 3
}

export default class OrangeRicky extends Block {
    mField = [[0, 0, 0], [0, 0, 1], [1, 1, 1]]
    mSize = 3
}


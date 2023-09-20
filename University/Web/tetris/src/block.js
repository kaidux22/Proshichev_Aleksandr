export default class Block {
    mField
    mSize
    posX = 5
    posY = 3
}

export default class Square extends Block {
    mField = [[1, 1], [1, 1]]
    mSize = 2
}


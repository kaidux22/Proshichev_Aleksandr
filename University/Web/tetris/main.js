import Manager from "./src/manager"

const field = document.querySelector("#field")

const game = new Manager(field)

window.game = game

document.addEventListener('keydown', game.ReactToPress)

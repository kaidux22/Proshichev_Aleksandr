import Manager from "./src/manager.js"

const field = document.querySelector("#field")

const game = new Manager(field)

window.game = game

document.addEventListener('keydown', game.ReactToPress)

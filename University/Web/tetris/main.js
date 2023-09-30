import Manager from "./src/manager"

const field = document.querySelector("#field")

const game = new Manager(field)

window.game = game

game.Start()

function reply(event) {
    console.log("Yes", event.keyCode)
}

document.addEventListener('keydown', game.ReactToPress)

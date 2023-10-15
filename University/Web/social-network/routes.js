const router = require('express').Router()
const path = require('path')
const parser = require('express').urlencoded({extended: false})

let data = require("./Data/users.json")

router.get("/", (req, res) => {
    res.render("./users.html")
})

router.get("/:num", (req, res) => {
    res.render("./profile.html")
})

router.get("/:name.svg", (req, res) => {
    res.sendFile(path.resolve(req.params.name, ".svg"))
})

router.get("/:name.css", (req, res) => {
    res.sendFile(path.resolve(req.params.name, ".css"))
})

router.get("/:name.js", (req, res) => {
    res.sendFile(path.resolve(req.params.name, ".js"))
})

router.get("/favicon.ico", (req, res) => {
    res.sendFile("./favicon.ico")
})

router.post("/", parser, (req, res) => {
    if(!req.body.content){
        res.json(data)
    }
    else{
        let pattern = RegExp(req.body.content, "i");
        console.log("Паттерн", pattern);
        let list = { "users" : []}
        
        for(let i = 0; i < data.users.length; i++){
            let string = data.users[i].lastName + " " + data.users[i].name

            string = string.match(pattern)
            console.log("результат", string)
            if(string){
                list.users.push(data.users[i])
            }
        }

        res.json(list)
    }
})

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found!")
})

module.exports = router
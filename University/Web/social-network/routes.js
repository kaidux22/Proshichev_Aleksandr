const router = require('express').Router()
const path = require('path')
const parser = require('express').urlencoded({extended: false})
const fs = require('fs')



router.get("/", (req, res) => {
    res.render("./pages/users.html")
})

router.get("/:file.:type", (req, res) => {
    if(req.params.type == "css"){
        res.sendFile(path.join(__dirname, '/views', '/styles', req.params.file + "." + req.params.type))
    }
    else if(req.params.type == "js"){
        res.sendFile(path.join(__dirname, '/views', '/scripts', req.params.file + "." + req.params.type))
    }
    else{
        res.sendFile(path.join(__dirname, '/views', '/src', req.params.file + "." + req.params.type))
    }
})

router.get("/icon.ico", (req, res) => {
    res.sendFile("./src/icon.ico")
})

router.post("/", parser, (req, res) => {
    let data = require("./Data/users.json")
    if(!req.body.content){
        res.json(data)
    }
    else{
        let pattern = RegExp(req.body.content, "i");
        let list = { "users" : []}
        
        for(let i = 0; i < data.users.length; i++){
            let string = data.users[i].lastName + " " + data.users[i].name

            string = string.match(pattern)
            if(string){
                list.users.push(data.users[i])
            }
        }

        res.status(202)
        res.json(list)
    }
})

router.post("/status", parser, (req, res) => {
    let data = require("./Data/users.json")
    let idx = Number(req.body.id)
    let status = "confirmed"

    if(data.users[idx].status == status){
        status = "blocked"
    }

    data.users[idx].status = status;

    fs.writeFile("./Data/users.json", JSON.stringify(data), (err) => {
        if(err)
            throw err;
        console.log("correct!")
    })

    res.status(200)
    res.json(data)
})

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found!")
})

module.exports = router
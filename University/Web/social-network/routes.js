const router = require('express').Router()
const path = require('path')
const parser = require('express').urlencoded({extended: false})
const fs = require('fs')

let curPage = -1


router.get("/", (req, res) => {
    curPage = -1
    res.render("./pages/users.html")
})

router.get("/user/:num", (req, res) => {
    curPage = req.params.num
    res.render("./pages/profile.html")
})

router.get("/feed/:num", (req, res) => {
    curPage = req.params.num
    res.render("./pages/feed.html")
})

router.get("/friends/:num", (req, res) => {
    curPage = req.params.num
    res.render("./pages/friends.html")
})

router.get("/user/", (req, res) => {
    let data = require("./Data/users.json")
    res.json(data.users[curPage])
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

router.post("/usersList", parser, (req, res) => {
    let data = require("./Data/users.json")

    if(req.body.filter == "regexp"){
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
    }
    else{
        list = {"users" : []}
        console.log(data.users[curPage].friends)
        for(let i = 0; i < data.users[curPage].friends.length; i++){ list.users.push(data.users[Number(data.users[curPage].friends[i])])}

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

router.post("/postsList", parser, (req, res) => {
    let data = require("./Data/users.json")
    let news = []
    let list = []

    if(req.body.with == "false"){
        for(let i = 0; i < data.users.length; i++){
            if(data.users[i].id != req.body["content[]"]){
                list.push(data.users[i].id)
            }
        }    
    }
    else{
        list = req.body["content[]"]
    }


    for(let i = 0; i < list.length; i++){
        let curId = list[i]
        for(let j = 0; j < data.users[Number(curId)].news.length; j++){
            news.push(data.users[Number(curId)].news[j])
            news[news.length - 1]["author"] = data.users[Number(curId)].lastName + " " + data.users[Number(curId)].name
            news[news.length - 1]["author_id"] = data.users[Number(curId)].id
        }
    }
    res.json(news)
})


router.post("/statusPost", parser, (req, res) => {
    let data = require("./Data/users.json")
    let author_idx = Number(req.body.author_id)
    let news_idx = Number(req.body.news_id)
    let status = "confirmed"

    if(data.users[author_idx].news[news_idx].status == status){
        status = "blocked"
    }

    data.users[author_idx].news[news_idx].status = status;

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
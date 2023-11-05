const router = require('express').Router()
const jsonParser = require('express').json()
const path = require('path')
const parser = require('express').urlencoded({extended: true})
const fs = require('fs')
const { json } = require('express')

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
    let data = require("../Data/users.json")
    res.json(data.users[curPage])
})

router.get("/userInfo/:num", (req, res) => {
    let data = require("../Data/users.json")
    res.json(data.users[req.params.num])
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
    let data = require("../Data/users.json")

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
    let data = require("../Data/users.json")
    let idx = Number(req.body.id)
    let status = "confirmed"

    if(data.users[idx].status == status){
        status = "blocked"
        data.users[idx].role = "user"
    }

    data.users[idx].status = status;


    fs.writeFile("../Data/users.json", JSON.stringify(data), (err) => {
        if(err)
            throw err;
    })

    res.status(200)
    res.json(data)
})

router.post("/posts", jsonParser, (req, res) => {
    let data = require("../Data/users.json")
    let news = []
    let list = []

    if(req.body.with == "false"){
        list = data.users[Number(req.body["content"][0])].friends    
    }
    else{
        list = req.body["content"]
    }



    for(let i = 0; i < list.length; i++){
        let curId = list[i]

        let authorNews = require("../Data/" + curId + "/news.json")

        for(let j = 0; j < authorNews.news.length; j++){
            news.push(authorNews.news[j])
            news[news.length - 1]["author"] = data.users[Number(curId)].lastName + " " + data.users[Number(curId)].name
            news[news.length - 1]["author_id"] = data.users[Number(curId)].id
            news[news.length - 1]["news_id"] = j.toString()
        }
    }

    

    res.json(news)
})

router.post("/postsList", parser, (req, res) => {
    let data = require("../Data/users.json")
    let news = []
    let list = []

    if(req.body.with == "false"){
        list = data.users[Number(req.body["content"][0])].friends    
    }
    else{
        list = req.body["content"]
    }



    for(let i = 0; i < list.length; i++){
        let curId = list[i]

        let authorNews = require("../Data/" + curId + "/news.json")

        for(let j = 0; j < authorNews.news.length; j++){
            news.push(authorNews.news[j])
            news[news.length - 1]["author"] = data.users[Number(curId)].lastName + " " + data.users[Number(curId)].name
            news[news.length - 1]["author_id"] = data.users[Number(curId)].id
            news[news.length - 1]["news_id"] = j.toString()
        }
    }

    res.json(news)
})


router.post("/statusPost", parser, (req, res) => {
    let author_idx = req.body.author_id
    let news_idx = Number(req.body.news_id)
    let status = "confirmed"
    let authorNews = require('../Data/' + author_idx + '/news.json')

    if(authorNews.news[news_idx].status == status){
        status = "blocked"
    }   

    authorNews.news[news_idx].status = status;

    fs.writeFile("../Data/" + author_idx + "/news.json", JSON.stringify(authorNews), (err) => {
        if(err)
            throw err;
    })

    res.status(200)
    res.json(authorNews)
})

router.post("/changeRole", parser, (req, res) => {
    let data = require('../Data/users.json')

    if(data.users[curPage].role == "user"){
        data.users[curPage].role = "admin"
    }
    else{
        data.users[curPage].role = "user"
    }

    fs.writeFile("../Data/users.json", JSON.stringify(data), (err) => {
        if(err)
            throw err;
    })
    res.status(202)
    res.end("correct")
})

router.get("/users", (req, res) => {
    let data = require('../Data/users.json')
    res.json(data.users)
})

router.get("*", (req, res) => {
    res.status(404)
    res.end("Page not found!")
})

router.post("/addUser", jsonParser, (req, res) => {
    let data = require("../Data/users.json")

    req.body.data.id = data.users.length.toString()
    data.users.push(req.body.data)

    fs.writeFile("../Data/users.json", JSON.stringify(data), (err) => {
        if(err)
            throw err 
    })

    fs.mkdir("../Data/" + req.body.data.id.toString(), (err) => {
        if(err){
            throw err
        }
    })

    fs.open("../Data/" + req.body.data.id.toString() + "/news.json", "w", (err) =>{
        if(err)
            throw err
    })

    fs.writeFile("../Data/" + req.body.data.id.toString() + "/news.json", JSON.stringify({"news": []}), (err) =>{
        if(err)
            throw err
    })

    res.status(202)
    res.end(req.body.data.id.toString())
})

router.post("/editUser", jsonParser, (req, res) => {
    let data = require("../Data/users.json")
    
    data.users[Number(req.body.data.id)] = req.body.data
    
    fs.writeFile("../Data/users.json", JSON.stringify(data), (err) => {
        if(err)
            throw err 
    })
    res.status(202)
    res.end('true')
})

router.post("/editPost", jsonParser, (req, res) => {
    let data = require("../Data/" + req.body.data.author_id + "/news.json")

    data.news[Number(req.body.data.news_id)] = req.body.data

    fs.writeFile("../Data/" + req.body.data.author_id + "/news.json", JSON.stringify(data), (err) => {
        if(err)
            throw err 
    })

    res.status(202)
    res.end('true')
})

router.post("/addPost", jsonParser, (req, res) => {
    let data = require("../Data/" + req.body.data.author_id + "/news.json")

    req.body.data.news_id = data.news.length.toString()

    data.news.unshift(req.body.data)


    fs.writeFile("../Data/" + req.body.data.author_id + "/news.json", JSON.stringify(data), (err) => { 
        if(err)
            throw err 
    })

    res.status(202)
    res.end(req.body.data.news_id.toString())

})

router.post("/msgs", jsonParser, (req, res) => {
    try{
        require("../Data/msgs/" + req.body.data[0] + "-" + req.body.data[1] + ".json")
    }
    catch(err){
        fs.open("../Data/msgs/" + req.body.data[0] + "-" + req.body.data[1] + ".json", "w", (err) => {
            if(err)
                throw err
        })
        fs.writeFile("../Data/msgs/" + req.body.data[0] + "-" + req.body.data[1] + ".json", JSON.stringify({"msgs" : []}), (err) => {
            if(err)
                throw err
        })

        
    }

    let msgs = require("../Data/msgs/" + req.body.data[0] + "-" + req.body.data[1] + ".json")

    res.status(202)
    res.json(msgs.msgs)
})

router.post("/addMsg", jsonParser, (req, res) => {
    let msgs = require("../Data/msgs/" + req.body.file[0] + "-" + req.body.file[1] + ".json")
    let data = require("../Data/users.json")


    req.body.message.author = data.users[req.body.message.author_id].name
    msgs.msgs.push(req.body.message)

    fs.writeFile("../Data/msgs/" + req.body.file[0] + "-" + req.body.file[1] + ".json", JSON.stringify(msgs), (err) => {
        if(err)
            throw err
    })

    res.json(msgs.msgs)
    res.status(202)
})

module.exports = router
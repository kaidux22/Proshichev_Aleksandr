const express = require("express");
const router = express.Router();
const path = require('path')
const pages = path.resolve(__dirname, "../")
const urlencodedParser = express.urlencoded({extended: false});

var date = new Date()
let library = require("../DataBase.json");
const { loadavg } = require("os");
let curPath = "/"

let userData = {
    "userName" : "null",
    "userRights" : false
}

router.get("/", (req, res) => {
    curPath = "/"
    res.render("index", {
        user : userData,
        books : library.library,
        data : date.toLocaleDateString("ru-RU", {year: "numeric", month: "numeric", day: "numeric"}) + " (" + date.toLocaleDateString("ru-RU", {weekday : "long"}) + ")",
    })
})

router.get("/src/favicon.png", (req, res) => {
    res.sendFile(path.resolve(pages, "/src/favicon.png"))
 })

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/books/login", (req, res) => {
    res.redirect("/login")
})

router.post("/login", urlencodedParser, (req, res) => {
    userData.userName = req.body.userName
    userData.userRights = (req.body.userRights == "on")
    res.redirect(curPath)
})

router.post("/exit", urlencodedParser, (req, res) => {
    userData.userName = "null"
    userData.userRights = false
    res.redirect(curPath)
})

router.post("/exit", urlencodedParser, (req, res) => {
    userData.userName = "null"
    userData.userRights = false
    res.redirect(curPath)
})

router.post("/books/exit", urlencodedParser, (req, res) => {
    userData.userName = "null"
    userData.userRights = false
    res.redirect(curPath)
})

router.get("/books/:num", (req, res) => {
    if(library.library.length < req.params.num){
        res.status(404)
        res.end("Page not found")
    }
    curPath = path.resolve("/books", req.params.num.toString())
    res.render("book", {
        user : userData,
        data : date.toLocaleDateString("ru-RU", {year: "numeric", month: "numeric", day: "numeric"}) + " (" + date.toLocaleDateString("ru-RU", {weekday : "long"}) + ")",
        library : library.library,
        num : req.params.num,
        ms : Date.parse(date)
    })
})

router.post("/books/takeBook/", urlencodedParser, (req, res) => {
    library.library[req.body.book - 1].isTaken = "yes"
    library.library[req.body.book - 1].period = Date.parse(new Date(Date.parse(date) + 7 * 24 * 60 * 60 * 1000))
    library.library[req.body.book - 1].owner = userData.userName
    res.redirect("/books/" + req.body.book.toString())
})

router.post("/books/returnBook/", urlencodedParser, (req, res) => {
    library.library[req.body.book - 1].isTaken = null
    library.library[req.body.book - 1].period = null
    library.library[req.body.book - 1].owner = null
    res.redirect("/books/" + req.body.book.toString())
})

router.get("*", (req, res)=>{
res.status(404); // Ошибка – нет такой страницы
res.end("Page not found");
});

module.exports = router;
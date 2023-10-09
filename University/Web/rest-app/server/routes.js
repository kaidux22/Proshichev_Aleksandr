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
    library.library[req.body.book - 1].period = (new Date(Date.parse(date) + 7 * 24 * 60 * 60 * 1000)).toLocaleDateString("ru-RU", {year: "numeric", month: "numeric", day: "numeric"}) + " (" + date.toLocaleDateString("ru-RU", {weekday : "long"}) + ")",
    library.library[req.body.book - 1].owner = userData.userName
    res.redirect("/books/" + req.body.book.toString())
})

router.post("/books/returnBook/", urlencodedParser, (req, res) => {
    library.library[req.body.book - 1].isTaken = null
    library.library[req.body.book - 1].period = null
    library.library[req.body.book - 1].owner = null
    res.redirect("/books/" + req.body.book.toString())
})

router.post("/books/updateBookInfo", urlencodedParser, (req, res) => {
    library.library[req.body.book - 1].title = req.body.title
    library.library[req.body.book - 1].author = req.body.author
    library.library[req.body.book - 1].dataRelease = req.body.dataRelease

    if(req.body.owner != "" && req.body.period != ""){
        library.library[req.body.book - 1].isTaken = true
        library.library[req.body.book - 1].period = req.body.period
        library.library[req.body.book - 1].owner = req.body.owner
    }

    if(req.body.owner == "" && req.bode.period == ""){
        library.library[req.body.book - 1].isTaken = null
        library.library[req.body.book - 1].period = null
        library.library[req.body.book - 1].owner = null
    }

    res.redirect("/books/" + req.body.book.toString())
})

router.post("/books/deleteBook", urlencodedParser, (req, res) => {
    library.library.splice(req.body.book - 1, 1)

    for(let i = 0; i < library.library.length; i++){
        if(library.library[i].id != (i + 1).toString()){
            library.library[i].id = (i + 1).toString()
        }
    }

    res.redirect("/")
})

router.post("/addBook", urlencodedParser, (req, res) => {
    let book = {}

    book["id"] = (library.library.length + 1).toString()
    book["title"] = req.body.title
    book["author"] = req.body.author
    book["dataRelease"] = req.body.dataRelease
    
    library.library.push(book)
    res.redirect("/")
})

router.get("/ajax.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "ajax.js"))
})

function comp(book1, book2){
    if(book1.period == null && book2.period == null){
        return 0
    }
    if(book1.period == null){
        return -1
    }
    if(book2.period == null){
        return 1
    }
    
    return (Date.parse(book1.period) >= Date.parse(book2.period) ? 1 : -1)

}

router.post("/filter", urlencodedParser, (req, res) => {
    let listOfBooks = library.library.slice()
    switch(req.body.value){
        case "byNothing":
            break
        case "byTitle":
            listOfBooks.sort((book1, book2) => (book1.title > book2.title) ? 1 : -1)
            break
        case "byStock":
            listOfBooks = listOfBooks.filter((book) => {return book.isTaken == null})
            break
        case "byReturnDate":
            listOfBooks.sort(comp)
            break
    }
    res.render("bookList", {books : listOfBooks, user : userData})
})

router.get("*", (req, res)=>{
res.status(404); // Ошибка – нет такой страницы
res.end("Page not found");
});

module.exports = router;
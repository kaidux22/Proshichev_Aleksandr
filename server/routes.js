const express = require("express");
const router = express.Router();
const path = require('path')
const library = require("../DataBase.json")
const pages = path.resolve(__dirname, "../views")

router.get("/", (req, res) => {
    res.render("index", {
        user_name: "Sashka",
        books: library.library
    })
})

router.get("/page", (req, res, next) => {
res.end(`Here is a page`); // Ответ
next(); // Переход к следующему обработчику
});
                        
router.get("/", (req, res, next)=>{
res.end("ROOT PAGE");                                                             
next();
});

router.get("*", (req, res)=>{
res.status(404); // Ошибка – нет такой страницы
res.end("Page not found");
});

module.exports = router;
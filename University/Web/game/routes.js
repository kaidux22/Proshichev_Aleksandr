const express = require("express");
const router = express.Router();
const path = require('path')
const urlencodedParser = express.urlencoded({extended: false});
const pixels = require('get-pixels');
const getPixels = require("get-pixels");
const fs = require('fs')

router.get("/", (req, res) => {
    res.render("reg.pug")
})

router.get("/records", (req, res) => {
    let data = 
    res.render("records.pug")
})

router.get("/list", (req, res) => {
    let data = require('./players.json')
    res.send(data.players)
})

router.get("/:name.:type", (req, res) => {
    if(req.params.type == 'css'){
        res.send("/styles/" + req.params.name + ".css")
    }
    else if(req.params.type == 'js'){
        res.sendFile(__dirname + "/scripts/" + req.params.name + ".js")
    }
    else{
        console.log(req.params.type)
        res.sendFile(__dirname + "/src/" + req.params.name + "." + req.params.type)
    }
})

router.get("/mapInfo/:level", (req, res) => {
    let data = require('./design/' + req.params.level + '/map.json')
    console.log(data)
    res.send(data)
})


router.get("/player/:type", (req, res) => {
    if(req.params.type == "json"){
        let data = require('./design/player/sprites.json')
        res.send(data)
    }
    else{
        res.sendFile(__dirname + '/design/player/spritesheet.png')
    }

})

router.get("/wolf/:type", (req, res) => {
    if(req.params.type == "json"){
        let data = require('./design/wolf/sprites.json')
        res.send(data)
    }
    else{
        res.sendFile(__dirname + '/design/wolf/spritesheet.png')
    }

})

router.get("/bear/:type", (req, res) => {
    if(req.params.type == "json"){
        let data = require('./design/bear/sprites.json')
        res.send(data)
    }
    else{
        res.sendFile(__dirname + '/design/bear/spritesheet.png')
    }

})


router.get("/tileset", (req, res) => {
    getPixels('./src/top-down-forest-tileset.png', function(err, pixels) {
        if(err){
            console.log("Bad img path")
            return
        }
        res.json(pixels)
    })
})

router.get("/:level/:name.png", (req, res) => {
    res.sendFile(__dirname + '/design/'+ req.params.level + '/' + req.params.name + '.png')
})

async function SaveFile(data){
    return await fs.writeFile("players.json", JSON.stringify(data), (err) => {
        if(err)
            throw err
    })
}

router.post("/game", urlencodedParser, (req, res) => {
    let data = require('./players.json')

    if(req.body.fir != undefined){
        level = "1"
    }
    else{
        level = "2"
    }
    res.render("main.pug", {
        name : req.body.name,
        level : level  
    })
})


router.get("/:name/:level/:score", (req, res) => {
    let data = require('./players.json')

    req.params.score = Number(req.params.score)
    let isExist = false
    for(let i = 0; i < data.players.length; i++){
        if(req.params.name.indexOf(data.players[i].name) != -1){
            isExist = true
            if(req.params.level == 1){
                if(data.players[i].fir_level_best_score < req.params.score){
                    data.players[i].fir_level_best_score = req.params.score
                }
                data.players[i].fir_level_score = req.params.score
            }
            else{
                if(data.players[i].sec_level_best_score < req.params.score){
                    data.players[i].sec_level_best_score = req.params.score
                }
                data.players[i].sec_level_score = req.params.score
            }
        }
    }

    if(!isExist){
        let player = {
            name : req.params.name.trim(),
            fir_level_score : 0,
            fir_level_best_score : 0,
            sec_level_score : 0,
            sec_level_best_score : 0
        }

        if(req.params.level == 1){
            if(player.fir_level_best_score < req.params.score){
                player.fir_level_best_score = req.params.score
            }
            player.fir_level_score = req.params.score
        }
        else{
            if(player.sec_level_best_score < req.params.score){
                player.sec_level_best_score = req.params.score
            }
            player.sec_level_score = req.params.score
        }
        data.players.push(player)
    }

    fs.writeFile("players.json", JSON.stringify(data), (err) => {
        if(err)
            throw err
        else
            console.log("Correct")
    })
    
    res.end('true')
})


router.get("*", (req, res) => {
    res.status(404)
    res.end("Not found")
})

module.exports = router
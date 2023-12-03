import MapManager from './mapManager.js'
import * as Objects from './objectManager.js'
import * as Sprites from './spriteManager.js'
import * as CONSTS from './gameConfig.js'
import EventManager from './eventManager.js'
import AudioManager from './audioManager.js'

class Game{
    constructor(){
        this.AudioManager = new AudioManager()
        this.gameScore = 0
        this.isBush = false
        this.objects = []
        this.Wolfs = []
        this.WolfViews = []
        this.level = document.getElementById('level').textContent[0]
        this.GetJSON('mapInfo/' + this.level).then(res => {
            res.json().then(json => {
                this.MapManager = new MapManager(this.level, json)
                this.ObjectParser(json)
            })
        })
    }

    async GetJSON(str){
        return await fetch(
            'http://localhost:3000/' + str,
            {
                method: 'GET',
            }
        )
    }

    getScore(){
        this.gameScore += this.Player.health / 12
        document.getElementById('time').textContent = "Счёт: " + (Math.floor(this.gameScore)).toString() + " x" + (4 - this.Player.health)
    }

    ObjectParser(json){
        for(let item of json.layers){
            if(item.type == "objectgroup" && item.name == 'characters'){
                console.log(item)
                for(let object of item.objects){
                    if(object.name == 'player'){
                        console.log("here")
                        this.Player = new Objects.Player(object)
                        this.PlayerView = new Sprites.PlayerSprite(this.Player, this.GetJSON('player/json'))
                    }
                    else if(object.name == 'wolf'){
                        
                        this.Wolfs.push(new Objects.Wolf(object))
                        this.WolfViews.push(new Sprites.WolfSprite(this.Wolfs[this.Wolfs.length - 1], this.GetJSON('wolf/json')))
                    }
                    else if(object.name == 'bear'){
                        this.Bear = new Objects.Bear(object)
                        this.BearView = new Sprites.BearSprite(this.Bear, this.GetJSON('bear/json'))
                    }
                    
                }
            }
            else if(item.type == 'objectgroup'){
                for(let object of item.objects){
                    this.objects.push(new Objects.ObjectManager(object))
                }
            }
        }
    }

    MapEnd(person){
        if(person.pos.x < 4 || person.pos.x > this.MapManager.canvas.width - 64)
            return false
        if(person.pos.y < 4 || person.pos.y > this.MapManager.canvas.height - 80)
            return false

            person.isBush = false
        for(let object of this.objects){
            if(person.pos.x >= object.pos.x && person.pos.x <= object.pos.x + object.width && person.pos.y >= object.pos.y && person.pos.y <= object.pos.y + object.height){
                if(object.name == "bush"){
                    this.AudioManager.BushSound()
                    person.isBush = true
                    return true
                }
                
                return false
            } 
        }
        
        return true
    }

}

const game = new Game

const eventManager = new EventManager(game)


let interval = setInterval(function(){
    game.MapManager.GenerateMap()

    game.MapManager.GenerateDecors()

    if(!game.Player.isBush){
        game.PlayerView.GeneratePlayer(game.Player.diractive, game.Player)
        game.Player.WasteBonus()
        for(let i = 0; i < game.Wolfs.length; i++){
            game.Wolfs[i].Attack(game.Player, game.AudioManager)
            if(!game.MapEnd(game.Wolfs[i])){
                game.Wolfs[i].AttackY()
                if(!game.MapEnd(game.Wolfs[i])){
                    game.Wolfs[i].AttackX()
                }
            }
            if(!game.Wolfs[i].isBush)
                game.WolfViews[i].GenerateWolf(game.Wolfs[i].diractive, game.Wolfs[i], false)
        }

    }
    else{
        for(let i = 0; i < game.Wolfs.length; i++){
            game.Wolfs[i].Walk()
            if(!game.MapEnd(game.Wolfs[i])){
                game.Wolfs[i].WalkCancel()
            }
            if(!game.Wolfs[i].isBush)
                if(game.Wolfs[i].cnt_steps > 0)
                    game.WolfViews[i].GenerateWolf(game.Wolfs[i].diractive, game.Wolfs[i], false)
                else
                    game.WolfViews[i].GenerateWolf(game.Wolfs[i].diractive, game.Wolfs[i], true)
        }
    }

    game.Bear.Attack(game.Player)
    if(!game.MapEnd(game.Bear)){
        game.Bear.AttackY()
        if(!game.MapEnd(game.Bear)){
            game.Bear.AttackX()
        }
    }
    

    
    if(!game.Bear.isBush)
        game.BearView.GenerateBear(game.Bear.diractive, game.Bear)

    game.MapManager.GenerateTree()
    
    game.getScore()

    if(game.Player.health <= 0){
        game.GetJSON(document.getElementById('name').textContent.toString() + '/' + document.getElementById('level').textContent[0] + '/' + game.gameScore.toString()).then( () => {
            setTimeout(function(){
                window.location.href = 'http://localhost:3000/records'
            }, 1000)
        })
        clearInterval(interval)
    }
}, 30)

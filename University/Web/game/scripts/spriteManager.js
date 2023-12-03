import * as CONSTS from './gameConfig.js'

export default class SpriteManager{
    constructor(){
        this.image = new Image()
        this.sprites = new Array()
        this.imgLoaded = false
        this.jsonLoaded = false
    }
}

export class PlayerSprite extends SpriteManager{
    constructor(data, response){
        super()
        this.Player = data
        this.onPlace = true
        this.animation = 0
        this.ctx = document.getElementById('map').getContext('2d')
        this.imgLoaded = false
        this.jsonLoaded = false
        response.then(res => {
            res.json().then(json => {
                this.sprites = json
                this.jsonLoaded = true
                this.LoadViewPlayer()
            })
        })   
    }

    LoadViewPlayer(){
        let self = this
        this.image.onload = function() {
            self.GeneratePlayer("_down idle", self.Player)
        }   
        this.image.src = "http://localhost:3000/player/png"
    }

    GeneratePlayer(action, data){

        switch(action){
            case CONSTS.DIRACTIVE.BOTTOM:
                if(this.onPlace)
                    action = "_down idle"
                else
                    action = "_down walk"
                break
            case CONSTS.DIRACTIVE.LEFT:
                if(this.onPlace)
                    action = "_left idle"
                else
                    action = "_left walk"
                break
            case CONSTS.DIRACTIVE.RIGHT:
                if(this.onPlace)
                    action = "_right idle"
                else
                    action = "_rigth walk"
                break
            case CONSTS.DIRACTIVE.TOP:
                if(this.onPlace)
                    action = "_up idle"
                else
                    action = "_up walk"
                break
        }
        this.onPlace = true

        this.Player = data
        let sprites = this.GetSpriteset(action)
        if(sprites == null)
            console.log(this.sprites)
        
        if(this.animation < 2)
            this.ctx.drawImage(this.image, sprites.x, sprites.y, 64, 64, this.Player.pos.x, this.Player.pos.y, 64, 64)
        else if(this.animation < 4)
            this.ctx.drawImage(this.image, sprites.x + 64, sprites.y, 64, 64, this.Player.pos.x, this.Player.pos.y, 64, 64)
        else if(this.animation < 6)
            this.ctx.drawImage(this.image, sprites.x + 64 * 2, sprites.y, 64, 64, this.Player.pos.x, this.Player.pos.y, 64, 64)
        else if(this.animation < 8)
            this.ctx.drawImage(this.image, sprites.x + 64 * 3, sprites.y, 64, 64, this.Player.pos.x, this.Player.pos.y, 64, 64)
        this.animation = (this.animation + 2) % 8

    }

    GetSpriteset(name){
        for(let obj of this.sprites){
            if(obj.name == name){
                return obj
            }
        }
        return null
    }
}

export class WolfSprite extends SpriteManager{
    constructor(data, response){
        super()
        this.Wolf = data
        this.animation = 0
        this.ctx = document.getElementById('map').getContext('2d')
        this.imgLoaded = false
        this.jsonLoaded = false
        console.log(this)
        response.then(res => {
            res.json().then(json => {
                this.sprites = json
                this.jsonLoaded = true
                this.LoadViewWolf()
            })
        })   
    }

    LoadViewWolf(){
        let self = this
        this.image.onload = function() {
            self.GenerateWolf(self.Wolf.diractive, self.Wolf)
        }   
        this.image.src = "http://localhost:3000/wolf/png"
    }

    GenerateWolf(action, data, onPlace){

        switch(action){
            case CONSTS.DIRACTIVE.BOTTOM:
                action = "MiniWolf2"
                break
            case CONSTS.DIRACTIVE.LEFT:
                action = "MiniWolf2"
                break
            case CONSTS.DIRACTIVE.RIGHT:
                action = "MiniWolf"
                break
            case CONSTS.DIRACTIVE.TOP:
                action = "MiniWolf"
                break
        }

        this.Wolf = data
        let sprites = this.GetSpriteset(action)

        if(onPlace || this.Wolf.afterBite != 0){
            if(action == "MiniWolf"){
                this.ctx.drawImage(this.image, sprites.x, sprites.y, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            } 
            else{
                this.ctx.drawImage(this.image, sprites.x + 128, sprites.y, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            } 
        }
        else{
            if(action == "MiniWolf"){
                if(this.animation < 2)
                    this.ctx.drawImage(this.image, sprites.x, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
                else if(this.animation < 4)
                    this.ctx.drawImage(this.image, sprites.x + 32, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
                else if(this.animation < 6)
                    this.ctx.drawImage(this.image, sprites.x + 64, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)            
                else if(this.animation < 8)
                    this.ctx.drawImage(this.image, sprites.x + 96, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)           
                this.animation = (this.animation + 1) % 8
            } 
            else{
                if(this.animation < 2)
                this.ctx.drawImage(this.image, sprites.x + 64, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
                else if(this.animation < 4)
                    this.ctx.drawImage(this.image, sprites.x + 96, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
                else if(this.animation < 6)
                    this.ctx.drawImage(this.image, sprites.x + 128, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
                else if(this.animation < 8)
                    this.ctx.drawImage(this.image, sprites.x + 160, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
                this.animation = (this.animation + 1) % 8
            } 
        }
        
    }

    GetSpriteset(name){
        for(let obj of this.sprites){
            
            if(obj.name == name){
                return obj
            }
        }
        return null
    }
}

export class BearSprite extends SpriteManager{
    constructor(data, response){
        super()
        this.Bear = data
        this.animation = 0
        this.ctx = document.getElementById('map').getContext('2d')
        this.imgLoaded = false
        this.jsonLoaded = false
        console.log(this)
        response.then(res => {
            res.json().then(json => {
                this.sprites = json
                this.jsonLoaded = true
                this.LoadViewBear()
            })
        })   
    }

    LoadViewBear(){
        let self = this
        this.image.onload = function() {
            self.GenerateBear(self.Wolf.diractive, self.Wolf)
        }   
        this.image.src = "http://localhost:3000/bear/png"
    }

    GenerateBear(action, data){
        let right = false

        switch(action){
            case CONSTS.DIRACTIVE.BOTTOM:
                action = "MiniBear2"
                break
            case CONSTS.DIRACTIVE.LEFT:
                action = "MiniBear2"
                break
            case CONSTS.DIRACTIVE.RIGHT:
                action = "MiniBear"
                break
            case CONSTS.DIRACTIVE.TOP:
                action = "MiniBear"
                break
        }

        this.Wolf = data
        let sprites = this.GetSpriteset(action)
        if(action == "MiniBear"){
            if(this.animation < 2)
                this.ctx.drawImage(this.image, sprites.x, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            else if(this.animation < 4)
                this.ctx.drawImage(this.image, sprites.x + 32, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            else if(this.animation < 6)
                this.ctx.drawImage(this.image, sprites.x + 64, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)            
            else if(this.animation < 8)
                this.ctx.drawImage(this.image, sprites.x + 96, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)           
            this.animation = (this.animation + 1) % 8
        } 
        else{
            if(this.animation < 2)
            this.ctx.drawImage(this.image, sprites.x + 128, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            else if(this.animation < 4)
                this.ctx.drawImage(this.image, sprites.x + 160, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            else if(this.animation < 6)
                this.ctx.drawImage(this.image, sprites.x + 192, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            else if(this.animation < 8)
                this.ctx.drawImage(this.image, sprites.x + 224, sprites.y + 32, 32, 32, this.Wolf.pos.x, this.Wolf.pos.y - 10, 64, 64)
            this.animation = (this.animation + 1) % 8
        } 

    }

    GetSpriteset(name){
        for(let obj of this.sprites){
            
            if(obj.name == name){
                return obj
            }
        }
        return null
    }
}

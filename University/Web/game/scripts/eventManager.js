import * as CONSTS from './gameConfig.js'

export default class EventManager{
    constructor(game){
        document.addEventListener('keydown', function(event){
            if(event.key == 'ArrowRight'){
                game.PlayerView.onPlace = false
                game.Player.pos.x += game.Player.speed
                if(!game.MapEnd(game.Player)){
                    game.Player.pos.x -= game.Player.speed
                }
                game.Player.diractive = CONSTS.DIRACTIVE.RIGHT
            }
        })
        
        document.addEventListener('keydown', function(event){
            if(event.key == 'ArrowLeft'){
                game.PlayerView.onPlace = false
                game.Player.pos.x -= game.Player.speed
                if(!game.MapEnd(game.Player)){
                    game.Player.pos.x += game.Player.speed
                }
                game.Player.diractive = CONSTS.DIRACTIVE.LEFT
            }
        })
        
        document.addEventListener('keydown', function(event){
            if(event.key == 'ArrowUp'){
                game.PlayerView.onPlace = false
                game.Player.pos.y -= game.Player.speed
                if(!game.MapEnd(game.Player)){
                    game.Player.pos.y += game.Player.speed
                }
                game.Player.diractive = CONSTS.DIRACTIVE.TOP
            }
        })
        
        document.addEventListener('keydown', function(event){
            if(event.key == 'ArrowDown'){
                game.PlayerView.onPlace = false
                game.Player.pos.y += game.Player.speed
                if(!game.MapEnd(game.Player)){
                    game.Player.pos.y -= game.Player.speed
                }
                game.Player.diractive = CONSTS.DIRACTIVE.BOTTOM
            }
        })
    }
}


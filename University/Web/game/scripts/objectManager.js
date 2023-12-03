import * as CONSTS from './gameConfig.js'

export class ObjectManager{
    constructor(data){
        this.height = data.height * 2 + 10
        this.width = data.width * 2
        this.pos = {x : Math.ceil(data.x) * 2 - 32, y: Math.ceil(data.y) * 2 - 50}
        this.name = data.name
    }
}



export class Player extends ObjectManager{
    constructor(data){
        super(data)
        this.bonus_time = 0
        this.health = CONSTS.PLAYER_HEALTH
        this.speed = CONSTS.SPEED.PLAYER.RUN
        this.diractive = CONSTS.DIRACTIVE.BOTTOM
        this.deractiveWalk = CONSTS.DIRACTIVE.BOTTOM
        this.isBush = false
    }

    Bite(val){
        this.health -= val
        this.speed = CONSTS.SPEED.PLAYER.BONUS
        this.bonus_time = CONSTS.PLAYER_BONUS
    }

    WasteBonus(){
        if(this.bonus_time > 0){
            this.bonus_time--
        }
        else{
            this.speed = CONSTS.SPEED.PLAYER.RUN
        }
    }
}

export class Wolf extends ObjectManager{
    constructor(data){
        super(data)
        this.speed_walk = CONSTS.SPEED.WOLF.WALK
        this.speed_run = CONSTS.SPEED.WOLF.RUN
        this.diractive = CONSTS.DIRACTIVE.RIGHT
        this.cnt_steps = -100
        this.isBush = false
        this.afterBite = 0
    }

    Walk(){
        if(this.cnt_steps == -100){
            this.cnt_steps = Math.ceil(Math.random() * 1000 % 200 + 200)

            let dir = this.diractive
            while(dir == this.diractive){
                dir = Math.ceil(Math.random() * 1000) % 4
                console.log(dir)

                switch(dir){
                    case 0:
                        dir = CONSTS.DIRACTIVE.RIGHT
                        break
                    case 1:
                        dir = CONSTS.DIRACTIVE.LEFT
                        break
                    case 2:
                        dir = CONSTS.DIRACTIVE.BOTTOM
                        break
                    case 3:
                        dir = CONSTS.DIRACTIVE.TOP
                        break
                }
            }
            this.diractive = dir
            this.deractiveWalk = dir

            this.GetStep()
            this.cnt_steps--
        }
        else if(this.cnt_steps <= 0){
            this.cnt_steps--
        }
        else{
            this.cnt_steps--
            this.GetStep()
        }

    }

    GetStep(){
        switch(this.diractive){
            case CONSTS.DIRACTIVE.RIGHT:
                this.pos.x += this.speed_walk
                break;
            case CONSTS.DIRACTIVE.LEFT:
                this.pos.x -= this.speed_walk
                break
            case CONSTS.DIRACTIVE.TOP:
                this.pos.y -= this.speed_walk
                break
            case CONSTS.DIRACTIVE.BOTTOM:
                this.pos.y += this.speed_walk
                break
        }
    }

    WalkCancel(){
        switch(this.diractive){
            case CONSTS.DIRACTIVE.RIGHT:
                this.pos.x -= this.speed_walk
                break;
            case CONSTS.DIRACTIVE.LEFT:
                this.pos.x += this.speed_walk
                break
            case CONSTS.DIRACTIVE.TOP:
                this.pos.y += this.speed_walk
                break
            case CONSTS.DIRACTIVE.BOTTOM:
                this.pos.y -= this.speed_walk
                break
        }
    }

    Attack(player, sounds){
        if(this.afterBite != 0){
            this.afterBite--
            return
        }

        let distance = Math.sqrt((player.pos.x - this.pos.x) * (player.pos.x - this.pos.x) + (player.pos.y - this.pos.y)*(player.pos.y - this.pos.y))
        this.LastPosition = {x : this.pos.x, y : this.pos.y}
        if(Math.sqrt(distance <= this.speed_run)){
            sounds.WolfSound()
            sounds.PlayerScream()
            player.Bite(1)
            this.afterBite = 50
        }

        else{
            this.pos.x += (player.pos.x - this.pos.x) / distance * this.speed_run
            this.pos.y += (player.pos.y - this.pos.y) / distance * this.speed_run

            if(player.pos.x - this.pos.x < 0){
                this.diractive = CONSTS.DIRACTIVE.LEFT
            }
            else{
                this.diractive = CONSTS.DIRACTIVE.RIGHT
            }
        }

        
    }

    AttackY(){
        
        if(this.pos.y - this.LastPosition.y >= 0)
            this.pos.y += Math.abs(this.pos.x - this.LastPosition.x) 
        else
            this.pos.y -= Math.abs(this.pos.x - this.LastPosition.x) 
        this.pos.x = this.LastPosition.x
    }

    AttackX(){
        if(this.pos.x - this.LastPosition.x >= 0)
        this.pos.x += Math.abs(this.pos.y - this.LastPosition.y) 
        else
            this.pos.x -= Math.abs(this.pos.y - this.LastPosition.y) 
        this.pos.y = this.LastPosition.y
    }
}

export class Bear extends ObjectManager{
    constructor(data){
        super(data)
        this.speed = CONSTS.SPEED.BEAR
        this.diractive = CONSTS.DIRACTIVE.LEFT
        this.isBush = false
    }

    Attack(player){

        let distance = Math.sqrt((player.pos.x - this.pos.x) * (player.pos.x - this.pos.x) + (player.pos.y - this.pos.y)*(player.pos.y - this.pos.y))
        this.LastPosition = {x : this.pos.x, y : this.pos.y}
        if(Math.sqrt(distance <= this.speed)){
            player.Bite(3)
            return
        }

        else{
            this.pos.x += (player.pos.x - this.pos.x) / distance * this.speed
            this.pos.y += (player.pos.y - this.pos.y) / distance * this.speed

            if(player.pos.x - this.pos.x < 0){
                this.diractive = CONSTS.DIRACTIVE.LEFT
            }
            else{
                this.diractive = CONSTS.DIRACTIVE.RIGHT
            }
        }

        
    }

    AttackY(){
        
        if(this.pos.y - this.LastPosition.y >= 0)
            this.pos.y += Math.abs(this.pos.x - this.LastPosition.x) 
        else
            this.pos.y -= Math.abs(this.pos.x - this.LastPosition.x) 
        this.pos.x = this.LastPosition.x
    }

    AttackX(){
        if(this.pos.x - this.LastPosition.x >= 0)
        this.pos.x += Math.abs(this.pos.y - this.LastPosition.y) 
        else
            this.pos.x -= Math.abs(this.pos.y - this.LastPosition.y) 
        this.pos.y = this.LastPosition.y
    }
}
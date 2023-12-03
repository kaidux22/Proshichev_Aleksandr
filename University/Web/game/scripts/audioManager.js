
export default class AudioManager{
    constructor(){
        this.bush = new Audio('./bush.mp3')
        this.player = new Audio('./player.mp3')
        this.wolf = new Audio('./wolf.mp3')
    }

    BushSound(){
        this.bush.play()
    }

    PlayerScream(){
        this.player.play()
    }

    WolfSound(){
        this.wolf.play()
    }

}
export default class MapManager {
    constructor(level, json){
        this.mapData = json
        this.tilesets = this.mapData.layers
        this.xCount = json.width
        this.yCount = json.height
        this.tSize = {x : json.tilewidth * 2, y : json.tileheight * 2}
        this.mapSize = { x: this.xCount * this.tSize.x, y : this.yCount * this.tSize.y}
        this.imgLoadCount = 0
        this.imgLoaded = false
        this.imgs = []

        this.canvas = document.getElementById('map')
        this.canvas.width = this.mapSize.x
        this.canvas.height = this.mapSize.y
        this.canvas.style = "border : 5px solid #779eb973; border-radius : 10px;"
        this.canvas.style.left = ((1850 - this.mapSize.x) / 2).toString() + 'px'
        this.ctx = document.getElementById('map').getContext('2d')
        
        let img = new Image(this.mapSize.x, this.mapSize.y)
        img.onload = this.LoadImg
        img.src = '/' + level + '/grass.png'
        this.imgs.push(img)

        for(let i = 0; i < this.tilesets.length; i++){
            let img = new Image()
            img.onload = this.LoadImg
            img.src = '/' + level + '/' + this.tilesets[i].name + '.png'
            this.imgs.push(img)
        }
    }


    LoadImg(){
        const canvas = document.getElementById('map')
        const ctx = canvas.getContext('2d')

        ctx.save()

        ctx.drawImage(this, 0, 0, canvas.width, canvas.height)

        ctx.restore()
    }

    GenerateMap(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.save()

        this.ctx.drawImage(this.imgs[0], 0, 0, this.canvas.width, this.canvas.height)

        this.ctx.restore()

    }

    GenerateDecors(){
        for(let i = 2; i < this.imgs.length; i++){

            this.ctx.save()

            this.ctx.drawImage(this.imgs[i], 0, 0, this.canvas.width, this.canvas.height)

            this.ctx.restore()
        }
    }

    GenerateTree(){
        this.ctx.save()

        this.ctx.drawImage(this.imgs[7], 0, 0, this.canvas.width, this.canvas.height)

        this.ctx.restore()
    }
}
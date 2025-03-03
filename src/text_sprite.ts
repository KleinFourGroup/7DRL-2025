import { Container, Graphics, Sprite, Texture } from "pixi.js"

class TextSprite {
    text: string
    textColor: string
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    sprite: Sprite

    constructor(text: string, textColor: string, backColor: string = null) {
        this.text = text

        this.textColor = textColor

        this.canvas = document.createElement('canvas')
        this.canvas.width = 24
        this.canvas.height = 24

        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "24px serif"
        this.ctx.fillStyle = this.textColor
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, 12, 12)

        this.sprite = new Sprite(Texture.from(this.canvas))
        this.sprite.position.set(0, 0)
    }

    redraw() {
        this.ctx.clearRect(0, 0, 24, 24)
        this.ctx.fillText(this.text, 12, 12)
    }
}

class TileSprite {
    text: string
    textColor: string
    backColor: string
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    tile: Container
    sprite: Sprite
    background: Graphics

    constructor(text: string, textColor: string, backColor: string = null) {
        this.text = text

        this.textColor = textColor
        this.backColor = backColor

        this.canvas = document.createElement('canvas')
        this.canvas.width = 24
        this.canvas.height = 24

        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "24px serif"
        this.ctx.fillStyle = this.textColor
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, 12, 12)

        this.sprite = new Sprite(Texture.from(this.canvas))
        this.sprite.position.set(0, 0)

        if (this.backColor !== null) {
            this.background = new Graphics().rect(0, 0, 24, 24).fill(this.backColor)
            this.background.position.set(0, 0)
        } else {
            this.background = null
        }
        
        this.tile = new Container()
        if (this.background !== null) {
            this.tile.addChild(this.background)
        }
        this.tile.addChild(this.sprite)
    }

    redraw() {
        this.ctx.clearRect(0, 0, 24, 24)
        this.ctx.fillText(this.text, 12, 12)
    }
}

export { TextSprite, TileSprite }
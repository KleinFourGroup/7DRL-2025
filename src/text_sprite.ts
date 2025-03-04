import { Container, Graphics, Sprite, Texture } from "pixi.js"

const TILE_SIZE = 128

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
        this.canvas.width = TILE_SIZE
        this.canvas.height = TILE_SIZE

        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = `${TILE_SIZE}px serif`
        this.ctx.fillStyle = this.textColor
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, TILE_SIZE / 2, TILE_SIZE / 2)

        this.sprite = new Sprite(Texture.from(this.canvas))
        this.sprite.position.set(0, 0)
    }

    redraw() {
        this.ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE)
        this.ctx.fillText(this.text, TILE_SIZE / 2, TILE_SIZE / 2)
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
        this.canvas.width = TILE_SIZE
        this.canvas.height = TILE_SIZE

        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = `${TILE_SIZE}px serif`
        this.ctx.fillStyle = this.textColor
        this.ctx.textBaseline = "middle"
        this.ctx.textAlign = "center"
        this.ctx.fillText(this.text, TILE_SIZE / 2, TILE_SIZE / 2)

        this.sprite = new Sprite(Texture.from(this.canvas))
        this.sprite.position.set(0, 0)

        if (this.backColor !== null) {
            this.background = new Graphics().rect(0, 0, TILE_SIZE, TILE_SIZE).fill(this.backColor)
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
        this.ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE)
        this.ctx.fillText(this.text, TILE_SIZE / 2, TILE_SIZE / 2)
    }
}

export {TILE_SIZE}
export { TextSprite, TileSprite }
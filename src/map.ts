
import { Container } from "pixi.js"
import { COLORS } from "./colors"
import { TileSprite } from "./text_sprite"

function randomTiles(ROWS: number, COLS: number) {
    let backgroundSprites: TileSprite[][] = []

    for (let row = 0; row < ROWS; row++) {
        backgroundSprites.push([])
        for (let col = 0; col < COLS; col++) {
            let typeText = Math.floor(Math.random() * 3)
            let typeBack = Math.floor(Math.random() * 2)
            let tile = new TileSprite(
                typeText === 2 ? "\"" : typeText === 1 ? "'" : ",",
                COLORS["terminal green"],
                typeBack === 1 ? COLORS["dark terminal green"] : COLORS["dark terminal amber"]
            )
            tile.tile.position.set(row * 24, col* 24)
            backgroundSprites[row].push(tile)
        }
    }

    return backgroundSprites
}

class GameMap {
    rows: number
    cols: number
    stage: Container
    backgroundTiles: TileSprite[][]
    background: Container
    foreground: Container

    constructor(rows: number, cols: number, backgroundTiles: TileSprite[][]) {
        this.rows = rows
        this.cols = cols
        this.stage = new Container()
        this.backgroundTiles = backgroundTiles
        this.background = new Container()
        this.foreground = new Container()

        for (let row of this.backgroundTiles) {
            for (let tile of row) {
                this.background.addChild(tile.tile)
            }
        }

        this.stage.addChild(this.background)
        this.stage.addChild(this.foreground)
    }
}

export { randomTiles }
export { GameMap }
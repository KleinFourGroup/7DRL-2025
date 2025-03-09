
import { Container } from "pixi.js"
import { COLORS } from "./colors"
import { TILE_SIZE, TileSprite } from "./text_sprite"
import { Position } from "./ecs"

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
            tile.tile.position.set(row * TILE_SIZE, col * TILE_SIZE)
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
    tileStage: Container
    entityStage: Container

    constructor(rows: number, cols: number, backgroundTiles: TileSprite[][]) {
        this.rows = rows
        this.cols = cols
        this.stage = new Container()
        this.backgroundTiles = backgroundTiles
        this.tileStage = new Container()
        this.entityStage = new Container()

        for (let row of this.backgroundTiles) {
            for (let tile of row) {
                this.tileStage.addChild(tile.tile)
            }
        }

        this.stage.addChild(this.tileStage)
        this.stage.addChild(this.entityStage)
    }

    isInboundsPos(position: Position) {
        return (0 <= position.x && position.x < this.rows && 0 <= position.y && position.y < this.cols)
    }

    isInboundsCoord(x: number, y: number) {
        return (0 <= x && x < this.rows && 0 <= y && y < this.cols)
    }
}

export { randomTiles }
export { GameMap }
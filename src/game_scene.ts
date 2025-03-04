import { Container, ContainerChild, Ticker, Text } from "pixi.js"
import { Scene, SceneStatus } from "./scenes"
import { Entity } from "./entities"
import { GameMap, randomTiles } from "./map"
import { TILE_SIZE } from "./text_sprite"
import { COLORS } from "./colors"
    
const ROWS = 41
const COLS = 21
const MESSAGE = "TESTING"


class GameScene implements Scene {
    stage: Container
    debug: Container
    status: SceneStatus
    screenW: number
    screenH: number
    elapsed: number
    
    gameMap: GameMap
    debugText: Text
    ind: number
    character: Entity
    
    lastTick: number

    constructor() {
        this.stage = new Container()
        this.debug = new Container()
        this.debugText = new Text({
            style: {
                fill: COLORS["terminal green"]
            }
        })
        this.debug.addChild(this.debugText)
        this.debugText.position.set(10, 10)
        let backgroundTiles = randomTiles(ROWS, COLS)

        this.screenW = 1920
        this.screenH = 1080

        this.elapsed = 0.0
        this.lastTick = 0.0
        
        this.gameMap = new GameMap(ROWS, COLS, backgroundTiles)
        this.ind = -1
        
        this.character = new Entity("@@")
        this.character.currLoc = {
            x: 20,
            y: 10
        }
        this.character.oldLoc = {
            x: 20,
            y: 10
        }

        this.gameMap.foreground.addChild(this.character.sprite.sprite)
        this.stage.addChild(this.gameMap.stage)

        this.status = SceneStatus.CREATED
    }

    setSize(width: number, height: number): void {
        this.screenW = width
        this.screenH = height

        let scale = Math.hypot(this.screenW, this.screenH) / (25 * TILE_SIZE)
        this.debugText.text = `Scale: ${(scale * 100).toFixed(2)}%` 
        this.stage.scale = scale
    }

    setCamera(x: number, y: number) {
        this.stage.position.set(this.screenW / 2, this.screenH / 2)
        this.gameMap.stage.position.set(-x, -y)
    }

    tick() {
        this.character.oldLoc.x = this.character.currLoc.x
        this.character.oldLoc.y = this.character.currLoc.y
        let searching = true
        while (searching) {
            let rand = Math.floor(Math.random() * 4)
            let dx = 0
            let dy = 0
            switch (rand) {
                case 0:
                    dx = -1
                    break
                case 1:
                    dy = 1
                    break
                case 2:
                    dx = 1
                    break
                case 3:
                    dy = -1
                    break
                default:
                    console.error("Uh oh...")
            }
    
            if (0 <= this.character.currLoc.x + dx && this.character.currLoc.x + dx < ROWS && 0 <= this.character.currLoc.y + dy && this.character.currLoc.y + dy < COLS) {
                this.character.currLoc.x += dx
                this.character.currLoc.y += dy
                searching = false
            }
        }
    
        this.ind = (this.ind + 1) % MESSAGE.length
        this.character.sprite.text = MESSAGE[this.ind]
        this.character.sprite.redraw()
        this.character.sprite.sprite.texture.source.update()
    }

    initScene(): void {
        this.tick()
        this.status = SceneStatus.INITIALIZED
    }
    suspendScene(): void {
        this.status = SceneStatus.SUSPENDED
    }
    resumeScene(): void {
        this.status = SceneStatus.RUNNING
    }

    update(ticker: Ticker): void {

        this.elapsed += ticker.deltaMS
        if (this.elapsed - this.lastTick >= 1000) {
            this.tick()
            this.lastTick += 1000
        }
    
        let progress = (1 - Math.cos(Math.min((this.elapsed - this.lastTick) / 1000, 1) * Math.PI)) / 2
    
        this.character.sprite.sprite.x = this.character.oldLoc.x * TILE_SIZE * (1 - progress) + this.character.currLoc.x * TILE_SIZE * progress
        this.character.sprite.sprite.y = this.character.oldLoc.y * TILE_SIZE * (1 - progress) + this.character.currLoc.y * TILE_SIZE * progress
    
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                let tile = this.gameMap.backgroundTiles[row][col]
                let overlapX = Math.max(0, TILE_SIZE + Math.min(tile.tile.x, this.character.sprite.sprite.x) - Math.max(tile.tile.x, this.character.sprite.sprite.x))
                let overlapY = Math.max(0, TILE_SIZE + Math.min(tile.tile.y, this.character.sprite.sprite.y) - Math.max(tile.tile.y, this.character.sprite.sprite.y))
    
                let overlap = Math.min(overlapX, overlapY) / TILE_SIZE
                tile.sprite.alpha = 1 - overlap
            }
        }
    
        this.setCamera(this.character.sprite.sprite.x + TILE_SIZE / 2, this.character.sprite.sprite.y + TILE_SIZE / 2)
    }
}

export {GameScene}
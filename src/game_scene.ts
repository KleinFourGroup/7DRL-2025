import { Container, Ticker, Text, Rectangle, Application } from "pixi.js"
import { Scene, SceneStatus } from "./scenes"
import { Entity } from "./entities"
import { GameMap, randomTiles } from "./map"
import { TILE_SIZE } from "./text_sprite"
import { COLORS } from "./colors"
import { Camera } from "./camera"
import { KeyframedAnimation, createMessageAnimation } from "./animation"
import { createMoveAction, TICK_GRANULARITY } from "./action"
import { PerfManager } from "./perf"
    
const ROWS = 41
const COLS = 21
const MESSAGE = "TESTING"


class GameScene implements Scene {
    app: Application
    stage: Container
    debug: Container
    status: SceneStatus
    screenW: number
    screenH: number
    elapsed: number
    
    camera: Camera
    ui: Container

    gameMap: GameMap
    debugText: Text
    ind: number
    character: Entity
    characterAnimation: KeyframedAnimation
    
    tickLength: number
    lastTick: number

    perfManager: PerfManager

    constructor(app: Application) {
        this.app = app
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

        this.tickLength = 50

        this.camera = new Camera(this, 25 * TILE_SIZE)
        this.ui = new Container()
        this.ui.eventMode = "static"
        this.ui.hitArea = new Rectangle(0, 0, this.screenW, this.screenH)
        this.ui.on("wheel", (event) => {
            this.camera.deltaZoom(event.deltaY / 5)
        })
        this.ui.on("pointerdown", (event) => {
            console.log(event.x)
        })
        
        this.gameMap = new GameMap(ROWS, COLS, backgroundTiles)
        this.ind = -1
        
        this.character = new Entity("@@", this)
        this.character.currLoc = {
            x: 20,
            y: 10
        }

        this.characterAnimation = createMessageAnimation(this.character, MESSAGE, 200)
        this.characterAnimation.init()

        this.gameMap.foreground.addChild(this.character.sprite.sprite)
        this.camera.innerStage.addChild(this.gameMap.stage)

        this.stage.addChild(this.camera.outerStage)
        this.stage.addChild(this.ui)

        this.status = SceneStatus.CREATED

        this.perfManager = new PerfManager(app)
    }

    setSize(width: number, height: number): void {
        (this.ui.hitArea as Rectangle).width = width;
        (this.ui.hitArea as Rectangle).height = height;

        this.screenW = width;
        this.screenH = height;

        this.camera.setSize()
    }

    tickAI() {
        if (this.character.actor.isIdle()) {
            let oldLoc = {...this.character.currLoc}
            let newLoc = {...this.character.currLoc}
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
        
                if (0 <= oldLoc.x + dx && oldLoc.x + dx < ROWS && 0 <= oldLoc.y + dy && oldLoc.y + dy < COLS) {
                    newLoc.x += dx
                    newLoc.y += dy
                    searching = false
                }
            }

            let action = createMoveAction(this.character, oldLoc, newLoc, Math.ceil(600 / this.tickLength))
            this.character.actor.queueAction(action)
        }

    }

    tick(deltaMS: number) {
        this.character.actor.processCurrentAction()
        this.tickAI()
        this.character.actor.processQueue(deltaMS)
        this.character.actor.doTickAction()
    }

    initScene(): void {
        this.tick(0)
        this.status = SceneStatus.INITIALIZED
    }
    suspendScene(): void {
        this.status = SceneStatus.SUSPENDED
    }
    resumeScene(): void {
        this.status = SceneStatus.RUNNING
    }

    update(ticker: Ticker): void {
        this.perfManager.beginFrame()
        this.perfManager.beginWork()
        this.elapsed += ticker.deltaMS
        if (this.elapsed - this.lastTick >= this.tickLength) {
            this.lastTick += this.tickLength
            this.tick((this.elapsed - this.lastTick) * TICK_GRANULARITY / this.tickLength)
        }

        this.character.actor.animateCurrentAction(ticker.deltaMS * TICK_GRANULARITY / this.tickLength)
        this.characterAnimation.animate(ticker.deltaMS)
    
        this.camera.setPos(this.character.sprite.sprite.x + TILE_SIZE / 2, this.character.sprite.sprite.y + TILE_SIZE / 2)
        this.perfManager.endWork()
        this.debugText.text = `Frame: ${this.perfManager.avgFrame.toFixed(2)} (${this.perfManager.maxFrame.toFixed(2)})\nLoad: ${(this.perfManager.avgLoad * 100).toFixed(2)}% (${(this.perfManager.maxLoad * 100).toFixed(2)}%)\nScale: ${(this.camera.scale * 100).toFixed(2)}% / Zoom: ${this.camera.roundZoom}%`
    }
}

export {GameScene}
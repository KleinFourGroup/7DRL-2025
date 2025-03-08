import { Container } from "pixi.js";
import { GameScene } from "./game_scene";

const MIN_ZOOM = 70
const MAX_ZOOM = 200
const ZOOM_STEP = 10

class Camera {
    scene: GameScene
    outerStage: Container
    innerStage: Container

    size: number
    scale: number
    zoom: number
    x: number
    y: number

    constructor(scene: GameScene, size: number) {
        this.scene = scene
        this.size = size

        this.outerStage = new Container()
        this.innerStage = new Container()

        this.zoom = 100

        this.outerStage.addChild(this.innerStage)

        this.setSize()
    }

    get roundZoom() {
        return Math.round(this.zoom / ZOOM_STEP) * ZOOM_STEP
    }

    deltaZoom(val: number) {
        this.zoom += val
        this.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, this.zoom))
    }

    setSize(): void {
        this.scale = Math.hypot(this.scene.screenW, this.scene.screenH) / this.size
        this.outerStage.scale = this.scale * (this.roundZoom / 100)
    }

    setPos(x: number, y: number) {
        this.x = x
        this.y = y
        this.outerStage.position.set(this.scene.screenW / 2, this.scene.screenH / 2)
        this.innerStage.position.set(-x, -y)
    }
}

export {Camera}
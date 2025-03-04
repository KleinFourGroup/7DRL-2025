import { Container } from "pixi.js";
import { GameScene } from "./game_scene";


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

    deltaZoom(val: number) {
        this.zoom += val
        this.zoom = Math.max(75, Math.min(200, this.zoom))
    }

    setSize(): void {
        this.scale = Math.hypot(this.scene.screenW, this.scene.screenH) / this.size
        this.outerStage.scale = this.scale * (this.zoom / 100)
    }

    setPos(x: number, y: number) {
        this.x = x
        this.y = y
        this.outerStage.position.set(this.scene.screenW / 2, this.scene.screenH / 2)
        this.innerStage.position.set(-x, -y)
    }
}

export {Camera}
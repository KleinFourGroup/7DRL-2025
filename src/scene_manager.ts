import { Application, Ticker, Container } from "pixi.js"

import { Scene, SceneStatus } from "./scenes"

class SceneManager {
    app: Application
    scenes: Scene[]
    currScene: Scene
    elapsed: number
    lastTick: number

    constructor(app: Application) {
        this.app = app
        this.scenes = []
        this.currScene = null
        this.elapsed = 0.0
    }

    addScene(scene: Scene) {
        this.scenes.push(scene)
        console.assert(scene.status === SceneStatus.CREATED || scene.status === SceneStatus.INITIALIZED)
    }

    delScene(scene: Scene) {
        let ind = this.scenes.indexOf(scene)
        console.assert(ind !== -1)
        scene.status = SceneStatus.DEAD
        this.scenes.splice(ind, 1)
    }

    setScene(scene: Scene) {
        if (scene === this.currScene) {
            console.warn("(SceneManager.setScene) Attempted to set current scene to itself!")
            return
        }
        console.assert(this.scenes.indexOf(scene) !== -1)

        switch (scene.status) {
            case SceneStatus.CREATED:
                scene.initScene()
            case SceneStatus.INITIALIZED:
                break
            case SceneStatus.RUNNING:
                console.error("(SceneManager.setScene) Trying to set current scene to an already running scene!")
                break
            case SceneStatus.SUSPENDED:
                scene.resumeScene()
                break
            case SceneStatus.DEAD:
                console.error("(SceneManager.setScene) Trying to set current scene to a dead scene!")
                break
            default:
                console.error("(SceneManager.setScene) Shouldn't be possible to get here...")
        }

        if (this.currScene !== null) {
            this.currScene.suspendScene()
            this.app.stage.removeChild(this.currScene.stage)
            this.app.stage.removeChild(this.currScene.debug)
        }

        this.currScene = scene
        this.app.stage.addChild(this.currScene.stage)
        this.app.stage.addChild(this.currScene.debug)
        this.currScene.status = SceneStatus.RUNNING
    }

    update(ticker: Ticker) {
        this.elapsed += ticker.deltaMS
        if (this.currScene !== null) {
            this.currScene.setSize(this.app.renderer.width, this.app.renderer.height)
            this.currScene.update(ticker)
        }
    }
}

export {SceneManager}
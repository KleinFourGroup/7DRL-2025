import { Container, Ticker } from "pixi.js";

enum SceneStatus {
    CREATED,
    INITIALIZED,
    RUNNING,
    SUSPENDED,
    DEAD // Probably not necessary
}

interface Scene {
    stage: Container
    debug: Container
    status: SceneStatus

    screenW: number
    screenH: number

    elapsed: number

    initScene(): void
    suspendScene(): void
    resumeScene(): void

    setSize(x: number, y: number): void

    update(ticker: Ticker): void
}

export {Scene, SceneStatus}
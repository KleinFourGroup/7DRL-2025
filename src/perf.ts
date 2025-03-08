import { Application } from "pixi.js"

class PerfManager {
    app: Application
    elapsed: number
    lastStep: number
    startWork: number
    prevWork: number
    intervalsWork: Array<number>
    intervalsTotal: Array<number>

    constructor(app: Application) {
        this.app = app
        this.elapsed = 0.0
        this.lastStep = 0
        this.prevWork = 0
        this.intervalsWork = []
        this.intervalsTotal = []
    }

    get avgFrame() {
        return this.intervalsTotal.reduce((a, b) => a + b, 0) / this.intervalsTotal.length
    }

    get maxFrame() {
        return this.intervalsTotal.reduce((a, b) => Math.max(a, b), 0)
    }

    get avgLoad() {
        return this.intervalsWork.reduce((a, b) => a + b, 0) / this.intervalsTotal.reduce((a, b) => a + b, 0)
    }

    get maxLoad() {
        let load = 0
        for (let ind = 0; ind < this.intervalsTotal.length; ind++) {
            load = Math.max(this.intervalsWork[ind] / this.intervalsTotal[ind], load)
        }
        return load
    }

    beginFrame() {
        let deltaMS = this.app.ticker.deltaMS
        this.elapsed += deltaMS

        this.intervalsTotal.push(deltaMS)
        this.intervalsWork.push(this.prevWork)

        if (this.intervalsTotal.length > 20) {
            this.intervalsTotal.shift()
            this.intervalsWork.shift()
        }
    }

    beginWork() {
        this.startWork = performance.now()
    }

    endWork() {
        this.prevWork = performance.now() - this.startWork
    }
}

export {PerfManager}
import { Entity } from "./entities"
import { GameScene } from "./game_scene"

type TickAction = (target: Entity, scene: GameScene) => void

type ActionSequence = {
    keyframes: number[]
    events: TickAction[]
}

class CompoundAction {
    actions: ActionSequence
    target: Entity
    scene: GameScene
    currTick: number
    lastActionInd: number

    constructor(actions: ActionSequence, target: Entity, scene: GameScene) {
        this.actions = actions
        this.target = target
        this.scene = scene
        this.currTick = 0
        this.lastActionInd = -1
    }

    tick() {
        let ind = this.actions.keyframes[this.lastActionInd + 1]
        if (this.currTick === ind) {
            this.lastActionInd++
            if (this.actions.events[this.lastActionInd] !== null) {
                this.target.doTickAction(this.actions.events[this.lastActionInd])
            }
        }
        return (this.lastActionInd === this.actions.keyframes.length - 1)
    }
}
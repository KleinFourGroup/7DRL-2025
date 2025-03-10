import { createMoveAnimation, KeyframedAnimation } from "./animation"
import { Entity, Position } from "./ecs"
import { GameScene } from "./game_scene"

const TICK_GRANULARITY = 100

type TickAction = (target: Entity, scene: GameScene) => void

type ActionSequence = {
    keyframes: number[]
    events: TickAction[]
}

class CompoundAction {
    actions: ActionSequence
    target: Entity
    scene: GameScene
    animation: KeyframedAnimation
    currTick: number
    lastActionInd: number

    constructor(actions: ActionSequence, target: Entity, scene: GameScene, animation: KeyframedAnimation = null) {
        this.actions = actions
        this.target = target
        this.scene = scene
        this.animation = animation
        this.currTick = 0
        this.lastActionInd = -1
    }

    tick() {
        let ind = this.actions.keyframes[this.lastActionInd + 1]
        if (this.currTick === ind) {
            this.lastActionInd++
            if (this.actions.events[this.lastActionInd] !== null) {
                this.target.actor.prepTickAction(this.actions.events[this.lastActionInd])
            }
        }
        this.currTick++
        return (this.lastActionInd === this.actions.keyframes.length - 1)
    }
}

function createMoveAction(character: Entity, oldLoc: Position, newLoc: Position, duration: number = 1) {
    function moveTick(target: Entity, scene: GameScene) {
        target.currLoc = newLoc
    }

    let keyframes = [0, duration]
    let events = [moveTick, null]
    let actions: ActionSequence = {
        keyframes: keyframes,
        events: events
    }
    let animation = createMoveAnimation(character, oldLoc, newLoc, duration * TICK_GRANULARITY)

    return new CompoundAction(actions, character, character.scene, animation)
}

export {TICK_GRANULARITY}
export {TickAction, ActionSequence}
export {CompoundAction}
export {createMoveAction}
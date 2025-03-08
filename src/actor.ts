import { CompoundAction, TickAction } from "./action"
import { Entity } from "./entities"

class Actor {
    entity: Entity
    actionQueue: CompoundAction[]
    currAction: CompoundAction
    tickAction: TickAction
    constructor(entity: Entity) {
        this.entity = entity

        this.actionQueue = []
        this.currAction = null
        this.tickAction = null
    }

    get scene() {
        return this.entity.scene
    }

    processCurrentAction() {
        let isDone = this.currAction.tick()
        if (isDone) {
            this.currAction = null
        }
    }

    animateCurrentAction(deltaTime: number) {
        if (this.currAction?.animation !== null) {
            this.currAction.animation.animate(deltaTime)
        }
    }

    queueAction(action: CompoundAction) {
        console.assert(action !== null)
        this.actionQueue.push(action)
    }

    processQueue(initMS: number) {
        if (this.currAction === null && this.actionQueue.length > 0) {
            this.currAction = this.actionQueue.shift()

            if (this.tickAction === null) {
                // Initialize it!
                this.currAction.tick()
                if (this.currAction.animation !== null) {
                    this.currAction.animation.init(initMS)
                }
            }
        }
    }

    prepTickAction(tickAction: TickAction) {
        this.tickAction = tickAction
    }

    doTickAction() {
        if (this.tickAction !== null) {
            this.tickAction(this.entity, this.scene)
        }
        this.tickAction = null
    }
}
export { Actor }
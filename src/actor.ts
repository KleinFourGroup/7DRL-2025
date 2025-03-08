import { CompoundAction, TICK_GRANULARITY, TickAction } from "./action"
import { Entity } from "./entities"

class Actor {
    entity: Entity
    actionQueue: CompoundAction[]
    currAction: CompoundAction
    tickAction: TickAction
    freshAnimation: boolean
    constructor(entity: Entity) {
        this.entity = entity

        this.actionQueue = []
        this.currAction = null
        this.tickAction = null
        this.freshAnimation = false
    }

    get scene() {
        return this.entity.scene
    }

    isIdle() {
        return this.currAction === null
    }

    processCurrentAction() {
        let isDone = this.currAction?.tick()
        if (isDone) {
            this.currAction = null
        }
    }

    animateCurrentAction(deltaTime: number) {
        if (this.currAction?.animation !== null) {
            if (!this.freshAnimation) {
                this.currAction.animation.animate(deltaTime)
            } else {
                this.freshAnimation = false
            }
        }
    }

    queueAction(action: CompoundAction) {
        console.assert(action !== null)
        this.actionQueue.push(action)
    }

    processQueue(initTime: number) {
        if (this.currAction === null && this.actionQueue.length > 0) {
            this.currAction = this.actionQueue.shift()

            if (this.tickAction === null) {
                // Initialize it!
                this.currAction.tick()
                if (this.currAction.animation !== null) {
                    this.currAction.animation.init(initTime)
                    this.freshAnimation = true
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
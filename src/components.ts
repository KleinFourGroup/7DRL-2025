import { Component } from "./ecs";

type AICallback = (self: AIComponent) => void

class AIComponent extends Component {
    static name: string = "idleAI"
    tickAI: AICallback

    constructor(tickAI: AICallback) {
        super()
        this.tickAI = tickAI
    }

    runAI() {
        this.tickAI(this)
    }
}

export { AICallback }
export { AIComponent }
import { createMoveAction } from "./action"
import { AIComponent } from "./components"

function randomWalkAI(self: AIComponent) {
    console.log("(randomWalkAI)")
    console.assert(self.entity.actor.isIdle())
    
    let oldLoc = {...self.entity.currLoc}
    let newLoc = {...self.entity.currLoc}
    let searching = true
    while (searching) {
        let rand = Math.floor(Math.random() * 4)
        let dx = 0
        let dy = 0
        switch (rand) {
            case 0:
                dx = -1
                break
            case 1:
                dy = 1
                break
            case 2:
                dx = 1
                break
            case 3:
                dy = -1
                break
            default:
                console.error("Uh oh...")
        }

        if (self.entity.scene.gameMap.isInboundsCoord(oldLoc.x + dx, oldLoc.y + dy)) {
            newLoc.x += dx
            newLoc.y += dy
            searching = false
        }
    }

    let action = createMoveAction(self.entity, oldLoc, newLoc, Math.ceil(600 / self.entity.scene.tickLength))
    self.entity.actor.queueAction(action)
}

export { randomWalkAI }
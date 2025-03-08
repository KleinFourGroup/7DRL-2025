import { CompoundAction, TickAction } from "./action"
import { Actor } from "./actor"
import { COLORS } from "./colors"
import { GameScene } from "./game_scene"
import { TextSprite } from "./text_sprite"

let ID = 1

type Position = {
    x: number,
    y: number
}

class Entity {
    id: number
    scene: GameScene
    actor: Actor
    currLoc: Position
    oldLoc: Position
    sprite: TextSprite
    constructor(txt: string, scene: GameScene) {
        this.id = ID
        this.scene = scene

        this.actor = new Actor(this)

        ID++

        this.sprite = new TextSprite("@", COLORS["terminal amber"])
    }
}
export { Entity, Position }
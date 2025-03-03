import { COLORS } from "./colors"
import { TextSprite } from "./text_sprite"

let ID = 1

type Position = {
    x: number,
    y: number
}

class Entity {
    id: number
    currLoc: Position
    oldLoc: Position
    sprite: TextSprite
    constructor(txt: string) {
        this.id = ID
        ID++

        this.sprite = new TextSprite("@", COLORS["terminal amber"])
    }
}
export { Entity }
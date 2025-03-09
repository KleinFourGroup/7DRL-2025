import { CompoundAction, TickAction } from "./action"
import { Actor } from "./actor"
import { COLORS } from "./colors"
import { GameScene } from "./game_scene"
import { Scene } from "./scenes"
import { TextSprite } from "./text_sprite"

let ID = 1

type Position = {
    x: number,
    y: number
}

type ClassConstructor<T> = new(...args: any[]) => T

abstract class Component {
    static name: string
    entity: Entity
    constructor() {
        this.entity = null
    }

    setEntity(entity: Entity) {
        this.entity = entity
    }
}

class Entity {
    id: number
    scene: GameScene
    actor: Actor
    currLoc: Position
    sprite: TextSprite
    components: {[name: string]: Component}

    constructor(txt: string) {
        this.id = ID
        this.scene = null

        this.actor = new Actor(this)
        this.components = {}

        ID++

        this.sprite = new TextSprite(txt, COLORS["terminal amber"])
    }

    setScene(scene: GameScene) {
        this.scene = scene
    }

    getComponent<Comp extends Component>(comp: ClassConstructor<Comp>): Comp {
        let name = (comp as typeof Component).name
        if (this.components.hasOwnProperty(name)) {
            return this.components[name] as Comp
        }
        return null
    }

    addComponents(...components: Component[]) {
        for (let component of components) {
            this.components[(component.constructor as typeof Component).name] = component
            component.setEntity(this)
        }
    }

    hasComponents(...components: Component[]) {
        for (let component of components) {
            if (!this.components.hasOwnProperty((component.constructor as typeof Component).name)) {
                return false
            }
        }
        return true
    }
}

class ECS {
    entities: Entity[]
    scene: GameScene

    constructor(scene: GameScene) {
        this.scene = scene
        this.entities = []
    }

    addEntity(entity: Entity) {
        this.entities.push(entity)
    }

    removeEntity(entity: Entity) {
        this.entities.push(entity)
    }

    getWithComponents(...components: Component[]) {
        return this.entities.filter((entity) => entity.hasComponents(...components))
    }
}

export { Position }
export { Entity, Component, ECS }
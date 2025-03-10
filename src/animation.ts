import { Entity, Position } from "./ecs";
import { GameScene } from "./game_scene";
import { TILE_SIZE } from "./text_sprite";

type AnimationInterval = (time: number, target: Entity, scene: GameScene) => void
type AnimationFrame = (target: Entity, scene: GameScene) => void

type KeyframedAnimationData = {
    keyframes: number[]
    frameAnimations: AnimationFrame[]
    betweenAnimations: AnimationInterval[]
}

class KeyframedAnimation {
    animation: KeyframedAnimationData
    target: Entity
    scene: GameScene
    loop: boolean
    elapsed: number
    loopNum: number
    lastKeyframe: number

    constructor(animation: KeyframedAnimationData, target: Entity, scene: GameScene, loop: boolean) {
        console.assert(animation.keyframes.length === animation.frameAnimations.length)
        console.assert(animation.keyframes.length === animation.betweenAnimations.length + 1)
        console.assert(animation.keyframes[0] === 0)
        if (loop) {
            console.assert(animation.frameAnimations[0] === null || animation.frameAnimations[animation.frameAnimations.length - 1] === null)
        }
        this.animation = animation
        this.target = target
        this.scene = scene
        this.loop = loop
        this.elapsed = 0.0
        this.loopNum = 0
        this.lastKeyframe = -1
    }

    get duration() {
        return this.animation.keyframes[this.animation.keyframes.length - 1]
    }

    init(deltaTime: number = 0) {
        this.animate(deltaTime)
    }

    finish(deltaTime: number) {
        if (this.loop) {
            return
        }

        this.lastKeyframe++

        while (this.lastKeyframe < this.animation.keyframes.length) {
            // console.log(`Processing frame ${frameInd}`)
            if (this.animation.frameAnimations[this.lastKeyframe] !== null) {
                this.animation.frameAnimations[this.lastKeyframe](this.target, this.scene)
            }
            this.elapsed = this.duration
            this.lastKeyframe++
        }
    }

    animate(deltaTime: number) {
        let processedTime = this.elapsed
        this.elapsed += deltaTime

        do {
            let frameInd = this.lastKeyframe + 1

            // Walk through keyframes from next one until either end or we go past elapsed
            while (frameInd < this.animation.keyframes.length && this.animation.keyframes[frameInd] <= this.elapsed) {
                // console.log(`Processing frame ${frameInd}`)
                if (this.animation.frameAnimations[frameInd] !== null) {
                    this.animation.frameAnimations[frameInd](this.target, this.scene)
                }
                processedTime = this.animation.keyframes[frameInd]
                this.lastKeyframe = frameInd
                frameInd++
            }

            // We aren't done and we had more frames left
            if (processedTime < this.elapsed && this.lastKeyframe < this.animation.keyframes.length - 1) {
                // console.log(`Processing between frames ${this.lastKeyframe}-${this.lastKeyframe + 1}`)

                let overflow = this.elapsed - this.animation.keyframes[this.lastKeyframe]
                processedTime = this.elapsed
                if (this.animation.betweenAnimations[this.lastKeyframe] !== null) {
                    this.animation.betweenAnimations[this.lastKeyframe](overflow, this.target, this.scene)
                }
            }

            // We ran out of keyframes and we're looping
            if (this.loop && this.lastKeyframe === this.animation.keyframes.length - 1) {
                console.assert(this.elapsed >= this.duration)
                this.elapsed -= this.duration
                processedTime = 0
                if (this.animation.frameAnimations[0] !== null) {
                    this.animation.frameAnimations[0](this.target, this.scene)
                }
                this.lastKeyframe = 0
            }

            // console.log(`${processedTime} / ${this.elapsed}`)
        } while (this.loop && processedTime !== this.elapsed)
    }
}

function createMessageAnimation(character: Entity, text: string, step: number = 1000) {
    let keyframes: number[] = []
    let frameAnimations: AnimationFrame[] = []
    let betweenAnimations: AnimationInterval[] = []

    for (let ind = 0; ind <= text.length; ind++) {
        keyframes.push(ind * step)
    }

    for (let ind = 0; ind < text.length; ind++) {
        function frame(target: Entity, scene: GameScene) {
            target.sprite.text = text[ind]
            target.sprite.redraw()
            target.sprite.sprite.texture.source.update()

        }
        frameAnimations.push(frame)
        betweenAnimations.push(null)
    }
    frameAnimations.push(null)

    let animation: KeyframedAnimationData = {
        keyframes: keyframes,
        frameAnimations: frameAnimations,
        betweenAnimations: betweenAnimations
    }

    return new KeyframedAnimation(animation, character, null, true)
}

function createMoveAnimation(character: Entity, oldLoc: Position, newLoc: Position, duration: number = 1000) {
    function startFrame(target: Entity, scene: GameScene) {
        target.sprite.sprite.x = oldLoc.x * TILE_SIZE
        target.sprite.sprite.y = oldLoc.y * TILE_SIZE
    }

    function endFrame(target: Entity, scene: GameScene) {
        target.sprite.sprite.x = newLoc.x * TILE_SIZE
        target.sprite.sprite.y = newLoc.y * TILE_SIZE
    }

    function betweenFrame(time: number, target: Entity, scene: GameScene) {
        let progress = (1 - Math.cos(Math.min(time / duration, 1) * Math.PI)) / 2
        target.sprite.sprite.x = oldLoc.x * TILE_SIZE * (1 - progress) + newLoc.x * TILE_SIZE * progress
        target.sprite.sprite.y = oldLoc.y * TILE_SIZE * (1 - progress) + newLoc.y * TILE_SIZE * progress
    }
    let keyframes: number[] = [0, duration]
    let frameAnimations: AnimationFrame[] = [startFrame, endFrame]
    let betweenAnimations: AnimationInterval[] = [betweenFrame]

    let animation: KeyframedAnimationData = {
        keyframes: keyframes,
        frameAnimations: frameAnimations,
        betweenAnimations: betweenAnimations
    }

    return new KeyframedAnimation(animation, character, null, false)
}

export { AnimationInterval, AnimationFrame, KeyframedAnimationData }
export { KeyframedAnimation }
export { createMessageAnimation, createMoveAnimation }
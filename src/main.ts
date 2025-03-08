import { Application, Ticker, Container } from "pixi.js"

import { COLORS } from "./colors"
import { TextSprite, TileSprite } from "./text_sprite"
import { GameMap, randomTiles } from "./map"
import { Entity } from "./entities"
import { Scene, SceneStatus } from "./scenes"
import { SceneManager } from "./scene_manager"
import { GameScene } from "./game_scene"

// Create the application
const app = new Application()
await app.init({ resizeTo: window, background: COLORS["terminal black"], antialias: true })

// Attach the app to the page
// @ts-ignore
document.body.appendChild(app.canvas)

let sceneManager = new SceneManager(app)

let gameScene = new GameScene(app)

sceneManager.addScene(gameScene)
sceneManager.setScene(gameScene)

function update(ticker: Ticker) {
    sceneManager.update(ticker)
}

app.ticker.add(update)
/**
 * Main Game Engine
 * Manages game state, scenes, and coordinates all game systems
 */
export class GameEngine {
  constructor() {
    this.currentScene = 'lobby'
    this.player = null
    this.mapManager = null
    this.battleManager = null
    this.dungeonManager = null
    this.progressTracker = null
    
    // Initialize systems
    this.initialize()
  }

  initialize() {
    // Systems will be initialized as they are created
    console.log('Game Engine initialized')
  }

  update(deltaTime) {
    // Update current scene
    if (this.mapManager && this.currentScene === 'map') {
      this.mapManager.update(deltaTime)
    }
    if (this.battleManager && this.currentScene === 'battle') {
      this.battleManager.update(deltaTime)
    }
  }

  setScene(scene) {
    this.currentScene = scene
  }
}

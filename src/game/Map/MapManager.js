import { Camera } from './Camera'
import { PlayerController } from './PlayerController'
import { DungeonEntrance } from './DungeonEntrance'
import { Hero } from '../Characters/Hero'
import { generateTileSprite } from '../../utils/assetGenerator'

/**
 * Map Manager
 * Manages the game map, player, camera, and dungeon entrances
 */
export class MapManager {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    
    // Map dimensions
    this.mapWidth = 2000
    this.mapHeight = 2000
    
    // Camera
    this.camera = new Camera(canvasWidth, canvasHeight)
    
    // Player
    this.hero = new Hero({ x: this.mapWidth / 2, y: this.mapHeight / 2 })
    this.playerController = new PlayerController(this.hero)
    
    // Tiles
    this.tileSize = 32
    this.tiles = this.generateTiles()
    
    // Dungeon entrances
    this.dungeonEntrances = this.createDungeonEntrances()
    
    // Lobby area bounds (center of map)
    this.lobbyBounds = {
      x: this.mapWidth / 2 - 200,
      y: this.mapHeight / 2 - 200,
      width: 400,
      height: 400
    }
  }

  /**
   * Generate tile map
   * @returns {Object} Tile map data
   */
  generateTiles() {
    const tiles = {
      grass: generateTileSprite('grass'),
      stone: generateTileSprite('stone'),
      dungeonFloor: generateTileSprite('dungeon-floor')
    }
    return tiles
  }

  /**
   * Create dungeon entrances for all grades
   * @returns {DungeonEntrance[]} Array of dungeon entrances
   */
  createDungeonEntrances() {
    const entrances = []
    const grades = [
      { grade: 1, name: 'Math 1' },
      { grade: 2, name: 'Math 2' },
      { grade: 3, name: 'Math 3' },
      { grade: 4, name: 'Math 4' },
      { grade: 5, name: 'Math 5' },
      { grade: 6, name: 'Math 6' },
      { grade: 7, name: 'Math 7' },
      { grade: 8, name: 'Math 8' },
      { grade: 9, name: 'Math 9' },
      { grade: 10, name: 'Math 10-1' },
      { grade: 20, name: 'Math 20-1' },
      { grade: 30, name: 'Math 30-1' }
    ]

    // Arrange entrances in a circle around the lobby
    const centerX = this.mapWidth / 2
    const centerY = this.mapHeight / 2
    const radius = 250
    const angleStep = (Math.PI * 2) / grades.length

    grades.forEach((gradeInfo, index) => {
      const angle = angleStep * index
      const x = centerX + Math.cos(angle) * radius - 32
      const y = centerY + Math.sin(angle) * radius - 32
      
      entrances.push(new DungeonEntrance({
        x: x,
        y: y,
        grade: gradeInfo.grade,
        gradeName: gradeInfo.name
      }))
    })

    return entrances
  }

  /**
   * Check if player is near a dungeon entrance
   * @returns {DungeonEntrance|null} Nearest entrance or null
   */
  getNearbyEntrance() {
    const threshold = 50
    for (const entrance of this.dungeonEntrances) {
      const dx = this.hero.x - (entrance.x + entrance.width / 2)
      const dy = this.hero.y - (entrance.y + entrance.height / 2)
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < threshold) {
        return entrance
      }
    }
    return null
  }

  /**
   * Update map state
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Update player controller
    this.playerController.update(deltaTime)
    
    // Update hero
    this.hero.update(deltaTime)
    
    // Keep player within map bounds
    this.hero.x = Math.max(0, Math.min(this.mapWidth - this.hero.width, this.hero.x))
    this.hero.y = Math.max(0, Math.min(this.mapHeight - this.hero.height, this.hero.y))
    
    // Update camera to follow player
    this.camera.setTarget(this.hero.x + this.hero.width / 2, this.hero.y + this.hero.height / 2)
    this.camera.update(deltaTime)
    
    // Keep camera within map bounds
    this.camera.x = Math.max(0, Math.min(this.mapWidth - this.camera.width, this.camera.x))
    this.camera.y = Math.max(0, Math.min(this.mapHeight - this.camera.height, this.camera.y))
  }

  /**
   * Render the map
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  render(ctx) {
    // Clear canvas
    ctx.fillStyle = '#0f0f1e'
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    // Draw tiles (only visible ones)
    const startTileX = Math.floor(this.camera.x / this.tileSize)
    const startTileY = Math.floor(this.camera.y / this.tileSize)
    const endTileX = Math.ceil((this.camera.x + this.camera.width) / this.tileSize)
    const endTileY = Math.ceil((this.camera.y + this.camera.height) / this.tileSize)

    for (let y = startTileY; y <= endTileY; y++) {
      for (let x = startTileX; x <= endTileX; x++) {
        const tileX = x * this.tileSize
        const tileY = y * this.tileSize
        
        // Determine tile type based on position
        let tileType = 'grass'
        if (this.isInLobby(tileX, tileY)) {
          tileType = 'dungeonFloor'
        } else if ((x + y) % 10 === 0) {
          tileType = 'stone'
        }
        
        const tile = this.tiles[tileType]
        if (tile) {
          ctx.drawImage(tile, tileX - this.camera.x, tileY - this.camera.y)
        }
      }
    }

    // Draw lobby area indicator
    ctx.strokeStyle = '#667eea'
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.strokeRect(
      this.lobbyBounds.x - this.camera.x,
      this.lobbyBounds.y - this.camera.y,
      this.lobbyBounds.width,
      this.lobbyBounds.height
    )
    ctx.setLineDash([])

    // Draw dungeon entrances
    for (const entrance of this.dungeonEntrances) {
      if (this.camera.isVisible(entrance.x, entrance.y)) {
        entrance.render(ctx, this.camera.x, this.camera.y)
      }
    }

    // Draw hero
    if (this.camera.isVisible(this.hero.x, this.hero.y)) {
      this.hero.render(ctx, this.camera.x, this.camera.y)
    }

    // Draw nearby entrance indicator
    const nearbyEntrance = this.getNearbyEntrance()
    if (nearbyEntrance) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`Near ${nearbyEntrance.gradeName} - Press E to Enter`, this.canvasWidth / 2, 50)
    }
  }

  /**
   * Check if position is in lobby area
   * @param {number} x - X position
   * @param {number} y - Y position
   * @returns {boolean}
   */
  isInLobby(x, y) {
    return x >= this.lobbyBounds.x && x <= this.lobbyBounds.x + this.lobbyBounds.width &&
           y >= this.lobbyBounds.y && y <= this.lobbyBounds.y + this.lobbyBounds.height
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.playerController.destroy()
  }
}

import { CharacterStats } from './CharacterStats'
import { generateHeroSpriteSheet } from '../../utils/assetGenerator'

/**
 * Hero Character Class
 * Represents the player's character with animated sprites
 */
export class Hero {
  constructor(config = {}) {
    this.x = config.x || 0
    this.y = config.y || 0
    this.width = 48
    this.height = 48
    this.speed = config.speed || 2
    this.stats = new CharacterStats({
      maxHP: config.maxHP || 100,
      attack: config.attack || 15,
      defense: config.defense || 8,
      level: config.level || 1
    })

    // 💾 LOAD SAVED DATA!
    // If the player bought items in the shop or played before, load their stuff!
    this.stats.load()

    // Animated Sprite System
    this.animations = null
    this.currentAnimation = 'idle'
    this.animationFrame = 0
    this.animationTimer = 0
    this.animationSpeed = 150 // milliseconds per frame
    this.direction = 'down' // up, down, left, right

    // Movement state
    this.moving = false
    this.velocityX = 0
    this.velocityY = 0

    // Battle state
    this.isAttacking = false
    this.isHit = false
    this.isVictory = false

    // Initialize sprites asynchronously to handle canvas context availability
    this.initializeSprites()
  }

  /**
   * Initialize animated sprites
   */
  initializeSprites() {
    // Generate sprite sheet
    try {
      this.animations = generateHeroSpriteSheet('#4a90e2')
    } catch (e) {
      console.warn('Hero sprites will be generated when canvas is available')
    }
  }

  /**
   * Ensure sprites are loaded
   */
  ensureSprites() {
    if (!this.animations) {
      this.animations = generateHeroSpriteSheet('#4a90e2')
    }
  }

  /**
   * Set the current animation state
   * @param {string} animation - Animation name (idle, walk, attack, hit, victory)
   */
  setAnimation(animation) {
    if (this.currentAnimation !== animation) {
      this.currentAnimation = animation
      this.animationFrame = 0
      this.animationTimer = 0
    }
  }

  /**
   * Trigger attack animation
   */
  triggerAttack() {
    this.isAttacking = true
    this.setAnimation('attack')
    setTimeout(() => {
      this.isAttacking = false
      this.setAnimation('idle')
    }, this.animationSpeed * 4)
  }

  /**
   * Trigger hit animation
   */
  triggerHit() {
    this.isHit = true
    this.setAnimation('hit')
    setTimeout(() => {
      this.isHit = false
      this.setAnimation('idle')
    }, this.animationSpeed * 2)
  }

  /**
   * Trigger victory animation
   */
  triggerVictory() {
    this.isVictory = true
    this.setAnimation('victory')
  }

  /**
   * Update hero state
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Update position
    this.x += this.velocityX * this.speed
    this.y += this.velocityY * this.speed

    // Determine animation based on state
    if (!this.isAttacking && !this.isHit && !this.isVictory) {
      if (this.moving) {
        this.setAnimation('walk')
      } else {
        this.setAnimation('idle')
      }
    }

    // Update animation frame
    this.animationTimer += deltaTime
    const currentFrames = this.animations?.[this.currentAnimation] || []
    const frameCount = currentFrames.length || 4

    if (this.animationTimer > this.animationSpeed) {
      this.animationFrame = (this.animationFrame + 1) % frameCount
      this.animationTimer = 0
    }
  }

  /**
   * Set movement velocity
   * @param {number} x - X velocity (-1, 0, or 1)
   * @param {number} y - Y velocity (-1, 0, or 1)
   */
  setVelocity(x, y) {
    this.velocityX = x
    this.velocityY = y
    this.moving = x !== 0 || y !== 0

    // Update direction
    if (y < 0) this.direction = 'up'
    else if (y > 0) this.direction = 'down'
    else if (x < 0) this.direction = 'left'
    else if (x > 0) this.direction = 'right'
  }

  /**
   * Perform an attack
   * @param {boolean} correctAnswer - Whether the math answer was correct
   * @returns {number} Damage dealt
   */
  attack(correctAnswer = true) {
    this.triggerAttack()
    if (!correctAnswer) {
      return Math.floor(this.stats.attack * 0.5) // Half damage for wrong answer
    }
    return this.stats.attack + Math.floor(Math.random() * 5) // Add some randomness
  }

  /**
   * Get the current animation frame canvas
   * @returns {HTMLCanvasElement|null}
   */
  getCurrentFrame() {
    this.ensureSprites()
    const frames = this.animations?.[this.currentAnimation]
    if (!frames || frames.length === 0) return null
    return frames[this.animationFrame % frames.length]
  }

  /**
   * Render the hero
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} cameraX - Camera X offset
   * @param {number} cameraY - Camera Y offset
   */
  render(ctx, cameraX = 0, cameraY = 0) {
    this.ensureSprites()

    const screenX = this.x - cameraX
    const screenY = this.y - cameraY

    const frame = this.getCurrentFrame()

    // Apply direction flip if moving left
    if (this.direction === 'left' && frame) {
      ctx.save()
      ctx.translate(screenX + this.width, screenY)
      ctx.scale(-1, 1)
      ctx.drawImage(frame, 0, 0)
      ctx.restore()
    } else if (frame) {
      ctx.drawImage(frame, screenX, screenY)
    }

    // Draw name/level above character
    ctx.fillStyle = '#fff'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Lv.${this.stats.level}`, screenX + this.width / 2, screenY - 5)
  }

  /**
   * Render hero for battle UI (larger, centered)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} scale - Scale factor
   */
  renderBattle(ctx, x, y, scale = 2) {
    this.ensureSprites()

    const frame = this.getCurrentFrame()
    if (frame) {
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(scale, scale)
      ctx.drawImage(frame, -this.width / 2, -this.height / 2)
      ctx.restore()
    }
  }

  /**
   * Get hero data for serialization
   * @returns {Object}
   */
  toJSON() {
    return {
      x: this.x,
      y: this.y,
      stats: this.stats.toJSON()
    }
  }

  /**
   * Load hero data
   * @param {Object} data - Hero data
   */
  fromJSON(data) {
    this.x = data.x || 0
    this.y = data.y || 0
    if (data.stats) {
      this.stats.fromJSON(data.stats)
    }
  }
}

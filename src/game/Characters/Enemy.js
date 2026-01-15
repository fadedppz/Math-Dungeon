import { CharacterStats } from './CharacterStats'
import { generateEnemySpriteSheet } from '../../utils/assetGenerator'

/**
 * Enemy Character Class
 * Represents enemy monsters in battles with animated sprites
 */
export class Enemy {
  constructor(config = {}) {
    this.name = config.name || 'Monster'
    this.type = config.type || 'slime'
    this.grade = config.grade || 1 // Math grade level
    this.difficulty = config.difficulty || 1 // 1-5 scale

    // ════════════════════════════════════════════════════════════════
    // 📊 Calculate enemy stats based on grade and difficulty
    // ════════════════════════════════════════════════════════════════
    // These formulas determine how tough the enemy is!
    // Lower numbers = easier enemy, higher numbers = harder enemy

    // HP: How much health the enemy has
    const baseHP = 50 + (this.grade * 10) + (this.difficulty * 20)

    // Attack: How hard the enemy hits (REDUCED for fairness!)
    // Old formula was too strong, now enemies are more balanced
    const baseAttack = 5 + (this.grade * 1) + (this.difficulty * 2)

    // Defense: How well the enemy blocks your attacks
    const baseDefense = 3 + (this.grade * 1) + (this.difficulty * 2)

    this.stats = new CharacterStats({
      maxHP: baseHP,
      attack: baseAttack,
      defense: baseDefense,
      level: this.grade + this.difficulty
    })

    // Animation System
    this.animations = null
    this.currentAnimation = 'idle'
    this.animationFrame = 0
    this.animationTimer = 0
    this.animationSpeed = 200 // ms per frame
    this.width = 48
    this.height = 48

    // Battle state
    this.isAttacking = false
    this.isHit = false
    this.isDying = false

    // Initialize sprites
    this.initializeSprites()
  }

  /**
   * Initialize animated sprites
   */
  initializeSprites() {
    try {
      this.animations = generateEnemySpriteSheet(this.type, this.getEnemyColor())
    } catch (e) {
      console.warn('Enemy sprites will be generated when canvas is available')
    }
  }

  /**
   * Ensure sprites are loaded
   */
  ensureSprites() {
    if (!this.animations) {
      this.animations = generateEnemySpriteSheet(this.type, this.getEnemyColor())
    }
  }

  /**
   * Get color based on enemy type
   * @returns {string} Color hex code
   */
  getEnemyColor() {
    const colors = {
      slime: '#8b4513',
      goblin: '#228b22',
      skeleton: '#f5f5dc',
      dragon: '#8b0000',
      default: '#8b0000'
    }
    return colors[this.type] || colors.default
  }

  /**
   * Get enemy type based on grade level
   * @param {number} grade - Grade level
   * @returns {string} Enemy type
   */
  static getTypeForGrade(grade) {
    if (grade <= 3) return 'slime'
    if (grade <= 6) return 'goblin'
    if (grade <= 9) return 'skeleton'
    return 'dragon'
  }

  /**
   * Get enemy name based on type and difficulty
   * @param {string} type - Enemy type
   * @param {number} difficulty - Difficulty level
   * @returns {string} Enemy name
   */
  static getNameForType(type, difficulty) {
    const names = {
      slime: ['Baby Slime', 'Slime', 'Giant Slime', 'Elite Slime', 'Slime King'],
      goblin: ['Goblin Scout', 'Goblin Warrior', 'Goblin Chief', 'Goblin Shaman', 'Goblin Lord'],
      skeleton: ['Skeleton', 'Skeleton Warrior', 'Dark Skeleton', 'Bone Knight', 'Skeleton King'],
      dragon: ['Whelpling', 'Drake', 'Dragon', 'Elder Dragon', 'Dragon Lord']
    }
    const nameList = names[type] || names.slime
    return nameList[Math.min(difficulty - 1, nameList.length - 1)]
  }

  /**
   * Set current animation
   * @param {string} animation - Animation name
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
   * Trigger death animation
   */
  triggerDeath() {
    this.isDying = true
    this.setAnimation('death')
  }

  /**
   * Update enemy state
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Update animation frame
    this.animationTimer += deltaTime

    const currentFrames = this.animations?.[this.currentAnimation] || []
    const frameCount = currentFrames.length || 4

    if (this.animationTimer > this.animationSpeed) {
      // For death animation, stop at last frame
      if (this.currentAnimation === 'death') {
        if (this.animationFrame < frameCount - 1) {
          this.animationFrame++
        }
      } else {
        this.animationFrame = (this.animationFrame + 1) % frameCount
      }
      this.animationTimer = 0
    }
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
   * Perform an attack
   * @returns {number} Damage dealt
   */
  attack() {
    this.triggerAttack()
    const baseDamage = this.stats.attack
    const variance = Math.floor(Math.random() * 5)
    return baseDamage + variance
  }

  /**
   * Render the enemy
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  render(ctx, x, y) {
    this.ensureSprites()

    const frame = this.getCurrentFrame()
    if (frame) {
      ctx.drawImage(frame, x, y)
    }

    // Draw name above enemy
    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(this.name, x + this.width / 2, y - 15)

    // Draw level
    ctx.font = '10px Arial'
    ctx.fillText(`Lv.${this.stats.level}`, x + this.width / 2, y - 5)
  }

  /**
   * Render enemy for battle UI (larger, centered)
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
   * Get enemy data for serialization
   * @returns {Object}
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      grade: this.grade,
      difficulty: this.difficulty,
      stats: this.stats.toJSON()
    }
  }

  /**
   * Create enemy from data
   * @param {Object} data - Enemy data
   * @returns {Enemy}
   */
  static fromJSON(data) {
    return new Enemy({
      name: data.name,
      type: data.type,
      grade: data.grade,
      difficulty: data.difficulty,
      maxHP: data.stats?.maxHP,
      attack: data.stats?.attack,
      defense: data.stats?.defense,
      level: data.stats?.level
    })
  }

  /**
   * Create an enemy for a specific grade and unit
   * @param {number} grade - Grade level
   * @param {number} difficulty - Difficulty level (1-5)
   * @returns {Enemy}
   */
  static createForGrade(grade, difficulty = 1) {
    const type = Enemy.getTypeForGrade(grade)
    const name = Enemy.getNameForType(type, difficulty)
    return new Enemy({
      name,
      type,
      grade,
      difficulty
    })
  }
}

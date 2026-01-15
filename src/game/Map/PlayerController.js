/**
 * Player Controller
 * Handles player input and movement
 */
export class PlayerController {
  constructor(hero) {
    this.hero = hero
    this.keys = {}
    
    // Bind event listeners
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  /**
   * Handle key down event
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    this.keys[event.key.toLowerCase()] = true
  }

  /**
   * Handle key up event
   * @param {KeyboardEvent} event
   */
  handleKeyUp(event) {
    this.keys[event.key.toLowerCase()] = false
  }

  /**
   * Update player movement based on input
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    let velX = 0
    let velY = 0

    // Check movement keys (WASD or Arrow keys)
    if (this.keys['w'] || this.keys['arrowup']) velY = -1
    if (this.keys['s'] || this.keys['arrowdown']) velY = 1
    if (this.keys['a'] || this.keys['arrowleft']) velX = -1
    if (this.keys['d'] || this.keys['arrowright']) velX = 1

    // Normalize diagonal movement
    if (velX !== 0 && velY !== 0) {
      velX *= 0.707 // 1/sqrt(2) for diagonal normalization
      velY *= 0.707
    }

    this.hero.setVelocity(velX, velY)
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
}

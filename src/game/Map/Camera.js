/**
 * Camera System
 * Handles camera following and viewport management
 */
export class Camera {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.x = 0
    this.y = 0
    this.targetX = 0
    this.targetY = 0
    this.followSpeed = 0.1
  }

  /**
   * Set camera target (what to follow)
   * @param {number} x - Target X position
   * @param {number} y - Target Y position
   */
  setTarget(x, y) {
    this.targetX = x - this.width / 2
    this.targetY = y - this.height / 2
  }

  /**
   * Update camera position (smooth follow)
   * @param {number} deltaTime - Time since last update
   */
  update(deltaTime) {
    // Smooth camera follow
    this.x += (this.targetX - this.x) * this.followSpeed
    this.y += (this.targetY - this.y) * this.followSpeed
  }

  /**
   * Get camera bounds
   * @returns {Object} Bounds object
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  /**
   * Check if a point is visible
   * @param {number} x - X position
   * @param {number} y - Y position
   * @returns {boolean}
   */
  isVisible(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height
  }
}

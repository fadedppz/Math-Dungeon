/**
 * Dungeon Entrance
 * Represents an entrance to a grade-specific dungeon
 */
export class DungeonEntrance {
  constructor(config = {}) {
    this.x = config.x || 0
    this.y = config.y || 0
    this.width = config.width || 64
    this.height = config.height || 64
    this.grade = config.grade || 1
    this.gradeName = config.gradeName || `Math ${this.grade}`
    this.color = this.getGradeColor()
  }

  /**
   * Get color based on grade level
   * @returns {string} Color hex code
   */
  getGradeColor() {
    const colors = [
      '#ff6b6b', // Math 1 - Red
      '#4ecdc4', // Math 2 - Teal
      '#45b7d1', // Math 3 - Blue
      '#96ceb4', // Math 4 - Green
      '#ffeaa7', // Math 5 - Yellow
      '#dda0dd', // Math 6 - Plum
      '#98d8c8', // Math 7 - Mint
      '#f7dc6f', // Math 8 - Gold
      '#bb8fce', // Math 9 - Purple
      '#85c1e2', // Math 10-1 - Sky Blue
      '#f8b739', // Math 20-1 - Orange
      '#e74c3c'  // Math 30-1 - Dark Red
    ]
    const index = Math.min(this.grade - 1, colors.length - 1)
    return colors[index] || '#888'
  }

  /**
   * Check if point is inside entrance
   * @param {number} x - X position
   * @param {number} y - Y position
   * @returns {boolean}
   */
  contains(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height
  }

  /**
   * Render the dungeon entrance
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} cameraX - Camera X offset
   * @param {number} cameraY - Camera Y offset
   */
  render(ctx, cameraX = 0, cameraY = 0) {
    const screenX = this.x - cameraX
    const screenY = this.y - cameraY

    // Draw entrance portal effect
    ctx.fillStyle = this.color
    ctx.globalAlpha = 0.6
    ctx.fillRect(screenX, screenY, this.width, this.height)
    
    // Draw border
    ctx.globalAlpha = 1.0
    ctx.strokeStyle = this.color
    ctx.lineWidth = 3
    ctx.strokeRect(screenX, screenY, this.width, this.height)

    // Draw grade label
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(this.gradeName, screenX + this.width / 2, screenY + this.height / 2 - 5)
    ctx.font = '10px Arial'
    ctx.fillText('Press E to Enter', screenX + this.width / 2, screenY + this.height / 2 + 10)
  }
}

/**
 * Geometry Visualizer
 * Renders geometric shapes for geometry problems
 */
export class GeometryVisualizer {
  constructor(canvas, width, height) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = width
    this.height = height
  }

  /**
   * Draw a square
   * @param {number} sideLength - Length of side
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   */
  drawSquare(sideLength, x, y) {
    const halfSide = sideLength / 2
    this.ctx.strokeStyle = '#4a90e2'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(x - halfSide, y - halfSide, sideLength, sideLength)
    
    // Draw labels
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`${sideLength}`, x, y + halfSide + 15)
    this.ctx.fillText(`${sideLength}`, x - halfSide - 15, y)
  }

  /**
   * Draw a rectangle
   * @param {number} length - Length
   * @param {number} width - Width
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   */
  drawRectangle(length, width, x, y) {
    this.ctx.strokeStyle = '#4a90e2'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(x - length / 2, y - width / 2, length, width)
    
    // Draw labels
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`${length}`, x, y + width / 2 + 15)
    this.ctx.textAlign = 'right'
    this.ctx.fillText(`${width}`, x - length / 2 - 10, y)
  }

  /**
   * Draw a circle
   * @param {number} radius - Radius
   * @param {number} x - X position (center)
   * @param {number} y - Y position (center)
   */
  drawCircle(radius, x, y) {
    this.ctx.strokeStyle = '#4a90e2'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.stroke()
    
    // Draw radius line
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(x + radius, y)
    this.ctx.stroke()
    
    // Draw label
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`r = ${radius}`, x + radius / 2, y - 10)
  }

  /**
   * Draw a triangle
   * @param {number} base - Base length
   * @param {number} height - Height
   * @param {number} x - X position (center of base)
   * @param {number} y - Y position (bottom of triangle)
   */
  drawTriangle(base, height, x, y) {
    this.ctx.strokeStyle = '#4a90e2'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(x - base / 2, y)
    this.ctx.lineTo(x + base / 2, y)
    this.ctx.lineTo(x, y - height)
    this.ctx.closePath()
    this.ctx.stroke()
    
    // Draw labels
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(`${base}`, x, y + 15)
    this.ctx.textAlign = 'right'
    this.ctx.fillText(`${height}`, x - base / 2 - 10, y - height / 2)
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Render a shape based on problem type
   * @param {string} shapeType - Type of shape
   * @param {Object} dimensions - Shape dimensions
   */
  renderShape(shapeType, dimensions) {
    this.clear()
    
    const centerX = this.width / 2
    const centerY = this.height / 2
    
    switch (shapeType.toLowerCase()) {
      case 'square':
        this.drawSquare(dimensions.side || dimensions.length || 50, centerX, centerY)
        break
      case 'rectangle':
        this.drawRectangle(
          dimensions.length || 80,
          dimensions.width || 50,
          centerX,
          centerY
        )
        break
      case 'circle':
        this.drawCircle(dimensions.radius || 40, centerX, centerY)
        break
      case 'triangle':
        this.drawTriangle(
          dimensions.base || 60,
          dimensions.height || 50,
          centerX,
          centerY + 20
        )
        break
    }
  }
}

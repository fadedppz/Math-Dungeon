/**
 * Graph Plotter Visualization
 * Renders graphs for functions and equations
 */
export class GraphPlotter {
  constructor(canvas, width, height) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = width
    this.height = height
    this.xMin = -10
    this.xMax = 10
    this.yMin = -10
    this.yMax = 10
  }

  /**
   * Set the viewing window
   * @param {number} xMin - Minimum X value
   * @param {number} xMax - Maximum X value
   * @param {number} yMin - Minimum Y value
   * @param {number} yMax - Maximum Y value
   */
  setWindow(xMin, xMax, yMin, yMax) {
    this.xMin = xMin
    this.xMax = xMax
    this.yMin = yMin
    this.yMax = yMax
  }

  /**
   * Convert world coordinates to screen coordinates
   * @param {number} x - World X
   * @param {number} y - World Y
   * @returns {Object} Screen coordinates {x, y}
   */
  worldToScreen(x, y) {
    const screenX = ((x - this.xMin) / (this.xMax - this.xMin)) * this.width
    const screenY = this.height - ((y - this.yMin) / (this.yMax - this.yMin)) * this.height
    return { x: screenX, y: screenY }
  }

  /**
   * Render axes and grid
   */
  renderAxes() {
    // Draw grid
    this.ctx.strokeStyle = '#333'
    this.ctx.lineWidth = 1
    
    // Vertical grid lines
    for (let x = Math.ceil(this.xMin); x <= Math.floor(this.xMax); x++) {
      const screen = this.worldToScreen(x, 0)
      this.ctx.beginPath()
      this.ctx.moveTo(screen.x, 0)
      this.ctx.lineTo(screen.x, this.height)
      this.ctx.stroke()
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(this.yMin); y <= Math.floor(this.yMax); y++) {
      const screen = this.worldToScreen(0, y)
      this.ctx.beginPath()
      this.ctx.moveTo(0, screen.y)
      this.ctx.lineTo(this.width, screen.y)
      this.ctx.stroke()
    }
    
    // Draw axes
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 2
    
    // X axis
    const xAxisY = this.worldToScreen(0, 0).y
    this.ctx.beginPath()
    this.ctx.moveTo(0, xAxisY)
    this.ctx.lineTo(this.width, xAxisY)
    this.ctx.stroke()
    
    // Y axis
    const yAxisX = this.worldToScreen(0, 0).x
    this.ctx.beginPath()
    this.ctx.moveTo(yAxisX, 0)
    this.ctx.lineTo(yAxisX, this.height)
    this.ctx.stroke()
    
    // Draw labels
    this.ctx.fillStyle = '#fff'
    this.ctx.font = '10px Arial'
    this.ctx.textAlign = 'center'
    
    // X axis labels
    for (let x = Math.ceil(this.xMin); x <= Math.floor(this.xMax); x++) {
      if (x !== 0) {
        const screen = this.worldToScreen(x, 0)
        this.ctx.fillText(x.toString(), screen.x, xAxisY + 15)
      }
    }
    
    // Y axis labels
    this.ctx.textAlign = 'right'
    for (let y = Math.ceil(this.yMin); y <= Math.floor(this.yMax); y++) {
      if (y !== 0) {
        const screen = this.worldToScreen(0, y)
        this.ctx.fillText(y.toString(), yAxisX - 5, screen.y + 4)
      }
    }
  }

  /**
   * Plot a linear function y = mx + b
   * @param {number} m - Slope
   * @param {number} b - Y-intercept
   * @param {string} color - Line color
   */
  plotLinear(m, b, color = '#4a90e2') {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    
    let firstPoint = true
    for (let x = this.xMin; x <= this.xMax; x += 0.1) {
      const y = m * x + b
      if (y >= this.yMin && y <= this.yMax) {
        const screen = this.worldToScreen(x, y)
        if (firstPoint) {
          this.ctx.moveTo(screen.x, screen.y)
          firstPoint = false
        } else {
          this.ctx.lineTo(screen.x, screen.y)
        }
      }
    }
    
    this.ctx.stroke()
  }

  /**
   * Plot a quadratic function y = ax² + bx + c
   * @param {number} a - Coefficient of x²
   * @param {number} b - Coefficient of x
   * @param {number} c - Constant
   * @param {string} color - Line color
   */
  plotQuadratic(a, b, c, color = '#4a90e2') {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    
    let firstPoint = true
    for (let x = this.xMin; x <= this.xMax; x += 0.1) {
      const y = a * x * x + b * x + c
      if (y >= this.yMin && y <= this.yMax) {
        const screen = this.worldToScreen(x, y)
        if (firstPoint) {
          this.ctx.moveTo(screen.x, screen.y)
          firstPoint = false
        } else {
          this.ctx.lineTo(screen.x, screen.y)
        }
      }
    }
    
    this.ctx.stroke()
  }

  /**
   * Clear and render the graph
   */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.renderAxes()
  }
}

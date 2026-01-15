/**
 * Number Line Visualization
 * Renders an interactive number line for arithmetic problems
 */
export class NumberLine {
  constructor(canvas, width, height) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.width = width
    this.height = height
    this.min = -10
    this.max = 10
    this.value = 0
  }

  /**
   * Set the range of the number line
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   */
  setRange(min, max) {
    this.min = min
    this.max = max
  }

  /**
   * Set the current value to highlight
   * @param {number} value - Value to highlight
   */
  setValue(value) {
    this.value = value
  }

  /**
   * Render the number line
   */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height)
    
    const centerY = this.height / 2
    const padding = 40
    const lineWidth = this.width - (padding * 2)
    const range = this.max - this.min
    
    // Draw the line
    this.ctx.strokeStyle = '#fff'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(padding, centerY)
    this.ctx.lineTo(this.width - padding, centerY)
    this.ctx.stroke()
    
    // Draw tick marks and labels
    const numTicks = Math.min(21, range + 1)
    for (let i = 0; i < numTicks; i++) {
      const value = this.min + (i / (numTicks - 1)) * range
      const x = padding + (i / (numTicks - 1)) * lineWidth
      
      // Draw tick mark
      this.ctx.strokeStyle = '#fff'
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.moveTo(x, centerY - 5)
      this.ctx.lineTo(x, centerY + 5)
      this.ctx.stroke()
      
      // Draw label for integers
      if (Number.isInteger(value)) {
        this.ctx.fillStyle = '#fff'
        this.ctx.font = '12px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.fillText(value.toString(), x, centerY + 20)
      }
    }
    
    // Highlight current value
    if (this.value >= this.min && this.value <= this.max) {
      const valueX = padding + ((this.value - this.min) / range) * lineWidth
      
      // Draw marker
      this.ctx.fillStyle = '#4a90e2'
      this.ctx.beginPath()
      this.ctx.arc(valueX, centerY, 8, 0, Math.PI * 2)
      this.ctx.fill()
      
      // Draw value label
      this.ctx.fillStyle = '#4a90e2'
      this.ctx.font = 'bold 14px Arial'
      this.ctx.fillText(this.value.toString(), valueX, centerY - 15)
    }
  }

  /**
   * Show an addition/subtraction operation
   * @param {number} a - First number
   * @param {number} b - Second number
   * @param {string} operation - '+' or '-'
   */
  showOperation(a, b, operation) {
    this.setRange(Math.min(a, b, a + (operation === '+' ? b : -b)) - 5, 
                  Math.max(a, b, a + (operation === '+' ? b : -b)) + 5)
    this.render()
    
    // Animate the operation
    setTimeout(() => {
      this.setValue(a)
      this.render()
    }, 500)
    
    setTimeout(() => {
      const result = operation === '+' ? a + b : a - b
      this.setValue(result)
      this.render()
    }, 1500)
  }
}

import { NumberLine } from './NumberLine'
import { GraphPlotter } from './GraphPlotter'
import { GeometryVisualizer } from './GeometryVisualizer'

/**
 * Math Visualizer
 * Main interface for math visualizations
 */
export class MathVisualizer {
  constructor(containerElement) {
    this.container = containerElement
    this.currentVisualization = null
    this.canvas = null
    this.numberLine = null
    this.graphPlotter = null
    this.geometryVisualizer = null
    
    this.initialize()
  }

  /**
   * Initialize visualization components
   */
  initialize() {
    // Create canvas
    this.canvas = document.createElement('canvas')
    this.canvas.width = 400
    this.canvas.height = 300
    this.canvas.style.border = '2px solid #667eea'
    this.canvas.style.borderRadius = '8px'
    this.canvas.style.background = '#1a1a2e'
    this.container.appendChild(this.canvas)
    
    // Initialize visualizers
    this.numberLine = new NumberLine(this.canvas, this.canvas.width, this.canvas.height)
    this.graphPlotter = new GraphPlotter(this.canvas, this.canvas.width, this.canvas.height)
    this.geometryVisualizer = new GeometryVisualizer(this.canvas, this.canvas.width, this.canvas.height)
  }

  /**
   * Visualize a problem
   * @param {Object} problem - Problem object
   */
  visualize(problem) {
    const topic = problem.topic || ''
    const question = problem.question || ''
    
    // Determine visualization type based on topic
    if (topic.includes('arithmetic') || topic.includes('addition') || topic.includes('subtraction')) {
      this.visualizeArithmetic(problem)
    } else if (topic.includes('linear') || topic.includes('function') || topic.includes('graph')) {
      this.visualizeLinear(problem)
    } else if (topic.includes('quadratic') || topic.includes('polynomial')) {
      this.visualizeQuadratic(problem)
    } else if (topic.includes('geometry') || topic.includes('area') || topic.includes('shape')) {
      this.visualizeGeometry(problem)
    } else {
      // Default: show number line
      this.visualizeArithmetic(problem)
    }
  }

  /**
   * Visualize arithmetic problem with number line
   * @param {Object} problem - Problem object
   */
  visualizeArithmetic(problem) {
    this.currentVisualization = 'number-line'
    
    // Extract numbers from question
    const numbers = problem.question.match(/\d+/g)
    if (numbers && numbers.length >= 2) {
      const a = parseInt(numbers[0])
      const b = parseInt(numbers[1])
      const hasAddition = problem.question.includes('+')
      const hasSubtraction = problem.question.includes('-')
      
      if (hasAddition) {
        this.numberLine.showOperation(a, b, '+')
      } else if (hasSubtraction) {
        this.numberLine.showOperation(a, b, '-')
      } else {
        this.numberLine.setValue(parseInt(numbers[0]))
        this.numberLine.render()
      }
    } else {
      this.numberLine.render()
    }
  }

  /**
   * Visualize linear function
   * @param {Object} problem - Problem object
   */
  visualizeLinear(problem) {
    this.currentVisualization = 'graph'
    this.graphPlotter.render()
    
    // Try to extract slope and intercept from question
    const slopeMatch = problem.question.match(/slope.*?(-?\d+)/i)
    const interceptMatch = problem.question.match(/y\s*=\s*(-?\d+)x\s*([+-]\d+)/i)
    
    if (interceptMatch) {
      const m = parseInt(interceptMatch[1])
      const b = parseInt(interceptMatch[2])
      this.graphPlotter.plotLinear(m, b)
    } else if (slopeMatch) {
      const m = parseInt(slopeMatch[1])
      this.graphPlotter.plotLinear(m, 0)
    }
  }

  /**
   * Visualize quadratic function
   * @param {Object} problem - Problem object
   */
  visualizeQuadratic(problem) {
    this.currentVisualization = 'graph'
    this.graphPlotter.setWindow(-5, 5, -5, 10)
    this.graphPlotter.render()
    
    // Try to extract coefficients
    const quadMatch = problem.question.match(/(-?\d+)x²\s*([+-]\d+)x\s*([+-]\d+)/i)
    if (quadMatch) {
      const a = parseInt(quadMatch[1])
      const b = parseInt(quadMatch[2])
      const c = parseInt(quadMatch[3])
      this.graphPlotter.plotQuadratic(a, b, c)
    }
  }

  /**
   * Visualize geometry problem
   * @param {Object} problem - Problem object
   */
  visualizeGeometry(problem) {
    this.currentVisualization = 'geometry'
    
    // Extract shape type and dimensions
    const question = problem.question.toLowerCase()
    let shapeType = 'square'
    const dimensions = {}
    
    if (question.includes('square')) {
      shapeType = 'square'
      const sideMatch = problem.question.match(/side.*?(\d+)/i)
      if (sideMatch) dimensions.side = parseInt(sideMatch[1])
    } else if (question.includes('rectangle')) {
      shapeType = 'rectangle'
      const lengthMatch = problem.question.match(/length.*?(\d+)/i)
      const widthMatch = problem.question.match(/width.*?(\d+)/i)
      if (lengthMatch) dimensions.length = parseInt(lengthMatch[1])
      if (widthMatch) dimensions.width = parseInt(widthMatch[1])
    } else if (question.includes('circle')) {
      shapeType = 'circle'
      const radiusMatch = problem.question.match(/radius.*?(\d+)/i)
      if (radiusMatch) dimensions.radius = parseInt(radiusMatch[1])
    } else if (question.includes('triangle')) {
      shapeType = 'triangle'
      const baseMatch = problem.question.match(/base.*?(\d+)/i)
      const heightMatch = problem.question.match(/height.*?(\d+)/i)
      if (baseMatch) dimensions.base = parseInt(baseMatch[1])
      if (heightMatch) dimensions.height = parseInt(heightMatch[1])
    }
    
    // Default dimensions if not found
    if (Object.keys(dimensions).length === 0) {
      dimensions.side = 50
      dimensions.length = 80
      dimensions.width = 50
      dimensions.radius = 40
      dimensions.base = 60
      dimensions.height = 50
    }
    
    this.geometryVisualizer.renderShape(shapeType, dimensions)
  }

  /**
   * Clear visualization
   */
  clear() {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }
}

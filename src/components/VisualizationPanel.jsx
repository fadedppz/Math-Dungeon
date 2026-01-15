// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                                                                             ║
// ║   💡 VISUALIZATION PANEL 💡                                                ║
// ║   ═════════════════════════                                                 ║
// ║                                                                             ║
// ║   WHAT IS THIS FILE?                                                        ║
// ║   This is a helper panel that shows hints and pictures to help you          ║
// ║   solve math problems! Think of it like having a friend next to you        ║
// ║   who draws pictures to explain the problem.                                ║
// ║                                                                             ║
// ║   FOR EXAMPLE:                                                              ║
// ║   • For multiplication (3 × 4), it draws 3 rows of 4 dots                  ║
// ║   • For fractions (1/2), it draws a pizza cut in half                      ║
// ║   • For geometry, it draws shapes with labels                              ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import { useEffect, useRef } from 'react'


// ═══════════════════════════════════════════════════════════════════════════
// 🎨 THE MAIN VISUALIZATION PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
//
// This is a React component - it's like a LEGO piece that you can put
// on your website. It shows a hint box with helpful pictures!
//
// INPUT: problem = the math problem we need to give hints for

function VisualizationPanel({ problem }) {

  // ──────────────────────────────────────────────────────────────────────────
  // 🖼️ Set up the canvas (the drawing area)
  // ──────────────────────────────────────────────────────────────────────────
  // useRef lets us "grab onto" the canvas so we can draw on it later
  const drawingCanvas = useRef(null)


  // ──────────────────────────────────────────────────────────────────────────
  // 🎨 This runs whenever the problem changes - it draws the visual hint!
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {

    // First, check if we have everything we need
    const haveCanvas = drawingCanvas.current !== null
    const haveProblem = problem !== null && problem !== undefined

    if (haveCanvas === false || haveProblem === false) {
      return  // Can't draw without a canvas or problem!
    }

    // Get the canvas and the "pen" (context) to draw with
    const canvas = drawingCanvas.current
    const pen = canvas.getContext('2d')  // This is our drawing pen!

    // ────────────────────────────────────────────────────────
    // 📏 Set up the canvas size
    // ────────────────────────────────────────────────────────
    // We double the size for sharp graphics on fancy screens (retina)
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    pen.scale(2, 2)

    const canvasWidth = canvas.offsetWidth
    const canvasHeight = canvas.offsetHeight

    // ────────────────────────────────────────────────────────
    // 🧹 Clear the canvas (erase any old drawings)
    // ────────────────────────────────────────────────────────
    const backgroundColor = '#1a1a2e'  // Dark purple color
    pen.fillStyle = backgroundColor
    pen.fillRect(0, 0, canvasWidth, canvasHeight)

    // ────────────────────────────────────────────────────────
    // 🔍 Figure out what TYPE of problem this is
    // ────────────────────────────────────────────────────────
    // We look at the problem topic and question to decide
    // what kind of picture to draw!

    const mathTopic = (problem.topic || '').toLowerCase()
    const questionText = (problem.question || '').toLowerCase()

    // ────────────────────────────────────────────────────────
    // 🎨 Draw the RIGHT kind of help based on the problem type
    // ────────────────────────────────────────────────────────

    // Is it a MULTIPLICATION problem? (like 3 × 4)
    const isMultiplication = mathTopic.includes('times') ||
      mathTopic.includes('multiplication') ||
      questionText.includes('×')

    // Is it a DIVISION problem? (like 12 ÷ 3)
    const isDivision = mathTopic.includes('division') ||
      questionText.includes('÷')

    // Is it a FRACTION problem? (like 1/2 + 1/4)
    const isFraction = mathTopic.includes('fraction') ||
      questionText.includes('/')

    // Is it a GEOMETRY problem? (shapes, area, perimeter)
    const isGeometry = mathTopic.includes('area') ||
      mathTopic.includes('perimeter') ||
      mathTopic.includes('geometry')

    // Is it a GRAPHING problem? (slope, lines)
    const isGraphing = mathTopic.includes('slope') ||
      mathTopic.includes('linear') ||
      mathTopic.includes('graph')

    // Is it a TRIGONOMETRY problem? (sin, cos, tan)
    const isTrigonometry = mathTopic.includes('trig') ||
      mathTopic.includes('sin') ||
      mathTopic.includes('cos')

    // Is it an ALGEBRA problem? (factoring, quadratics)
    const isAlgebra = mathTopic.includes('quadrat') ||
      mathTopic.includes('factor')

    // Is it an EXPONENT or LOG problem?
    const isExponentOrLog = mathTopic.includes('expon') ||
      mathTopic.includes('log')

    // Is it a PROBABILITY problem?
    const isProbability = mathTopic.includes('probab')

    // Is it a SEQUENCE problem? (patterns)
    const isSequence = mathTopic.includes('sequence') ||
      mathTopic.includes('series')

    // ────────────────────────────────────────────────────────
    // 🎨 Call the right drawing function!
    // ────────────────────────────────────────────────────────
    // We check each type and draw the matching picture

    if (isMultiplication) {
      drawMultiplicationHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isDivision) {
      drawDivisionHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isFraction) {
      drawFractionHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isGeometry) {
      drawGeometryHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isGraphing) {
      drawGraphHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isTrigonometry) {
      drawTrigHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isAlgebra) {
      drawAlgebraHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isExponentOrLog) {
      drawExponentHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isProbability) {
      drawProbabilityHelp(pen, canvasWidth, canvasHeight, problem)
    } else if (isSequence) {
      drawSequenceHelp(pen, canvasWidth, canvasHeight, problem)
    } else {
      // Default: draw basic number help (dots, counting)
      drawNumberHelp(pen, canvasWidth, canvasHeight, problem)
    }

  }, [problem])  // Re-run this whenever the problem changes!


  // ──────────────────────────────────────────────────────────────────────────
  // 🚫 If there's no problem, don't show anything
  // ──────────────────────────────────────────────────────────────────────────

  const haveProblem = problem !== null && problem !== undefined

  if (haveProblem === false) {
    return null  // Show nothing
  }


  // ──────────────────────────────────────────────────────────────────────────
  // 🎨 THE ACTUAL VISUAL LAYOUT (what you see on screen!)
  // ──────────────────────────────────────────────────────────────────────────

  // Get the hint text to display
  const hintMessage = problem.hint || getHintText(problem)

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
      borderRadius: '10px',
      border: '1px solid #667eea',
      padding: '10px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* The hint header bar */}
      <div style={{
        color: '#667eea',
        fontSize: '10px',
        fontWeight: 'bold',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>💡 HINT</span>
        <span style={{ color: '#aaa', fontWeight: 'normal' }}>{hintMessage}</span>
      </div>

      {/* The drawing canvas where we show pictures */}
      <canvas
        ref={drawingCanvas}
        style={{
          flex: 1,
          width: '100%',
          borderRadius: '6px',
          background: '#1a1a2e'
        }}
      />
    </div>
  )
}

// ╔════════════════════════════════════════════════════════════════╗
// ║                   💡 HINT HELPER SYSTEM 💡                      ║
// ╠════════════════════════════════════════════════════════════════╣
// ║                                                                 ║
// ║  WHAT IS THIS? 🤔                                              ║
// ║  ──────────────────────────────────────────────────────────── ║
// ║  Imagine you have a really nice friend sitting next to you.   ║
// ║  When you get stuck on a math problem, your friend peeks at   ║
// ║  the problem and whispers a little hint to help you!          ║
// ║                                                                 ║
// ║  This code does exactly that! It:                              ║
// ║  1. Looks at what KIND of problem you have (adding? dividing?)║
// ║  2. Finds the NUMBERS in your problem                         ║
// ║  3. Gives you a helpful, specific hint!                       ║
// ║                                                                 ║
// ║  EXAMPLE:                                                       ║
// ║  If your problem is "5 + 3 = ?", the hint might say:          ║
// ║  "Start with 5, count up 3 more!"                              ║
// ║                                                                 ║
// ╚════════════════════════════════════════════════════════════════╝

function getHintText(problem) {

  // ════════════════════════════════════════════════════════════════
  // 📖 STEP 1: Get information about the math problem
  // ════════════════════════════════════════════════════════════════

  // What type of math is this? (like "addition" or "division")
  // We make it lowercase so "Addition" and "addition" are treated the same
  const mathType = (problem.topic || '').toLowerCase()

  // What does the question actually say? (like "5 + 3 = ?")
  const questionText = (problem.question || '').toLowerCase()

  // Find all the numbers hiding in the question!
  // This magic pattern finds numbers like: 5, -3, 2.5, 100, etc.
  const findNumbersPattern = /-?\d+\.?\d*/g
  const allTheNumbers = questionText.match(findNumbersPattern) || []

  // Turn the text numbers into actual numbers we can use
  // "5" (text) becomes 5 (number we can do math with)
  const numbersWeFound = allTheNumbers.map(textNumber => parseFloat(textNumber))


  // ════════════════════════════════════════════════════════════════
  // ➕ ADDITION HINTS (like combining two piles of toys!)
  // ════════════════════════════════════════════════════════════════

  const isAdditionProblem = mathType.includes('addition') ||
    (questionText.includes('+') && !questionText.includes('x'))

  if (isAdditionProblem) {
    // Did we find at least 2 numbers?
    const weFoundEnoughNumbers = numbersWeFound.length >= 2

    if (weFoundEnoughNumbers) {
      const firstNumber = numbersWeFound[0]
      const secondNumber = numbersWeFound[1]

      // If the second number is small (5 or less), suggest counting up
      const isSmallNumber = secondNumber <= 5

      if (isSmallNumber) {
        return `Start with ${firstNumber}, count up ${secondNumber} more!`
      } else {
        return `Combine ${firstNumber} and ${secondNumber} together`
      }
    }
    return 'Count both groups together!'
  }


  // ════════════════════════════════════════════════════════════════
  // ➖ SUBTRACTION HINTS (like taking away some toys!)
  // ════════════════════════════════════════════════════════════════

  const isSubtractionProblem = mathType.includes('subtraction') ||
    questionText.includes('-')

  if (isSubtractionProblem) {
    const weFoundEnoughNumbers = numbersWeFound.length >= 2

    if (weFoundEnoughNumbers) {
      const startingNumber = numbersWeFound[0]
      const numberToTakeAway = numbersWeFound[1]

      const isSmallNumber = numberToTakeAway <= 5

      if (isSmallNumber) {
        return `Start at ${startingNumber}, count back ${numberToTakeAway}`
      } else {
        return `Take ${numberToTakeAway} away from ${startingNumber}`
      }
    }
    return 'Take away the second number!'
  }


  // ════════════════════════════════════════════════════════════════
  // ✖️ MULTIPLICATION HINTS (like having groups of items!)
  // ════════════════════════════════════════════════════════════════

  const isMultiplicationProblem = mathType.includes('times') ||
    mathType.includes('multi') ||
    questionText.includes('×') ||
    questionText.includes('x')

  if (isMultiplicationProblem) {
    const weFoundEnoughNumbers = numbersWeFound.length >= 2

    if (weFoundEnoughNumbers) {
      const numberOfGroups = numbersWeFound[0]
      const itemsInEachGroup = numbersWeFound[1]

      // For small numbers, show it as repeated addition (easier to understand!)
      const areNumbersSmall = numberOfGroups <= 5 && itemsInEachGroup <= 10

      if (areNumbersSmall) {
        return `${numberOfGroups} groups of ${itemsInEachGroup} = ${itemsInEachGroup}+${itemsInEachGroup}+... (${numberOfGroups} times)`
      } else {
        return `${numberOfGroups} groups with ${itemsInEachGroup} in each`
      }
    }
    return 'Count the groups!'
  }


  // ════════════════════════════════════════════════════════════════
  // ➗ DIVISION HINTS (like sharing items equally with friends!)
  // ════════════════════════════════════════════════════════════════

  const isDivisionProblem = mathType.includes('division') ||
    questionText.includes('÷')

  if (isDivisionProblem) {
    const weFoundEnoughNumbers = numbersWeFound.length >= 2

    if (weFoundEnoughNumbers) {
      const totalItems = numbersWeFound[0]
      const numberOfFriends = numbersWeFound[1]

      return `Split ${totalItems} items between ${numberOfFriends} friends equally`
    }
    return 'How many does each person get?'
  }


  // ════════════════════════════════════════════════════════════════
  // 🍕 FRACTION HINTS (like slices of pizza!)
  // ════════════════════════════════════════════════════════════════

  const isFractionProblem = mathType.includes('fraction') ||
    questionText.includes('/')

  if (isFractionProblem) {
    return 'Think of it like pizza slices!'
  }


  // ════════════════════════════════════════════════════════════════
  // 📐 SHAPE HINTS (geometry stuff!)
  // ════════════════════════════════════════════════════════════════

  if (mathType.includes('area')) return 'Area = Length × Width'
  if (mathType.includes('perimeter')) return 'Add up all the sides!'
  if (mathType.includes('triangle')) return 'Triangles have 3 sides'
  if (mathType.includes('circle')) return 'Use π (that\'s about 3.14)'


  // ════════════════════════════════════════════════════════════════
  // 🔤 ALGEBRA HINTS (with x and y!)
  // ════════════════════════════════════════════════════════════════

  if (mathType.includes('slope')) return 'Rise ÷ Run (how much up vs across)'
  if (mathType.includes('equation')) return 'Get x by itself on one side!'
  if (questionText.includes('solve')) return 'Get x by itself on one side!'
  if (mathType.includes('quadrat')) return 'Try factoring or use the formula'


  // ════════════════════════════════════════════════════════════════
  // 🎓 ADVANCED MATH HINTS
  // ════════════════════════════════════════════════════════════════

  if (mathType.includes('trig')) return 'Remember: SOH CAH TOA!'
  if (mathType.includes('log')) return 'log means "what power?"'
  if (mathType.includes('sequence')) return 'Find the pattern between numbers'
  if (mathType.includes('probab')) return 'Probability = Favorable ÷ Total'


  // ════════════════════════════════════════════════════════════════
  // 🤷 DEFAULT HINT (when we're not sure what type of problem it is)
  // ════════════════════════════════════════════════════════════════

  return 'Take it step by step, you got this!'
}

// Number help for basic arithmetic
function drawNumberHelp(ctx, width, height, problem) {
  const numbers = problem.question.match(/-?\d+\.?\d*/g)?.map(n => parseFloat(n)) || []

  if (numbers.length < 2) {
    drawCenteredText(ctx, width, height, 'Solve step by step!')
    return
  }

  const [a, b] = numbers
  const operation = problem.question.includes('+') ? '+' :
    problem.question.includes('-') ? '-' : '?'

  // Draw visual counting/grouping
  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 14px Arial'
  ctx.textAlign = 'center'

  if (operation === '+') {
    // Draw dots for addition
    const maxDots = Math.min(a + b, 20)
    const dotRadius = Math.min(8, (width - 40) / (maxDots * 2.5))

    ctx.fillText(`${a} + ${b} = ?`, width / 2, 20)

    let x = 20
    let y = height / 2

    // First number dots
    ctx.fillStyle = '#4ecdc4'
    for (let i = 0; i < Math.min(a, 10); i++) {
      ctx.beginPath()
      ctx.arc(x + i * (dotRadius * 2.5), y - 10, dotRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Second number dots
    ctx.fillStyle = '#f7dc6f'
    for (let i = 0; i < Math.min(b, 10); i++) {
      ctx.beginPath()
      ctx.arc(x + i * (dotRadius * 2.5), y + 20, dotRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`First: ${a}`, 20, height - 30)
    ctx.fillText(`Second: ${b}`, 20, height - 15)
    ctx.textAlign = 'right'
    ctx.fillText(`Total: ${a + b}`, width - 20, height - 20)

  } else if (operation === '-') {
    ctx.fillText(`${a} - ${b} = ?`, width / 2, 20)
    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.fillText(`Start with ${a}, take away ${b}`, width / 2, height / 2)
    ctx.fillText(`Answer: ${a - b}`, width / 2, height / 2 + 20)
  }
}

// Multiplication help
function drawMultiplicationHelp(ctx, width, height, problem) {
  const numbers = problem.question.match(/(\d+)\s*[×x]\s*(\d+)/i)

  if (!numbers) {
    drawCenteredText(ctx, width, height, 'Groups × Items per group')
    return
  }

  const a = Math.min(parseInt(numbers[1]), 10)
  const b = Math.min(parseInt(numbers[2]), 10)

  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`${numbers[1]} × ${numbers[2]} = ${parseInt(numbers[1]) * parseInt(numbers[2])}`, width / 2, 18)

  // Draw array
  const cellSize = Math.min(15, (width - 60) / b, (height - 50) / a)
  const startX = (width - cellSize * b) / 2
  const startY = 30

  for (let row = 0; row < a; row++) {
    for (let col = 0; col < b; col++) {
      ctx.fillStyle = `hsl(${170 + row * 10}, 70%, 50%)`
      ctx.beginPath()
      ctx.arc(startX + col * cellSize + cellSize / 2, startY + row * cellSize + cellSize / 2, cellSize / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.fillStyle = '#aaa'
  ctx.font = '10px Arial'
  ctx.fillText(`${a} rows × ${b} columns = ${a * b} total`, width / 2, height - 8)
}

// Division help
function drawDivisionHelp(ctx, width, height, problem) {
  const numbers = problem.question.match(/(\d+)\s*÷\s*(\d+)/i)

  if (!numbers) {
    drawCenteredText(ctx, width, height, 'Total ÷ Groups = Items per group')
    return
  }

  const total = parseInt(numbers[1])
  const divisor = parseInt(numbers[2])
  const result = Math.floor(total / divisor)

  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`${total} ÷ ${divisor} = ${result}`, width / 2, 18)

  // Draw groups
  const groupSize = Math.min(6, result)
  const groups = Math.min(divisor, 5)
  const dotRadius = Math.min(8, (width - 40) / (groups * (groupSize + 1)))

  for (let g = 0; g < groups; g++) {
    const groupX = 30 + g * (width - 60) / groups
    ctx.fillStyle = '#444'
    ctx.fillRect(groupX - 5, 35, (dotRadius * 2 + 4) * Math.min(groupSize, 3), height - 60)

    for (let i = 0; i < Math.min(groupSize, 6); i++) {
      const row = Math.floor(i / 3)
      const col = i % 3
      ctx.fillStyle = '#4ecdc4'
      ctx.beginPath()
      ctx.arc(groupX + col * (dotRadius * 2 + 2), 50 + row * (dotRadius * 2 + 2), dotRadius, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.fillStyle = '#aaa'
  ctx.font = '10px Arial'
  ctx.fillText(`${divisor} groups of ${result}`, width / 2, height - 8)
}

// Fraction help
function drawFractionHelp(ctx, width, height, problem) {
  const fractions = problem.question.match(/(\d+)\/(\d+)/g)

  if (!fractions || fractions.length === 0) {
    drawCenteredText(ctx, width, height, 'Part of a whole')
    return
  }

  const radius = Math.min(40, height / 3)

  fractions.slice(0, 2).forEach((frac, idx) => {
    const [num, denom] = frac.split('/').map(n => parseInt(n))
    const centerX = width / (fractions.length > 1 ? 3 : 2) * (idx + 1)
    const centerY = height / 2

    // Draw pie
    for (let i = 0; i < denom; i++) {
      const startAngle = (i / denom) * Math.PI * 2 - Math.PI / 2
      const endAngle = ((i + 1) / denom) * Math.PI * 2 - Math.PI / 2

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = i < num ? '#4ecdc4' : 'rgba(255,255,255,0.1)'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(frac, centerX, centerY + radius + 15)
  })
}

// Geometry help
function drawGeometryHelp(ctx, width, height, problem) {
  const question = problem.question.toLowerCase()

  ctx.strokeStyle = '#4ecdc4'
  ctx.fillStyle = 'rgba(78, 205, 196, 0.2)'
  ctx.lineWidth = 2

  const centerX = width / 2
  const centerY = height / 2

  if (question.includes('rectangle') || question.includes('area')) {
    const rectW = 80
    const rectH = 50
    ctx.strokeRect(centerX - rectW / 2, centerY - rectH / 2, rectW, rectH)
    ctx.fillRect(centerX - rectW / 2, centerY - rectH / 2, rectW, rectH)

    ctx.fillStyle = '#fff'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Length', centerX, centerY + rectH / 2 + 15)
    ctx.save()
    ctx.translate(centerX - rectW / 2 - 12, centerY)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Width', 0, 0)
    ctx.restore()

    ctx.fillStyle = '#aaa'
    ctx.font = '10px Arial'
    ctx.fillText('Area = Length × Width', centerX, height - 8)
  } else if (question.includes('triangle')) {
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 35)
    ctx.lineTo(centerX - 45, centerY + 30)
    ctx.lineTo(centerX + 45, centerY + 30)
    ctx.closePath()
    ctx.stroke()
    ctx.fill()

    ctx.fillStyle = '#aaa'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Area = ½ × base × height', centerX, height - 8)
  } else if (question.includes('circle')) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fill()

    ctx.strokeStyle = '#ff6b6b'
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + 40, centerY)
    ctx.stroke()

    ctx.fillStyle = '#ff6b6b'
    ctx.font = '10px Arial'
    ctx.fillText('r', centerX + 20, centerY - 5)

    ctx.fillStyle = '#aaa'
    ctx.fillText('Area = πr²', centerX, height - 8)
  } else {
    drawCenteredText(ctx, width, height, 'Use geometry formulas')
  }
}

// Graph help for linear equations
function drawGraphHelp(ctx, width, height, problem) {
  const padding = 25
  const graphW = width - padding * 2
  const graphH = height - padding * 2
  const originX = padding + graphW / 2
  const originY = padding + graphH / 2

  // Axes
  ctx.strokeStyle = '#555'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, originY)
  ctx.lineTo(width - padding, originY)
  ctx.moveTo(originX, padding)
  ctx.lineTo(originX, height - padding)
  ctx.stroke()

  // Try to extract slope
  const slopeMatch = problem.question.match(/y\s*=\s*(-?\d+)x/i) || problem.question.match(/slope.*?(-?\d+)/i)
  const slope = slopeMatch ? parseInt(slopeMatch[1]) : 1

  // Draw line
  ctx.strokeStyle = '#4ecdc4'
  ctx.lineWidth = 2
  ctx.beginPath()

  for (let x = -5; x <= 5; x += 0.5) {
    const y = slope * x
    const screenX = originX + (x / 5) * (graphW / 2)
    const screenY = originY - (y / 5) * (graphH / 2)

    if (x === -5) ctx.moveTo(screenX, screenY)
    else ctx.lineTo(screenX, screenY)
  }
  ctx.stroke()

  ctx.fillStyle = '#fff'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('x', width - 15, originY + 12)
  ctx.fillText('y', originX - 10, 15)
  ctx.fillText(`Slope = ${slope}`, width / 2, height - 5)
}

// Trigonometry help
function drawTrigHelp(ctx, width, height, problem) {
  const centerX = width / 2 - 20
  const centerY = height / 2 + 10
  const size = Math.min(60, height / 2 - 20)

  // Draw right triangle
  ctx.strokeStyle = '#4ecdc4'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(centerX - size, centerY)
  ctx.lineTo(centerX + size / 2, centerY)
  ctx.lineTo(centerX - size, centerY - size)
  ctx.closePath()
  ctx.stroke()

  // Right angle marker
  ctx.strokeRect(centerX - size, centerY - 10, 10, 10)

  // Labels
  ctx.fillStyle = '#fff'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Opposite', centerX - size - 25, centerY - size / 2)
  ctx.fillText('Adjacent', centerX - size / 4, centerY + 15)
  ctx.fillText('Hypotenuse', centerX - 10, centerY - size / 2 - 5)

  // SOH CAH TOA
  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 11px Arial'
  ctx.textAlign = 'left'
  const rightX = width - 70
  ctx.fillText('SOH CAH TOA', rightX, 20)
  ctx.font = '9px Arial'
  ctx.fillStyle = '#4ecdc4'
  ctx.fillText('sin = O/H', rightX, 38)
  ctx.fillText('cos = A/H', rightX, 52)
  ctx.fillText('tan = O/A', rightX, 66)
}

// Algebra help
function drawAlgebraHelp(ctx, width, height, problem) {
  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Factoring Pattern', width / 2, 20)

  ctx.fillStyle = '#fff'
  ctx.font = '11px Arial'
  ctx.fillText('x² + (a+b)x + ab', width / 2, height / 2 - 15)
  ctx.fillText('= (x + a)(x + b)', width / 2, height / 2 + 5)

  ctx.fillStyle = '#aaa'
  ctx.font = '10px Arial'
  ctx.fillText('Find two numbers that:', width / 2, height - 35)
  ctx.fillText('• Multiply to give c', width / 2, height - 20)
  ctx.fillText('• Add to give b', width / 2, height - 5)
}

// Exponent/Log help
function drawExponentHelp(ctx, width, height, problem) {
  const question = problem.question.toLowerCase()

  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'

  if (question.includes('log')) {
    ctx.fillText('Logarithm Rule', width / 2, 20)
    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.fillText('log_b(x) = y', width / 2, height / 2 - 10)
    ctx.fillText('means b^y = x', width / 2, height / 2 + 10)

    ctx.fillStyle = '#4ecdc4'
    ctx.font = '10px Arial'
    ctx.fillText('Example: log₂(8) = 3', width / 2, height - 20)
    ctx.fillText('because 2³ = 8', width / 2, height - 5)
  } else {
    ctx.fillText('Exponent Rules', width / 2, 20)
    ctx.fillStyle = '#fff'
    ctx.font = '10px Arial'
    ctx.fillText('a^m × a^n = a^(m+n)', width / 2, height / 2 - 15)
    ctx.fillText('a^m ÷ a^n = a^(m-n)', width / 2, height / 2)
    ctx.fillText('(a^m)^n = a^(mn)', width / 2, height / 2 + 15)
  }
}

// Probability help
function drawProbabilityHelp(ctx, width, height, problem) {
  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Probability', width / 2, 18)

  ctx.fillStyle = '#fff'
  ctx.font = '12px Arial'
  ctx.fillText('P(event) = Favorable', width / 2, height / 2 - 15)
  ctx.fillText('────────────', width / 2, height / 2)
  ctx.fillText('Total outcomes', width / 2, height / 2 + 15)

  ctx.fillStyle = '#aaa'
  ctx.font = '10px Arial'
  ctx.fillText('0 ≤ P ≤ 1 (or 0% to 100%)', width / 2, height - 8)
}

// Sequence help
function drawSequenceHelp(ctx, width, height, problem) {
  const question = problem.question.toLowerCase()

  ctx.fillStyle = '#667eea'
  ctx.font = 'bold 11px Arial'
  ctx.textAlign = 'center'

  if (question.includes('geometric')) {
    ctx.fillText('Geometric Sequence', width / 2, 18)
    ctx.fillStyle = '#fff'
    ctx.font = '11px Arial'
    ctx.fillText('aₙ = a₁ × r^(n-1)', width / 2, height / 2 - 5)
    ctx.fillStyle = '#aaa'
    ctx.font = '10px Arial'
    ctx.fillText('Each term = previous × ratio', width / 2, height / 2 + 15)
  } else {
    ctx.fillText('Arithmetic Sequence', width / 2, 18)
    ctx.fillStyle = '#fff'
    ctx.font = '11px Arial'
    ctx.fillText('aₙ = a₁ + (n-1)d', width / 2, height / 2 - 5)
    ctx.fillStyle = '#aaa'
    ctx.font = '10px Arial'
    ctx.fillText('Each term = previous + difference', width / 2, height / 2 + 15)
  }

  // Show example pattern
  ctx.fillStyle = '#4ecdc4'
  ctx.font = '10px Arial'
  ctx.fillText('Pattern: 2, 4, 6, 8, ... (+2 each time)', width / 2, height - 8)
}

// Helper function for centered text
function drawCenteredText(ctx, width, height, text) {
  ctx.fillStyle = '#aaa'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(text, width / 2, height / 2)
}

export default VisualizationPanel

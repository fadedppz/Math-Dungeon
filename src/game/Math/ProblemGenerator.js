import { AnswerValidator } from './AnswerValidator'

/**
 * Problem Generator
 * Generates math problems aligned with Alberta curriculum
 * Uses direct unit name mapping for accurate problem generation
 */
export class ProblemGenerator {
  constructor() {
    // Map of unit names to generator functions
    this.unitGenerators = this.initializeUnitGenerators()
    // Map of topic keywords to generator functions
    this.topicGenerators = this.initializeTopicGenerators()
  }

  /**
   * Initialize generators mapped by UNIT NAME from curriculum
   */
  initializeUnitGenerators() {
    return {
      // ===== GRADE 1 =====
      'addition & subtraction to 20': (g) => this.genAddSubTo20(g),
      '2d and 3d shapes': (g) => this.genShapes(g),
      'measurement basics': (g) => this.genMeasurementBasics(g),
      'time concepts': (g) => this.genTimeConcepts(g),

      // ===== GRADE 2 =====
      'addition & subtraction to 100': (g) => this.genAddSubTo100(g),
      'shape sorting': (g) => this.genShapeSorting(g),
      'measuring length': (g) => this.genMeasuringLength(g),
      'time duration': (g) => this.genTimeDuration(g),
      'data & graphing': (g) => this.genDataGraphing(g),

      // ===== GRADE 3 =====
      'addition & subtraction to 1000': (g) => this.genAddSubTo1000(g),
      'multiplication facts': (g) => this.genMultiplicationFacts(g),
      'geometry lines & shapes': (g) => this.genGeometryLines(g),
      'metric measurement': (g) => this.genMetricMeasurement(g),
      'telling time': (g) => this.genTellingTime(g),

      // ===== GRADE 4 =====
      'operations to 10,000': (g) => this.genOperationsTo10000(g),
      'multiplication & division': (g) => this.genMultDiv(g),
      'classifying shapes': (g) => this.genClassifyShapes(g),
      'area of rectangles': (g) => this.genAreaRectangles(g),
      'data representation': (g) => this.genDataRepresentation(g),

      // ===== GRADE 5 =====
      'operations to 1,000,000': (g) => this.genOperationsMillion(g),
      'multi-digit multiplication': (g) => this.genMultiDigitMult(g),
      'fractions': (g) => this.genFractions(g),
      'algebraic expressions': (g) => this.genAlgebraicExpressions(g),
      'symmetry & shapes': (g) => this.genSymmetry(g),
      'perimeter & area': (g) => this.genPerimeterArea(g),

      // ===== GRADE 6 =====
      'four operations mastery': (g) => this.genFourOperations(g),
      'multiplying fractions': (g) => this.genMultiplyingFractions(g),
      'area & volume': (g) => this.genAreaVolume(g),
      'algebraic equations': (g) => this.genAlgebraicEquations(g),
      'data interpretation': (g) => this.genDataInterpretation(g),

      // ===== GRADE 7 =====
      'integer operations': (g) => this.genIntegerOperations(g),
      'fraction operations': (g) => this.genFractionOperations(g),
      'two-sided equations': (g) => this.genTwoSidedEquations(g),
      'circles & cylinders': (g) => this.genCirclesCylinders(g),
      'functions intro': (g) => this.genFunctionsIntro(g),
      'probability': (g) => this.genProbability(g),

      // ===== GRADE 8 =====
      'rational numbers': (g) => this.genRationalNumbers(g),
      'polynomials intro': (g) => this.genPolynomialsIntro(g),
      'linear equations': (g) => this.genLinearEquations(g),
      'surface area': (g) => this.genSurfaceArea(g),
      'slope of lines': (g) => this.genSlopeOfLines(g),
      'data distributions': (g) => this.genDataDistributions(g),

      // ===== GRADE 9 =====
      'real numbers': (g) => this.genRealNumbers(g),
      'polynomial operations': (g) => this.genPolynomialOperations(g),
      'linear inequalities': (g) => this.genLinearInequalities(g),
      'quadratic equations intro': (g) => this.genQuadraticIntro(g),
      'function notation': (g) => this.genFunctionNotation(g),
      'box plots & statistics': (g) => this.genBoxPlots(g),
      'probability events': (g) => this.genProbabilityEvents(g),

      // ===== GRADE 10-1 =====
      'measurement & conversions': (g) => this.genMeasurementConversions(g),
      'factoring polynomials': (g) => this.genFactoringPolynomials(g),
      'linear relations': (g) => this.genLinearRelations(g),
      'systems of equations': (g) => this.genSystemsOfEquations(g),
      'right triangle trigonometry': (g) => this.genRightTriangleTrig(g),

      // ===== GRADE 20-1 =====
      'absolute value': (g) => this.genAbsoluteValue(g),
      'radicals': (g) => this.genRadicals(g),
      'rational expressions': (g) => this.genRationalExpressions(g),
      'quadratic equations': (g) => this.genQuadraticEquations(g),
      'sequences & series': (g) => this.genSequencesSeries(g),
      'trigonometry - unit circle': (g) => this.genUnitCircleTrig(g),

      // ===== GRADE 30-1 =====
      'function transformations': (g) => this.genFunctionTransformations(g),
      'exponential functions': (g) => this.genExponentialFunctions(g),
      'logarithmic functions': (g) => this.genLogarithmicFunctions(g),
      'polynomial functions': (g) => this.genPolynomialFunctions(g),
      'trigonometric equations': (g) => this.genTrigEquations(g),
      'permutations & combinations': (g) => this.genPermutationsCombinations(g),
    }
  }

  /**
   * Initialize generators by topic keyword
   */
  initializeTopicGenerators() {
    return {
      // Basic operations
      'addition': (g) => this.genAddition(g),
      'subtraction': (g) => this.genSubtraction(g),
      'multiplication': (g) => this.genMultiplication(g),
      'division': (g) => this.genDivision(g),
      'times tables': (g) => this.genMultiplicationFacts(g),

      // Fractions & Decimals
      'fractions': (g) => this.genFractions(g),
      'adding fractions': (g) => this.genFractions(g),
      'multiplying fractions': (g) => this.genMultiplyingFractions(g),
      'dividing fractions': (g) => this.genFractionOperations(g),

      // Integers
      'integers': (g) => this.genIntegerOperations(g),
      'adding integers': (g) => this.genIntegerOperations(g),
      'negative numbers': (g) => this.genIntegerOperations(g),

      // Algebra
      'equations': (g) => this.genLinearEquations(g),
      'solving equations': (g) => this.genLinearEquations(g),
      'variables': (g) => this.genAlgebraicExpressions(g),
      'polynomials': (g) => this.genPolynomialsIntro(g),
      'factoring': (g) => this.genFactoringPolynomials(g),
      'FOIL': (g) => this.genPolynomialOperations(g),

      // Geometry
      'area': (g) => this.genAreaRectangles(g),
      'perimeter': (g) => this.genPerimeterArea(g),
      'volume': (g) => this.genAreaVolume(g),
      'circles': (g) => this.genCirclesCylinders(g),

      // Linear
      'slope': (g) => this.genSlopeOfLines(g),
      'linear functions': (g) => this.genLinearRelations(g),
      'systems': (g) => this.genSystemsOfEquations(g),

      // Trigonometry
      'sine': (g) => this.genRightTriangleTrig(g),
      'cosine': (g) => this.genRightTriangleTrig(g),
      'tangent': (g) => this.genRightTriangleTrig(g),
      'SOH CAH TOA': (g) => this.genRightTriangleTrig(g),
      'trigonometric': (g) => this.genTrigEquations(g),
      'unit circle': (g) => this.genUnitCircleTrig(g),

      // Advanced
      'quadratic': (g) => this.genQuadraticEquations(g),
      'quadratics': (g) => this.genQuadraticEquations(g),
      'radicals': (g) => this.genRadicals(g),
      'absolute value': (g) => this.genAbsoluteValue(g),

      // Sequences
      'sequences': (g) => this.genSequencesSeries(g),
      'arithmetic sequences': (g) => this.genSequencesSeries(g),
      'geometric sequences': (g) => this.genGeometricSequence(g),
      'series': (g) => this.genSequencesSeries(g),

      // Exponential & Log
      'exponential': (g) => this.genExponentialFunctions(g),
      'logarithms': (g) => this.genLogarithmicFunctions(g),
      'log laws': (g) => this.genLogLaws(g),

      // Probability & Stats
      'probability': (g) => this.genProbability(g),
      'theoretical probability': (g) => this.genProbability(g),
      'outcomes': (g) => this.genProbability(g),

      // Permutations & Combinations
      'permutations': (g) => this.genPermutations(g),
      'combinations': (g) => this.genCombinations(g),
      'factorial': (g) => this.genPermutations(g),
      'counting principles': (g) => this.genPermutations(g),
      'binomial': (g) => this.genBinomial(g),
      'binomial theorem': (g) => this.genBinomial(g),
    }
  }

  // ==================== GENERATOR FUNCTIONS ====================

  // Grade 1
  // Grade 1 - 🌈 Easy Math Fun!
  genAddSubTo20(grade) {
    // We pick a random number to decide what kind of problem to make
    // 1 = Simple Addition (5 + 3 = ?)
    // 2 = Simple Subtraction (10 - 4 = ?)
    // 3 = Missing Number (5 + ? = 8)
    // 4 = Word Problem (Apples!)
    // 5 = Comparison (Which is bigger?)
    // 6 = Counting On (Start at 7, count 3 more)
    // 7 = Number Bonds (What adds to 10?)
    // 8 = Doubles (5 + 5 = ?)
    const problemType = Math.floor(Math.random() * 8) + 1

    if (problemType === 1) {
      // ➕ Simple Addition
      const num1 = Math.floor(Math.random() * 10) + 1
      const num2 = Math.floor(Math.random() * 10) + 1
      return this.createProblem(`${num1} + ${num2} = ?`, num1 + num2, 'Addition', grade, true)

    } else if (problemType === 2) {
      // ➖ Simple Subtraction
      const num1 = Math.floor(Math.random() * 10) + 5
      const num2 = Math.floor(Math.random() * 5) + 1
      return this.createProblem(`${num1} - ${num2} = ?`, num1 - num2, 'Subtraction', grade, true)

    } else if (problemType === 3) {
      // ❓ Missing Number
      const total = Math.floor(Math.random() * 10) + 5
      const part = Math.floor(Math.random() * 5) + 1
      const answer = total - part
      return this.createProblem(`${part} + ? = ${total}`, answer, 'Missing Number', grade, true)

    } else if (problemType === 4) {
      // 🍎 Word Problem
      const apples = Math.floor(Math.random() * 5) + 3
      const moreApples = Math.floor(Math.random() * 4) + 1
      const totalApples = apples + moreApples
      const question = `You have ${apples} apples. You get ${moreApples} more. How many apples do you have?`
      return this.createProblem(question, totalApples, 'Word Problem', grade, true)

    } else if (problemType === 5) {
      // 📊 Comparison
      const num1 = Math.floor(Math.random() * 15) + 3
      const num2 = Math.floor(Math.random() * 15) + 3
      const bigger = Math.max(num1, num2)
      return this.createProblem(`Which is bigger: ${num1} or ${num2}?`, bigger, 'Comparison', grade, true, [num1, num2])

    } else if (problemType === 6) {
      // 🔢 Counting On
      const start = Math.floor(Math.random() * 10) + 3
      const countMore = Math.floor(Math.random() * 5) + 1
      return this.createProblem(`Start at ${start}. Count ${countMore} more. What number?`, start + countMore, 'Counting', grade, true)

    } else if (problemType === 7) {
      // 🔗 Number Bonds to 10
      const part = Math.floor(Math.random() * 9) + 1
      return this.createProblem(`${part} + ? = 10`, 10 - part, 'Number Bonds', grade, true)

    } else {
      // 👯 Doubles
      const num = Math.floor(Math.random() * 10) + 1
      return this.createProblem(`${num} + ${num} = ?`, num + num, 'Doubles', grade, true)
    }
  }

  genShapes(grade) {
    // 🔷 Shape Questions
    const questionType = Math.floor(Math.random() * 3) + 1

    if (questionType === 1) {
      const shapes = ['square', 'rectangle', 'triangle']
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      const sides = { 'square': 4, 'rectangle': 4, 'triangle': 3 }
      return this.createProblem(`How many sides does a ${shape} have?`, sides[shape], 'Shapes', grade, true)

    } else if (questionType === 2) {
      const corners = { 'triangle': 3, 'square': 4, 'circle': 0 }
      const shape = ['triangle', 'square', 'circle'][Math.floor(Math.random() * 3)]
      return this.createProblem(`How many corners does a ${shape} have?`, corners[shape], 'Corners', grade, true)

    } else {
      return this.createProblem('Which shape is round?', 'circle', 'Shape ID', grade, false, ['square', 'triangle', 'circle', 'rectangle'])
    }
  }

  genMeasurementBasics(grade) {
    // 📏 Measurement Fun
    const type = Math.floor(Math.random() * 2)

    if (type === 0) {
      // Compare lengths
      const length1 = Math.floor(Math.random() * 10) + 2
      const length2 = Math.floor(Math.random() * 10) + 15
      return this.createProblem(`Which is longer: ${length1}cm or ${length2}cm?`, length2, 'Measuring', grade, true)
    } else {
      // How many hands? (Non-standard units)
      const hands = Math.floor(Math.random() * 5) + 3
      return this.createProblem(`The table is ${hands} hands long. If you use smaller hands, will the number be bigger or smaller?`, 'bigger', 'Measuring', grade, false, ['bigger', 'smaller', 'same'])
    }
  }

  genTimeConcepts(grade) {
    // ⏰ Time Questions
    const type = Math.floor(Math.random() * 3)

    if (type === 0) {
      return this.createProblem('How many months are in one year?', 12, 'Calendar', grade, true)
    } else if (type === 1) {
      return this.createProblem('How many days are in a week?', 7, 'Calendar', grade, true)
    } else {
      return this.createProblem('Which takes longer?', 'sleeping at night', 'Time', grade, false, ['brushing teeth', 'sleeping at night', 'eating a snack'])
    }
  }

  // Grade 2
  genAddSubTo100(grade) {
    const op = Math.random() > 0.5 ? '+' : '-'
    if (op === '+') {
      const a = Math.floor(Math.random() * 50) + 10
      const b = Math.floor(Math.random() * (50 - a % 50)) + 10
      return this.createProblem(`${a} + ${b} = ?`, a + b, 'Addition to 100', grade, true)
    } else {
      const a = Math.floor(Math.random() * 50) + 50
      const b = Math.floor(Math.random() * 40) + 5
      return this.createProblem(`${a} - ${b} = ?`, a - b, 'Subtraction to 100', grade, true)
    }
  }

  genShapeSorting(grade) {
    const sides = Math.floor(Math.random() * 4) + 3
    const shapes = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon' }
    const correct = shapes[sides]

    // 🧠 Generate smart wrong answers instead of "Option 2"
    const distractors = Object.values(shapes).filter(s => s !== correct)

    return this.createProblem(
      `A shape with ${sides} sides is called a...?`,
      correct,
      'Shape Sorting',
      grade,
      true,
      [correct, ...distractors] // We MUST provide options here!
    )
  }

  genMeasuringLength(grade) {
    const cm = Math.floor(Math.random() * 50) + 10
    // For numbers, auto-generation works fine, but let's be explicit for consistency
    const wrong1 = cm + 10
    const wrong2 = Math.floor(cm / 2)
    const wrong3 = cm - 5
    return this.createProblem(
      `A pencil is ${cm} cm long. How many centimeters is that?`,
      cm,
      'Measuring Length',
      grade,
      true,
      [cm, wrong1, wrong2, wrong3]
    )
  }

  genTimeDuration(grade) {
    const weeks = Math.floor(Math.random() * 4) + 1
    const days = weeks * 7
    return this.createProblem(
      `How many days are in ${weeks} week(s)?`,
      days,
      'Time Duration',
      grade,
      true,
      [days, days + 2, days - 1, weeks * 5] // Smart distractors
    )
  }

  genDataGraphing(grade) {
    const a = Math.floor(Math.random() * 10) + 2
    const b = Math.floor(Math.random() * 10) + 2
    return this.createProblem(`A pictograph shows ${a} apples and ${b} oranges. How many fruits in total?`, a + b, 'Data & Graphing', grade, true)
  }

  // Grade 3
  genAddSubTo1000(grade) {
    const a = Math.floor(Math.random() * 500) + 200
    const b = Math.floor(Math.random() * 300) + 100
    return this.createProblem(`${a} + ${b} = ?`, a + b, 'Addition to 1000', grade)
  }

  genMultiplicationFacts(grade) {
    // ═══════════════════════════════════════════════════════════════
    // ✖️ GRADE 3: Multiplication Facts
    // ═══════════════════════════════════════════════════════════════
    const problemType = Math.floor(Math.random() * 5) + 1

    if (problemType === 1) {
      // Basic multiplication
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      return this.createProblem(`${a} × ${b} = ?`, a * b, 'Multiplication Facts', grade, grade <= 4)

    } else if (problemType === 2) {
      // Word problem
      const groups = Math.floor(Math.random() * 6) + 2
      const perGroup = Math.floor(Math.random() * 8) + 2
      return this.createProblem(`There are ${groups} bags with ${perGroup} apples each. How many apples in total?`, groups * perGroup, 'Multiplication Word Problem', grade, true)

    } else if (problemType === 3) {
      // Array/rows and columns
      const rows = Math.floor(Math.random() * 5) + 2
      const cols = Math.floor(Math.random() * 5) + 2
      return this.createProblem(`${rows} rows × ${cols} columns = how many squares?`, rows * cols, 'Arrays', grade, true)

    } else if (problemType === 4) {
      // Related division
      const a = Math.floor(Math.random() * 10) + 2
      const b = Math.floor(Math.random() * 10) + 2
      return this.createProblem(`${a * b} ÷ ${a} = ?`, b, 'Division Facts', grade, true)

    } else {
      // Skip counting
      const by = [2, 5, 10][Math.floor(Math.random() * 3)]
      const times = Math.floor(Math.random() * 8) + 3
      return this.createProblem(`Count by ${by}s: What is the ${times}th number?`, by * times, 'Skip Counting', grade, true)
    }
  }

  genGeometryLines(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 📐 GRADE 3: Parallel & Perpendicular Lines
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 3)

    if (questionType === 0) {
      return this.createProblem(
        'Lines that NEVER meet (even if extended forever) are called...?',
        'parallel',
        'Geometry Lines',
        grade,
        true,
        ['parallel', 'perpendicular', 'intersecting', 'diagonal']
      )
    } else if (questionType === 1) {
      return this.createProblem(
        'Lines that meet at exactly 90° (a right angle) are called...?',
        'perpendicular',
        'Geometry Lines',
        grade,
        true,
        ['perpendicular', 'parallel', 'slanted', 'curved']
      )
    } else {
      return this.createProblem(
        'Two lines that cross each other are called...?',
        'intersecting',
        'Geometry Lines',
        grade,
        true,
        ['intersecting', 'parallel', 'perpendicular', 'adjacent']
      )
    }
  }

  genMetricMeasurement(grade) {
    const meters = Math.floor(Math.random() * 10) + 1
    return this.createProblem(`How many centimeters are in ${meters} meter(s)?`, meters * 100, 'Metric Measurement', grade)
  }

  genTellingTime(grade) {
    const hours = Math.floor(Math.random() * 11) + 1
    const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)]
    return this.createProblem(`What time is it when the hour hand is on ${hours} and minute hand on ${minutes / 5}?`, `${hours}:${minutes.toString().padStart(2, '0')}`, 'Telling Time', grade)
  }

  // Grade 4
  genOperationsTo10000(grade) {
    const a = Math.floor(Math.random() * 5000) + 1000
    const b = Math.floor(Math.random() * 3000) + 500
    return this.createProblem(`${a} + ${b} = ?`, a + b, 'Operations to 10,000', grade)
  }

  genMultDiv(grade) {
    const a = Math.floor(Math.random() * 90) + 10
    const b = Math.floor(Math.random() * 9) + 2
    return this.createProblem(`${a} × ${b} = ?`, a * b, 'Multiplication & Division', grade)
  }

  genClassifyShapes(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 📐 GRADE 4: Classifying Angles & Triangles
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 3)

    if (questionType === 0) {
      // Angle classification
      const angleValues = [30, 45, 60, 85, 90, 100, 120, 150]
      const angle = angleValues[Math.floor(Math.random() * angleValues.length)]
      let correct = angle < 90 ? 'acute' : angle === 90 ? 'right' : 'obtuse'
      return this.createProblem(
        `An angle measuring ${angle}° is classified as...?`,
        correct,
        'Classifying Angles',
        grade,
        true,
        ['acute', 'right', 'obtuse', 'straight']
      )
    } else if (questionType === 1) {
      // Triangle by sides
      const types = [
        { name: 'equilateral', desc: 'all 3 sides are EQUAL' },
        { name: 'isosceles', desc: 'exactly 2 sides are EQUAL' },
        { name: 'scalene', desc: 'NO sides are equal' }
      ]
      const chosen = types[Math.floor(Math.random() * types.length)]
      return this.createProblem(
        `A triangle where ${chosen.desc} is called...?`,
        chosen.name,
        'Classifying Triangles',
        grade,
        true,
        ['equilateral', 'isosceles', 'scalene', 'right']
      )
    } else {
      // Quadrilateral identification
      const quads = [
        { name: 'square', desc: '4 equal sides AND 4 right angles' },
        { name: 'rectangle', desc: 'opposite sides equal AND 4 right angles' },
        { name: 'rhombus', desc: '4 equal sides but angles are NOT 90°' },
        { name: 'trapezoid', desc: 'exactly ONE pair of parallel sides' }
      ]
      const chosen = quads[Math.floor(Math.random() * quads.length)]
      return this.createProblem(
        `A quadrilateral with ${chosen.desc} is called...?`,
        chosen.name,
        'Classifying Quadrilaterals',
        grade,
        true,
        ['square', 'rectangle', 'rhombus', 'trapezoid']
      )
    }
  }

  genAreaRectangles(grade) {
    const l = Math.floor(Math.random() * 12) + 2
    const w = Math.floor(Math.random() * 8) + 2
    return this.createProblem(`Area of rectangle: length=${l}, width=${w}`, l * w, 'Area of Rectangles', grade)
  }

  genDataRepresentation(grade) {
    const values = [Math.floor(Math.random() * 20) + 5, Math.floor(Math.random() * 20) + 5, Math.floor(Math.random() * 20) + 5]
    const total = values.reduce((a, b) => a + b, 0)
    return this.createProblem(`Bar graph shows: ${values[0]}, ${values[1]}, ${values[2]}. Total?`, total, 'Data Representation', grade)
  }

  // Grade 5
  genOperationsMillion(grade) {
    const a = Math.floor(Math.random() * 50000) + 10000
    const b = Math.floor(Math.random() * 30000) + 5000
    return this.createProblem(`${a.toLocaleString()} + ${b.toLocaleString()} = ?`, a + b, 'Large Number Operations', grade)
  }

  genMultiDigitMult(grade) {
    const a = Math.floor(Math.random() * 90) + 10
    const b = Math.floor(Math.random() * 90) + 10
    return this.createProblem(`${a} × ${b} = ?`, a * b, 'Multi-digit Multiplication', grade)
  }

  genFractions(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 🍕 GRADE 5: Fractions  
    // ═══════════════════════════════════════════════════════════════
    const problemType = Math.floor(Math.random() * 6) + 1

    if (problemType === 1) {
      // Adding fractions with same denominator
      const denom = [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)]
      const n1 = Math.floor(Math.random() * (denom - 1)) + 1
      const n2 = Math.floor(Math.random() * (denom - n1)) + 1
      return this.createProblem(`${n1}/${denom} + ${n2}/${denom} = ?`, `${n1 + n2}/${denom}`, 'Adding Fractions', grade)

    } else if (problemType === 2) {
      // Comparing fractions
      const denom = [4, 6, 8][Math.floor(Math.random() * 3)]
      const n1 = Math.floor(Math.random() * (denom - 1)) + 1
      const n2 = Math.floor(Math.random() * (denom - 1)) + 1
      const bigger = n1 > n2 ? `${n1}/${denom}` : `${n2}/${denom}`
      return this.createProblem(`Which is bigger: ${n1}/${denom} or ${n2}/${denom}?`, bigger, 'Comparing Fractions', grade, true, [`${n1}/${denom}`, `${n2}/${denom}`])

    } else if (problemType === 3) {
      // Equivalent fractions
      const baseDenom = [2, 3, 4][Math.floor(Math.random() * 3)]
      const baseNum = Math.floor(Math.random() * (baseDenom - 1)) + 1
      const multiplier = Math.floor(Math.random() * 3) + 2
      return this.createProblem(`${baseNum}/${baseDenom} = ?/${baseDenom * multiplier}`, baseNum * multiplier, 'Equivalent Fractions', grade, true)

    } else if (problemType === 4) {
      // Fraction of a whole number
      const whole = [12, 15, 20, 24, 30][Math.floor(Math.random() * 5)]
      const denom = [2, 3, 4, 5][Math.floor(Math.random() * 4)]
      return this.createProblem(`What is 1/${denom} of ${whole}?`, whole / denom, 'Fraction of Whole', grade, true)

    } else if (problemType === 5) {
      // Subtracting fractions
      const denom = [4, 5, 6, 8][Math.floor(Math.random() * 4)]
      const n1 = Math.floor(Math.random() * 3) + Math.floor(denom / 2)
      const n2 = Math.floor(Math.random() * Math.floor(denom / 2)) + 1
      return this.createProblem(`${n1}/${denom} - ${n2}/${denom} = ?`, `${n1 - n2}/${denom}`, 'Subtracting Fractions', grade)

    } else {
      // Word problem
      const pizza = Math.floor(Math.random() * 6) + 2
      const ate = Math.floor(Math.random() * (pizza - 1)) + 1
      return this.createProblem(`A pizza is cut into ${pizza} slices. You eat ${ate} slices. What fraction did you eat?`, `${ate}/${pizza}`, 'Fraction Word Problem', grade)
    }
  }

  genAlgebraicExpressions(grade) {
    const a = Math.floor(Math.random() * 5) + 2
    const x = Math.floor(Math.random() * 10) + 1
    return this.createProblem(`If x = ${x}, what is ${a}x?`, a * x, 'Algebraic Expressions', grade)
  }

  genSymmetry(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 🧊 GRADE 5: Lines of Symmetry
    // ═══════════════════════════════════════════════════════════════
    const shapes = [
      { name: 'square', lines: 4 },
      { name: 'rectangle', lines: 2 },
      { name: 'equilateral triangle', lines: 3 },
      { name: 'isosceles triangle', lines: 1 },
      { name: 'regular hexagon', lines: 6 },
      { name: 'regular pentagon', lines: 5 }
    ]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    const correct = shape.lines

    // Generate wrong answers that are close to correct
    const distractors = [correct, correct + 1, correct - 1, correct + 2].filter(n => n >= 0)

    return this.createProblem(
      `How many lines of symmetry does a ${shape.name} have?`,
      correct,
      'Symmetry',
      grade,
      true,
      [...new Set(distractors)].slice(0, 4) // Unique values only
    )
  }

  genPerimeterArea(grade) {
    const l = Math.floor(Math.random() * 10) + 3
    const w = Math.floor(Math.random() * 8) + 2
    return this.createProblem(`Perimeter of rectangle: length=${l}, width=${w}`, 2 * (l + w), 'Perimeter & Area', grade)
  }

  genFourOperations(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 🧠 GRADE 6: Order of Operations (BEDMAS/PEMDAS)
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 3)

    if (questionType === 0) {
      // Basic BEDMAS: addition and multiplication
      const a = Math.floor(Math.random() * 10) + 2
      const b = Math.floor(Math.random() * 6) + 2
      const c = Math.floor(Math.random() * 6) + 2
      const answer = a + (b * c)
      return this.createProblem(`${a} + ${b} × ${c} = ?`, answer, 'BEDMAS', grade, true)
    } else if (questionType === 1) {
      // With brackets
      const a = Math.floor(Math.random() * 5) + 2
      const b = Math.floor(Math.random() * 5) + 2
      const c = Math.floor(Math.random() * 4) + 2
      const answer = (a + b) * c
      return this.createProblem(`(${a} + ${b}) × ${c} = ?`, answer, 'BEDMAS', grade, true)
    } else {
      // Division and subtraction
      const a = Math.floor(Math.random() * 30) + 20
      const b = Math.floor(Math.random() * 8) + 2
      const c = Math.floor(Math.random() * 4) + 2
      const answer = a - Math.floor(b / c) * c
      const divisor = c
      const dividend = divisor * (Math.floor(Math.random() * 5) + 2)
      const answer2 = a - (dividend / divisor)
      return this.createProblem(`${a} - ${dividend} ÷ ${divisor} = ?`, answer2, 'BEDMAS', grade, true)
    }
  }

  genMultiplyingFractions(grade) {
    const n = Math.floor(Math.random() * 5) + 1
    const d = Math.floor(Math.random() * 4) + 2
    const w = Math.floor(Math.random() * 5) + 2
    return this.createProblem(`${n}/${d} × ${w} = ?`, `${n * w}/${d}`, 'Multiplying Fractions', grade)
  }

  genAreaVolume(grade) {
    const l = Math.floor(Math.random() * 6) + 2
    const w = Math.floor(Math.random() * 5) + 2
    const h = Math.floor(Math.random() * 4) + 2
    return this.createProblem(`Volume: length=${l}, width=${w}, height=${h}`, l * w * h, 'Volume', grade)
  }

  genAlgebraicEquations(grade) {
    const x = Math.floor(Math.random() * 10) + 1
    const a = Math.floor(Math.random() * 5) + 2
    return this.createProblem(`Solve: ${a}x = ${a * x}`, x, 'Algebraic Equations', grade)
  }

  genDataInterpretation(grade) {
    const values = [10, 15, 20, 25, 30]
    const avg = 20
    return this.createProblem(`Mean of: 10, 15, 20, 25, 30 = ?`, avg, 'Mean (Average)', grade)
  }

  // Grade 7
  genIntegerOperations(grade) {
    const a = Math.floor(Math.random() * 20) - 10
    const b = Math.floor(Math.random() * 20) - 10
    const ops = ['+', '-', '×']
    const op = ops[Math.floor(Math.random() * ops.length)]
    let ans
    if (op === '+') ans = a + b
    else if (op === '-') ans = a - b
    else ans = a * b
    return this.createProblem(`(${a}) ${op} (${b}) = ?`, ans, 'Integer Operations', grade)
  }

  genFractionOperations(grade) {
    const n1 = Math.floor(Math.random() * 3) + 1
    const n2 = Math.floor(Math.random() * 3) + 1
    return this.createProblem(`${n1}/2 × ${n2}/3 = ?`, `${n1 * n2}/6`, 'Fraction Operations', grade)
  }

  genTwoSidedEquations(grade) {
    const x = Math.floor(Math.random() * 10) + 1
    const a = Math.floor(Math.random() * 3) + 2
    const b = Math.floor(Math.random() * 10) + 1
    return this.createProblem(`Solve: ${a}x + ${b} = ${a * x + b}`, x, 'Two-sided Equations', grade)
  }

  genCirclesCylinders(grade) {
    const r = Math.floor(Math.random() * 5) + 2
    return this.createProblem(`Circumference of circle with radius ${r}? (Use π=3.14, round to 1 decimal)`, Math.round(2 * 3.14 * r * 10) / 10, 'Circles', grade)
  }

  genFunctionsIntro(grade) {
    const x = Math.floor(Math.random() * 5) + 1
    const m = Math.floor(Math.random() * 3) + 2
    const b = Math.floor(Math.random() * 5)
    return this.createProblem(`If f(x) = ${m}x + ${b}, find f(${x})`, m * x + b, 'Functions', grade)
  }

  genProbability(grade) {
    const total = Math.floor(Math.random() * 8) + 4
    const favorable = Math.floor(Math.random() * (total - 1)) + 1
    return this.createProblem(`P(red) if ${favorable} red out of ${total} total? Answer as fraction.`, `${favorable}/${total}`, 'Probability', grade)
  }

  // Grade 8
  genRationalNumbers(grade) {
    const a = (Math.floor(Math.random() * 10) + 1) / 2
    const b = (Math.floor(Math.random() * 10) + 1) / 2
    return this.createProblem(`${a} + ${b} = ?`, a + b, 'Rational Numbers', grade)
  }

  genPolynomialsIntro(grade) {
    const a = Math.floor(Math.random() * 5) + 1
    const b = Math.floor(Math.random() * 5) + 1
    return this.createProblem(`Simplify: ${a}x + ${b}x = ?`, `${a + b}x`, 'Polynomials', grade)
  }

  genLinearEquations(grade) {
    const x = Math.floor(Math.random() * 10) - 5
    const a = Math.floor(Math.random() * 5) + 2
    const b = Math.floor(Math.random() * 10) - 5
    return this.createProblem(`Solve: ${a}x + ${b} = ${a * x + b}`, x, 'Linear Equations', grade)
  }

  genSurfaceArea(grade) {
    const l = Math.floor(Math.random() * 5) + 2
    const w = Math.floor(Math.random() * 4) + 2
    const h = Math.floor(Math.random() * 3) + 2
    const sa = 2 * (l * w + w * h + l * h)
    return this.createProblem(`Surface area of box: ${l}×${w}×${h}`, sa, 'Surface Area', grade)
  }

  genSlopeOfLines(grade) {
    const m = Math.floor(Math.random() * 10) - 5
    const b = Math.floor(Math.random() * 10) - 5
    return this.createProblem(`Slope of y = ${m}x ${b >= 0 ? '+' : ''}${b}?`, m, 'Slope', grade)
  }

  genDataDistributions(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 📊 GRADE 8: Histograms and Data Analysis
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 3)

    if (questionType === 0) {
      return this.createProblem(
        'In a histogram, the HEIGHT of each bar represents...?',
        'frequency',
        'Histograms',
        grade,
        true,
        ['frequency', 'mean', 'range', 'mode']
      )
    } else if (questionType === 1) {
      return this.createProblem(
        'Which graph is best for showing continuous data (like heights)?',
        'histogram',
        'Data Representation',
        grade,
        true,
        ['histogram', 'pie chart', 'pictograph', 'bar graph']
      )
    } else {
      return this.createProblem(
        'The SHAPE of a distribution can be described as...?',
        'skewed or symmetric',
        'Distribution Shape',
        grade,
        true,
        ['skewed or symmetric', 'tall or short', 'wide or narrow', 'positive or negative']
      )
    }
  }

  // Grade 9
  genRealNumbers(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 🔢 GRADE 9: Rational vs Irrational Numbers
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 3)

    if (questionType === 0) {
      // Perfect squares are rational
      const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100]
      const num = perfectSquares[Math.floor(Math.random() * perfectSquares.length)]
      return this.createProblem(
        `Is √${num} a rational or irrational number?`,
        'rational',
        'Real Numbers',
        grade,
        true,
        ['rational', 'irrational', 'integer', 'whole number']
      )
    } else if (questionType === 1) {
      // Non-perfect squares are irrational
      const nonPerfect = [2, 3, 5, 7, 10, 11, 13, 17, 19, 23]
      const num = nonPerfect[Math.floor(Math.random() * nonPerfect.length)]
      return this.createProblem(
        `Is √${num} a rational or irrational number?`,
        'irrational',
        'Real Numbers',
        grade,
        true,
        ['irrational', 'rational', 'integer', 'natural number']
      )
    } else {
      // Estimation
      const num = Math.floor(Math.random() * 20) + 30 // 30-49 (not perfect)
      const lower = Math.floor(Math.sqrt(num))
      const upper = lower + 1
      return this.createProblem(
        `√${num} is between which two consecutive integers?`,
        `${lower} and ${upper}`,
        'Estimating Roots',
        grade,
        true,
        [`${lower} and ${upper}`, `${lower - 1} and ${lower}`, `${upper} and ${upper + 1}`, `${lower} and ${upper + 1}`]
      )
    }
  }

  genPolynomialOperations(grade) {
    const a = Math.floor(Math.random() * 4) + 1
    const b = Math.floor(Math.random() * 4) + 1
    return this.createProblem(`Expand: (x+${a})(x+${b}). Coefficient of x?`, a + b, 'Polynomial Operations (FOIL)', grade)
  }

  genLinearInequalities(grade) {
    const a = Math.floor(Math.random() * 4) + 2
    const b = Math.floor(Math.random() * 20) + 5
    const maxX = Math.floor(b / a) - (b % a === 0 ? 1 : 0)
    return this.createProblem(`Largest integer x where ${a}x < ${b}?`, maxX, 'Linear Inequalities', grade)
  }

  genQuadraticIntro(grade) {
    const r = Math.floor(Math.random() * 6) + 1
    return this.createProblem(`Solve: x² - ${r * 2}x + ${r * r} = 0`, r, 'Quadratic Equations Intro', grade)
  }

  genFunctionNotation(grade) {
    const m = Math.floor(Math.random() * 4) + 2
    const b = Math.floor(Math.random() * 5)
    const x = Math.floor(Math.random() * 5) + 1
    return this.createProblem(`f(x) = ${m}x + ${b}. Find f(${x}).`, m * x + b, 'Function Notation', grade)
  }

  genBoxPlots(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 📦 GRADE 9: Box Plots (5-Number Summary)
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 4)

    if (questionType === 0) {
      return this.createProblem(
        'In a box plot, the LINE inside the box represents...?',
        'median',
        'Box Plots',
        grade,
        true,
        ['median', 'mean', 'mode', 'range']
      )
    } else if (questionType === 1) {
      return this.createProblem(
        'The LEFT edge of the box in a box plot represents...?',
        'Q1 (first quartile)',
        'Box Plots',
        grade,
        true,
        ['Q1 (first quartile)', 'minimum', 'median', 'Q3 (third quartile)']
      )
    } else if (questionType === 2) {
      return this.createProblem(
        'The WHISKERS on a box plot extend to...?',
        'minimum and maximum',
        'Box Plots',
        grade,
        true,
        ['minimum and maximum', 'Q1 and Q3', 'mean and median', 'outliers only']
      )
    } else {
      return this.createProblem(
        'The Interquartile Range (IQR) is calculated as...?',
        'Q3 - Q1',
        'Box Plots',
        grade,
        true,
        ['Q3 - Q1', 'Max - Min', 'Mean - Median', 'Q2 - Q1']
      )
    }
  }

  genProbabilityEvents(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 🎲 GRADE 9: Compound Probability
    // ═══════════════════════════════════════════════════════════════
    const p1 = (Math.floor(Math.random() * 4) + 1) / 10  // 0.1 to 0.4
    const p2 = (Math.floor(Math.random() * 4) + 1) / 10  // 0.1 to 0.4
    const sumP = Math.round((p1 + p2) * 10) / 10

    const questionType = Math.floor(Math.random() * 2)

    if (questionType === 0) {
      return this.createProblem(
        `P(A) = ${p1}, P(B) = ${p2}. If A and B are MUTUALLY EXCLUSIVE, P(A or B) = ?`,
        sumP,
        'Probability Events',
        grade,
        true
      )
    } else {
      return this.createProblem(
        'Two events that CANNOT happen at the same time are called...?',
        'mutually exclusive',
        'Probability Events',
        grade,
        true,
        ['mutually exclusive', 'independent', 'dependent', 'complementary']
      )
    }
  }

  // Grade 10-1
  genMeasurementConversions(grade) {
    // ═══════════════════════════════════════════════════════════════
    // 📏 MATH 10-1: Metric and Imperial Conversions
    // ═══════════════════════════════════════════════════════════════
    const questionType = Math.floor(Math.random() * 4)

    if (questionType === 0) {
      // Feet to inches
      const feet = Math.floor(Math.random() * 10) + 1
      return this.createProblem(`${feet} feet = ? inches`, feet * 12, 'Unit Conversions', grade, true)
    } else if (questionType === 1) {
      // Meters to centimeters
      const meters = Math.floor(Math.random() * 5) + 1
      return this.createProblem(`${meters} meters = ? centimeters`, meters * 100, 'Unit Conversions', grade, true)
    } else if (questionType === 2) {
      // Kilometers to meters
      const km = Math.floor(Math.random() * 5) + 1
      return this.createProblem(`${km} kilometers = ? meters`, km * 1000, 'Unit Conversions', grade, true)
    } else {
      // Approximate: inches to cm (1 inch ≈ 2.54 cm)
      const inches = Math.floor(Math.random() * 10) + 5
      const answer = Math.round(inches * 2.54 * 10) / 10
      return this.createProblem(`${inches} inches ≈ ? cm (use 1 inch = 2.54 cm)`, answer, 'Unit Conversions', grade, true)
    }
  }

  genFactoringPolynomials(grade) {
    const a = Math.floor(Math.random() * 5) + 1
    const b = Math.floor(Math.random() * 5) + 1
    return this.createProblem(`Factor x² + ${a + b}x + ${a * b}. The factors are (x+?)(x+?)`, `${a}, ${b}`, 'Factoring Polynomials', grade)
  }

  genLinearRelations(grade) {
    const m = Math.floor(Math.random() * 6) - 3
    const b = Math.floor(Math.random() * 10) - 5
    return this.createProblem(`y-intercept of y = ${m}x ${b >= 0 ? '+' : ''}${b}?`, b, 'Linear Relations', grade)
  }

  genSystemsOfEquations(grade) {
    const x = Math.floor(Math.random() * 5) + 1
    const y = Math.floor(Math.random() * 5) + 1
    return this.createProblem(`x + y = ${x + y}, x - y = ${x - y}. Find x.`, x, 'Systems of Equations', grade)
  }

  genRightTriangleTrig(grade) {
    const angles = [30, 45, 60]
    const funcs = ['sin', 'cos', 'tan']
    const angle = angles[Math.floor(Math.random() * angles.length)]
    const func = funcs[Math.floor(Math.random() * funcs.length)]
    const values = {
      'sin30': 0.5, 'sin45': 0.71, 'sin60': 0.87,
      'cos30': 0.87, 'cos45': 0.71, 'cos60': 0.5,
      'tan30': 0.58, 'tan45': 1, 'tan60': 1.73
    }
    return this.createProblem(`${func}(${angle}°) = ? (2 decimals)`, values[`${func}${angle}`], 'Trigonometry', grade)
  }

  // Grade 20-1
  genAbsoluteValue(grade) {
    const a = Math.floor(Math.random() * 30) - 15
    return this.createProblem(`|${a}| = ?`, Math.abs(a), 'Absolute Value', grade)
  }

  genRadicals(grade) {
    const perfect = [4, 9, 16, 25, 36, 49, 64, 81, 100][Math.floor(Math.random() * 9)]
    return this.createProblem(`√${perfect} = ?`, Math.sqrt(perfect), 'Radicals', grade)
  }

  genRationalExpressions(grade) {
    const a = Math.floor(Math.random() * 5) + 2
    return this.createProblem(`Simplify: ${a}x/${a} = ?`, 'x', 'Rational Expressions', grade)
  }

  genQuadraticEquations(grade) {
    const r1 = Math.floor(Math.random() * 6) - 3
    const r2 = Math.floor(Math.random() * 6) - 3
    const b = -(r1 + r2)
    const c = r1 * r2
    return this.createProblem(`x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0. Find one root.`, r1, 'Quadratic Equations', grade)
  }

  genSequencesSeries(grade) {
    const a1 = Math.floor(Math.random() * 5) + 1
    const d = Math.floor(Math.random() * 4) + 1
    const n = Math.floor(Math.random() * 5) + 5
    return this.createProblem(`Arithmetic: ${a1}, ${a1 + d}, ${a1 + 2 * d}... Term ${n}?`, a1 + (n - 1) * d, 'Sequences', grade)
  }

  genGeometricSequence(grade) {
    const a1 = Math.floor(Math.random() * 3) + 1
    const r = 2
    const n = Math.floor(Math.random() * 3) + 3
    return this.createProblem(`Geometric: ${a1}, ${a1 * r}, ${a1 * r * r}... Term ${n}?`, a1 * Math.pow(r, n - 1), 'Geometric Sequences', grade)
  }

  genUnitCircleTrig(grade) {
    const angles = [0, 30, 45, 60, 90, 180, 270]
    const angle = angles[Math.floor(Math.random() * angles.length)]
    const sinVals = { 0: 0, 30: 0.5, 45: 0.71, 60: 0.87, 90: 1, 180: 0, 270: -1 }
    return this.createProblem(`sin(${angle}°) = ?`, sinVals[angle], 'Unit Circle', grade)
  }

  // Grade 30-1
  genFunctionTransformations(grade) {
    const h = Math.floor(Math.random() * 5) + 1
    const k = Math.floor(Math.random() * 5) + 1
    return this.createProblem(`f(x) = x². Vertex of f(x-${h}) + ${k}?`, `(${h}, ${k})`, 'Function Transformations', grade)
  }

  genExponentialFunctions(grade) {
    const base = [2, 3, 5][Math.floor(Math.random() * 3)]
    const exp = Math.floor(Math.random() * 4) + 2
    return this.createProblem(`${base}^${exp} = ?`, Math.pow(base, exp), 'Exponential Functions', grade)
  }

  genLogarithmicFunctions(grade) {
    const base = [2, 10][Math.floor(Math.random() * 2)]
    const exp = Math.floor(Math.random() * 4) + 1
    const value = Math.pow(base, exp)
    const q = base === 10 ? `log(${value})` : `log₂(${value})`
    return this.createProblem(`${q} = ?`, exp, 'Logarithmic Functions', grade)
  }

  genLogLaws(grade) {
    const a = Math.floor(Math.random() * 5) + 2
    const b = Math.floor(Math.random() * 5) + 2
    return this.createProblem(`log(${a}) + log(${b}) = log(?)`, a * b, 'Log Laws', grade)
  }

  genPolynomialFunctions(grade) {
    const a = Math.floor(Math.random() * 3) + 1
    return this.createProblem(`Degree of x³ + ${a}x² - x + 5?`, 3, 'Polynomial Functions', grade)
  }

  genTrigEquations(grade) {
    return this.createProblem(`Solve: sin(x) = 0.5 for 0° ≤ x ≤ 90°`, 30, 'Trigonometric Equations', grade)
  }

  genPermutationsCombinations(grade) {
    const choice = Math.random() > 0.5 ? 'perm' : 'comb'
    if (choice === 'perm') {
      return this.genPermutations(grade)
    } else {
      return this.genCombinations(grade)
    }
  }

  genPermutations(grade) {
    const n = Math.floor(Math.random() * 3) + 4
    const r = Math.floor(Math.random() * 2) + 2
    const factorial = (x) => x <= 1 ? 1 : x * factorial(x - 1)
    const ans = factorial(n) / factorial(n - r)
    return this.createProblem(`P(${n},${r}) = Arrange ${r} from ${n} items?`, ans, 'Permutations', grade)
  }

  genCombinations(grade) {
    const n = Math.floor(Math.random() * 4) + 4
    const r = Math.floor(Math.random() * 2) + 2
    const factorial = (x) => x <= 1 ? 1 : x * factorial(x - 1)
    const ans = factorial(n) / (factorial(r) * factorial(n - r))
    return this.createProblem(`C(${n},${r}) = Choose ${r} from ${n} items?`, ans, 'Combinations', grade)
  }

  genBinomial(grade) {
    const n = Math.floor(Math.random() * 3) + 3
    const factorial = (x) => x <= 1 ? 1 : x * factorial(x - 1)
    const coeff = factorial(n) / (factorial(2) * factorial(n - 2))
    return this.createProblem(`(x+1)^${n}: coefficient of x²?`, coeff, 'Binomial Theorem', grade)
  }

  // Fallback generators
  genAddition(grade) {
    const max = grade <= 2 ? 20 : grade <= 4 ? 100 : 1000
    const a = Math.floor(Math.random() * max) + 1
    const b = Math.floor(Math.random() * (max - a)) + 1
    return this.createProblem(`${a} + ${b} = ?`, a + b, 'Addition', grade, grade <= 3)
  }

  genSubtraction(grade) {
    const max = grade <= 2 ? 20 : grade <= 4 ? 100 : 1000
    const a = Math.floor(Math.random() * max) + Math.floor(max / 2)
    const b = Math.floor(Math.random() * Math.floor(max / 2)) + 1
    return this.createProblem(`${a} - ${b} = ?`, a - b, 'Subtraction', grade, grade <= 3)
  }

  genMultiplication(grade) {
    const max = grade <= 4 ? 10 : 12
    const a = Math.floor(Math.random() * max) + 1
    const b = Math.floor(Math.random() * max) + 1
    return this.createProblem(`${a} × ${b} = ?`, a * b, 'Multiplication', grade, grade <= 4)
  }

  genDivision(grade) {
    const max = 12
    const b = Math.floor(Math.random() * max) + 1
    const ans = Math.floor(Math.random() * max) + 1
    return this.createProblem(`${b * ans} ÷ ${b} = ?`, ans, 'Division', grade, grade <= 4)
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 🏗️ HELPER: Create a problem object
  // ══════════════════════════════════════════════════════════════════════════
  // Parameters:
  //   question       = The question text
  //   answer         = The correct answer
  //   topic          = The topic name (for display)
  //   grade          = The grade level
  //   multipleChoice = true/false for multiple choice
  //   customOptions  = (OPTIONAL) Array of custom options (INCLUDING the correct answer)
  //
  // If customOptions is provided, those will be used instead of auto-generating distractors.
  // This fixes the "Option 2" bug for text-based questions!

  createProblem(question, answer, topic, grade, multipleChoice = false, customOptions = null) {
    const problem = {
      question,
      answer,
      topic,
      difficulty: grade,
      type: multipleChoice ? 'multiple-choice' : 'fill-in-blank'
    }

    if (multipleChoice) {
      // If custom options were provided, use them!
      if (customOptions && Array.isArray(customOptions) && customOptions.length >= 2) {
        problem.options = this.formatCustomOptions(customOptions, answer)
      } else {
        // Otherwise, auto-generate distractors (works best for numbers)
        problem.options = this.generateMultipleChoiceOptions(answer, 4)
      }
    }

    return problem
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 🎯 HELPER: Format custom options into the expected structure
  // ══════════════════════════════════════════════════════════════════════════
  formatCustomOptions(options, correctAnswer) {
    // Shuffle the options so the correct answer isn't always first
    const shuffled = [...options]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Take only the first 4 options (in case more were provided)
    const finalOptions = shuffled.slice(0, 4)

    // Format into the expected structure with labels A, B, C, D
    return finalOptions.map((opt, index) => ({
      label: String.fromCharCode(65 + index), // A, B, C, D
      value: opt
    }))
  }

  /**
   * Generate multiple choice options
   */
  generateMultipleChoiceOptions(correctAnswer, numOptions = 4) {
    const options = [correctAnswer]
    const used = new Set([String(correctAnswer)])

    while (options.length < numOptions) {
      let distractor
      if (typeof correctAnswer === 'number') {
        const variance = Math.max(3, Math.abs(correctAnswer) * 0.3)
        distractor = Math.round(correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * variance + 1))
        if (correctAnswer >= 0 && distractor < 0) distractor = Math.abs(distractor)
      } else {
        distractor = `Option ${options.length + 1}`
      }

      if (!used.has(String(distractor))) {
        options.push(distractor)
        used.add(String(distractor))
      }
    }

    // Shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]
    }

    return options.map((opt, index) => ({
      label: String.fromCharCode(65 + index),
      value: opt
    }))
  }

  /**
   * Generate a problem based on grade and topic
   */
  generateProblem(grade, topic) {
    console.log(`=== ProblemGenerator ===`)
    console.log(`Grade: ${grade}, Topic: "${topic}"`)

    // First try to match by topic keyword
    const topicLower = topic.toLowerCase().trim()

    // Check topic generators first
    if (this.topicGenerators[topicLower]) {
      console.log(`Found topic generator for: ${topicLower}`)
      return this.topicGenerators[topicLower](grade)
    }

    // Check for partial matches in topic generators
    for (const key of Object.keys(this.topicGenerators)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        console.log(`Found partial topic match: ${key}`)
        return this.topicGenerators[key](grade)
      }
    }

    // Fallback based on grade level
    console.log(`No match found, using grade-based fallback for grade ${grade}`)
    if (grade >= 20) {
      return this.genLogarithmicFunctions(grade)
    } else if (grade >= 10) {
      return this.genFactoringPolynomials(grade)
    } else if (grade >= 7) {
      return this.genLinearEquations(grade)
    } else if (grade >= 4) {
      return this.genMultiplication(grade)
    } else {
      return this.genAddition(grade)
    }
  }

  /**
   * Generate problem by unit name (primary method)
   */
  generateProblemByUnit(grade, unitName) {
    console.log(`=== ProblemGenerator (by Unit) ===`)
    console.log(`Grade: ${grade}, Unit: "${unitName}"`)

    const unitLower = unitName.toLowerCase().trim()

    // Check unit generators
    if (this.unitGenerators[unitLower]) {
      console.log(`Found unit generator for: ${unitLower}`)
      return this.unitGenerators[unitLower](grade)
    }

    // Check for partial matches
    for (const key of Object.keys(this.unitGenerators)) {
      if (unitLower.includes(key) || key.includes(unitLower)) {
        console.log(`Found partial unit match: ${key}`)
        return this.unitGenerators[key](grade)
      }
    }

    console.log(`No unit match, falling back to topic search`)
    return this.generateProblem(grade, unitName)
  }

  /**
   * Validate an answer
   */
  validateAnswer(problem, answer) {
    return AnswerValidator.validate(problem, answer)
  }
}

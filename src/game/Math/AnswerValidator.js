/**
 * Answer Validator
 * Validates answers to math problems with tolerance for floating point errors
 */
export class AnswerValidator {
  /**
   * Validate an answer
   * @param {Object} problem - Problem object
   * @param {string|number} userAnswer - User's answer
   * @returns {boolean} True if answer is correct
   */
  static validate(problem, userAnswer) {
    const correctAnswer = problem.answer
    
    // Handle null/undefined answers
    if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
      return false
    }

    // For multiple choice, the user answer is the actual value they clicked
    if (problem.type === 'multiple-choice') {
      return this.compareAnswers(correctAnswer, userAnswer)
    }

    // For fill-in-blank, parse and compare
    return this.compareAnswers(correctAnswer, userAnswer)
  }

  /**
   * Compare two answers with tolerance for numbers
   * @param {any} correct - Correct answer
   * @param {any} user - User's answer
   * @returns {boolean} True if they match
   */
  static compareAnswers(correct, user) {
    const correctNum = this.parseToNumber(correct)
    const userNum = this.parseToNumber(user)

    // If both can be parsed as numbers, compare numerically
    if (correctNum !== null && userNum !== null) {
      const tolerance = 0.01
      return Math.abs(userNum - correctNum) < tolerance
    }

    // Otherwise, compare as strings (case-insensitive)
    const correctStr = String(correct).toLowerCase().trim()
    const userStr = String(user).toLowerCase().trim()
    
    // Handle fraction comparison
    if (correctStr.includes('/') || userStr.includes('/')) {
      return this.compareFractions(correctStr, userStr)
    }
    
    return correctStr === userStr
  }

  /**
   * Parse a value to a number, returning null if not possible
   * @param {any} value - Value to parse
   * @returns {number|null}
   */
  static parseToNumber(value) {
    if (typeof value === 'number' && !isNaN(value)) {
      return value
    }
    
    if (typeof value === 'string') {
      // Handle fractions like "3/4"
      if (value.includes('/')) {
        const parts = value.split('/')
        if (parts.length === 2) {
          const num = parseFloat(parts[0].trim())
          const denom = parseFloat(parts[1].trim())
          if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
            return num / denom
          }
        }
      }
      
      const num = parseFloat(value)
      if (!isNaN(num)) {
        return num
      }
    }
    
    return null
  }

  /**
   * Compare two fractions
   * @param {string} a - First fraction
   * @param {string} b - Second fraction
   * @returns {boolean} True if equivalent
   */
  static compareFractions(a, b) {
    const aNum = this.parseToNumber(a)
    const bNum = this.parseToNumber(b)
    
    if (aNum !== null && bNum !== null) {
      return Math.abs(aNum - bNum) < 0.01
    }
    
    // Direct string comparison as fallback
    return a === b
  }

  /**
   * Check if answer format is valid
   * @param {string|number} answer - User's answer
   * @param {string} problemType - Type of problem
   * @returns {boolean} True if format is valid
   */
  static isValidFormat(answer, problemType) {
    if (answer === null || answer === undefined || answer === '') {
      return false
    }
    
    if (problemType === 'multiple-choice') {
      // Multiple choice can be a letter, number, or the actual value
      return true // Accept any answer for multiple choice
    } else if (problemType === 'fill-in-blank') {
      // Fill in blank should be a number or fraction
      const str = String(answer).trim()
      if (str.includes('/')) {
        const parts = str.split('/')
        return parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))
      }
      return !isNaN(parseFloat(str))
    }
    return true
  }
}

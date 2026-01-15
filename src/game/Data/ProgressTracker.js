/**
 * Progress Tracker
 * Tracks player progress through grades, units, and problems
 */
export class ProgressTracker {
  constructor() {
    this.completedGrades = new Set()
    this.completedUnits = new Map() // grade -> Set of unit names
    this.completedProblems = new Map() // grade -> Set of problem IDs
    this.stats = {
      totalProblemsSolved: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalBattlesWon: 0,
      totalBattlesLost: 0,
      totalTimePlayed: 0,
      accuracy: 0
    }
  }

  /**
   * Mark a grade as completed
   * @param {number} grade - Grade number
   */
  completeGrade(grade) {
    this.completedGrades.add(grade)
    this.save()
  }

  /**
   * Mark a unit as completed
   * @param {number} grade - Grade number
   * @param {string} unitName - Unit name
   */
  completeUnit(grade, unitName) {
    if (!this.completedUnits.has(grade)) {
      this.completedUnits.set(grade, new Set())
    }
    this.completedUnits.get(grade).add(unitName)
    this.save()
  }

  /**
   * Mark a problem as completed
   * @param {number} grade - Grade number
   * @param {string} problemId - Problem ID
   * @param {boolean} correct - Whether answer was correct
   */
  completeProblem(grade, problemId, correct) {
    if (!this.completedProblems.has(grade)) {
      this.completedProblems.set(grade, new Set())
    }
    this.completedProblems.get(grade).add(problemId)
    
    // Update stats
    this.stats.totalProblemsSolved++
    if (correct) {
      this.stats.correctAnswers++
    } else {
      this.stats.incorrectAnswers++
    }
    this.stats.accuracy = this.stats.correctAnswers / this.stats.totalProblemsSolved
    
    this.save()
  }

  /**
   * Record a battle result
   * @param {boolean} won - Whether battle was won
   */
  recordBattle(won) {
    if (won) {
      this.stats.totalBattlesWon++
    } else {
      this.stats.totalBattlesLost++
    }
    this.save()
  }

  /**
   * Check if grade is completed
   * @param {number} grade - Grade number
   * @returns {boolean}
   */
  isGradeCompleted(grade) {
    return this.completedGrades.has(grade)
  }

  /**
   * Check if unit is completed
   * @param {number} grade - Grade number
   * @param {string} unitName - Unit name
   * @returns {boolean}
   */
  isUnitCompleted(grade, unitName) {
    return this.completedUnits.has(grade) && 
           this.completedUnits.get(grade).has(unitName)
  }

  /**
   * Get completion percentage for a grade
   * @param {number} grade - Grade number
   * @param {number} totalUnits - Total number of units in grade
   * @returns {number} Completion percentage (0-100)
   */
  getGradeCompletion(grade, totalUnits) {
    if (totalUnits === 0) return 0
    const completed = this.completedUnits.has(grade) 
      ? this.completedUnits.get(grade).size 
      : 0
    return (completed / totalUnits) * 100
  }

  /**
   * Get overall progress
   * @returns {Object} Progress object
   */
  getOverallProgress() {
    return {
      completedGrades: this.completedGrades.size,
      totalProblemsSolved: this.stats.totalProblemsSolved,
      accuracy: this.stats.accuracy,
      battlesWon: this.stats.totalBattlesWon,
      battlesLost: this.stats.totalBattlesLost
    }
  }

  /**
   * Get progress data for serialization
   * @returns {Object} Progress data
   */
  toJSON() {
    return {
      completedGrades: Array.from(this.completedGrades),
      completedUnits: Object.fromEntries(
        Array.from(this.completedUnits.entries()).map(([k, v]) => [k, Array.from(v)])
      ),
      completedProblems: Object.fromEntries(
        Array.from(this.completedProblems.entries()).map(([k, v]) => [k, Array.from(v)])
      ),
      stats: this.stats
    }
  }

  /**
   * Load progress from data
   * @param {Object} data - Progress data
   */
  fromJSON(data) {
    if (data.completedGrades) {
      this.completedGrades = new Set(data.completedGrades)
    }
    if (data.completedUnits) {
      this.completedUnits = new Map(
        Object.entries(data.completedUnits).map(([k, v]) => [parseInt(k), new Set(v)])
      )
    }
    if (data.completedProblems) {
      this.completedProblems = new Map(
        Object.entries(data.completedProblems).map(([k, v]) => [parseInt(k), new Set(v)])
      )
    }
    if (data.stats) {
      this.stats = { ...this.stats, ...data.stats }
    }
  }

  /**
   * Save progress to localStorage
   */
  save() {
    try {
      localStorage.setItem('mathDungeonProgress', JSON.stringify(this.toJSON()))
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  }

  /**
   * Load progress from localStorage
   */
  load() {
    try {
      const data = localStorage.getItem('mathDungeonProgress')
      if (data) {
        this.fromJSON(JSON.parse(data))
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
  }

  /**
   * Reset all progress
   */
  reset() {
    this.completedGrades.clear()
    this.completedUnits.clear()
    this.completedProblems.clear()
    this.stats = {
      totalProblemsSolved: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalBattlesWon: 0,
      totalBattlesLost: 0,
      totalTimePlayed: 0,
      accuracy: 0
    }
    this.save()
  }
}

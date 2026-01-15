import { DungeonSearcher } from './DungeonSearcher'
import { UnitManager } from './UnitManager'
import curriculumData from '../../data/curriculum/alberta_curriculum.json'

/**
 * Dungeon Manager
 * Manages dungeon loading, unit progression, and content access
 */
export class DungeonManager {
  constructor() {
    this.searcher = new DungeonSearcher(curriculumData)
    this.currentGrade = null
    this.currentUnitManager = null
    this.availableDungeons = []
  }

  /**
   * Load a dungeon by grade number
   * @param {number} gradeNumber - Grade number to load
   * @returns {boolean} True if loaded successfully
   */
  loadDungeon(gradeNumber) {
    const grade = this.searcher.findGrade(gradeNumber)
    if (!grade) {
      console.error(`Grade ${gradeNumber} not found`)
      return false
    }

    this.currentGrade = grade
    this.currentUnitManager = new UnitManager(grade)
    return true
  }

  /**
   * Get current grade data
   * @returns {Object|null} Current grade object
   */
  getCurrentGrade() {
    return this.currentGrade
  }

  /**
   * Get current unit manager
   * @returns {UnitManager|null} Current unit manager
   */
  getCurrentUnitManager() {
    return this.currentUnitManager
  }

  /**
   * Get available dungeons for player level
   * @param {number} playerLevel - Player's current level
   * @returns {Array} Array of available dungeon objects
   */
  getAvailableDungeons(playerLevel) {
    this.availableDungeons = this.searcher.getAvailableDungeons(playerLevel)
    return this.availableDungeons
  }

  /**
   * Find problems for current unit by topic
   * @param {string} topic - Topic to search for
   * @returns {Array} Array of matching problems
   */
  findProblemsByTopic(topic) {
    if (!this.currentGrade) return []
    return this.searcher.findProblemsByTopic(this.currentGrade.grade, topic)
  }

  /**
   * Find problems by difficulty
   * @param {number} minDifficulty - Minimum difficulty
   * @param {number} maxDifficulty - Maximum difficulty
   * @returns {Array} Array of matching problems
   */
  findProblemsByDifficulty(minDifficulty, maxDifficulty) {
    if (!this.currentGrade) return []
    return this.searcher.findProblemsByDifficulty(
      this.currentGrade.grade,
      minDifficulty,
      maxDifficulty
    )
  }

  /**
   * Get searcher instance (for direct algorithm access)
   * @returns {DungeonSearcher} Searcher instance
   */
  getSearcher() {
    return this.searcher
  }

  /**
   * Get all available grades
   * @returns {Array} Array of grade objects
   */
  getAvailableGrades() {
    return curriculumData.grades.map(grade => ({
      grade: grade.grade,
      gradeName: grade.name,
      minLevel: grade.minLevel || grade.grade,
      unitCount: grade.units?.length || 0
    }))
  }

  /**
   * Get units for a specific grade
   * @param {number} gradeNumber - Grade number
   * @returns {Array} Array of unit objects
   */
  getUnitsForGrade(gradeNumber) {
    const grade = this.searcher.findGrade(gradeNumber)
    if (!grade || !grade.units) return []
    
    return grade.units.map(unit => ({
      name: unit.name,
      description: unit.description || unit.name,
      topics: unit.topics || [],
      difficulty: unit.difficulty || 1,
      grade: gradeNumber
    }))
  }
}

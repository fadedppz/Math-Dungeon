/**
 * Dungeon Searcher
 * Implements iterative searching algorithms for finding dungeons, units, and problems
 * 
 * Algorithms implemented:
 * - Binary Search: O(log n) for finding grades/units in sorted data
 * - Linear Search: O(n) for finding problems by topic
 */

/**
 * Binary Search Algorithm (Recursive)
 * Finds a specific grade in a sorted array of grades using recursion
 * Time Complexity: O(log n)
 * Space Complexity: O(log n) - due to recursive call stack
 * 
 * @param {Array} sortedGrades - Sorted array of grade objects
 * @param {number} targetGrade - Grade number to find
 * @param {number} left - Left boundary index (default: 0)
 * @param {number} right - Right boundary index (default: array length - 1)
 * @returns {Object|null} Found grade object or null
 */
export function binarySearchGrade(sortedGrades, targetGrade, left = 0, right = sortedGrades.length - 1) {
  // Base case: search space exhausted
  if (left > right) {
    return null
  }

  const mid = Math.floor((left + right) / 2)
  const midGrade = sortedGrades[mid]

  // Found the target
  if (midGrade.grade === targetGrade) {
    return midGrade
  }

  // Recursive cases: search in appropriate half
  if (midGrade.grade < targetGrade) {
    // Target is in right half - recurse right
    return binarySearchGrade(sortedGrades, targetGrade, mid + 1, right)
  } else {
    // Target is in left half - recurse left
    return binarySearchGrade(sortedGrades, targetGrade, left, mid - 1)
  }
}

/**
 * Binary Search for Units within a Grade (Recursive)
 * Finds a specific unit in a sorted array of units using recursion
 * Time Complexity: O(log n)
 * Space Complexity: O(log n) - due to recursive call stack
 * 
 * @param {Array} sortedUnits - Sorted array of unit objects
 * @param {string} targetUnitName - Unit name to find
 * @param {number} left - Left boundary index (default: 0)
 * @param {number} right - Right boundary index (default: array length - 1)
 * @returns {Object|null} Found unit object or null
 */
export function binarySearchUnit(sortedUnits, targetUnitName, left = 0, right = sortedUnits.length - 1) {
  // Base case: search space exhausted
  if (left > right) {
    return null
  }

  const mid = Math.floor((left + right) / 2)
  const midUnit = sortedUnits[mid]

  // Found the target
  if (midUnit.name === targetUnitName) {
    return midUnit
  }

  // Recursive cases: search in appropriate half
  if (midUnit.name < targetUnitName) {
    // Target is in right half - recurse right
    return binarySearchUnit(sortedUnits, targetUnitName, mid + 1, right)
  } else {
    // Target is in left half - recurse left
    return binarySearchUnit(sortedUnits, targetUnitName, left, mid - 1)
  }
}

/**
 * Linear Search Algorithm
 * Finds problems by topic in an array
 * Time Complexity: O(n)
 * 
 * @param {Array} problems - Array of problem objects
 * @param {string} topic - Topic to search for
 * @returns {Array} Array of matching problems
 */
export function linearSearchProblems(problems, topic) {
  const results = []

  for (let i = 0; i < problems.length; i++) {
    if (problems[i].topic === topic ||
      problems[i].topics?.includes(topic)) {
      results.push(problems[i])
    }
  }

  return results
}

/**
 * Linear Search for Available Dungeons
 * Finds all dungeons that the player can access
 * Time Complexity: O(n)
 * 
 * @param {Array} dungeons - Array of dungeon objects
 * @param {number} playerLevel - Player's current level
 * @returns {Array} Array of accessible dungeons
 */
export function linearSearchAvailableDungeons(dungeons, playerLevel) {
  const available = []

  for (let i = 0; i < dungeons.length; i++) {
    const dungeon = dungeons[i]
    // Player can access dungeons at their level or below
    if (dungeon.minLevel <= playerLevel) {
      available.push(dungeon)
    }
  }

  return available
}

/**
 * Linear Search for Problems by Difficulty
 * Finds problems within a difficulty range
 * Time Complexity: O(n)
 * 
 * @param {Array} problems - Array of problem objects
 * @param {number} minDifficulty - Minimum difficulty
 * @param {number} maxDifficulty - Maximum difficulty
 * @returns {Array} Array of matching problems
 */
export function linearSearchByDifficulty(problems, minDifficulty, maxDifficulty) {
  const results = []

  for (let i = 0; i < problems.length; i++) {
    const difficulty = problems[i].difficulty || 1
    if (difficulty >= minDifficulty && difficulty <= maxDifficulty) {
      results.push(problems[i])
    }
  }

  return results
}

/**
 * Dungeon Searcher Class
 * Main interface for searching dungeons and content
 */
export class DungeonSearcher {
  constructor(curriculumData) {
    this.curriculumData = curriculumData
    // Ensure grades are sorted for binary search
    this.sortedGrades = [...curriculumData.grades].sort((a, b) => a.grade - b.grade)
  }

  /**
   * Find a grade by number using binary search
   * @param {number} gradeNumber - Grade number to find
   * @returns {Object|null} Grade object or null
   */
  findGrade(gradeNumber) {
    return binarySearchGrade(this.sortedGrades, gradeNumber)
  }

  /**
   * Find a unit within a grade using binary search
   * @param {number} gradeNumber - Grade number
   * @param {string} unitName - Unit name to find
   * @returns {Object|null} Unit object or null
   */
  findUnit(gradeNumber, unitName) {
    const grade = this.findGrade(gradeNumber)
    if (!grade || !grade.units) return null

    const sortedUnits = [...grade.units].sort((a, b) => a.name.localeCompare(b.name))
    return binarySearchUnit(sortedUnits, unitName)
  }

  /**
   * Find problems by topic using linear search
   * @param {number} gradeNumber - Grade number
   * @param {string} topic - Topic to search for
   * @returns {Array} Array of matching problems
   */
  findProblemsByTopic(gradeNumber, topic) {
    const grade = this.findGrade(gradeNumber)
    if (!grade || !grade.problems) return []

    return linearSearchProblems(grade.problems, topic)
  }

  /**
   * Get all available dungeons for player level
   * @param {number} playerLevel - Player's current level
   * @returns {Array} Array of accessible dungeons
   */
  getAvailableDungeons(playerLevel) {
    const dungeons = this.sortedGrades.map(grade => ({
      grade: grade.grade,
      name: grade.name,
      minLevel: grade.minLevel || grade.grade,
      units: grade.units || []
    }))

    return linearSearchAvailableDungeons(dungeons, playerLevel)
  }

  /**
   * Find problems by difficulty range
   * @param {number} gradeNumber - Grade number
   * @param {number} minDifficulty - Minimum difficulty
   * @param {number} maxDifficulty - Maximum difficulty
   * @returns {Array} Array of matching problems
   */
  findProblemsByDifficulty(gradeNumber, minDifficulty, maxDifficulty) {
    const grade = this.findGrade(gradeNumber)
    if (!grade || !grade.problems) return []

    return linearSearchByDifficulty(grade.problems, minDifficulty, maxDifficulty)
  }
}

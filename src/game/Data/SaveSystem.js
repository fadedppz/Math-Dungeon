import { ProgressTracker } from './ProgressTracker'

/**
 * Save System
 * Handles saving and loading game state using localStorage
 */
export class SaveSystem {
  constructor() {
    this.progressTracker = new ProgressTracker()
    this.progressTracker.load()
  }

  /**
   * Save game state
   * @param {Object} gameState - Game state object
   */
  saveGame(gameState) {
    try {
      const saveData = {
        hero: gameState.hero ? gameState.hero.toJSON() : null,
        currentGrade: gameState.currentGrade || null,
        currentUnit: gameState.currentUnit || null,
        timestamp: Date.now()
      }
      
      localStorage.setItem('mathDungeonSave', JSON.stringify(saveData))
      this.progressTracker.save()
      return true
    } catch (e) {
      console.error('Failed to save game:', e)
      return false
    }
  }

  /**
   * Load game state
   * @returns {Object|null} Game state object or null
   */
  loadGame() {
    try {
      const saveData = localStorage.getItem('mathDungeonSave')
      if (saveData) {
        return JSON.parse(saveData)
      }
    } catch (e) {
      console.error('Failed to load game:', e)
    }
    return null
  }

  /**
   * Check if save exists
   * @returns {boolean}
   */
  hasSave() {
    return localStorage.getItem('mathDungeonSave') !== null
  }

  /**
   * Delete save
   */
  deleteSave() {
    localStorage.removeItem('mathDungeonSave')
    this.progressTracker.reset()
  }

  /**
   * Get progress tracker
   * @returns {ProgressTracker}
   */
  getProgressTracker() {
    return this.progressTracker
  }

  /**
   * Save leaderboard entry
   * @param {Object} entry - Leaderboard entry
   */
  saveLeaderboardEntry(entry) {
    try {
      let leaderboard = JSON.parse(localStorage.getItem('mathDungeonLeaderboard') || '[]')
      leaderboard.push({
        ...entry,
        timestamp: Date.now()
      })
      localStorage.setItem('mathDungeonLeaderboard', JSON.stringify(leaderboard))
    } catch (e) {
      console.error('Failed to save leaderboard entry:', e)
    }
  }

  /**
   * Get leaderboard
   * @returns {Array} Array of leaderboard entries
   */
  getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem('mathDungeonLeaderboard') || '[]')
    } catch (e) {
      return []
    }
  }

  /**
   * Clear leaderboard
   */
  clearLeaderboard() {
    localStorage.removeItem('mathDungeonLeaderboard')
  }
}

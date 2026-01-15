/**
 * Turn System
 * Manages turn-based combat flow
 */
export class TurnSystem {
  constructor() {
    this.currentTurn = 'player' // 'player' or 'enemy'
    this.turnCount = 0
    this.waitingForAnswer = false
  }

  /**
   * Start a new turn
   * @param {string} turnOwner - 'player' or 'enemy'
   */
  startTurn(turnOwner) {
    this.currentTurn = turnOwner
    this.turnCount++
    this.waitingForAnswer = false
  }

  /**
   * End current turn and switch to next
   */
  endTurn() {
    if (this.currentTurn === 'player') {
      this.currentTurn = 'enemy'
    } else {
      this.currentTurn = 'player'
    }
    this.waitingForAnswer = false
  }

  /**
   * Get current turn owner
   * @returns {string} 'player' or 'enemy'
   */
  getCurrentTurn() {
    return this.currentTurn
  }

  /**
   * Check if it's player's turn
   * @returns {boolean}
   */
  isPlayerTurn() {
    return this.currentTurn === 'player'
  }

  /**
   * Check if it's enemy's turn
   * @returns {boolean}
   */
  isEnemyTurn() {
    return this.currentTurn === 'enemy'
  }

  /**
   * Set waiting for answer state
   * @param {boolean} waiting
   */
  setWaitingForAnswer(waiting) {
    this.waitingForAnswer = waiting
  }

  /**
   * Check if waiting for answer
   * @returns {boolean}
   */
  isWaitingForAnswer() {
    return this.waitingForAnswer
  }

  /**
   * Reset turn system
   */
  reset() {
    this.currentTurn = 'player'
    this.turnCount = 0
    this.waitingForAnswer = false
  }
}

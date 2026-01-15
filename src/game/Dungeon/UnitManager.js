/**
 * Unit Manager
 * Manages units within a grade/dungeon
 */
export class UnitManager {
  constructor(gradeData) {
    this.grade = gradeData.grade
    this.gradeName = gradeData.name
    this.units = gradeData.units || []
    this.currentUnitIndex = 0
  }

  /**
   * Get current unit
   * @returns {Object|null} Current unit or null
   */
  getCurrentUnit() {
    if (this.units.length === 0) return null
    return this.units[this.currentUnitIndex]
  }

  /**
   * Move to next unit
   * @returns {boolean} True if moved to next unit, false if at end
   */
  nextUnit() {
    if (this.currentUnitIndex < this.units.length - 1) {
      this.currentUnitIndex++
      return true
    }
    return false
  }

  /**
   * Move to previous unit
   * @returns {boolean} True if moved to previous unit, false if at start
   */
  previousUnit() {
    if (this.currentUnitIndex > 0) {
      this.currentUnitIndex--
      return true
    }
    return false
  }

  /**
   * Get all units
   * @returns {Array} Array of unit objects
   */
  getAllUnits() {
    return this.units
  }

  /**
   * Get unit by index
   * @param {number} index - Unit index
   * @returns {Object|null} Unit object or null
   */
  getUnit(index) {
    if (index >= 0 && index < this.units.length) {
      return this.units[index]
    }
    return null
  }
}

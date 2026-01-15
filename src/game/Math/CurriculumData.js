/**
 * Curriculum Data Manager
 * Provides access to Alberta curriculum structure
 */
import curriculumData from '../../data/curriculum/alberta_curriculum.json'

export class CurriculumData {
  constructor() {
    this.data = curriculumData
  }

  /**
   * Get all grades
   * @returns {Array} Array of grade objects
   */
  getGrades() {
    return this.data.grades || []
  }

  /**
   * Get grade by number
   * @param {number} gradeNumber - Grade number
   * @returns {Object|null} Grade object or null
   */
  getGrade(gradeNumber) {
    return this.data.grades.find(g => g.grade === gradeNumber) || null
  }

  /**
   * Get units for a grade
   * @param {number} gradeNumber - Grade number
   * @returns {Array} Array of unit objects
   */
  getUnits(gradeNumber) {
    const grade = this.getGrade(gradeNumber)
    return grade ? (grade.units || []) : []
  }

  /**
   * Get topics for a unit
   * @param {number} gradeNumber - Grade number
   * @param {string} unitName - Unit name
   * @returns {Array} Array of topic strings
   */
  getTopics(gradeNumber, unitName) {
    const units = this.getUnits(gradeNumber)
    const unit = units.find(u => u.name === unitName)
    return unit ? (unit.topics || []) : []
  }
}

export default new CurriculumData()

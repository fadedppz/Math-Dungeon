/**
 * Attack System
 * Handles attack calculations and damage dealing
 */
export class AttackSystem {
  /**
   * Calculate damage dealt by attacker to defender
   * @param {Object} attacker - Attacker stats object
   * @param {Object} defender - Defender stats object
   * @param {boolean} correctAnswer - Whether math answer was correct (for player attacks)
   * @returns {number} Damage dealt
   */
  static calculateDamage(attacker, defender, correctAnswer = true) {
    // ════════════════════════════════════════════════════════════════
    // 💥 STEP 1: Get base attack power
    // ════════════════════════════════════════════════════════════════
    let baseDamage = attacker.attack || 10

    // ════════════════════════════════════════════════════════════════
    // 🗡️ STEP 2: Add weapon damage bonus (if player has a weapon!)
    // ════════════════════════════════════════════════════════════════
    // Check if attacker has an equipped weapon with a damage bonus
    const weaponBonus = attacker.equippedWeapon?.damageBonus || 0
    baseDamage = baseDamage + weaponBonus

    // ════════════════════════════════════════════════════════════════
    // ❌ STEP 3: If wrong answer, reduce damage
    // ════════════════════════════════════════════════════════════════
    if (!correctAnswer) {
      baseDamage = Math.floor(baseDamage * 0.5)
    }

    // ════════════════════════════════════════════════════════════════
    // 🎲 STEP 4: Add a little randomness (0-5 extra damage)
    // ════════════════════════════════════════════════════════════════
    const variance = Math.floor(Math.random() * 5)
    const totalDamage = baseDamage + variance

    // ════════════════════════════════════════════════════════════════
    // 🛡️ STEP 5: Apply defense (reduces damage taken)
    // ════════════════════════════════════════════════════════════════
    const defenseReduction = Math.floor((defender.defense || 0) * 0.5)
    const finalDamage = Math.max(1, totalDamage - defenseReduction)

    return finalDamage
  }

  /**
   * Apply damage to a character
   * @param {Object} character - Character with stats
   * @param {number} damage - Damage amount
   * @returns {boolean} True if character is still alive
   */
  static applyDamage(character, damage) {
    if (character.stats) {
      character.stats.takeDamage(damage)
      return character.stats.isAlive()
    }
    return false
  }

  /**
   * Perform a critical hit (bonus damage)
   * @param {number} baseDamage - Base damage amount
   * @returns {number} Critical hit damage
   */
  static criticalHit(baseDamage) {
    const criticalChance = Math.random()
    if (criticalChance < 0.15) { // 15% chance
      return Math.floor(baseDamage * 1.5)
    }
    return baseDamage
  }
}

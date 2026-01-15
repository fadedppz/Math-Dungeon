/**
 * Character Stats System
 * Manages character statistics (HP, attack, defense, level, experience, gold, weapon)
 */
export class CharacterStats {
  constructor(config = {}) {
    // ════════════════════════════════════════════════════════════════
    // 💚 HEALTH STATS
    // ════════════════════════════════════════════════════════════════
    this.maxHP = config.maxHP || 400
    this.currentHP = this.maxHP

    // ════════════════════════════════════════════════════════════════
    // ⚔️ COMBAT STATS
    // ════════════════════════════════════════════════════════════════
    this.attack = config.attack || 10
    this.defense = config.defense || 5

    // ════════════════════════════════════════════════════════════════
    // 📊 LEVEL AND EXPERIENCE
    // ════════════════════════════════════════════════════════════════
    this.level = config.level || 1
    this.experience = config.experience || 0
    this.experienceToNextLevel = config.experienceToNextLevel || 100

    // ════════════════════════════════════════════════════════════════
    // 💰 GOLD (for buying weapons!)
    // ════════════════════════════════════════════════════════════════
    this.gold = config.gold || 0

    // ════════════════════════════════════════════════════════════════
    // 🗡️ EQUIPPED WEAPON
    // ════════════════════════════════════════════════════════════════
    // The weapon adds bonus damage to your attacks!
    this.equippedWeapon = config.equippedWeapon || {
      name: 'Wooden Sword',
      damageBonus: 0,
      description: 'A basic training sword'
    }
  }

  /**
   * Take damage - damage amount is already calculated (defense already applied)
   * @param {number} damage - Final damage amount to take
   * @returns {number} Actual damage taken
   */
  takeDamage(damage) {
    // Damage is already calculated, just apply it directly
    const actualDamage = Math.max(1, Math.floor(damage))
    this.currentHP = Math.max(0, this.currentHP - actualDamage)
    console.log(`Taking ${actualDamage} damage. HP: ${this.currentHP + actualDamage} -> ${this.currentHP}`)
    return actualDamage
  }

  /**
   * Heal the character
   * @param {number} amount - Amount to heal
   */
  heal(amount) {
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount)
  }

  /**
   * Add experience and level up if needed
   * @param {number} exp - Experience points to add
   * @returns {boolean} True if leveled up
   */
  addExperience(exp) {
    this.experience += exp
    let leveledUp = false

    while (this.experience >= this.experienceToNextLevel) {
      this.experience -= this.experienceToNextLevel
      this.levelUp()
      leveledUp = true
    }

    return leveledUp
  }

  /**
   * Level up the character
   */
  levelUp() {
    this.level++
    const oldMaxHP = this.maxHP
    this.maxHP = Math.floor(this.maxHP * 1.2)
    this.currentHP += (this.maxHP - oldMaxHP) // Heal by the HP increase
    this.attack = Math.floor(this.attack * 1.15)
    this.defense = Math.floor(this.defense * 1.1)
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5)
  }

  /**
   * Check if character is alive
   * @returns {boolean}
   */
  isAlive() {
    return this.currentHP > 0
  }

  /**
   * Get HP percentage (0-1)
   * @returns {number}
   */
  getHPPercentage() {
    return this.currentHP / this.maxHP
  }

  /**
   * Reset character to full health
   */
  reset() {
    this.currentHP = this.maxHP
  }

  /**
   * Get stats as object for serialization
   * @returns {Object}
   */
  toJSON() {
    return {
      maxHP: this.maxHP,
      currentHP: this.currentHP,
      attack: this.attack,
      defense: this.defense,
      level: this.level,
      experience: this.experience,
      experienceToNextLevel: this.experienceToNextLevel,
      gold: this.gold,
      equippedWeapon: this.equippedWeapon
    }
  }

  /**
   * Load stats from object
   * @param {Object} data - Stats data
   */
  fromJSON(data) {
    // Load HP, but make sure it's at least 400! (Upgrade old saves)
    this.maxHP = Math.max(400, data.maxHP || 400)

    // If we upgraded maxHP, make sure currentHP is also healthy
    let loadedHP = data.currentHP || this.maxHP
    if (this.maxHP > (data.maxHP || 0)) {
      // If we just upgraded their health, heal them to full!
      loadedHP = this.maxHP
    }
    this.currentHP = loadedHP

    this.attack = data.attack || 10
    this.defense = data.defense || 5
    this.level = data.level || 1
    this.experience = data.experience || 0
    this.experienceToNextLevel = data.experienceToNextLevel || 100
    this.gold = data.gold || 0
    this.equippedWeapon = data.equippedWeapon || {
      name: 'Wooden Sword',
      damageBonus: 0,
      description: 'A basic training sword'
    }
  }

  // ════════════════════════════════════════════════════════════════
  // 💾 SAVE GAME SYSTEM
  // ════════════════════════════════════════════════════════════════

  /**
   * Save stats to local storage
   * NOTE: We always save maxHP as currentHP so that when the player
   * returns to the menu and starts a new adventure, they have full health.
   * This prevents the bug where damaged HP persisted across game sessions.
   */
  save() {
    try {
      const data = this.toJSON()
      // Always save with full HP so players start fresh
      data.currentHP = data.maxHP
      localStorage.setItem('math_dungeon_save', JSON.stringify(data))
      console.log('Game saved!', data)
      return true
    } catch (e) {
      console.error('Failed to save game', e)
      return false
    }
  }

  /**
   * Load stats from local storage
   * @returns {boolean} True if save data was found and loaded
   */
  load() {
    try {
      const savedData = localStorage.getItem('math_dungeon_save')
      if (savedData) {
        const data = JSON.parse(savedData)
        this.fromJSON(data)
        console.log('Game loaded!', data)
        return true
      }
    } catch (e) {
      console.error('Failed to load game', e)
    }
    return false
  }
}

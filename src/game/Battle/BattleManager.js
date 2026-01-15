// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                                                                             ║
// ║   🎮 BATTLE MANAGER 🎮                                                      ║
// ║   ═══════════════════                                                       ║
// ║                                                                             ║
// ║   WHAT IS THIS FILE?                                                        ║
// ║   This file controls everything that happens during a battle!               ║
// ║   It's like the referee of a Pokemon battle - it keeps track of:            ║
// ║                                                                             ║
// ║   • Whose turn is it? (player or boss?)                                     ║
// ║   • How much health does everyone have?                                     ║
// ║   • Did the player answer the math problem correctly?                       ║
// ║   • Who wins the battle?                                                    ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

// ═══════════════════════════════════════════════════════════════
// 📦 IMPORTS (bringing in tools from other files)
// ═══════════════════════════════════════════════════════════════
// These are like getting tools from a toolbox!
// TurnSystem = keeps track of whose turn it is
// AttackSystem = calculates damage when someone attacks
// Enemy = creates the bad guys we fight
// ProblemGenerator = makes math problems for us to solve

import { TurnSystem } from './TurnSystem'
import { AttackSystem } from './AttackSystem'
import { Enemy } from '../Characters/Enemy'
import { ProblemGenerator } from '../Math/ProblemGenerator'


// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                                                                             ║
// ║   🎚️ DIFFICULTY SETTINGS 🎚️                                                ║
// ║                                                                             ║
// ║   These are like the "Easy / Medium / Hard" settings in a video game!      ║
// ║                                                                             ║
// ║   Each setting changes:                                                     ║
// ║   • bossHealthMultiplier = How much HP the boss has                        ║
// ║   • bossAttackMultiplier = How hard the boss hits                          ║
// ║   • playerDamageMultiplier = How much damage the player does               ║
// ║   • experienceMultiplier = How much EXP you get for winning                ║
// ║   • wrongAnswerPenalty = How much damage you still do if you're wrong      ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

const GAME_DIFFICULTY_SETTINGS = {

  // 🌱 EASY MODE - Great for beginners!
  // Boss is weak, you do lots of damage, perfect for learning
  easy: {
    bossHealthMultiplier: 0.6,      // Boss only has 60% health (weaker)
    bossAttackMultiplier: 0.5,      // Boss only does 50% damage (gentler)
    playerDamageMultiplier: 1.5,    // You do 150% damage (stronger)
    experienceMultiplier: 0.8,      // You get 80% EXP (better than before!)
    wrongAnswerPenalty: 0.3         // Wrong answers still do 30% damage
  },

  // ⚔️ MEDIUM MODE - The default balance!
  // Everything is normal - fair challenge
  medium: {
    bossHealthMultiplier: 1.0,      // Boss has 100% health (normal)
    bossAttackMultiplier: 1.0,      // Boss does 100% damage (normal)
    playerDamageMultiplier: 1.0,    // You do 100% damage (normal)
    experienceMultiplier: 1.2,      // You get 120% EXP (slight bonus!)
    wrongAnswerPenalty: 0.5         // Wrong answers still do 50% damage
  },

  // 🔥 HARD MODE - For experienced players!
  // Boss is tougher, you need to be careful
  hard: {
    bossHealthMultiplier: 1.5,      // Boss has 150% health (tankier)
    bossAttackMultiplier: 1.3,      // Boss does 130% damage (hits harder)
    playerDamageMultiplier: 0.8,    // You do 80% damage (weaker)
    experienceMultiplier: 2.5,      // 250% EXP! Huge reward for playing hard mode!
    wrongAnswerPenalty: 0.3         // Wrong answers still do 30% damage
  },

  // 💀 NIGHTMARE MODE - Ultimate challenge!
  // Boss is super strong, but amazing rewards!
  nightmare: {
    bossHealthMultiplier: 2.0,      // Boss has 200% health (double!)
    bossAttackMultiplier: 1.8,      // Boss does 180% damage (ouch!)
    playerDamageMultiplier: 0.6,    // You do 60% damage (weak)
    experienceMultiplier: 5.0,      // 500% EXP! Insane rewards for the brave!
    wrongAnswerPenalty: 0.2         // Wrong answers still do 20% damage
  }
}


// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                                                                             ║
// ║   🎮 THE BATTLE MANAGER CLASS 🎮                                            ║
// ║                                                                             ║
// ║   This is the main "brain" that controls the entire battle!                ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export class BattleManager {

  // ═══════════════════════════════════════════════════════════════
  // 🏗️ CONSTRUCTOR (This runs when we create a new battle!)
  // ═══════════════════════════════════════════════════════════════
  //
  // Think of this like setting up a board game before playing:
  // - Put the hero piece on the board
  // - Decide what grade level math to use
  // - Pick the difficulty setting

  constructor(theHero, mathGradeLevel, mathUnit, difficultyLevel = 'medium') {

    // ──────────────────────────────────────────────────────────────
    // 👤 Save the hero (that's you, the player!)
    // ──────────────────────────────────────────────────────────────
    this.hero = theHero

    // ──────────────────────────────────────────────────────────────
    // 📚 Save the math settings
    // ──────────────────────────────────────────────────────────────
    this.grade = mathGradeLevel              // What grade level? (1-12)
    this.unit = mathUnit                     // What topic? (addition, fractions, etc.)

    // ──────────────────────────────────────────────────────────────
    // 🎚️ Save the difficulty settings
    // ──────────────────────────────────────────────────────────────
    this.difficulty = difficultyLevel        // "easy", "medium", "hard", or "nightmare"

    // Get the actual numbers for this difficulty (or use medium if invalid)
    this.difficultySettings = GAME_DIFFICULTY_SETTINGS[difficultyLevel] || GAME_DIFFICULTY_SETTINGS.medium

    // ──────────────────────────────────────────────────────────────
    // 👾 The enemy (boss) - we'll create one when battle starts
    // ──────────────────────────────────────────────────────────────
    this.enemy = null  // null means "nothing yet"

    // ──────────────────────────────────────────────────────────────
    // 🎲 Create helper tools
    // ──────────────────────────────────────────────────────────────
    this.turnSystem = new TurnSystem()             // Keeps track of whose turn
    this.mathProblemMaker = new ProblemGenerator() // Creates math problems

    // ──────────────────────────────────────────────────────────────
    // 📝 Battle status tracking
    // ──────────────────────────────────────────────────────────────
    this.currentMathProblem = null  // The current problem to solve

    // What's happening in the battle right now?
    // Can be: 'waiting', 'player-turn', 'enemy-turn', 'victory', 'defeat'
    this.battleState = 'waiting'

    // A list of messages about what happened during the battle
    // Like: ["Battle started!", "You dealt 10 damage!", etc.]
    this.battleMessageHistory = []
  }


  // ═══════════════════════════════════════════════════════════════
  // 🚀 START THE BATTLE!
  // ═══════════════════════════════════════════════════════════════
  //
  // This is like yelling "LET'S BATTLE!" at the start of a Pokemon fight!
  // It creates an enemy and gets everything ready.

  startBattle() {

    // ──────────────────────────────────────────────────────────────
    // 👾 STEP 1: Figure out how tough the enemy should be
    // ──────────────────────────────────────────────────────────────

    // Start with a base difficulty from the math unit (1 to 5)
    // If we don't have that info, use the grade level to guess
    const startingDifficulty = this.unit?.difficulty || Math.min(5, Math.ceil(this.grade / 2)) || 1

    // Make the enemy even tougher on hard/nightmare modes!
    let enemyDifficultyLevel = startingDifficulty

    if (this.difficulty === 'hard') {
      // Hard mode: enemy is 1 level tougher
      enemyDifficultyLevel = Math.min(5, startingDifficulty + 1)  // Max is 5
    }

    if (this.difficulty === 'nightmare') {
      // Nightmare mode: enemy is 2 levels tougher!
      enemyDifficultyLevel = Math.min(5, startingDifficulty + 2)  // Max is 5
    }

    // ──────────────────────────────────────────────────────────────
    // 👾 STEP 2: Create the enemy!
    // ──────────────────────────────────────────────────────────────

    // This creates a monster based on the grade level and difficulty
    // Grade 1-3 = slimes, Grade 4-6 = goblins, etc.
    this.enemy = Enemy.createForGrade(this.grade, enemyDifficultyLevel)

    // ──────────────────────────────────────────────────────────────
    // 📊 STEP 3: Apply difficulty multipliers to enemy stats
    // ──────────────────────────────────────────────────────────────

    // Adjust the enemy's health based on difficulty
    const originalEnemyHealth = this.enemy.stats.maxHP
    const healthMultiplier = this.difficultySettings.bossHealthMultiplier
    const newEnemyHealth = Math.floor(originalEnemyHealth * healthMultiplier)

    this.enemy.stats.maxHP = newEnemyHealth
    this.enemy.stats.currentHP = newEnemyHealth  // Start with full health!

    // Adjust the enemy's attack power based on difficulty
    const originalEnemyAttack = this.enemy.stats.attack
    const attackMultiplier = this.difficultySettings.bossAttackMultiplier
    const newEnemyAttack = Math.floor(originalEnemyAttack * attackMultiplier)

    this.enemy.stats.attack = newEnemyAttack

    // ──────────────────────────────────────────────────────────────
    // 🎯 STEP 4: Set up the turn system
    // ──────────────────────────────────────────────────────────────

    this.turnSystem.reset()              // Clear any old turn data
    this.battleState = 'player-turn'     // Player goes first!
    this.turnSystem.startTurn('player')  // Tell the turn system

    // ──────────────────────────────────────────────────────────────
    // 📝 STEP 5: Write the first battle message
    // ──────────────────────────────────────────────────────────────

    // Pick an emoji for the difficulty
    const difficultyEmojis = {
      easy: '🌱',
      medium: '⚔️',
      hard: '🔥',
      nightmare: '💀'
    }
    const emoji = difficultyEmojis[this.difficulty]

    // Create the opening message like "🔥 HARD Mode - Goblin Chief appeared!"
    const difficultyName = this.difficulty.toUpperCase()
    const enemyName = this.enemy.name
    const openingMessage = `${emoji} ${difficultyName} Mode - ${enemyName} appeared!`

    this.battleMessageHistory = [openingMessage]

    // ──────────────────────────────────────────────────────────────
    // ❓ STEP 6: Create the first math problem!
    // ──────────────────────────────────────────────────────────────

    this.createNewMathProblem()
  }


  // ═══════════════════════════════════════════════════════════════
  // ❓ CREATE A NEW MATH PROBLEM
  // ═══════════════════════════════════════════════════════════════
  //
  // This picks a random math problem based on the grade and unit.

  createNewMathProblem() {

    // Debug messages (for developers to see what's happening)
    console.log('=== Creating a new math problem! ===')
    console.log('Grade level:', this.grade)
    console.log('Math unit:', this.unit)

    // ──────────────────────────────────────────────────────────────
    // Check if we have enough info to make a good problem
    // ──────────────────────────────────────────────────────────────

    const haveEnoughInfo = this.unit && this.grade

    if (haveEnoughInfo === false) {
      // We don't have unit/grade info, so make a simple addition problem
      console.log('Not enough info - making a simple addition problem')
      const gradeToUse = this.grade || 1
      this.currentMathProblem = this.mathProblemMaker.generateProblem(gradeToUse, 'addition')
      return  // We're done!
    }

    // ──────────────────────────────────────────────────────────────
    // Try to make a problem based on the unit name
    // ──────────────────────────────────────────────────────────────

    const unitName = this.unit.name || ''
    console.log('Unit name:', unitName)

    // Try making a problem based on the unit name first
    this.currentMathProblem = this.mathProblemMaker.generateProblemByUnit(this.grade, unitName)

    // ──────────────────────────────────────────────────────────────
    // If that didn't work, try using a random topic from the unit
    // ──────────────────────────────────────────────────────────────

    const problemWasCreated = this.currentMathProblem && this.currentMathProblem.question

    if (problemWasCreated === false) {
      // Get the list of math topics in this unit (or default to addition)
      const topicsInThisUnit = this.unit.topics || ['addition']
      console.log('Available topics:', topicsInThisUnit)

      // Pick a random topic from the list
      const randomIndex = Math.floor(Math.random() * topicsInThisUnit.length)
      const randomTopic = topicsInThisUnit[randomIndex]
      console.log('Randomly picked:', randomTopic)

      // Create a problem for that topic
      this.currentMathProblem = this.mathProblemMaker.generateProblem(this.grade, randomTopic)
    }

    console.log('Created problem:', this.currentMathProblem)
  }


  // ═══════════════════════════════════════════════════════════════
  // ✅ PLAYER SUBMITS THEIR ANSWER!
  // ═══════════════════════════════════════════════════════════════
  //
  // This is called when the player types in their answer and hits submit!
  // It checks if they're right, deals damage, and maybe wins the battle.

  submitAnswer(playerAnswer) {

    // ──────────────────────────────────────────────────────────────
    // 🚦 SAFETY CHECK: Is it the player's turn?
    // ──────────────────────────────────────────────────────────────

    const isPlayersTurn = (this.battleState === 'player-turn')

    if (isPlayersTurn === false) {
      // Oops! It's not the player's turn!
      return {
        success: false,
        message: 'Not your turn!'
      }
    }

    // ──────────────────────────────────────────────────────────────
    // ❓ Make sure we have a problem to check
    // ──────────────────────────────────────────────────────────────

    if (this.currentMathProblem === null) {
      this.createNewMathProblem()
    }

    // ──────────────────────────────────────────────────────────────
    // ✅ STEP 1: Check if the answer is correct!
    // ──────────────────────────────────────────────────────────────

    console.log('=== Checking the players answer! ===')
    console.log('Player typed:', playerAnswer)
    console.log('Correct answer is:', this.currentMathProblem.answer)

    const isAnswerCorrect = this.mathProblemMaker.validateAnswer(this.currentMathProblem, playerAnswer)
    console.log('Is it correct?', isAnswerCorrect)

    // ──────────────────────────────────────────────────────────────
    // 💥 STEP 2: Calculate how much damage to deal
    // ──────────────────────────────────────────────────────────────

    // Get the base damage (hero attack vs enemy defense)
    const heroAttackPower = this.hero.stats.attack
    const enemyDefense = this.enemy.stats.defense

    let damageToEnemy = AttackSystem.calculateDamage(
      { attack: heroAttackPower },
      { defense: enemyDefense },
      isAnswerCorrect
    )

    // Apply the difficulty multiplier
    const playerDamageMultiplier = this.difficultySettings.playerDamageMultiplier
    damageToEnemy = Math.floor(damageToEnemy * playerDamageMultiplier)

    // If the answer was WRONG, reduce the damage
    if (isAnswerCorrect === false) {
      const wrongAnswerPenalty = this.difficultySettings.wrongAnswerPenalty
      damageToEnemy = Math.max(1, Math.floor(damageToEnemy * wrongAnswerPenalty))
    }

    console.log('Damage to deal:', damageToEnemy)
    console.log('Enemy HP before hit:', this.enemy.stats.currentHP)

    // ──────────────────────────────────────────────────────────────
    // 👊 STEP 3: Hit the enemy!
    // ──────────────────────────────────────────────────────────────

    // Apply the damage - returns true if enemy is still alive
    const isEnemyStillAlive = AttackSystem.applyDamage(this.enemy, damageToEnemy)

    console.log('Enemy HP after hit:', this.enemy.stats.currentHP)
    console.log('Hero HP (unchanged):', this.hero.stats.currentHP)

    // ──────────────────────────────────────────────────────────────
    // 📝 STEP 4: Create the result message
    // ──────────────────────────────────────────────────────────────

    let resultMessage

    if (isAnswerCorrect) {
      resultMessage = `✓ Correct! You dealt ${damageToEnemy} damage to ${this.enemy.name}!`
    } else {
      resultMessage = `✗ Wrong! You dealt ${damageToEnemy} damage (reduced).`
    }

    // Add to the battle history
    this.battleMessageHistory.push(resultMessage)

    // Create the result object to return
    const battleResult = {
      success: true,
      correct: isAnswerCorrect,
      damage: damageToEnemy,
      enemyHP: this.enemy.stats.currentHP,
      enemyMaxHP: this.enemy.stats.maxHP,
      message: resultMessage
    }

    // ──────────────────────────────────────────────────────────────
    // 🏆 STEP 5: Did we defeat the enemy?
    // ──────────────────────────────────────────────────────────────

    if (isEnemyStillAlive === false) {
      // 🎉 VICTORY! The enemy was defeated!
      this.battleState = 'victory'

      // Calculate experience points earned
      const enemyLevel = this.enemy.stats.level
      const baseExperience = enemyLevel * 10
      const expMultiplier = this.difficultySettings.experienceMultiplier
      const experienceEarned = Math.floor(baseExperience * expMultiplier)

      // Give the hero their experience!
      const didHeroLevelUp = this.hero.stats.addExperience(experienceEarned)

      // ════════════════════════════════════════════════════════════════
      // 💰 GOLD REWARD! Players earn gold to buy weapons!
      // ════════════════════════════════════════════════════════════════
      // Base gold = enemy level × 15
      // Then multiplied by difficulty (harder = more gold!)
      const baseGold = enemyLevel * 15
      const goldEarned = Math.floor(baseGold * expMultiplier)

      // Add gold to the hero's stats
      this.hero.stats.gold = (this.hero.stats.gold || 0) + goldEarned

      // 💾 SAVE THE GAME!
      // Make sure we don't lose that hard-earned gold!
      if (this.hero.stats.save) {
        this.hero.stats.save()
      }

      // Add victory info to the result
      battleResult.victory = true
      battleResult.expGained = experienceEarned
      battleResult.goldGained = goldEarned
      battleResult.leveledUp = didHeroLevelUp

      // Add victory messages
      this.battleMessageHistory.push(`Victory! Gained ${experienceEarned} EXP and ${goldEarned} gold! 💰`)

      if (didHeroLevelUp) {
        const newLevel = this.hero.stats.level
        this.battleMessageHistory.push(`Level up! Now level ${newLevel}!`)
      }

    } else {
      // Enemy is still alive - now it's the enemy's turn!
      this.turnSystem.endTurn()
      this.battleState = 'enemy-turn'

      // Wait 1 second, then let the enemy attack
      const waitTime = 1000  // 1000 milliseconds = 1 second
      setTimeout(() => this.enemyTurn(), waitTime)
    }

    return battleResult
  }


  // ╔════════════════════════════════════════════════════════════════╗
  // ║                    🎮 BOSS DAMAGE SYSTEM 🎮                     ║
  // ╠════════════════════════════════════════════════════════════════╣
  // ║                                                                 ║
  // ║  STORY TIME! 📖                                                ║
  // ║  ──────────────────────────────────────────────────────────── ║
  // ║  Imagine you're playing a video game. When you first start,   ║
  // ║  you're level 1 and the monsters are easy. But as you get     ║
  // ║  stronger (level up!), the monsters need to be a bit tougher  ║
  // ║  too, or the game would be too easy and boring!               ║
  // ║                                                                 ║
  // ║  BUT WAIT! We don't want the boss to be a bully! 🛡️           ║
  // ║  So we have a SAFETY RULE:                                     ║
  // ║  The boss can NEVER hit you so hard that you lose             ║
  // ║  all your health in just one hit. That wouldn't be fair!      ║
  // ║                                                                 ║
  // ╚════════════════════════════════════════════════════════════════╝

  /**
   * 🧮 Figure out how much damage the boss should do
   * 
   * This is like a recipe with 5 easy steps!
   */
  figureOutHowMuchDamageTheBossDoes(
    bossNormalDamage,      // How hard the boss usually hits
    heroLevel,             // What level is our hero? (1, 2, 3, etc.)
    heroTotalHealth        // Hero's maximum HP (like 100 HP)
  ) {

    // ────────────────────────────────────────────────────────
    // 📖 STEP 1: Figure out the "level bonus"
    // ────────────────────────────────────────────────────────
    // For every level AFTER level 1, the boss gets 5% stronger
    // 
    // EXAMPLE:
    //   Hero is level 1  →  Boss gets 0% bonus! (Fair fight!)
    //   Hero is level 2  →  Boss gets 5% bonus (0.05)
    //   Hero is level 10 →  Boss gets 45% bonus (0.45)

    // We deduct 1 from level because level 1 should be the baseline
    const levelsAboveOne = Math.max(0, heroLevel - 1)

    const fivePercentBonus = 0.05  // This means 5%
    const howMuchExtraDamage = levelsAboveOne * fivePercentBonus


    // ────────────────────────────────────────────────────────
    // 📖 STEP 2: Make the "damage multiplier"
    // ────────────────────────────────────────────────────────
    // We start at 1 (which means 100%, or "normal damage")
    // Then we add the extra bonus on top
    // Multiplier = 1.0 + Extra

    const normalDamage = 1  // 1 means "100%" or "full damage"
    const damageMultiplier = normalDamage + howMuchExtraDamage


    // ────────────────────────────────────────────────────────
    // 📖 STEP 3: Calculate the boosted damage
    // ────────────────────────────────────────────────────────
    // Multiply the boss's normal hit by the multiplier
    const boostedDamage = bossNormalDamage * damageMultiplier


    // ────────────────────────────────────────────────────────
    // 📖 STEP 4: Set the "safety limit" (damage cap)
    // ────────────────────────────────────────────────────────
    // THE FAIR PLAY RULE! 🎯
    // The boss can NEVER do more than 20% of your total health.
    // This means you'll ALWAYS survive at least 5 hits! (Improved from 4)
    //
    // EXAMPLE:
    //   Hero has 400 HP
    //   20% of 400 = 80 max damage

    const twentyPercent = 0.20  // 20% = 0.20
    const maximumAllowedDamage = heroTotalHealth * twentyPercent


    // ────────────────────────────────────────────────────────
    // 📖 STEP 5: Pick the final damage (use the smaller one!)
    // ────────────────────────────────────────────────────────
    const smallerNumber = Math.min(boostedDamage, maximumAllowedDamage)
    const roundedDown = Math.floor(smallerNumber)
    const atLeastOneDamage = Math.max(1, roundedDown)  // Boss always does at least 1!

    return atLeastOneDamage
  }


  /**
   * ⚔️ The Boss Takes Their Turn to Attack!
   * 
   * This happens after you answer a math problem.
   * The boss swings at you and tries to hurt your hero!
   */
  enemyTurn() {

    // ────────────────────────────────────────────────────────
    // 🚦 SAFETY CHECK: Is it actually the boss's turn?
    // ────────────────────────────────────────────────────────
    // If it's not the enemy's turn, don't do anything!
    // This is like making sure you wait your turn in a game.

    const isItTheBossTurn = (this.battleState === 'enemy-turn')

    if (isItTheBossTurn === false) {
      return  // Stop here! It's not the boss's turn yet.
    }


    // ────────────────────────────────────────────────────────
    // 👊 STEP 1: Calculate the boss's basic attack
    // ────────────────────────────────────────────────────────
    // This uses the attack power of the boss vs the hero's defense
    // Like comparing how hard someone punches vs how good your shield is!

    const bossAttackPower = this.enemy.stats.attack
    const heroDefense = this.hero.stats.defense
    const bossAlwaysTriesHard = true

    const bossNormalDamage = AttackSystem.calculateDamage(
      { attack: bossAttackPower },
      { defense: heroDefense },
      bossAlwaysTriesHard
    )


    // ────────────────────────────────────────────────────────
    // 📈 STEP 2: Add the level scaling (makes it fair!)
    // ────────────────────────────────────────────────────────
    // Higher level hero = boss hits a bit harder
    // But we also have a safety cap so new players don't get crushed!

    const heroLevel = this.hero.stats.level
    const heroTotalHealth = this.hero.stats.maxHP

    const finalDamage = this.figureOutHowMuchDamageTheBossDoes(
      bossNormalDamage,
      heroLevel,
      heroTotalHealth
    )


    // ────────────────────────────────────────────────────────
    // 💔 STEP 3: The boss hits the hero!
    // ────────────────────────────────────────────────────────
    // This subtracts HP from the hero
    // Returns true if hero is still alive, false if defeated

    const isHeroStillAlive = AttackSystem.applyDamage(this.hero, finalDamage)


    // ────────────────────────────────────────────────────────
    // 📝 STEP 4: Write down what happened
    // ────────────────────────────────────────────────────────
    // We keep a log so the player can see what's going on!

    const bossName = this.enemy.name
    const attackMessage = `${bossName} attacks! ${finalDamage} damage!`
    this.battleMessageHistory.push(attackMessage)


    // ────────────────────────────────────────────────────────
    // 🏁 STEP 5: What happens next?
    // ────────────────────────────────────────────────────────

    if (isHeroStillAlive === false) {
      // 😢 Oh no! The hero was knocked out!
      this.battleState = 'defeat'
      this.battleMessageHistory.push('Defeat! You were knocked out!')
    } else {
      // 🎉 Hero survived! Now it's the player's turn again!
      this.turnSystem.endTurn()
      this.battleState = 'player-turn'
      this.createNewMathProblem()  // Give them a new math problem to solve!
    }
  }


  // ═══════════════════════════════════════════════════════════════
  // 📊 GETTER FUNCTIONS (ways to ask the battle for information)
  // ═══════════════════════════════════════════════════════════════
  //
  // These are like asking the referee "hey, what's the score?"
  // They just give back information without changing anything.

  /**
   * 📝 Get the current math problem
   * Returns the problem object, or null if there isn't one
   */
  getCurrentProblem() {
    return this.currentMathProblem
  }

  /**
   * 🎯 What's happening in the battle right now?
   * Returns: 'waiting', 'player-turn', 'enemy-turn', 'victory', or 'defeat'
   */
  getBattleState() {
    return this.battleState
  }

  /**
   * 📜 Get all the battle messages
   * Returns an array of strings like ["Battle started!", "You dealt 10 damage!"]
   */
  getBattleLog() {
    return this.battleMessageHistory
  }

  /**
   * 🏁 Is the battle finished?
   * Returns true if someone won (or lost), false if still fighting
   */
  isBattleOver() {
    const playerWon = (this.battleState === 'victory')
    const playerLost = (this.battleState === 'defeat')
    return playerWon || playerLost
  }

  /**
   * 💚 Get the hero's current stats
   * Returns an object with health, attack, defense, etc.
   */
  getHeroStats() {
    return {
      currentHP: this.hero.stats.currentHP,   // Current health
      maxHP: this.hero.stats.maxHP,           // Maximum health
      level: this.hero.stats.level,           // Current level
      attack: this.hero.stats.attack,         // Attack power
      defense: this.hero.stats.defense        // Defense power
    }
  }

  /**
   * ❤️ Get the enemy's current stats
   * Returns an object with name, health, level, etc.
   * Returns null if there's no enemy yet
   */
  getEnemyStats() {
    // Check if we even have an enemy
    const haveEnemy = (this.enemy !== null)

    if (haveEnemy === false) {
      return null  // No enemy to report on!
    }

    return {
      name: this.enemy.name,                  // Enemy's name
      currentHP: this.enemy.stats.currentHP,  // Current health
      maxHP: this.enemy.stats.maxHP,          // Maximum health
      level: this.enemy.stats.level           // Enemy level
    }
  }
}

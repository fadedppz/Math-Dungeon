# 🎮 Math Dungeon: Complete Code Walkthrough

This document explains **every major part** of the Math Dungeon codebase in a way that a complete beginner can understand and explain to others.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [How The Game Starts (Entry Points)](#how-the-game-starts)
3. [The Central Hub (GameEngine)](#the-central-hub---gameengine)
4. [The Battle System (The Heart of the Game)](#the-battle-system)
5. [Math Problem Generation](#math-problem-generation)
6. [Character System](#character-system)
7. [React UI Components](#react-ui-components)
8. [Data Flow: What Happens When You Answer a Question](#data-flow-answering-a-question)
9. [Saving & Loading Progress](#saving--loading-progress)

---

## Project Overview

### What Is Math Dungeon?

Math Dungeon is an **educational RPG** where players fight monsters by answering math questions correctly. It's built with:

| Technology | Purpose |
|------------|---------|
| **React** | JavaScript library for building the user interface |
| **Vite** | Fast build tool that bundles and serves the code |
| **JavaScript (ES6+)** | The programming language for all game logic |
| **CSS** | Styling and animations |

### The Core Gameplay Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CORE GAMEPLAY LOOP                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   1. MAIN MENU                                                      │
│      └─→ Player clicks "Start Adventure"                           │
│                                                                     │
│   2. MAP/EXPLORATION                                                │
│      └─→ Player walks to a dungeon entrance (Grade 1-12)           │
│                                                                     │
│   3. DUNGEON SELECTION                                              │
│      └─→ Player picks a Unit (Fractions, Algebra, etc.)            │
│      └─→ Player picks a Difficulty (Easy/Medium/Hard/Nightmare)    │
│                                                                     │
│   4. BATTLE                                                         │
│      ┌─→ Math problem appears: "5 + 3 = ?"                         │
│      │   Player answers: "8"                                        │
│      │   ├─ CORRECT: Deal full damage to enemy                      │
│      │   └─ WRONG: Deal reduced damage                              │
│      │                                                              │
│      │   Enemy attacks back                                         │
│      │   └─→ Loop until someone wins                                │
│      │                                                              │
│   5. VICTORY                                                        │
│      └─→ Earn EXP and Gold, level up, return to map                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How The Game Starts

### File: `src/main.jsx` (The Very First File That Runs)

```javascript
// This is the ENTRY POINT - the first code that runs in the browser

import React from 'react'            // React library
import ReactDOM from 'react-dom/client'  // React's DOM renderer
import App from './App'              // Our main App component
import './styles/App.css'            // Global styles

// Find the HTML element with id="root" and render our app inside it
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>    {/* Helps catch potential problems */}
    <App />             {/* Our entire game lives inside this component */}
  </React.StrictMode>,
)
```

**What's happening:**
1. The browser loads `index.html`
2. `index.html` loads `main.jsx`
3. `main.jsx` tells React: "Put my `<App />` component inside the `<div id="root">` element"
4. React takes over and renders the game!

### File: `src/App.jsx` (The Screen Manager)

This file controls **which screen the player sees**. It's like a traffic controller.

```javascript
function App() {
  // STATE = Data that can change over time
  const [gameState, setGameState] = useState('menu')     // What screen are we on?
  const [gameEngine, setGameEngine] = useState(null)     // The game's brain
  const [selectedGrade, setSelectedGrade] = useState(null)  // What grade did they pick?

  // FUNCTIONS to change screens
  const startGame = () => {
    const engine = new GameEngine()  // Create the game engine
    setGameEngine(engine)
    setGameState('map')              // Switch to the map screen
  }

  const enterDungeon = (grade) => {
    setSelectedGrade(grade)
    setGameState('dungeon-selection')  // Switch to unit selection
  }

  const startBattle = () => {
    setGameState('battle')            // Switch to battle screen
  }

  // RENDER = What the player sees
  return (
    <div className="app">
      {/* Only show MainMenu if gameState is 'menu' */}
      {gameState === 'menu' && (
        <MainMenu onStart={startGame} />
      )}
      
      {/* Only show GameHUD if gameState is 'map' */}
      {gameState === 'map' && gameEngine && (
        <GameHUD 
          gameEngine={gameEngine}
          onEnterDungeon={enterDungeon}
        />
      )}
      
      {/* Only show BattleUI if gameState is 'battle' */}
      {gameState === 'battle' && gameEngine && (
        <BattleUI 
          gameEngine={gameEngine}
          onReturnToMap={returnToMap}
        />
      )}
      
      {/* Only show DungeonSelection if gameState is 'dungeon-selection' */}
      {gameState === 'dungeon-selection' && gameEngine && (
        <DungeonSelection 
          gameEngine={gameEngine}
          initialGrade={selectedGrade}
          onStartBattle={startBattle}
        />
      )}
    </div>
  )
}
```

**Key Concepts:**
- `useState` = React's way of storing data that can change
- When `setGameState('battle')` is called, React automatically re-renders with the BattleUI
- `&&` = "Show this component only if the condition is true"

---

## The Central Hub - GameEngine

### File: `src/game/GameEngine.js`

The GameEngine is the **central brain** that holds references to all game systems.

```javascript
export class GameEngine {
  constructor() {
    // What scene/screen is active
    this.currentScene = 'lobby'
    
    // References to game systems (will be set later)
    this.player = null         // The hero
    this.mapManager = null     // Controls the map
    this.battleManager = null  // Controls battles
    this.dungeonManager = null // Controls dungeons
    
    // Game data (set when player makes selections)
    this.selectedGrade = null
    this.selectedUnit = null
    this.selectedDifficulty = null
    
    this.initialize()
  }

  initialize() {
    console.log('Game Engine initialized')
    // Setup code goes here
  }

  // Called every frame to update animations/game logic
  update(deltaTime) {
    if (this.mapManager && this.currentScene === 'map') {
      this.mapManager.update(deltaTime)
    }
    if (this.battleManager && this.currentScene === 'battle') {
      this.battleManager.update(deltaTime)
    }
  }

  setScene(scene) {
    this.currentScene = scene
  }
}
```

**Why a Central GameEngine?**
- All systems can access shared data through the engine
- Easy to manage game state (what scene, what grade, etc.)
- Classic game development pattern

---

## The Battle System

This is the **most important part** of the game - where the action happens!

### File: `src/game/Battle/BattleManager.js` (THE CRITICAL FILE)

```javascript
// ═══════════════════════════════════════════════════════════════
// DIFFICULTY SETTINGS
// ═══════════════════════════════════════════════════════════════
// These numbers control how hard the game is

const GAME_DIFFICULTY_SETTINGS = {
  easy: {
    bossHealthMultiplier: 0.6,      // Boss has only 60% health
    bossAttackMultiplier: 0.5,      // Boss does 50% damage
    playerDamageMultiplier: 1.5,    // Player does 150% damage
    experienceMultiplier: 0.8,      // Get 80% EXP (less reward for easy)
    wrongAnswerPenalty: 0.3         // Wrong answers still do 30% damage
  },
  medium: {
    bossHealthMultiplier: 1.0,      // Normal
    bossAttackMultiplier: 1.0,
    playerDamageMultiplier: 1.0,
    experienceMultiplier: 1.2,
    wrongAnswerPenalty: 0.5
  },
  hard: {
    bossHealthMultiplier: 1.5,      // 150% health - tougher!
    bossAttackMultiplier: 1.3,      // 130% damage
    playerDamageMultiplier: 0.8,    // Player does less damage
    experienceMultiplier: 2.5,      // 250% EXP reward!
    wrongAnswerPenalty: 0.3
  },
  nightmare: {
    bossHealthMultiplier: 2.0,      // DOUBLE health!
    bossAttackMultiplier: 1.8,      // 180% damage
    playerDamageMultiplier: 0.6,    // Player is weaker
    experienceMultiplier: 5.0,      // 500% EXP - huge reward!
    wrongAnswerPenalty: 0.2
  }
}
```

### The BattleManager Class

```javascript
export class BattleManager {
  constructor(theHero, mathGradeLevel, mathUnit, difficultyLevel = 'medium') {
    // Save references
    this.hero = theHero                   // The player character
    this.grade = mathGradeLevel           // Grade level (1-12)
    this.unit = mathUnit                  // Topic (fractions, algebra, etc.)
    this.difficulty = difficultyLevel
    
    // Load difficulty settings
    this.difficultySettings = GAME_DIFFICULTY_SETTINGS[difficultyLevel]
    
    // Battle state
    this.enemy = null                     // Will be created in startBattle()
    this.currentMathProblem = null        // The current question
    this.battleState = 'waiting'          // 'player-turn', 'enemy-turn', 'victory', 'defeat'
    this.battleMessageHistory = []        // Combat log
    
    // Helper systems
    this.turnSystem = new TurnSystem()
    this.mathProblemMaker = new ProblemGenerator()
  }
```

### Starting a Battle

```javascript
startBattle() {
  // STEP 1: Calculate how tough the enemy should be
  const startingDifficulty = this.unit?.difficulty || Math.ceil(this.grade / 2)
  let enemyDifficultyLevel = startingDifficulty

  // Hard/Nightmare modes increase enemy difficulty
  if (this.difficulty === 'hard') {
    enemyDifficultyLevel = Math.min(5, startingDifficulty + 1)
  }
  if (this.difficulty === 'nightmare') {
    enemyDifficultyLevel = Math.min(5, startingDifficulty + 2)
  }

  // STEP 2: Create the enemy
  this.enemy = Enemy.createForGrade(this.grade, enemyDifficultyLevel)

  // STEP 3: Apply difficulty multipliers
  const originalHealth = this.enemy.stats.maxHP
  const newHealth = Math.floor(originalHealth * this.difficultySettings.bossHealthMultiplier)
  this.enemy.stats.maxHP = newHealth
  this.enemy.stats.currentHP = newHealth

  // STEP 4: Set up turns
  this.turnSystem.reset()
  this.battleState = 'player-turn'
  this.turnSystem.startTurn('player')

  // STEP 5: Create opening message
  const emoji = { easy: '🌱', medium: '⚔️', hard: '🔥', nightmare: '💀' }[this.difficulty]
  this.battleMessageHistory = [`${emoji} ${this.difficulty.toUpperCase()} Mode - ${this.enemy.name} appeared!`]

  // STEP 6: Generate first math problem
  this.createNewMathProblem()
}
```

### Submitting an Answer (THE MOST IMPORTANT FUNCTION)

This is the function that runs **every time the player answers a question**:

```javascript
submitAnswer(playerAnswer) {
  // SAFETY CHECK: Is it the player's turn?
  if (this.battleState !== 'player-turn') {
    return { success: false, message: 'Not your turn!' }
  }

  // STEP 1: Check if the answer is correct
  const isCorrect = this.mathProblemMaker.validateAnswer(
    this.currentMathProblem, 
    playerAnswer
  )

  // STEP 2: Calculate damage
  // Get hero's attack power and enemy's defense
  const heroAttack = this.hero.stats.attack
  const enemyDefense = this.enemy.stats.defense
  
  let damage = AttackSystem.calculateDamage(
    { attack: heroAttack },
    { defense: enemyDefense },
    isCorrect  // Correct answers do more damage!
  )

  // Apply difficulty multiplier
  damage = Math.floor(damage * this.difficultySettings.playerDamageMultiplier)

  // Wrong answers get EXTRA penalty
  if (!isCorrect) {
    damage = Math.max(1, Math.floor(damage * this.difficultySettings.wrongAnswerPenalty))
  }

  // STEP 3: Apply damage to enemy
  const enemyAlive = AttackSystem.applyDamage(this.enemy, damage)

  // STEP 4: Create result message
  const msg = isCorrect
    ? `✓ Correct! You dealt ${damage} damage to ${this.enemy.name}!`
    : `✗ Wrong! You dealt ${damage} damage (reduced).`
  this.battleMessageHistory.push(msg)

  // STEP 5: Check for victory
  if (!enemyAlive) {
    this.battleState = 'victory'
    
    // Calculate rewards
    const baseExp = this.enemy.stats.level * 10
    const expEarned = Math.floor(baseExp * this.difficultySettings.experienceMultiplier)
    const leveledUp = this.hero.stats.addExperience(expEarned)
    
    const baseGold = this.enemy.stats.level * 15
    const goldEarned = Math.floor(baseGold * this.difficultySettings.experienceMultiplier)
    this.hero.stats.gold += goldEarned
    
    // Save progress
    this.hero.stats.save()
    
    this.battleMessageHistory.push(`Victory! Gained ${expEarned} EXP and ${goldEarned} gold!`)
    
    return {
      success: true,
      victory: true,
      expGained: expEarned,
      goldGained: goldEarned,
      leveledUp: leveledUp
    }
  }

  // STEP 6: Enemy still alive - switch to enemy turn
  this.turnSystem.endTurn()
  this.battleState = 'enemy-turn'
  
  // Wait 1 second, then enemy attacks
  setTimeout(() => this.enemyTurn(), 1000)

  return {
    success: true,
    correct: isCorrect,
    damage: damage,
    enemyHP: this.enemy.stats.currentHP,
    message: msg
  }
}
```

### The Enemy's Turn

```javascript
enemyTurn() {
  if (this.battleState !== 'enemy-turn') return

  // Calculate boss damage with safety cap
  const bossAttack = this.enemy.stats.attack
  const heroDefense = this.hero.stats.defense
  const baseDamage = AttackSystem.calculateDamage(
    { attack: bossAttack }, 
    { defense: heroDefense }, 
    true  // Boss always "hits correctly"
  )

  // Apply the fair-play damage cap (max 20% of hero HP)
  const finalDamage = this.figureOutHowMuchDamageTheBossDoes(
    baseDamage,
    this.hero.stats.level,
    this.hero.stats.maxHP
  )

  // Apply damage to hero
  const heroAlive = AttackSystem.applyDamage(this.hero, finalDamage)

  this.battleMessageHistory.push(`${this.enemy.name} attacks! ${finalDamage} damage!`)

  if (!heroAlive) {
    // Player lost
    this.battleState = 'defeat'
    this.battleMessageHistory.push('Defeat! You were knocked out!')
  } else {
    // Continue battle - back to player's turn
    this.turnSystem.endTurn()
    this.battleState = 'player-turn'
    this.createNewMathProblem()  // New problem for next turn
  }
}
```

---

## Math Problem Generation

### File: `src/game/Math/ProblemGenerator.js`

This is the **educational brain** of the game - it creates curriculum-aligned math problems.

### How It Works

```javascript
export class ProblemGenerator {
  constructor() {
    // Two lookup tables for finding the right generator
    this.unitGenerators = this.initializeUnitGenerators()    // Exact unit names
    this.topicGenerators = this.initializeTopicGenerators()  // Topic keywords
  }

  // Map exact unit names to generator functions
  initializeUnitGenerators() {
    return {
      // Grade 1
      'addition & subtraction to 20': (g) => this.genAddSubTo20(g),
      '2d and 3d shapes': (g) => this.genShapes(g),
      
      // Grade 5
      'fractions': (g) => this.genFractions(g),
      'algebraic expressions': (g) => this.genAlgebraicExpressions(g),
      
      // Grade 10
      'right triangle trigonometry': (g) => this.genRightTriangleTrig(g),
      
      // ... many more ...
    }
  }

  // Generate a problem by unit name
  generateProblemByUnit(grade, unitName) {
    // Try exact match first
    const generator = this.unitGenerators[unitName.toLowerCase()]
    if (generator) {
      return generator(grade)
    }
    
    // Try keyword match
    for (const [keyword, gen] of Object.entries(this.topicGenerators)) {
      if (unitName.toLowerCase().includes(keyword)) {
        return gen(grade)
      }
    }
    
    // Fallback to grade-appropriate default
    return this.generateFallbackProblem(grade)
  }
}
```

### Example: Grade 1 Addition Problems

```javascript
genAddSubTo20(grade) {
  // Pick a random problem type (1-8)
  const problemType = Math.floor(Math.random() * 8) + 1

  if (problemType === 1) {
    // ➕ Simple Addition: "5 + 3 = ?"
    const num1 = Math.floor(Math.random() * 10) + 1  // 1-10
    const num2 = Math.floor(Math.random() * 10) + 1  // 1-10
    return this.createProblem(
      `${num1} + ${num2} = ?`,    // Question: "5 + 3 = ?"
      num1 + num2,                 // Answer: 8
      'Addition',                  // Topic name
      grade,                       // Difficulty
      true                         // Multiple choice
    )
  }
  
  else if (problemType === 3) {
    // ❓ Missing Number: "5 + ? = 8"
    const total = Math.floor(Math.random() * 10) + 5   // 5-14
    const part = Math.floor(Math.random() * 5) + 1     // 1-5
    const answer = total - part
    return this.createProblem(
      `${part} + ? = ${total}`,   // "3 + ? = 8"
      answer,                      // 5
      'Missing Number',
      grade,
      true
    )
  }
  
  else if (problemType === 4) {
    // 🍎 Word Problem
    const apples = Math.floor(Math.random() * 5) + 3    // 3-7
    const moreApples = Math.floor(Math.random() * 4) + 1 // 1-4
    const question = `You have ${apples} apples. You get ${moreApples} more. How many apples do you have?`
    return this.createProblem(question, apples + moreApples, 'Word Problem', grade, true)
  }
  
  // ... more problem types ...
}
```

### Answer Validation

```javascript
// File: src/game/Math/AnswerValidator.js

export class AnswerValidator {
  static validate(problem, userAnswer) {
    // Empty answers are always wrong
    if (userAnswer === null || userAnswer === '' || userAnswer === undefined) {
      return false
    }
    return this.compareAnswers(problem.answer, userAnswer)
  }

  static compareAnswers(correct, user) {
    const correctNum = this.parseToNumber(correct)
    const userNum = this.parseToNumber(user)

    // Both are numbers? Compare with tolerance (for decimals)
    if (correctNum !== null && userNum !== null) {
      const tolerance = 0.01
      return Math.abs(userNum - correctNum) < tolerance
    }

    // Compare as strings (case-insensitive)
    const correctStr = String(correct).toLowerCase().trim()
    const userStr = String(user).toLowerCase().trim()

    // Handle fractions
    if (correctStr.includes('/') || userStr.includes('/')) {
      return this.compareFractions(correctStr, userStr)
    }

    return correctStr === userStr
  }

  static parseToNumber(value) {
    if (typeof value === 'number') return value
    
    // Handle fractions like "3/4"
    if (typeof value === 'string' && value.includes('/')) {
      const [num, denom] = value.split('/')
      const n = parseFloat(num)
      const d = parseFloat(denom)
      if (!isNaN(n) && !isNaN(d) && d !== 0) {
        return n / d
      }
    }
    
    const num = parseFloat(value)
    return isNaN(num) ? null : num
  }
}
```

---

## Character System

### File: `src/game/Characters/CharacterStats.js`

This class stores all data about a character (hero or enemy).

```javascript
export class CharacterStats {
  constructor(config = {}) {
    this.maxHP = config.maxHP || 400
    this.currentHP = this.maxHP
    this.attack = config.attack || 10
    this.defense = config.defense || 5
    this.level = config.level || 1
    this.experience = config.experience || 0
    this.experienceToNextLevel = config.experienceToNextLevel || 100
    this.gold = config.gold || 0
    this.equippedWeapon = config.equippedWeapon || {
      name: 'Wooden Sword',
      damageBonus: 0,
      description: 'A basic training sword'
    }
  }

  // Take damage and return how much damage was actually taken
  takeDamage(damage) {
    const actualDamage = Math.max(1, Math.floor(damage))
    this.currentHP = Math.max(0, this.currentHP - actualDamage)
    return actualDamage
  }

  // Heal HP (can't go above max)
  heal(amount) {
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount)
  }

  // Add experience and possibly level up
  addExperience(exp) {
    this.experience += exp
    let leveledUp = false
    
    // Keep leveling up while we have enough EXP
    while (this.experience >= this.experienceToNextLevel) {
      this.experience -= this.experienceToNextLevel
      this.levelUp()
      leveledUp = true
    }
    
    return leveledUp
  }

  // Increase stats when leveling up
  levelUp() {
    this.level++
    
    const oldMaxHP = this.maxHP
    this.maxHP = Math.floor(this.maxHP * 1.2)        // +20% HP
    this.currentHP += (this.maxHP - oldMaxHP)        // Heal the difference
    this.attack = Math.floor(this.attack * 1.15)     // +15% attack
    this.defense = Math.floor(this.defense * 1.1)    // +10% defense
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5)
  }

  isAlive() { return this.currentHP > 0 }
  getHPPercentage() { return this.currentHP / this.maxHP }
}
```

### File: `src/game/Characters/Enemy.js`

Enemies are created based on grade level and difficulty.

```javascript
export class Enemy {
  // Factory method - creates the right enemy for the grade
  static createForGrade(grade, difficulty = 1) {
    // Calculate stats based on grade and difficulty
    const baseHP = 50 + (grade * 10) + (difficulty * 20)
    const baseAttack = 5 + (grade * 1) + (difficulty * 2)
    const baseDefense = 2 + Math.floor(grade / 2) + difficulty
    
    // Pick enemy type based on grade
    let type, name
    if (grade <= 3) {
      type = 'slime'
      name = 'Math Slime'
    } else if (grade <= 6) {
      type = 'goblin'
      name = 'Equation Goblin'
    } else if (grade <= 9) {
      type = 'skeleton'
      name = 'Algebra Skeleton'
    } else {
      type = 'dragon'
      name = 'Calculus Dragon'
    }
    
    return new Enemy({
      name: name,
      type: type,
      maxHP: baseHP,
      attack: baseAttack,
      defense: baseDefense,
      level: grade
    })
  }
}
```

---

## React UI Components

### File: `src/components/BattleUI.jsx` (The Combat Screen)

This component renders everything the player sees during battle.

```javascript
function BattleUI({ gameEngine, onReturnToMap }) {
  // STATE - data that can change
  const [battleManager, setBattleManager] = useState(null)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [heroStats, setHeroStats] = useState(null)
  const [enemyStats, setEnemyStats] = useState(null)
  const [battleLog, setBattleLog] = useState([])
  const [battleState, setBattleState] = useState('waiting')
  const [answer, setAnswer] = useState('')

  // EFFECT - runs when component first appears
  useEffect(() => {
    // Get settings from game engine
    const grade = gameEngine?.selectedGrade || 1
    const unit = gameEngine?.selectedUnit || { name: 'Number Sense' }
    const difficulty = gameEngine?.selectedDifficulty || 'medium'

    // Find or create the hero
    let hero = gameEngine?.mapManager?.hero || new Hero({ x: 0, y: 0 })

    // Create and start the battle
    const manager = new BattleManager(hero, grade, unit, difficulty)
    manager.startBattle()

    // Update all state at once
    setBattleManager(manager)
    setCurrentProblem(manager.getCurrentProblem())
    setHeroStats(manager.getHeroStats())
    setEnemyStats(manager.getEnemyStats())
    setBattleState(manager.getBattleState())
    setBattleLog(manager.getBattleLog())
  }, [gameEngine])

  // FUNCTION - called when player submits answer
  const handleSubmitAnswer = (submittedAnswer) => {
    if (!battleManager || battleState !== 'player-turn') return
    if (submittedAnswer === '' || submittedAnswer === undefined) return

    // Submit to battle manager
    const result = battleManager.submitAnswer(String(submittedAnswer))

    // Update UI with new state
    setBattleLog([...battleManager.getBattleLog()])
    setHeroStats(battleManager.getHeroStats())
    setEnemyStats(battleManager.getEnemyStats())
    setBattleState(battleManager.getBattleState())
    setAnswer('')  // Clear input

    // Victory? Return to map after 3 seconds
    if (result.victory) {
      setTimeout(() => { onReturnToMap() }, 3000)
    }
  }

  // RENDER - what appears on screen
  return (
    <div className="battle-ui">
      {/* Hero Stats (left side) */}
      <div className="hero-panel">
        <h3>{heroStats?.name || 'Hero'}</h3>
        <div className="hp-bar">
          HP: {heroStats?.currentHP} / {heroStats?.maxHP}
        </div>
      </div>

      {/* Math Problem (center) */}
      <div className="problem-area">
        <h2>{currentProblem?.question}</h2>
        
        {/* Multiple choice buttons OR text input */}
        {currentProblem?.type === 'multiple-choice' ? (
          currentProblem.options.map(option => (
            <button 
              key={option.label}
              onClick={() => handleSubmitAnswer(option.value)}
            >
              {option.label}: {option.value}
            </button>
          ))
        ) : (
          <input 
            type="text" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer(answer)}
          />
        )}
      </div>

      {/* Enemy Stats (right side) */}
      <div className="enemy-panel">
        <h3>{enemyStats?.name || 'Enemy'}</h3>
        <div className="hp-bar">
          HP: {enemyStats?.currentHP} / {enemyStats?.maxHP}
        </div>
      </div>

      {/* Battle Log (bottom) */}
      <div className="battle-log">
        {battleLog.map((msg, i) => <p key={i}>{msg}</p>)}
      </div>
    </div>
  )
}
```

---

## Data Flow: Answering a Question

Let's trace what happens when a player types "25" and presses Enter:

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: User types "25" and presses Enter                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   BattleUI.jsx                                                      │
│   └─→ handleSubmitAnswer("25") is called                           │
│       └─→ battleManager.submitAnswer("25")                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ STEP 2: BattleManager checks the answer                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   BattleManager.js                                                  │
│   └─→ mathProblemMaker.validateAnswer(problem, "25")               │
│       │                                                             │
│       AnswerValidator.js                                            │
│       └─→ parseToNumber("25") = 25                                 │
│       └─→ parseToNumber(problem.answer) = 25                       │
│       └─→ |25 - 25| < 0.01 ? → TRUE! ✓                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ STEP 3: Calculate and apply damage                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   BattleManager.js                                                  │
│   └─→ AttackSystem.calculateDamage(hero, enemy, true)              │
│       │   hero.attack = 20, weapon = 5, random = 3                 │
│       │   baseDamage = 20 + 5 = 25                                 │
│       │   (correct answer, no penalty)                              │
│       │   totalDamage = 25 + 3 = 28                                │
│       │   defense = 10 * 0.5 = 5                                   │
│       └─→ Returns 28 - 5 = 23 damage                               │
│                                                                     │
│   └─→ difficulty multiplier: 23 * 1.0 = 23                         │
│   └─→ AttackSystem.applyDamage(enemy, 23)                          │
│       │   enemy HP: 100 - 23 = 77                                  │
│       └─→ Returns TRUE (enemy alive)                               │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ STEP 4: Switch to enemy turn                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   BattleManager.js                                                  │
│   └─→ this.battleState = 'enemy-turn'                              │
│   └─→ setTimeout(() => this.enemyTurn(), 1000)                     │
│   └─→ Return result to UI                                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ STEP 5: UI updates                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   BattleUI.jsx                                                      │
│   └─→ setBattleLog([...new messages])                              │
│   └─→ setEnemyStats({ currentHP: 77, ... })                        │
│   └─→ React re-renders with new HP bar                             │
│   └─→ "Correct! 23 damage!" popup appears                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ STEP 6: After 1 second, enemy attacks                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   BattleManager.js                                                  │
│   └─→ enemyTurn() is called                                        │
│   └─→ Calculate damage (with 20% HP cap for fairness)              │
│   └─→ Apply damage to hero                                         │
│   └─→ Generate new math problem                                    │
│   └─→ battleState = 'player-turn'                                  │
│                                                                     │
│   BattleUI.jsx                                                      │
│   └─→ Polls battleManager state every 100ms                        │
│   └─→ Detects state changed, updates UI                            │
│   └─→ Shows new problem, ready for next answer                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Saving & Loading Progress

### How Progress Is Saved

```javascript
// File: src/game/Characters/CharacterStats.js

save() {
  // Convert all stats to a JSON object
  const saveData = {
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
  
  // Store in browser's localStorage
  localStorage.setItem('math_dungeon_save', JSON.stringify(saveData))
}

load() {
  // Get saved data from localStorage
  const saved = localStorage.getItem('math_dungeon_save')
  
  if (saved) {
    // Parse the JSON and apply to this character
    const data = JSON.parse(saved)
    this.maxHP = data.maxHP
    this.currentHP = data.currentHP
    this.attack = data.attack
    this.defense = data.defense
    this.level = data.level
    this.experience = data.experience
    this.experienceToNextLevel = data.experienceToNextLevel
    this.gold = data.gold
    this.equippedWeapon = data.equippedWeapon
  }
}
```

**When is it saved?**
- After every battle victory
- When buying items from the shop
- When the player explicitly saves

**When is it loaded?**
- When the Hero is created (in constructor)
- When the player clicks "Continue" from main menu

---

## Summary

Here's a quick reference of the main parts:

| File | Purpose |
|------|---------|
| `main.jsx` | Entry point - starts the React app |
| `App.jsx` | Screen manager - controls which screen shows |
| `GameEngine.js` | Central hub - holds references to all systems |
| `BattleManager.js` | **THE CRITICAL FILE** - controls all battle logic |
| `AttackSystem.js` | Damage calculation |
| `TurnSystem.js` | Tracks whose turn it is |
| `ProblemGenerator.js` | Creates curriculum-aligned math problems |
| `AnswerValidator.js` | Checks if answers are correct |
| `CharacterStats.js` | Stores HP, attack, defense, level, etc. |
| `Hero.js` | Player character + sprites |
| `Enemy.js` | Enemy characters |
| `BattleUI.jsx` | The battle screen UI |

---

*This walkthrough explains the Math Dungeon codebase so that someone who has never seen it before can understand and explain how it works.*

import { useState, useEffect, useRef } from 'react'
import { BattleManager } from '../game/Battle/BattleManager'
import { Hero } from '../game/Characters/Hero'
import { SaveSystem } from '../game/Data/SaveSystem'
import { getAudioManager } from '../utils/audioManager'
import ProblemDisplay from './ProblemDisplay'
import VisualizationPanel from './VisualizationPanel'
import AnimatedCharacter from './AnimatedCharacter'

function BattleUI({ gameEngine, onReturnToMap }) {
  const [battleManager, setBattleManager] = useState(null)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [heroStats, setHeroStats] = useState(null)
  const [enemyStats, setEnemyStats] = useState(null)
  const [battleLog, setBattleLog] = useState([])
  const [battleState, setBattleState] = useState('waiting')
  const [answer, setAnswer] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [enemyShake, setEnemyShake] = useState(false)
  const [heroShake, setHeroShake] = useState(false)
  const [heroAnimation, setHeroAnimation] = useState('idle')
  const [enemyAnimation, setEnemyAnimation] = useState('idle')
  const [showVisualization, setShowVisualization] = useState(true)  // Hints visible by default!
  const battleLogRef = useRef(null)

  // This runs when the battle first starts.
  // It sets up the hero, the enemy, and the math problems.
  useEffect(() => {
    // 1. Figure out what grade and unit the player chose
    const grade = gameEngine?.selectedGrade || 1
    const unit = gameEngine?.selectedUnit || { name: 'Number Sense', topics: ['arithmetic'], difficulty: 1 }
    const difficulty = gameEngine?.selectedDifficulty || 'medium'

    // 2. Find the Hero!
    // We try to get the hero from the Map so that their progress (like Gold and EXP) is saved.
    let hero = null
    if (gameEngine?.mapManager?.hero) {
      hero = gameEngine.mapManager.hero // Use the hero from the map
    }
    else if (gameEngine?.hero) {
      hero = gameEngine.hero
    }
    else {
      // If we can't find a hero, create a temporary one (just in case)
      hero = new Hero({ x: 0, y: 0 })
      hero.stats.load()
    }

    // 3. Create the BattleManager (the "referee" of the fight)
    const manager = new BattleManager(hero, grade, unit, difficulty)
    manager.startBattle()

    // 4. Update the screen with all the new info
    setBattleManager(manager)
    setCurrentProblem(manager.getCurrentProblem())
    setHeroStats(manager.getHeroStats())
    setEnemyStats(manager.getEnemyStats())
    setBattleState(manager.getBattleState())
    setBattleLog(manager.getBattleLog())

    // Start the game sound
    getAudioManager().resume()
  }, [gameEngine])

  // Auto-scroll battle log
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight
    }
  }, [battleLog])

  // Listen for enemy turn completion
  useEffect(() => {
    if (battleManager && battleState === 'enemy-turn') {
      setEnemyAnimation('attack')

      const checkTurn = setInterval(() => {
        const newState = battleManager.getBattleState()
        if (newState !== 'enemy-turn') {
          setBattleState(newState)
          setBattleLog([...battleManager.getBattleLog()])
          setHeroStats(battleManager.getHeroStats())
          setEnemyStats(battleManager.getEnemyStats())

          if (newState === 'player-turn') {
            setCurrentProblem(battleManager.getCurrentProblem())
          }

          // Hero takes damage animation
          setHeroShake(true)
          setHeroAnimation('hit')
          setTimeout(() => {
            setHeroShake(false)
            setHeroAnimation('idle')
          }, 500)

          setEnemyAnimation('idle')
          clearInterval(checkTurn)
        }
      }, 100)

      return () => clearInterval(checkTurn)
    }
  }, [battleState, battleManager])

  // This is called when you click "Attack" or press Enter
  const submitAnswer = (submittedAnswer) => {
    // 1. If the battle is over or it's not our turn, don't do anything
    if (!battleManager || battleState !== 'player-turn') return
    if (submittedAnswer === '' || submittedAnswer === undefined || submittedAnswer === null) return

    const audioManager = getAudioManager()

    // 2. Start the attack animation
    setHeroAnimation('attack')

    // 3. Ask the BattleManager if the answer is correct
    const result = battleManager.submitAnswer(String(submittedAnswer))

    // 4. Play sounds
    if (result.correct) {
      audioManager.playAttackSound()
    } else {
      audioManager.playClickSound()
    }

    // 5. Show the feedback (like "Correct!" or "Wrong!") in a popup
    setLastResult(result)
    setShowResult(true)
    setTimeout(() => setShowResult(false), 1500)

    // Enemy damage animation
    setEnemyShake(true)
    setEnemyAnimation('hit')
    setTimeout(() => {
      setEnemyShake(false)
      setHeroAnimation('idle')
      setEnemyAnimation('idle')
    }, 500)

    setBattleLog([...battleManager.getBattleLog()])
    setHeroStats(battleManager.getHeroStats())
    setEnemyStats(battleManager.getEnemyStats())
    setBattleState(battleManager.getBattleState())
    setAnswer('')

    if (result.victory) {
      setHeroAnimation('victory')
      setEnemyAnimation('death')
      audioManager.playVictorySound()
      if (result.leveledUp) {
        audioManager.playLevelUpSound()
      }

      // Save to leaderboard!
      try {
        const saveSystem = new SaveSystem()
        saveSystem.saveLeaderboardEntry({
          playerName: 'Hero',
          score: (result.expGained || 0) + (result.goldGained || 0),
          level: heroStats.level,
          completionPercentage: 0
        })
        console.log('Leaderboard entry saved!')
      } catch (e) {
        console.error('Failed to save leaderboard entry:', e)
      }
      setTimeout(() => {
        onReturnToMap()
      }, 3000)
    } else if (battleManager.getBattleState() === 'defeat') {
      setHeroAnimation('hit')
      audioManager.playDefeatSound()
    }
  }

  const handleSubmitAnswer = () => {
    submitAnswer(answer.trim())
  }

  const handleSelectOption = (optionValue) => {
    submitAnswer(optionValue)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer()
    }
  }

  if (!battleManager || !heroStats || !enemyStats) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#1a1a2e',
        color: '#fff'
      }}>
        <div style={{ fontSize: '24px' }}>Preparing Battle...</div>
      </div>
    )
  }

  const isMultipleChoice = currentProblem?.type === 'multiple-choice'

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)',
      color: '#fff',
      padding: '15px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Battle Header - Compact */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        padding: '8px 15px',
        background: 'rgba(30, 30, 50, 0.8)',
        borderRadius: '10px',
        border: '1px solid #667eea'
      }}>
        <h1 style={{
          fontSize: '20px',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          ⚔️ BATTLE
        </h1>
        <div style={{ color: '#aaa', fontSize: '12px' }}>
          Turn {battleManager.turnSystem.turnCount} | {gameEngine?.selectedDifficulty?.toUpperCase() || 'MEDIUM'}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowVisualization(!showVisualization)}
            style={{
              background: showVisualization ? '#667eea' : 'rgba(102, 126, 234, 0.2)',
              border: '1px solid #667eea',
              padding: '6px 12px',
              fontSize: '12px'
            }}
          >
            {showVisualization ? '📊 Hide Help' : '📊 Show Help'}
          </button>
          <button
            onClick={onReturnToMap}
            style={{
              background: 'rgba(255, 107, 107, 0.2)',
              border: '1px solid #ff6b6b',
              padding: '6px 12px',
              fontSize: '12px'
            }}
          >
            🏃 Flee
          </button>
        </div>
      </div>

      {/* Main Battle Area - 3 Column Layout */}
      <div style={{ display: 'flex', gap: '15px', flex: 1, minHeight: 0 }}>

        {/* Left Side - Hero (Compact) */}
        <div style={{
          flex: '0 0 160px',
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '10px',
          border: '1px solid #4ecdc4',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            color: '#4ecdc4',
            fontSize: '10px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginBottom: '8px',
            textTransform: 'uppercase'
          }}>
            Hero
          </div>

          {/* Hero Animated Sprite */}
          <div style={{
            width: '100%',
            height: '90px',
            background: 'linear-gradient(180deg, rgba(78, 205, 196, 0.1) 0%, rgba(78, 205, 196, 0.2) 100%)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            position: 'relative'
          }}>
            <AnimatedCharacter
              character={gameEngine?.hero || battleManager?.hero}
              animation={heroAnimation}
              scale={2}
              shake={heroShake}
            />
          </div>

          <div style={{ fontSize: '11px', color: '#4ecdc4', fontWeight: 'bold', marginBottom: '6px' }}>
            Level {heroStats.level}
          </div>

          {/* HP Bar */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ color: '#aaa', fontSize: '10px' }}>HP</span>
              <span style={{ color: '#fff', fontSize: '10px' }}>{heroStats.currentHP}/{heroStats.maxHP}</span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(heroStats.currentHP / heroStats.maxHP) * 100}%`,
                height: '100%',
                background: (heroStats.currentHP / heroStats.maxHP) > 0.5
                  ? 'linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%)'
                  : (heroStats.currentHP / heroStats.maxHP) > 0.25
                    ? 'linear-gradient(90deg, #f7dc6f 0%, #f39c12 100%)'
                    : 'linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%)',
                transition: 'width 0.3s ease',
                borderRadius: '5px'
              }}></div>
            </div>
          </div>

          <div style={{ fontSize: '10px', color: '#aaa', marginTop: 'auto' }}>
            ATK: {heroStats.attack} | DEF: {heroStats.defense}
          </div>
        </div>

        {/* Center - Problem Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          {battleState === 'player-turn' && currentProblem && (
            <>
              {/* Problem Display */}
              <ProblemDisplay
                problem={currentProblem}
                onSelectOption={handleSelectOption}
              />

              {/* Visualization (collapsible) */}
              {showVisualization && (
                <div style={{ flex: '0 0 150px' }}>
                  <VisualizationPanel problem={currentProblem} />
                </div>
              )}

              {/* Answer Input - Only show for fill-in-blank */}
              {!isMultipleChoice && (
                <div style={{
                  background: 'rgba(30, 30, 50, 0.95)',
                  borderRadius: '10px',
                  border: '1px solid #667eea',
                  padding: '12px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your answer..."
                    style={{
                      flex: 1,
                      padding: '12px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #667eea',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#fff'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    style={{
                      padding: '12px 25px',
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '8px'
                    }}
                  >
                    ⚔️ Attack!
                  </button>
                </div>
              )}

              {/* Hint for multiple choice */}
              {isMultipleChoice && (
                <div style={{
                  background: 'rgba(78, 205, 196, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  fontSize: '13px',
                  color: '#4ecdc4',
                  textAlign: 'center'
                }}>
                  👆 Click on the correct answer above to attack!
                </div>
              )}
            </>
          )}

          {battleState === 'enemy-turn' && (
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(30, 30, 50, 0.95)',
              borderRadius: '10px',
              border: '1px solid #ff6b6b'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '15px',
                  animation: 'enemyAttackPulse 0.5s ease-in-out infinite'
                }}>⚡</div>
                <h2 style={{ color: '#ff6b6b', fontSize: '20px' }}>Enemy Attacking...</h2>
              </div>
            </div>
          )}

          {battleState === 'victory' && (
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.2) 0%, rgba(68, 160, 141, 0.2) 100%)',
              borderRadius: '10px',
              border: '2px solid #4ecdc4'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '15px',
                  animation: 'victoryBounce 0.5s ease-in-out infinite'
                }}>🏆</div>
                <h2 style={{ color: '#4ecdc4', fontSize: '32px', marginBottom: '10px' }}>Victory!</h2>
                <p style={{ color: '#fff', fontSize: '16px' }}>Returning to map...</p>
              </div>
            </div>
          )}

          {battleState === 'defeat' && (
            <div style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(238, 90, 111, 0.2) 100%)',
              borderRadius: '10px',
              border: '2px solid #ff6b6b'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '15px' }}>💔</div>
                <h2 style={{ color: '#ff6b6b', fontSize: '32px', marginBottom: '10px' }}>Defeat!</h2>
                <button onClick={onReturnToMap} style={{ marginTop: '15px', padding: '12px 30px' }}>
                  Return to Map
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Enemy (Compact) */}
        <div style={{
          flex: '0 0 160px',
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '10px',
          border: '1px solid #ff6b6b',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            color: '#ff6b6b',
            fontSize: '10px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginBottom: '8px',
            textTransform: 'uppercase'
          }}>
            Enemy
          </div>

          {/* Enemy Animated Sprite */}
          <div style={{
            width: '100%',
            height: '90px',
            background: 'linear-gradient(180deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 107, 107, 0.2) 100%)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
            position: 'relative'
          }}>
            <AnimatedCharacter
              character={battleManager?.enemy}
              animation={enemyAnimation}
              scale={2}
              shake={enemyShake}
            />
          </div>

          <div style={{
            color: '#ff6b6b',
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '6px',
            textAlign: 'center'
          }}>
            {enemyStats.name}
          </div>

          <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '6px', textAlign: 'center' }}>
            Level {enemyStats.level}
          </div>

          {/* HP Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ color: '#aaa', fontSize: '10px' }}>HP</span>
              <span style={{ color: '#fff', fontSize: '10px' }}>{enemyStats.currentHP}/{enemyStats.maxHP}</span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(enemyStats.currentHP / enemyStats.maxHP) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%)',
                transition: 'width 0.3s ease',
                borderRadius: '5px'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Log - Compact at bottom */}
      <div
        ref={battleLogRef}
        style={{
          marginTop: '10px',
          background: 'rgba(30, 30, 50, 0.9)',
          borderRadius: '8px',
          border: '1px solid #667eea',
          padding: '8px 12px',
          maxHeight: '80px',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
          {battleLog.slice(-5).map((log, index) => (
            <span
              key={index}
              style={{
                color: log.includes('Correct') ? '#4ecdc4' :
                  log.includes('Wrong') ? '#f7dc6f' :
                    log.includes('Victory') ? '#4ecdc4' :
                      log.includes('Defeat') ? '#ff6b6b' :
                        log.includes('attacks') ? '#ff6b6b' : '#aaa'
              }}
            >
              {log}
            </span>
          ))}
        </div>
      </div>

      {/* Result Popup */}
      {showResult && lastResult && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: lastResult.correct
            ? 'linear-gradient(135deg, rgba(78, 205, 196, 0.95) 0%, rgba(68, 160, 141, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(247, 220, 111, 0.95) 0%, rgba(243, 156, 18, 0.95) 100%)',
          padding: '25px 40px',
          borderRadius: '12px',
          textAlign: 'center',
          zIndex: 100,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          animation: 'popIn 0.3s ease-out'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>
            {lastResult.correct ? '✓' : '✗'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>
            {lastResult.correct ? 'Correct!' : 'Wrong!'}
          </div>
          <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginTop: '8px' }}>
            {lastResult.damage} damage!
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes enemyAttackPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes victoryBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

export default BattleUI

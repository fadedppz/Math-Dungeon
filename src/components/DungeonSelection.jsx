import { useState, useEffect } from 'react'
import { DungeonManager } from '../game/Dungeon/DungeonManager'
import { getAudioManager } from '../utils/audioManager'

const DIFFICULTY_MODES = [
  { 
    id: 'easy', 
    name: 'Easy', 
    color: '#4ecdc4', 
    emoji: '🌱',
    description: 'Perfect for practice. More time, simpler problems.',
    multiplier: 0.5
  },
  { 
    id: 'medium', 
    name: 'Medium', 
    color: '#f7dc6f', 
    emoji: '⚔️',
    description: 'Balanced challenge. Standard difficulty.',
    multiplier: 1.0
  },
  { 
    id: 'hard', 
    name: 'Hard', 
    color: '#ff6b6b', 
    emoji: '🔥',
    description: 'Tough enemies. Harder problems, more damage.',
    multiplier: 1.5
  },
  { 
    id: 'nightmare', 
    name: 'Nightmare', 
    color: '#9b59b6', 
    emoji: '💀',
    description: 'Only for the brave. Maximum challenge!',
    multiplier: 2.0
  }
]

function DungeonSelection({ gameEngine, initialGrade, onStartBattle, onReturnToMap }) {
  const [dungeonManager] = useState(() => new DungeonManager())
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium')
  const [availableDungeons, setAvailableDungeons] = useState([])
  const [step, setStep] = useState(1) // 1: grade, 2: unit, 3: difficulty

  // Initialize with all dungeons and auto-select the clicked grade
  useEffect(() => {
    // Get all dungeons (not filtered by level for now, show all)
    const allGrades = dungeonManager.getAvailableGrades()
    setAvailableDungeons(allGrades)
    
    // Auto-select the grade that was clicked on the map
    if (initialGrade && allGrades.length > 0) {
      const gradeToSelect = allGrades.find(d => d.grade === initialGrade)
      if (gradeToSelect) {
        setSelectedGrade(initialGrade)
        dungeonManager.loadDungeon(initialGrade)
        setStep(2) // Go directly to unit selection
      }
    }
  }, [dungeonManager, initialGrade])

  // Load units when grade changes
  useEffect(() => {
    if (selectedGrade) {
      dungeonManager.loadDungeon(selectedGrade)
      const unitManager = dungeonManager.getCurrentUnitManager()
      if (unitManager && unitManager.getAllUnits().length > 0) {
        const units = unitManager.getAllUnits()
        setSelectedUnit(units[0])
      } else {
        setSelectedUnit(null)
      }
    }
  }, [selectedGrade, dungeonManager])

  const handleGradeSelect = (grade) => {
    setSelectedGrade(grade)
    setStep(2)
  }

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit)
    setStep(3)
  }

  const handleStartBattle = () => {
    if (selectedGrade && selectedUnit) {
      const audioManager = getAudioManager()
      audioManager.playClickSound()
      
      // Store selection in game engine
      if (gameEngine) {
        gameEngine.selectedGrade = selectedGrade
        gameEngine.selectedUnit = selectedUnit
        gameEngine.selectedDifficulty = selectedDifficulty
      }
      
      onStartBattle()
    }
  }

  const currentGrade = dungeonManager.getCurrentGrade()
  const unitManager = dungeonManager.getCurrentUnitManager()
  const selectedDifficultyInfo = DIFFICULTY_MODES.find(d => d.id === selectedDifficulty)
  const selectedGradeInfo = availableDungeons.find(d => d.grade === selectedGrade)

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '12px 20px',
        background: 'rgba(30, 30, 50, 0.8)',
        borderRadius: '10px',
        border: '1px solid #667eea'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            🏰 {selectedGradeInfo?.gradeName || 'Select Dungeon'}
          </h1>
        </div>
        
        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {[
            { num: 1, label: 'Grade' },
            { num: 2, label: 'Unit' },
            { num: 3, label: 'Difficulty' }
          ].map(s => (
            <div 
              key={s.num} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '15px',
                background: step >= s.num ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
                cursor: step >= s.num ? 'pointer' : 'default',
                transition: 'all 0.2s',
                fontSize: '12px'
              }} 
              onClick={() => step >= s.num && setStep(s.num)}
            >
              <span style={{ fontWeight: 'bold' }}>{s.num}</span>
              <span style={{ opacity: 0.8 }}>{s.label}</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={onReturnToMap}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid #667eea',
            padding: '8px 16px',
            fontSize: '14px'
          }}
        >
          ← Back to Map
        </button>
      </div>

      {/* Main content */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        gap: '20px',
        minHeight: 0
      }}>
        
        {/* Step 1: Grade Selection */}
        <div style={{
          flex: step === 1 ? 2 : 1,
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '12px',
          border: step === 1 ? '2px solid #667eea' : '1px solid rgba(102, 126, 234, 0.3)',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: step >= 1 ? 1 : 0.5
        }}>
          <div style={{
            color: '#667eea',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>1. Select Grade</span>
            {selectedGrade && <span style={{ color: '#4ecdc4' }}>✓ {selectedGradeInfo?.gradeName}</span>}
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: step === 1 ? 'repeat(3, 1fr)' : '1fr',
            gap: '6px',
            overflowY: 'auto',
            flex: 1
          }}>
            {availableDungeons.map((dungeon) => (
              <button
                key={dungeon.grade}
                onClick={() => handleGradeSelect(dungeon.grade)}
                style={{
                  padding: step === 1 ? '12px' : '8px 10px',
                  textAlign: 'center',
                  fontSize: '13px',
                  background: selectedGrade === dungeon.grade 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'rgba(102, 126, 234, 0.1)',
                  border: selectedGrade === dungeon.grade 
                    ? 'none'
                    : '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: selectedGrade === dungeon.grade ? 'bold' : 'normal' }}>
                  {dungeon.gradeName}
                </div>
                {step === 1 && (
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>
                    {dungeon.unitCount} units
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Unit Selection */}
        <div style={{
          flex: step === 2 ? 2 : 1,
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '12px',
          border: step === 2 ? '2px solid #4ecdc4' : '1px solid rgba(78, 205, 196, 0.3)',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: step >= 2 ? 1 : 0.5
        }}>
          <div style={{
            color: '#4ecdc4',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginBottom: '12px',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>2. Select Unit</span>
            {selectedUnit && <span style={{ color: '#4ecdc4' }}>✓</span>}
          </div>
          {currentGrade && unitManager ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              overflowY: 'auto',
              flex: 1
            }}>
              {unitManager.getAllUnits().map((unit, index) => (
                <button
                  key={index}
                  onClick={() => handleUnitSelect(unit)}
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: '13px',
                    background: selectedUnit === unit 
                      ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
                      : 'rgba(78, 205, 196, 0.1)',
                    border: selectedUnit === unit 
                      ? 'none'
                      : '1px solid rgba(78, 205, 196, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: selectedUnit === unit ? 'bold' : 'normal', marginBottom: '3px' }}>
                    {unit.name}
                  </div>
                  {step === 2 && (
                    <div style={{ 
                      fontSize: '10px', 
                      opacity: 0.7,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '3px'
                    }}>
                      {unit.topics?.slice(0, 3).map((topic, i) => (
                        <span key={i} style={{
                          background: 'rgba(0,0,0,0.2)',
                          padding: '1px 5px',
                          borderRadius: '6px'
                        }}>
                          {topic}
                        </span>
                      ))}
                      {unit.topics?.length > 3 && (
                        <span style={{ opacity: 0.6 }}>+{unit.topics.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontSize: '13px'
            }}>
              Select a grade first
            </div>
          )}
        </div>

        {/* Step 3: Difficulty Selection */}
        <div style={{
          flex: step === 3 ? 2 : 1,
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '12px',
          border: step === 3 ? `2px solid ${selectedDifficultyInfo?.color || '#f093fb'}` : '1px solid rgba(240, 147, 251, 0.3)',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: step >= 3 ? 1 : 0.5
        }}>
          <div style={{
            color: selectedDifficultyInfo?.color || '#f093fb',
            fontSize: '11px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            marginBottom: '12px',
            textTransform: 'uppercase'
          }}>
            3. Select Difficulty
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            flex: 1
          }}>
            {DIFFICULTY_MODES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '14px',
                  background: selectedDifficulty === diff.id 
                    ? `linear-gradient(135deg, ${diff.color}40 0%, ${diff.color}20 100%)`
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedDifficulty === diff.id 
                    ? `2px solid ${diff.color}`
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontSize: '20px' }}>{diff.emoji}</span>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: selectedDifficulty === diff.id ? diff.color : '#fff'
                  }}>
                    {diff.name}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '11px',
                    background: diff.color,
                    color: '#000',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>
                    x{diff.multiplier}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#aaa',
                  marginLeft: '30px'
                }}>
                  {diff.description}
                </div>
              </button>
            ))}
          </div>
          
          {/* Start Battle Button */}
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={handleStartBattle}
              disabled={!selectedGrade || !selectedUnit}
              style={{ 
                width: '100%', 
                padding: '14px',
                fontSize: '16px',
                background: selectedGrade && selectedUnit
                  ? `linear-gradient(135deg, ${selectedDifficultyInfo?.color || '#f093fb'} 0%, ${selectedDifficultyInfo?.color || '#f5576c'}aa 100%)`
                  : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '10px',
                cursor: selectedGrade && selectedUnit ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                opacity: selectedGrade && selectedUnit ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            >
              ⚔️ Start Battle!
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div style={{
        marginTop: '15px',
        padding: '12px 20px',
        background: 'rgba(30, 30, 50, 0.8)',
        borderRadius: '10px',
        border: '1px solid #667eea',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '30px',
        fontSize: '13px'
      }}>
        <div>
          <span style={{ color: '#aaa' }}>Grade: </span>
          <span style={{ color: '#667eea', fontWeight: 'bold' }}>
            {selectedGradeInfo?.gradeName || 'None'}
          </span>
        </div>
        <div>
          <span style={{ color: '#aaa' }}>Unit: </span>
          <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>
            {selectedUnit?.name || 'None'}
          </span>
        </div>
        <div>
          <span style={{ color: '#aaa' }}>Difficulty: </span>
          <span style={{ color: selectedDifficultyInfo?.color, fontWeight: 'bold' }}>
            {selectedDifficultyInfo?.emoji} {selectedDifficultyInfo?.name}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DungeonSelection

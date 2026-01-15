import { useState, useEffect } from 'react'
import MainMenu from './components/MainMenu'
import GameHUD from './components/GameHUD'
import BattleUI from './components/BattleUI'
import DungeonSelection from './components/DungeonSelection'
import { GameEngine } from './game/GameEngine'
import { getAudioManager } from './utils/audioManager'

function App() {
  const [gameState, setGameState] = useState('menu') // menu, map, battle, dungeon-selection
  const [gameEngine, setGameEngine] = useState(null)
  const [selectedGrade, setSelectedGrade] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initial loading
  useEffect(() => {
    // Simulate loading time for assets
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const startGame = () => {
    const engine = new GameEngine()
    setGameEngine(engine)
    setGameState('map')
    
    // Initialize audio on first interaction
    getAudioManager().resume()
  }

  const enterDungeon = (grade) => {
    setSelectedGrade(grade)
    if (gameEngine) {
      gameEngine.selectedGrade = grade
    }
    setGameState('dungeon-selection')
  }

  const startBattle = () => {
    setGameState('battle')
  }

  const returnToMap = () => {
    setGameState('map')
  }

  const returnToMenu = () => {
    setGameState('menu')
    setGameEngine(null)
  }

  // Loading screen
  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#fff'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 'bold'
        }}>
          Math Dungeon
        </div>
        <div style={{
          width: '200px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            animation: 'loading 1.5s ease-in-out infinite'
          }} />
        </div>
        <div style={{
          marginTop: '20px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '14px'
        }}>
          Loading...
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="app">
      {gameState === 'menu' && (
        <MainMenu onStart={startGame} />
      )}
      
      {gameState === 'map' && gameEngine && (
        <GameHUD 
          gameEngine={gameEngine}
          onEnterDungeon={enterDungeon}
          onReturnToMenu={returnToMenu}
        />
      )}
      
      {gameState === 'battle' && gameEngine && (
        <BattleUI 
          gameEngine={gameEngine}
          onReturnToMap={returnToMap}
        />
      )}
      
      {gameState === 'dungeon-selection' && gameEngine && (
        <DungeonSelection 
          gameEngine={gameEngine}
          initialGrade={selectedGrade}
          onStartBattle={startBattle}
          onReturnToMap={returnToMap}
        />
      )}
    </div>
  )
}

export default App

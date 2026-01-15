import { useEffect, useRef, useState, useCallback } from 'react'
import { MapManager } from '../game/Map/MapManager'
import { DungeonManager } from '../game/Dungeon/DungeonManager'
import { getAudioManager } from '../utils/audioManager'

function GameHUD({ gameEngine, onEnterDungeon, onReturnToMenu }) {
  const canvasRef = useRef(null)
  const mapManagerRef = useRef(null)
  const dungeonManagerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const nearbyEntranceRef = useRef(null) // Use ref for key handler
  const [nearbyEntrance, setNearbyEntrance] = useState(null)
  const [heroStats, setHeroStats] = useState(null)
  const [showMinimap, setShowMinimap] = useState(true)
  const [showControls, setShowControls] = useState(true)

  // Update ref when state changes
  useEffect(() => {
    nearbyEntranceRef.current = nearbyEntrance
  }, [nearbyEntrance])

  // Handle E key press separately with useCallback
  const handleKeyPress = useCallback((e) => {
    if (e.key.toLowerCase() === 'e' && nearbyEntranceRef.current) {
      const audioManager = getAudioManager()
      audioManager.resume()
      audioManager.playClickSound()
      onEnterDungeon(nearbyEntranceRef.current.grade)
    }
    // Toggle minimap with M
    if (e.key.toLowerCase() === 'm') {
      setShowMinimap(prev => !prev)
    }
    // Toggle controls help with H
    if (e.key.toLowerCase() === 'h') {
      setShowControls(prev => !prev)
    }
  }, [onEnterDungeon])

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Initialize map manager
    const mapManager = new MapManager(canvas.width, canvas.height)
    mapManagerRef.current = mapManager

    // Store in game engine for access elsewhere
    if (gameEngine) {
      gameEngine.mapManager = mapManager
      gameEngine.hero = mapManager.hero
    }

    // Initialize dungeon manager
    const dungeonManager = new DungeonManager()
    dungeonManagerRef.current = dungeonManager
    if (gameEngine) {
      gameEngine.dungeonManager = dungeonManager
    }

    // Game loop
    let lastTime = 0
    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Update map
      mapManager.update(deltaTime)
      mapManager.render(ctx)

      // Check for nearby entrance
      const entrance = mapManager.getNearbyEntrance()
      setNearbyEntrance(entrance)

      // Update hero stats for HUD
      if (mapManager.hero) {
        setHeroStats({
          level: mapManager.hero.stats.level,
          currentHP: mapManager.hero.stats.currentHP,
          maxHP: mapManager.hero.stats.maxHP,
          experience: mapManager.hero.stats.experience,
          experienceToNextLevel: mapManager.hero.stats.experienceToNextLevel,
          attack: mapManager.hero.stats.attack,
          defense: mapManager.hero.stats.defense,
          hpPercentage: mapManager.hero.stats.getHPPercentage()
        })
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    // Resume audio context on first interaction
    const resumeAudio = () => {
      getAudioManager().resume()
    }
    window.addEventListener('click', resumeAudio, { once: true })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (mapManagerRef.current) {
        mapManagerRef.current.destroy()
      }
    }
  }, [gameEngine])

  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        if (mapManagerRef.current) {
          mapManagerRef.current.canvasWidth = canvas.width
          mapManagerRef.current.canvasHeight = canvas.height
          mapManagerRef.current.camera.width = canvas.width
          mapManagerRef.current.camera.height = canvas.height
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      
      {/* HUD Overlay - Player Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
        padding: '20px',
        borderRadius: '12px',
        border: '2px solid #667eea',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        minWidth: '220px'
      }}>
        <div style={{ 
          color: '#667eea', 
          fontSize: '14px', 
          fontWeight: 'bold', 
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Hero Stats
        </div>
        {heroStats && (
          <>
            <div style={{ color: '#fff', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#aaa' }}>Level</span>
                <span style={{ fontWeight: 'bold', color: '#4ecdc4' }}>{heroStats.level}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#aaa' }}>Attack</span>
                <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{heroStats.attack}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#aaa' }}>Defense</span>
                <span style={{ fontWeight: 'bold', color: '#4a90e2' }}>{heroStats.defense}</span>
              </div>
            </div>
            
            {/* HP Bar */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#aaa', fontSize: '12px' }}>HP</span>
                <span style={{ color: '#fff', fontSize: '12px' }}>{heroStats.currentHP} / {heroStats.maxHP}</span>
              </div>
              <div style={{
                width: '100%',
                height: '12px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${heroStats.hpPercentage * 100}%`,
                  height: '100%',
                  background: heroStats.hpPercentage > 0.5 
                    ? 'linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%)' 
                    : heroStats.hpPercentage > 0.25 
                      ? 'linear-gradient(90deg, #f7dc6f 0%, #f39c12 100%)'
                      : 'linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 100%)',
                  transition: 'width 0.3s ease',
                  borderRadius: '6px'
                }}></div>
              </div>
            </div>
            
            {/* EXP Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: '#aaa', fontSize: '12px' }}>EXP</span>
                <span style={{ color: '#fff', fontSize: '12px' }}>{heroStats.experience} / {heroStats.experienceToNextLevel}</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(heroStats.experience / heroStats.experienceToNextLevel) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  transition: 'width 0.3s ease',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Top Right - Menu and Settings */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <button
          onClick={() => setShowControls(prev => !prev)}
          style={{
            padding: '10px 15px',
            fontSize: '14px',
            background: 'rgba(30, 30, 50, 0.9)',
            border: '2px solid #667eea'
          }}
          title="Toggle Controls (H)"
        >
          ?
        </button>
        <button
          onClick={onReturnToMenu}
          style={{
            padding: '10px 20px'
          }}
        >
          Menu
        </button>
      </div>

      {/* Controls Help Panel */}
      {showControls && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #667eea',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          color: '#fff',
          fontSize: '14px'
        }}>
          <div style={{ 
            color: '#667eea', 
            fontSize: '12px', 
            fontWeight: 'bold', 
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Controls
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>WASD / Arrows</span> - Move
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>E</span> - Enter Dungeon
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>M</span> - Toggle Minimap
          </div>
          <div>
            <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>H</span> - Toggle Help
          </div>
        </div>
      )}

      {/* Minimap */}
      {showMinimap && mapManagerRef.current && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '180px',
          height: '180px',
          background: 'rgba(30, 30, 50, 0.9)',
          borderRadius: '12px',
          border: '2px solid #667eea',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden'
        }}>
          <canvas 
            ref={el => {
              if (el && mapManagerRef.current) {
                const ctx = el.getContext('2d')
                el.width = 180
                el.height = 180
                
                // Draw minimap
                const mapManager = mapManagerRef.current
                const scale = 180 / mapManager.mapWidth
                
                // Background
                ctx.fillStyle = '#1a1a2e'
                ctx.fillRect(0, 0, 180, 180)
                
                // Lobby
                ctx.fillStyle = 'rgba(102, 126, 234, 0.3)'
                ctx.fillRect(
                  mapManager.lobbyBounds.x * scale,
                  mapManager.lobbyBounds.y * scale,
                  mapManager.lobbyBounds.width * scale,
                  mapManager.lobbyBounds.height * scale
                )
                
                // Dungeon entrances
                mapManager.dungeonEntrances.forEach(entrance => {
                  ctx.fillStyle = entrance.color
                  ctx.fillRect(
                    entrance.x * scale,
                    entrance.y * scale,
                    entrance.width * scale,
                    entrance.height * scale
                  )
                })
                
                // Player position
                ctx.fillStyle = '#4ecdc4'
                ctx.beginPath()
                ctx.arc(
                  mapManager.hero.x * scale + 4,
                  mapManager.hero.y * scale + 4,
                  5,
                  0,
                  Math.PI * 2
                )
                ctx.fill()
                
                // Camera viewport
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.lineWidth = 1
                ctx.strokeRect(
                  mapManager.camera.x * scale,
                  mapManager.camera.y * scale,
                  mapManager.camera.width * scale,
                  mapManager.camera.height * scale
                )
              }
            }}
            style={{ width: '100%', height: '100%' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#667eea',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Minimap
          </div>
        </div>
      )}

      {/* Nearby Entrance Indicator */}
      {nearbyEntrance && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(40, 40, 70, 0.98) 100%)',
          padding: '20px 40px',
          borderRadius: '12px',
          border: `3px solid ${nearbyEntrance.color}`,
          boxShadow: `0 0 30px ${nearbyEntrance.color}40`,
          color: '#fff',
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: nearbyEntrance.color
          }}>
            {nearbyEntrance.gradeName}
          </div>
          <div style={{ 
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            Press 
            <span style={{
              background: nearbyEntrance.color,
              color: '#000',
              padding: '4px 12px',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>E</span> 
            to Enter
          </div>
        </div>
      )}

      {/* Game Title Watermark */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'rgba(255, 255, 255, 0.3)',
        fontSize: '12px',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        MATH DUNGEON ADVENTURE
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.02); }
        }
      `}</style>
    </div>
  )
}

export default GameHUD

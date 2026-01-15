import { useState, useEffect } from 'react'
import Leaderboard from './Leaderboard'
import Settings from './Settings'
import ShopUI from './ShopUI'
import { getAudioManager } from '../utils/audioManager'
import { CharacterStats } from '../game/Characters/CharacterStats'

function MainMenu({ onStart }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShop, setShowShop] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  // Player stats for the shop
  const [playerStats, setPlayerStats] = useState(new CharacterStats())

  useEffect(() => {
    // Trigger fade in animation
    setTimeout(() => setFadeIn(true), 100)

    // Load saved data for the shop
    const stats = new CharacterStats()
    stats.load() // Try to load saved game
    setPlayerStats(stats)
  }, [])

  const handleStart = () => {
    const audioManager = getAudioManager()
    audioManager.resume()
    audioManager.playClickSound()
    onStart()
  }

  // 🏪 Handle Shop Close
  const handleCloseShop = () => {
    setShowShop(false)
    playerStats.save() // Save game when closing shop!
  }

  if (showLeaderboard) {
    return <Leaderboard onBack={() => setShowLeaderboard(false)} />
  }

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />
  }

  if (showShop) {
    return <ShopUI
      playerStats={playerStats}
      onClose={handleCloseShop}
      onPurchase={() => playerStats.save()} // Save immediately after buying
    />
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#667eea',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Decorative math symbols */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '100px',
        color: 'rgba(102, 126, 234, 0.1)',
        fontWeight: 'bold'
      }}>∑</div>
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        fontSize: '80px',
        color: 'rgba(102, 126, 234, 0.1)',
        fontWeight: 'bold'
      }}>π</div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        fontSize: '90px',
        color: 'rgba(102, 126, 234, 0.1)',
        fontWeight: 'bold'
      }}>∫</div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '5%',
        fontSize: '70px',
        color: 'rgba(102, 126, 234, 0.1)',
        fontWeight: 'bold'
      }}>√</div>

      {/* Main content */}
      <div style={{
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out',
        textAlign: 'center',
        zIndex: 1
      }}>
        {/* Logo/Title */}
        <div style={{
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '16px',
            color: '#667eea',
            fontWeight: 'bold',
            letterSpacing: '8px',
            marginBottom: '10px',
            textTransform: 'uppercase'
          }}>
            Alberta Curriculum
          </div>
          <h1 style={{
            fontSize: '64px',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold',
            textShadow: 'none',
            letterSpacing: '2px'
          }}>
            Math Dungeon
          </h1>
          <h2 style={{
            fontSize: '28px',
            color: '#4ecdc4',
            fontWeight: 'normal',
            letterSpacing: '6px',
            textTransform: 'uppercase'
          }}>
            Adventure
          </h2>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '18px',
          marginBottom: '50px',
          color: 'rgba(255, 255, 255, 0.7)',
          maxWidth: '500px',
          lineHeight: '1.6'
        }}>
          Explore dungeons, battle monsters, and master mathematics from Grade 1 to Grade 12!
        </p>

        {/* Menu buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center'
        }}>
          <button
            onClick={handleStart}
            style={{
              fontSize: '22px',
              padding: '18px 60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.02)'
              e.target.style.boxShadow = '0 15px 50px rgba(102, 126, 234, 0.5)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)'
              e.target.style.boxShadow = '0 10px 40px rgba(102, 126, 234, 0.4)'
            }}
          >
            Start Adventure
          </button>

          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            {/* 🏪 WEAPON SHOP BUTTON */}
            <button
              onClick={() => setShowShop(true)}
              style={{
                fontSize: '16px',
                padding: '14px 30px',
                background: 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)', // Gold color!
                color: '#1a1a2e',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 5px 15px rgba(255, 215, 0, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 5px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              🏪 Weapon Shop
            </button>

            <button
              onClick={() => setShowLeaderboard(true)}
              style={{
                fontSize: '16px',
                padding: '14px 30px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #667eea',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                fontSize: '16px',
                padding: '14px 30px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid #667eea',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(102, 126, 234, 0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Grade coverage info */}
        <div style={{
          marginTop: '60px',
          padding: '25px 40px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{
            color: '#667eea',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '15px',
            textTransform: 'uppercase'
          }}>
            Curriculum Coverage
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {['Math 1-6', 'Math 7-9', 'Math 10-1', 'Math 20-1', 'Math 30-1'].map((grade, i) => (
              <span key={i} style={{
                padding: '8px 16px',
                background: 'rgba(102, 126, 234, 0.2)',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#fff'
              }}>
                {grade}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '8px' }}>
          Use <span style={{ color: '#4ecdc4' }}>WASD</span> or <span style={{ color: '#4ecdc4' }}>Arrow Keys</span> to move •
          Press <span style={{ color: '#4ecdc4' }}>E</span> near dungeon entrances to enter
        </div>
        <div>
          Serious Game for Alberta Mathematics Education
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

export default MainMenu

import { useState, useEffect } from 'react'
import { getAudioManager } from '../utils/audioManager'

function Settings({ onBack }) {
  const [volume, setVolume] = useState(50)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    // Load saved settings
    const savedVolume = localStorage.getItem('mathDungeonVolume')
    const savedSound = localStorage.getItem('mathDungeonSound')
    
    if (savedVolume) setVolume(parseInt(savedVolume))
    if (savedSound) setSoundEnabled(savedSound === 'true')
  }, [])

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    localStorage.setItem('mathDungeonVolume', newVolume.toString())
    
    const audioManager = getAudioManager()
    audioManager.setVolume(newVolume / 100)
  }

  const handleSoundToggle = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem('mathDungeonSound', newValue.toString())
    
    const audioManager = getAudioManager()
    audioManager.setSoundEnabled(newValue)
  }

  const handleResetProgress = () => {
    localStorage.removeItem('mathDungeonSave')
    localStorage.removeItem('mathDungeonProgress')
    localStorage.removeItem('mathDungeonLeaderboard')
    setShowResetConfirm(false)
    alert('Progress has been reset!')
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      padding: '40px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          fontSize: '36px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0
        }}>
          Settings
        </h1>
        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid #667eea'
          }}
        >
          Back
        </button>
      </div>

      {/* Settings Panels */}
      <div style={{ 
        display: 'flex', 
        gap: '30px',
        flex: 1 
      }}>
        {/* Audio Settings */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '16px',
          border: '2px solid #667eea',
          padding: '30px'
        }}>
          <div style={{
            color: '#667eea',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '25px',
            textTransform: 'uppercase'
          }}>
            Audio Settings
          </div>
          
          {/* Sound Toggle */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span>Sound Effects</span>
              <button
                onClick={handleSoundToggle}
                style={{
                  width: '60px',
                  height: '32px',
                  borderRadius: '16px',
                  border: 'none',
                  background: soundEnabled 
                    ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
                    : 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '4px',
                  left: soundEnabled ? '32px' : '4px',
                  transition: 'left 0.3s ease'
                }} />
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>
              Enable or disable game sound effects
            </p>
          </div>

          {/* Volume Slider */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <span>Volume</span>
              <span style={{ 
                color: '#667eea',
                fontWeight: 'bold'
              }}>
                {volume}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              style={{ 
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                appearance: 'none',
                background: `linear-gradient(to right, #667eea 0%, #667eea ${volume}%, rgba(255,255,255,0.2) ${volume}%, rgba(255,255,255,0.2) 100%)`,
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Test Sound */}
          <button
            onClick={() => {
              const audioManager = getAudioManager()
              audioManager.resume()
              audioManager.playClickSound()
            }}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(102, 126, 234, 0.2)',
              border: '2px solid #667eea'
            }}
          >
            Test Sound
          </button>
        </div>

        {/* Game Settings */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '16px',
          border: '2px solid #ff6b6b',
          padding: '30px'
        }}>
          <div style={{
            color: '#ff6b6b',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '25px',
            textTransform: 'uppercase'
          }}>
            Game Settings
          </div>
          
          {/* Reset Progress */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '10px' }}>Reset Progress</h3>
            <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '15px' }}>
              This will delete all your saved progress, including completed grades, 
              battle statistics, and leaderboard entries. This action cannot be undone.
            </p>
            
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 107, 107, 0.2)',
                  border: '2px solid #ff6b6b',
                  color: '#ff6b6b'
                }}
              >
                Reset All Progress
              </button>
            ) : (
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '2px solid #ff6b6b',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <p style={{ marginBottom: '15px', color: '#ff6b6b' }}>
                  Are you sure? This cannot be undone!
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleResetProgress}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#ff6b6b',
                      border: 'none',
                      color: '#fff'
                    }}
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid #fff'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
          borderRadius: '16px',
          border: '2px solid #4ecdc4',
          padding: '30px'
        }}>
          <div style={{
            color: '#4ecdc4',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '25px',
            textTransform: 'uppercase'
          }}>
            About
          </div>
          
          <h3 style={{ color: '#4ecdc4', marginBottom: '15px' }}>
            Math Dungeon Adventure
          </h3>
          
          <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px', lineHeight: '1.6' }}>
            A serious educational game designed to help students learn and practice 
            mathematics according to the Alberta curriculum. Explore dungeons, battle 
            monsters, and master math concepts from Grade 1 to Grade 12!
          </p>
          
          <div style={{ 
            background: 'rgba(78, 205, 196, 0.1)', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '12px', color: '#4ecdc4', marginBottom: '8px' }}>
              CURRICULUM COVERAGE
            </div>
            <div style={{ fontSize: '14px' }}>
              Math 1-6, Math 7-9, Math 10-1, Math 20-1, Math 30-1
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(78, 205, 196, 0.1)', 
            padding: '15px', 
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '12px', color: '#4ecdc4', marginBottom: '8px' }}>
              ALGORITHMS USED
            </div>
            <div style={{ fontSize: '14px' }}>
              Binary Search, Linear Search, Quicksort, Bubble Sort
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

import { useState, useEffect } from 'react'
import { SaveSystem } from '../game/Data/SaveSystem'
import { LeaderboardSorter } from '../game/Data/LeaderboardSorter'
import { getAudioManager } from '../utils/audioManager'

function Leaderboard({ onBack }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [sortBy, setSortBy] = useState('score')
  const [saveSystem] = useState(() => new SaveSystem())
  const [sorter] = useState(() => new LeaderboardSorter())

  useEffect(() => {
    loadLeaderboard()
  }, [])

  useEffect(() => {
    if (leaderboard.length > 0) {
      const sorted = sorter.sortLeaderboard([...leaderboard], sortBy)
      setLeaderboard(sorted)
    }
  }, [sortBy])

  const loadLeaderboard = () => {
    const entries = saveSystem.getLeaderboard()
    const sorted = sorter.sortLeaderboard(entries, sortBy)
    setLeaderboard(sorted)
  }

  const handleSort = (newSortBy) => {
    getAudioManager().playClickSound()
    setSortBy(newSortBy)
  }

  const getRankIcon = (rank) => {
    if (rank === 0) return '🥇'
    if (rank === 1) return '🥈'
    if (rank === 2) return '🥉'
    return `#${rank + 1}`
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
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '36px',
            background: 'linear-gradient(135deg, #f7dc6f 0%, #f39c12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            🏆 Leaderboard
          </h1>
          <p style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: '14px' }}>
            Top players ranked by their achievements
          </p>
        </div>
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

      {/* Main content */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 70, 0.95) 100%)',
        borderRadius: '16px',
        border: '2px solid #f7dc6f',
        padding: '25px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Sort buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          <span style={{ 
            color: '#aaa', 
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center'
          }}>
            Sort by:
          </span>
          {[
            { key: 'score', label: 'Score' },
            { key: 'level', label: 'Level' },
            { key: 'completionPercentage', label: 'Completion' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleSort(key)}
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                background: sortBy === key 
                  ? 'linear-gradient(135deg, #f7dc6f 0%, #f39c12 100%)'
                  : 'rgba(247, 220, 111, 0.1)',
                border: sortBy === key 
                  ? 'none'
                  : '2px solid rgba(247, 220, 111, 0.3)',
                color: sortBy === key ? '#000' : '#f7dc6f',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: sortBy === key ? 'bold' : 'normal'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        {leaderboard.length === 0 ? (
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#aaa'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎮</div>
            <h3 style={{ marginBottom: '10px' }}>No entries yet!</h3>
            <p>Play the game to appear on the leaderboard.</p>
          </div>
        ) : (
          <div style={{ 
            flex: 1,
            overflowY: 'auto'
          }}>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 120px 100px 140px',
              padding: '15px 20px',
              background: 'rgba(247, 220, 111, 0.1)',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '12px',
              color: '#f7dc6f',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              <div>Rank</div>
              <div>Player</div>
              <div style={{ textAlign: 'right' }}>Score</div>
              <div style={{ textAlign: 'right' }}>Level</div>
              <div style={{ textAlign: 'right' }}>Completion</div>
            </div>

            {/* Table rows */}
            {leaderboard.map((entry, index) => (
              <div 
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 120px 100px 140px',
                  padding: '18px 20px',
                  background: index < 3 
                    ? `rgba(247, 220, 111, ${0.15 - index * 0.04})`
                    : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  alignItems: 'center',
                  border: index < 3 
                    ? '1px solid rgba(247, 220, 111, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  fontSize: index < 3 ? '24px' : '16px',
                  fontWeight: 'bold',
                  color: index < 3 ? '#f7dc6f' : '#aaa'
                }}>
                  {getRankIcon(index)}
                </div>
                <div style={{ fontWeight: 'bold' }}>
                  {entry.playerName || 'Anonymous Hero'}
                </div>
                <div style={{ 
                  textAlign: 'right',
                  color: '#4ecdc4',
                  fontWeight: 'bold'
                }}>
                  {(entry.score || 0).toLocaleString()}
                </div>
                <div style={{ 
                  textAlign: 'right',
                  color: '#667eea'
                }}>
                  Lv.{entry.level || 1}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {entry.completionPercentage 
                    ? `${entry.completionPercentage.toFixed(1)}%`
                    : 'N/A'
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats footer */}
        <div style={{
          marginTop: '20px',
          padding: '15px 20px',
          background: 'rgba(247, 220, 111, 0.05)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '1px solid rgba(247, 220, 111, 0.2)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>
              Total Players
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f7dc6f' }}>
              {leaderboard.length}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>
              Highest Score
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4ecdc4' }}>
              {leaderboard.length > 0 
                ? (leaderboard[0]?.score || 0).toLocaleString()
                : '0'
              }
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>
              Highest Level
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
              {leaderboard.length > 0 
                ? Math.max(...leaderboard.map(e => e.level || 1))
                : '1'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard

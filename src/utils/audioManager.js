/**
 * Audio Manager
 * Manages game audio using Web Audio API
 * Generates simple tones programmatically (no external files needed)
 */
export class AudioManager {
  constructor() {
    this.audioContext = null
    this.masterVolume = 0.5
    this.soundEnabled = true
    
    // Initialize audio context
    this.initAudioContext()
  }

  /**
   * Initialize Web Audio API context
   */
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API not supported:', e)
    }
  }

  /**
   * Generate a tone
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {string} type - Waveform type ('sine', 'square', 'sawtooth', 'triangle')
   * @returns {OscillatorNode}
   */
  generateTone(frequency, duration = 0.1, type = 'sine') {
    if (!this.audioContext || !this.soundEnabled) return null

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)

    return oscillator
  }

  /**
   * Play attack sound
   */
  playAttackSound() {
    // Two-tone attack sound
    this.generateTone(400, 0.1, 'square')
    setTimeout(() => {
      this.generateTone(500, 0.1, 'square')
    }, 50)
  }

  /**
   * Play victory sound
   */
  playVictorySound() {
    // Ascending tones for victory
    const notes = [261.63, 329.63, 392.00, 523.25] // C, E, G, C (C major chord)
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.2, 'sine')
      }, index * 150)
    })
  }

  /**
   * Play defeat sound
   */
  playDefeatSound() {
    // Descending tones for defeat
    const notes = [392.00, 329.63, 261.63] // G, E, C
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.3, 'sawtooth')
      }, index * 200)
    })
  }

  /**
   * Play UI click sound
   */
  playClickSound() {
    this.generateTone(800, 0.05, 'sine')
  }

  /**
   * Play level up sound
   */
  playLevelUpSound() {
    // Ascending scale
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.1, 'sine')
      }, index * 80)
    })
  }

  /**
   * Play background music (simple loop)
   */
  playBackgroundMusic() {
    if (!this.audioContext || !this.soundEnabled) return

    // Simple ambient tone
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 220 // A3

    gainNode.gain.value = this.masterVolume * 0.2 // Lower volume for background

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.start()
    
    // Store reference to stop later
    this.backgroundMusic = { oscillator, gainNode }
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.oscillator.stop()
      this.backgroundMusic = null
    }
  }

  /**
   * Set master volume
   * @param {number} volume - Volume (0-1)
   */
  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Enable/disable sounds
   * @param {boolean} enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled
    if (!enabled) {
      this.stopBackgroundMusic()
    }
  }

  /**
   * Resume audio context (required after user interaction)
   */
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }
}

// Singleton instance
let audioManagerInstance = null

/**
 * Get audio manager instance
 * @returns {AudioManager}
 */
export function getAudioManager() {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}

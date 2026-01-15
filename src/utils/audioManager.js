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

  // This function generates a beep or sound effect (a "tone").
  // It uses something called an Oscillator—a virtual electronic instrument!
  generateTone(frequency, duration = 0.1, type = 'sine') {
    if (!this.audioContext || !this.soundEnabled) return null

    // 1. Create the oscillator (makes the sound waves)
    const oscillator = this.audioContext.createOscillator()

    // 2. Create the gain node (controls the volume)
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.value = frequency

    // 3. Make the sound fade out smoothly so it doesn't "pop"
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    // 4. Connect everything together: Oscillator -> Volume Control -> Speakers
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // 5. Start and stop the sound
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)

    return oscillator
  }

  // This plays a quick "thud-thud" sound when someone attacks
  playAttackSound() {
    this.generateTone(400, 0.1, 'square')
    setTimeout(() => {
      this.generateTone(500, 0.1, 'square')
    }, 50)
  }

  // This plays a series of happy notes for winning!
  playVictorySound() {
    const notes = [261.63, 329.63, 392.00, 523.25] // These represent a musical C Major Chord
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.generateTone(freq, 0.2, 'sine')
      }, index * 150) // Play each note a little bit after the last one
    })
  }

  // This plays sad, low notes for losing
  playDefeatSound() {
    const notes = [392.00, 329.63, 261.63] // Descending G, E, C
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

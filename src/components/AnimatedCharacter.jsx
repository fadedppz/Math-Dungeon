import { useEffect, useRef, useState } from 'react'

/**
 * AnimatedCharacter Component
 * Renders an animated character sprite on a canvas with smooth frame transitions
 */
function AnimatedCharacter({ 
  character, 
  animation = 'idle', 
  scale = 2, 
  shake = false,
  style = {}
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const frameRef = useRef(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!character) return

    // Ensure sprites are initialized
    if (character.ensureSprites) {
      character.ensureSprites()
    }

    setIsReady(true)
  }, [character])

  useEffect(() => {
    if (!character || !isReady) return

    // Set the animation on the character
    if (character.setAnimation) {
      character.setAnimation(animation)
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const frameWidth = (character.width || 48) * scale
    const frameHeight = (character.height || 48) * scale

    canvas.width = frameWidth
    canvas.height = frameHeight

    let lastTime = 0
    const animationSpeed = character.animationSpeed || 200

    const render = (currentTime) => {
      const deltaTime = currentTime - lastTime

      // Update animation frame
      if (deltaTime > animationSpeed) {
        frameRef.current++
        lastTime = currentTime
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get current frame
      let frame = null
      if (character.animations && character.animations[animation]) {
        const frames = character.animations[animation]
        if (frames.length > 0) {
          frame = frames[frameRef.current % frames.length]
        }
      } else if (character.getCurrentFrame) {
        // Update character's internal animation state
        if (character.update) {
          character.update(deltaTime)
        }
        frame = character.getCurrentFrame()
      }

      // Draw the frame scaled
      if (frame) {
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(
          frame,
          0,
          0,
          frame.width,
          frame.height,
          0,
          0,
          frameWidth,
          frameHeight
        )
      }

      animationRef.current = requestAnimationFrame(render)
    }

    animationRef.current = requestAnimationFrame(render)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [character, animation, scale, isReady])

  const shakeStyle = shake ? {
    animation: 'characterShake 0.1s ease-in-out infinite'
  } : {}

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          imageRendering: 'pixelated',
          ...shakeStyle,
          ...style
        }}
      />
      <style>{`
        @keyframes characterShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </>
  )
}

export default AnimatedCharacter

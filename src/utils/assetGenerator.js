/**
 * Procedural Asset Generator
 * Generates all game sprites and tiles programmatically using Canvas API
 * Includes animated sprite sheets with multiple frames
 */

/**
 * Animation configuration
 */
const ANIMATION_CONFIG = {
  frameWidth: 48,
  frameHeight: 48,
  idleFrames: 4,
  walkFrames: 6,
  attackFrames: 4,
  hitFrames: 2,
  victoryFrames: 4
}

/**
 * Generate an animated hero sprite sheet
 * Returns multiple frames for different animations
 * @param {string} color - Primary color for the character
 * @returns {Object} Object containing animation frames
 */
export function generateHeroSpriteSheet(color = '#4a90e2') {
  const animations = {
    idle: [],
    walk: [],
    attack: [],
    hit: [],
    victory: []
  }

  // Generate idle animation (breathing/bobbing)
  for (let frame = 0; frame < ANIMATION_CONFIG.idleFrames; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')
    
    // Bobbing offset
    const bobOffset = Math.sin((frame / ANIMATION_CONFIG.idleFrames) * Math.PI * 2) * 2
    
    drawHeroFrame(ctx, color, 24, 28 + bobOffset, frame, 'idle')
    animations.idle.push(canvas)
  }

  // Generate walk animation
  for (let frame = 0; frame < ANIMATION_CONFIG.walkFrames; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')
    
    // Walking motion
    const walkPhase = (frame / ANIMATION_CONFIG.walkFrames) * Math.PI * 2
    const legOffset = Math.sin(walkPhase) * 3
    
    drawHeroFrame(ctx, color, 24, 28, frame, 'walk', legOffset)
    animations.walk.push(canvas)
  }

  // Generate attack animation
  for (let frame = 0; frame < ANIMATION_CONFIG.attackFrames; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')
    
    drawHeroFrame(ctx, color, 24, 28, frame, 'attack')
    animations.attack.push(canvas)
  }

  // Generate hit animation
  for (let frame = 0; frame < ANIMATION_CONFIG.hitFrames; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')
    
    const shakeOffset = frame % 2 === 0 ? -3 : 3
    drawHeroFrame(ctx, color, 24 + shakeOffset, 28, frame, 'hit')
    animations.hit.push(canvas)
  }

  // Generate victory animation
  for (let frame = 0; frame < ANIMATION_CONFIG.victoryFrames; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')
    
    const jumpOffset = Math.sin((frame / ANIMATION_CONFIG.victoryFrames) * Math.PI) * 8
    drawHeroFrame(ctx, color, 24, 28 - jumpOffset, frame, 'victory')
    animations.victory.push(canvas)
  }

  return animations
}

/**
 * Draw a single hero frame
 */
function drawHeroFrame(ctx, color, centerX, centerY, frame, animationType, legOffset = 0) {
  const darkerColor = shadeColor(color, -30)
  const lighterColor = shadeColor(color, 30)
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 16, 10, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Body (torso)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, 8, 10, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Body highlight
  ctx.fillStyle = lighterColor
  ctx.beginPath()
  ctx.ellipse(centerX - 2, centerY - 3, 3, 5, -0.3, 0, Math.PI * 2)
  ctx.fill()

  // Legs with animation
  ctx.fillStyle = darkerColor
  if (animationType === 'walk') {
    // Walking legs
    ctx.fillRect(centerX - 6, centerY + 6, 4, 10 + legOffset)
    ctx.fillRect(centerX + 2, centerY + 6, 4, 10 - legOffset)
  } else if (animationType === 'victory') {
    // Victory pose - legs apart
    ctx.save()
    ctx.translate(centerX - 4, centerY + 6)
    ctx.rotate(-0.2)
    ctx.fillRect(0, 0, 4, 10)
    ctx.restore()
    ctx.save()
    ctx.translate(centerX + 4, centerY + 6)
    ctx.rotate(0.2)
    ctx.fillRect(-4, 0, 4, 10)
    ctx.restore()
  } else {
    // Standing legs
    ctx.fillRect(centerX - 6, centerY + 6, 4, 10)
    ctx.fillRect(centerX + 2, centerY + 6, 4, 10)
  }

  // Arms
  if (animationType === 'attack') {
    // Attack pose - arm extended
    const armAngle = (frame / ANIMATION_CONFIG.attackFrames) * Math.PI * 0.8 - 0.4
    ctx.save()
    ctx.translate(centerX + 6, centerY - 2)
    ctx.rotate(armAngle)
    ctx.fillStyle = color
    ctx.fillRect(0, -2, 12, 4)
    // Sword
    ctx.fillStyle = '#c0c0c0'
    ctx.fillRect(12, -3, 10, 2)
    ctx.fillRect(12, 1, 10, 2)
    ctx.fillStyle = '#ffd700'
    ctx.fillRect(10, -4, 4, 8)
    ctx.restore()
    // Left arm
    ctx.fillStyle = color
    ctx.fillRect(centerX - 12, centerY - 4, 4, 8)
  } else if (animationType === 'victory') {
    // Victory - arms up
    ctx.fillStyle = color
    ctx.save()
    ctx.translate(centerX - 8, centerY - 2)
    ctx.rotate(-0.8)
    ctx.fillRect(0, -2, 10, 4)
    ctx.restore()
    ctx.save()
    ctx.translate(centerX + 8, centerY - 2)
    ctx.rotate(0.8)
    ctx.fillRect(-10, -2, 10, 4)
    ctx.restore()
  } else {
    // Normal arms
    ctx.fillStyle = color
    ctx.fillRect(centerX - 12, centerY - 4, 4, 8)
    ctx.fillRect(centerX + 8, centerY - 4, 4, 8)
  }

  // Head
  ctx.fillStyle = '#ffdbac'
  ctx.beginPath()
  ctx.arc(centerX, centerY - 12, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Head highlight
  ctx.fillStyle = '#ffe8cc'
  ctx.beginPath()
  ctx.arc(centerX - 2, centerY - 14, 3, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  const eyeOffset = animationType === 'hit' ? 1 : 0
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(centerX - 3 + eyeOffset, centerY - 13, 1.5, 0, Math.PI * 2)
  ctx.arc(centerX + 3 + eyeOffset, centerY - 13, 1.5, 0, Math.PI * 2)
  ctx.fill()
  
  // Eye highlights
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.arc(centerX - 3.5 + eyeOffset, centerY - 13.5, 0.5, 0, Math.PI * 2)
  ctx.arc(centerX + 2.5 + eyeOffset, centerY - 13.5, 0.5, 0, Math.PI * 2)
  ctx.fill()

  // Mouth
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1
  if (animationType === 'hit') {
    // Hurt expression
    ctx.beginPath()
    ctx.arc(centerX, centerY - 8, 2, 0, Math.PI)
    ctx.stroke()
  } else if (animationType === 'victory') {
    // Happy expression
    ctx.beginPath()
    ctx.arc(centerX, centerY - 10, 3, 0, Math.PI)
    ctx.stroke()
  } else {
    // Normal expression
    ctx.beginPath()
    ctx.moveTo(centerX - 2, centerY - 9)
    ctx.lineTo(centerX + 2, centerY - 9)
    ctx.stroke()
  }

  // Hair
  ctx.fillStyle = '#4a3728'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY - 18, 7, 4, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.fillRect(centerX - 7, centerY - 18, 2, 6)
  ctx.fillRect(centerX + 5, centerY - 18, 2, 6)
}

/**
 * Generate animated enemy sprite sheet
 * @param {string} type - Enemy type (slime, goblin, skeleton, dragon)
 * @param {string} color - Primary color
 * @returns {Object} Animation frames object
 */
export function generateEnemySpriteSheet(type = 'slime', color = '#8b4513') {
  const animations = {
    idle: [],
    attack: [],
    hit: [],
    death: []
  }

  const frameCount = 4

  for (let frame = 0; frame < frameCount; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')

    drawEnemyFrame(ctx, type, color, 24, 28, frame, 'idle')
    animations.idle.push(canvas)
  }

  for (let frame = 0; frame < frameCount; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')

    drawEnemyFrame(ctx, type, color, 24, 28, frame, 'attack')
    animations.attack.push(canvas)
  }

  for (let frame = 0; frame < 2; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')

    const shakeX = frame % 2 === 0 ? -3 : 3
    drawEnemyFrame(ctx, type, color, 24 + shakeX, 28, frame, 'hit')
    animations.hit.push(canvas)
  }

  for (let frame = 0; frame < frameCount; frame++) {
    const canvas = document.createElement('canvas')
    canvas.width = ANIMATION_CONFIG.frameWidth
    canvas.height = ANIMATION_CONFIG.frameHeight
    const ctx = canvas.getContext('2d')

    ctx.globalAlpha = 1 - (frame / frameCount) * 0.7
    drawEnemyFrame(ctx, type, color, 24, 28 + frame * 2, frame, 'death')
    animations.death.push(canvas)
  }

  return animations
}

/**
 * Draw a single enemy frame
 */
function drawEnemyFrame(ctx, type, color, centerX, centerY, frame, animationType) {
  const phase = (frame / 4) * Math.PI * 2
  
  switch (type) {
    case 'slime':
      drawSlimeFrame(ctx, color, centerX, centerY, phase, animationType)
      break
    case 'goblin':
      drawGoblinFrame(ctx, color, centerX, centerY, phase, animationType)
      break
    case 'skeleton':
      drawSkeletonFrame(ctx, centerX, centerY, phase, animationType)
      break
    case 'dragon':
      drawDragonFrame(ctx, color, centerX, centerY, phase, animationType)
      break
    default:
      drawSlimeFrame(ctx, color, centerX, centerY, phase, animationType)
  }
}

/**
 * Draw slime enemy frame
 */
function drawSlimeFrame(ctx, color, centerX, centerY, phase, animationType) {
  const squishY = Math.sin(phase) * 3
  const squishX = Math.cos(phase) * 2
  const darkerColor = shadeColor(color, -30)
  const lighterColor = shadeColor(color, 50)

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 10, 12 + squishX, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Main body
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(centerX, centerY - squishY / 2, 14 + squishX, 12 - squishY / 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // Highlight
  ctx.fillStyle = lighterColor
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.ellipse(centerX - 4, centerY - 6 - squishY / 2, 5, 4, -0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // Eyes
  const eyeY = centerY - 2 - squishY / 2
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.ellipse(centerX - 5, eyeY, 4, 5, 0, 0, Math.PI * 2)
  ctx.ellipse(centerX + 5, eyeY, 4, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(centerX - 4, eyeY + 1, 2, 0, Math.PI * 2)
  ctx.arc(centerX + 6, eyeY + 1, 2, 0, Math.PI * 2)
  ctx.fill()

  // Mouth
  if (animationType === 'attack') {
    ctx.fillStyle = darkerColor
    ctx.beginPath()
    ctx.arc(centerX, centerY + 4 - squishY / 2, 4, 0, Math.PI)
    ctx.fill()
  }
}

/**
 * Draw goblin enemy frame
 */
function drawGoblinFrame(ctx, color, centerX, centerY, phase, animationType) {
  const shiftX = Math.sin(phase) * 1.5
  const bobY = Math.cos(phase) * 1
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 14, 10, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Body
  ctx.fillStyle = '#228b22'
  ctx.beginPath()
  ctx.ellipse(centerX + shiftX, centerY + 4 + bobY, 10, 12, 0, 0, Math.PI * 2)
  ctx.fill()

  // Legs
  ctx.fillStyle = '#1a6b1a'
  ctx.fillRect(centerX - 6 + shiftX, centerY + 10 + bobY, 4, 8)
  ctx.fillRect(centerX + 2 + shiftX, centerY + 10 + bobY, 4, 8)

  // Arms
  if (animationType === 'attack') {
    ctx.save()
    ctx.translate(centerX + 10 + shiftX, centerY + bobY)
    ctx.rotate(Math.sin(phase * 2) * 0.5)
    ctx.fillRect(0, -2, 10, 4)
    ctx.restore()
  } else {
    ctx.fillRect(centerX - 14 + shiftX, centerY + bobY, 4, 8)
    ctx.fillRect(centerX + 10 + shiftX, centerY + bobY, 4, 8)
  }

  // Head
  ctx.fillStyle = '#32cd32'
  ctx.beginPath()
  ctx.arc(centerX + shiftX, centerY - 8 + bobY, 10, 0, Math.PI * 2)
  ctx.fill()

  // Ears
  ctx.beginPath()
  ctx.moveTo(centerX - 10 + shiftX, centerY - 10 + bobY)
  ctx.lineTo(centerX - 18 + shiftX, centerY - 18 + bobY)
  ctx.lineTo(centerX - 8 + shiftX, centerY - 14 + bobY)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(centerX + 10 + shiftX, centerY - 10 + bobY)
  ctx.lineTo(centerX + 18 + shiftX, centerY - 18 + bobY)
  ctx.lineTo(centerX + 8 + shiftX, centerY - 14 + bobY)
  ctx.closePath()
  ctx.fill()

  // Eyes
  ctx.fillStyle = '#ff0000'
  ctx.beginPath()
  ctx.arc(centerX - 4 + shiftX, centerY - 10 + bobY, 3, 0, Math.PI * 2)
  ctx.arc(centerX + 4 + shiftX, centerY - 10 + bobY, 3, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.arc(centerX - 4 + shiftX, centerY - 10 + bobY, 1.5, 0, Math.PI * 2)
  ctx.arc(centerX + 4 + shiftX, centerY - 10 + bobY, 1.5, 0, Math.PI * 2)
  ctx.fill()

  // Nose
  ctx.fillStyle = '#1a6b1a'
  ctx.beginPath()
  ctx.arc(centerX + shiftX, centerY - 6 + bobY, 3, 0, Math.PI * 2)
  ctx.fill()
}

/**
 * Draw skeleton enemy frame
 */
function drawSkeletonFrame(ctx, centerX, centerY, phase, animationType) {
  const rattle = Math.sin(phase * 2) * 1
  
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 14, 8, 3, 0, 0, Math.PI * 2)
  ctx.fill()

  // Legs (bones)
  ctx.strokeStyle = '#f5f5dc'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(centerX - 4, centerY + 6)
  ctx.lineTo(centerX - 6 + rattle, centerY + 16)
  ctx.moveTo(centerX + 4, centerY + 6)
  ctx.lineTo(centerX + 6 - rattle, centerY + 16)
  ctx.stroke()

  // Ribcage
  ctx.fillStyle = '#f5f5dc'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY, 8, 10, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Rib lines
  ctx.strokeStyle = '#e5e5ce'
  ctx.lineWidth = 1
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.arc(centerX, centerY - 4 + i * 3, 6, 0.3, Math.PI - 0.3)
    ctx.stroke()
  }

  // Arms
  ctx.strokeStyle = '#f5f5dc'
  ctx.lineWidth = 3
  if (animationType === 'attack') {
    ctx.beginPath()
    ctx.moveTo(centerX - 8, centerY - 4)
    ctx.lineTo(centerX - 16, centerY - 12)
    ctx.moveTo(centerX + 8, centerY - 4)
    ctx.lineTo(centerX + 20, centerY - 8)
    ctx.stroke()
  } else {
    ctx.beginPath()
    ctx.moveTo(centerX - 8, centerY - 4)
    ctx.lineTo(centerX - 14 + rattle, centerY + 4)
    ctx.moveTo(centerX + 8, centerY - 4)
    ctx.lineTo(centerX + 14 - rattle, centerY + 4)
    ctx.stroke()
  }

  // Skull
  ctx.fillStyle = '#f5f5dc'
  ctx.beginPath()
  ctx.arc(centerX, centerY - 14, 10, 0, Math.PI * 2)
  ctx.fill()

  // Eye sockets
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.ellipse(centerX - 4, centerY - 15, 3, 4, 0, 0, Math.PI * 2)
  ctx.ellipse(centerX + 4, centerY - 15, 3, 4, 0, 0, Math.PI * 2)
  ctx.fill()

  // Red eye glow
  ctx.fillStyle = '#ff0000'
  ctx.globalAlpha = 0.5 + Math.sin(phase) * 0.3
  ctx.beginPath()
  ctx.arc(centerX - 4, centerY - 15, 1.5, 0, Math.PI * 2)
  ctx.arc(centerX + 4, centerY - 15, 1.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  // Jaw
  ctx.strokeStyle = '#e5e5ce'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY - 8, 6, 0.2, Math.PI - 0.2)
  ctx.stroke()
}

/**
 * Draw dragon enemy frame
 */
function drawDragonFrame(ctx, color, centerX, centerY, phase, animationType) {
  const wingFlap = Math.sin(phase) * 15
  const breathe = Math.sin(phase * 0.5) * 2
  
  color = '#8b0000'
  const lighterColor = shadeColor(color, 40)
  const darkerColor = shadeColor(color, -30)

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 16, 14, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Wings (behind body)
  ctx.fillStyle = darkerColor
  ctx.save()
  ctx.translate(centerX - 10, centerY - 8)
  ctx.rotate(-0.5 - wingFlap * 0.02)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(-20, -10 - wingFlap * 0.5)
  ctx.lineTo(-15, 5)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
  
  ctx.save()
  ctx.translate(centerX + 10, centerY - 8)
  ctx.rotate(0.5 + wingFlap * 0.02)
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(20, -10 - wingFlap * 0.5)
  ctx.lineTo(15, 5)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Tail
  ctx.strokeStyle = color
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(centerX, centerY + 8)
  ctx.quadraticCurveTo(centerX + 15, centerY + 15, centerX + 20 + Math.sin(phase) * 3, centerY + 10)
  ctx.stroke()
  
  // Tail spike
  ctx.fillStyle = darkerColor
  ctx.beginPath()
  ctx.moveTo(centerX + 20 + Math.sin(phase) * 3, centerY + 10)
  ctx.lineTo(centerX + 28 + Math.sin(phase) * 3, centerY + 8)
  ctx.lineTo(centerX + 22 + Math.sin(phase) * 3, centerY + 14)
  ctx.closePath()
  ctx.fill()

  // Body
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + breathe, 12, 14, 0, 0, Math.PI * 2)
  ctx.fill()

  // Belly
  ctx.fillStyle = lighterColor
  ctx.beginPath()
  ctx.ellipse(centerX, centerY + 4 + breathe, 7, 8, 0, 0, Math.PI * 2)
  ctx.fill()

  // Legs
  ctx.fillStyle = color
  ctx.fillRect(centerX - 8, centerY + 10 + breathe, 5, 8)
  ctx.fillRect(centerX + 3, centerY + 10 + breathe, 5, 8)
  
  // Claws
  ctx.fillStyle = '#333'
  for (let i = 0; i < 2; i++) {
    const legX = centerX - 7 + i * 11
    ctx.beginPath()
    ctx.moveTo(legX, centerY + 18 + breathe)
    ctx.lineTo(legX - 2, centerY + 20 + breathe)
    ctx.lineTo(legX + 2, centerY + 20 + breathe)
    ctx.closePath()
    ctx.fill()
  }

  // Neck and Head
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(centerX, centerY - 12, 8, 10, 0, 0, Math.PI * 2)
  ctx.fill()

  // Horns
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.moveTo(centerX - 6, centerY - 18)
  ctx.lineTo(centerX - 10, centerY - 28)
  ctx.lineTo(centerX - 4, centerY - 20)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(centerX + 6, centerY - 18)
  ctx.lineTo(centerX + 10, centerY - 28)
  ctx.lineTo(centerX + 4, centerY - 20)
  ctx.closePath()
  ctx.fill()

  // Eyes
  ctx.fillStyle = '#ffa500'
  ctx.beginPath()
  ctx.ellipse(centerX - 3, centerY - 14, 2.5, 3, 0, 0, Math.PI * 2)
  ctx.ellipse(centerX + 3, centerY - 14, 2.5, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = '#000'
  ctx.beginPath()
  ctx.ellipse(centerX - 3, centerY - 14, 1, 2, 0, 0, Math.PI * 2)
  ctx.ellipse(centerX + 3, centerY - 14, 1, 2, 0, 0, Math.PI * 2)
  ctx.fill()

  // Snout
  ctx.fillStyle = lighterColor
  ctx.beginPath()
  ctx.ellipse(centerX, centerY - 8, 4, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  
  // Nostrils
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(centerX - 2, centerY - 8, 1, 0, Math.PI * 2)
  ctx.arc(centerX + 2, centerY - 8, 1, 0, Math.PI * 2)
  ctx.fill()

  // Fire breath on attack
  if (animationType === 'attack') {
    const gradient = ctx.createRadialGradient(centerX, centerY - 4, 2, centerX, centerY + 10, 15)
    gradient.addColorStop(0, '#ff6600')
    gradient.addColorStop(0.5, '#ff3300')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(centerX - 3, centerY - 5)
    ctx.lineTo(centerX - 8, centerY + 15)
    ctx.lineTo(centerX, centerY + 20)
    ctx.lineTo(centerX + 8, centerY + 15)
    ctx.lineTo(centerX + 3, centerY - 5)
    ctx.closePath()
    ctx.fill()
  }
}

/**
 * Shade a color by a percentage
 * @param {string} color - Hex color
 * @param {number} percent - Percentage to lighten (positive) or darken (negative)
 * @returns {string} New hex color
 */
function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt))
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

/**
 * Legacy function - generates single static hero sprite
 * @deprecated Use generateHeroSpriteSheet instead
 */
export function generateHeroSprite(color = '#4a90e2') {
  const canvas = document.createElement('canvas')
  canvas.width = 48
  canvas.height = 48
  const ctx = canvas.getContext('2d')
  drawHeroFrame(ctx, color, 24, 28, 0, 'idle')
  return canvas
}

/**
 * Legacy function - generates single static enemy sprite
 * @deprecated Use generateEnemySpriteSheet instead
 */
export function generateEnemySprite(type = 'slime', color = '#8b4513') {
  const canvas = document.createElement('canvas')
  canvas.width = 48
  canvas.height = 48
  const ctx = canvas.getContext('2d')
  drawEnemyFrame(ctx, type, color, 24, 28, 0, 'idle')
  return canvas
}

/**
 * Generate a tile sprite
 * @param {string} type - Type of tile
 * @returns {HTMLCanvasElement}
 */
export function generateTileSprite(type = 'grass') {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')

  switch (type) {
    case 'grass':
      ctx.fillStyle = '#4a7c59'
      ctx.fillRect(0, 0, 32, 32)
      ctx.fillStyle = '#5a8c69'
      for (let i = 0; i < 12; i++) {
        ctx.fillRect(Math.random() * 30, Math.random() * 30, 2, 2)
      }
      ctx.fillStyle = '#3a6c49'
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(Math.random() * 30, Math.random() * 30, 1, 3)
      }
      break

    case 'stone':
      ctx.fillStyle = '#707070'
      ctx.fillRect(0, 0, 32, 32)
      ctx.strokeStyle = '#505050'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, 14, 14)
      ctx.strokeRect(17, 1, 14, 14)
      ctx.strokeRect(1, 17, 14, 14)
      ctx.strokeRect(17, 17, 14, 14)
      ctx.fillStyle = '#808080'
      ctx.fillRect(3, 3, 10, 10)
      ctx.fillRect(19, 19, 10, 10)
      break

    case 'dungeon-floor':
      ctx.fillStyle = '#2a2a2a'
      ctx.fillRect(0, 0, 32, 32)
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 1
      ctx.strokeRect(0, 0, 32, 32)
      ctx.beginPath()
      ctx.moveTo(16, 0)
      ctx.lineTo(16, 32)
      ctx.moveTo(0, 16)
      ctx.lineTo(32, 16)
      ctx.stroke()
      ctx.fillStyle = '#333'
      ctx.fillRect(2, 2, 4, 4)
      ctx.fillRect(26, 26, 4, 4)
      break

    case 'wall':
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(0, 0, 32, 32)
      ctx.strokeStyle = '#2a2a2a'
      ctx.lineWidth = 3
      ctx.strokeRect(2, 2, 28, 28)
      ctx.fillStyle = '#4a4a4a'
      ctx.fillRect(4, 4, 10, 10)
      ctx.fillRect(18, 18, 10, 10)
      break

    default:
      ctx.fillStyle = '#666'
      ctx.fillRect(0, 0, 32, 32)
  }

  return canvas
}

/**
 * Generate all game assets
 * @returns {Object}
 */
export function generateAllAssets() {
  return {
    hero: {
      animated: generateHeroSpriteSheet('#4a90e2'),
      static: generateHeroSprite('#4a90e2')
    },
    enemies: {
      slime: {
        animated: generateEnemySpriteSheet('slime', '#8b4513'),
        static: generateEnemySprite('slime', '#8b4513')
      },
      goblin: {
        animated: generateEnemySpriteSheet('goblin', '#228b22'),
        static: generateEnemySprite('goblin', '#228b22')
      },
      skeleton: {
        animated: generateEnemySpriteSheet('skeleton', '#f5f5dc'),
        static: generateEnemySprite('skeleton', '#f5f5dc')
      },
      dragon: {
        animated: generateEnemySpriteSheet('dragon', '#8b0000'),
        static: generateEnemySprite('dragon', '#8b0000')
      }
    },
    tiles: {
      grass: generateTileSprite('grass'),
      stone: generateTileSprite('stone'),
      dungeonFloor: generateTileSprite('dungeon-floor'),
      wall: generateTileSprite('wall')
    }
  }
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                                                                             ║
// ║   🏪 SHOP UI COMPONENT 🏪                                                   ║
// ║   ════════════════════════                                                  ║
// ║                                                                             ║
// ║   This shows the weapon shop to the player!                                 ║
// ║   They can see all weapons, their prices, and buy new ones.                ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝

import React, { useState } from 'react'
import { WeaponShop, ALL_WEAPONS } from '../game/Shop/WeaponShop'


// ═══════════════════════════════════════════════════════════════════════════════
// 🏪 THE MAIN SHOP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function ShopUI({ playerStats, onClose, onPurchase }) {

    // Track if we just bought something (for showing success message)
    const [purchaseMessage, setPurchaseMessage] = useState(null)

    // ────────────────────────────────────────────────────────────────────────────
    // 🛒 Handle when player clicks "Buy" on a weapon
    // ────────────────────────────────────────────────────────────────────────────

    function handleBuyWeapon(weaponId) {
        const result = WeaponShop.buyWeapon(playerStats, weaponId)

        setPurchaseMessage({
            success: result.success,
            text: result.message
        })

        // If purchase was successful, tell the parent component
        if (result.success && onPurchase) {
            onPurchase(result.weapon)
        }

        // Clear message after 3 seconds
        setTimeout(() => setPurchaseMessage(null), 3000)
    }

    // ────────────────────────────────────────────────────────────────────────────
    // 🎨 THE VISUAL LAYOUT
    // ────────────────────────────────────────────────────────────────────────────

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
                borderRadius: '20px',
                border: '3px solid #667eea',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
            }}>

                {/* ═══════════════════════ HEADER ═══════════════════════ */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{
                        color: '#fff',
                        margin: 0,
                        fontSize: '28px'
                    }}>
                        🏪 Weapon Shop
                    </h2>
                    <div style={{
                        background: '#ffd700',
                        color: '#1a1a2e',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>
                        💰 {playerStats.gold || 0} Gold
                    </div>
                </div>

                {/* ═══════════════════════ CURRENT WEAPON ═══════════════════════ */}
                <div style={{
                    background: 'rgba(102, 126, 234, 0.2)',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '20px'
                }}>
                    <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '5px' }}>
                        Currently Equipped:
                    </div>
                    <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                        {playerStats.equippedWeapon?.emoji || '🗡️'} {playerStats.equippedWeapon?.name || 'Wooden Sword'}
                        <span style={{ color: '#4ecdc4', marginLeft: '10px' }}>
                            +{playerStats.equippedWeapon?.damageBonus || 0} damage
                        </span>
                    </div>
                </div>

                {/* ═══════════════════════ PURCHASE MESSAGE ═══════════════════════ */}
                {purchaseMessage && (
                    <div style={{
                        background: purchaseMessage.success ? 'rgba(78, 205, 196, 0.3)' : 'rgba(255, 99, 99, 0.3)',
                        border: `2px solid ${purchaseMessage.success ? '#4ecdc4' : '#ff6363'}`,
                        borderRadius: '10px',
                        padding: '15px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        color: '#fff'
                    }}>
                        {purchaseMessage.success ? '✅' : '❌'} {purchaseMessage.text}
                    </div>
                )}

                {/* ═══════════════════════ WEAPON LIST ═══════════════════════ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {ALL_WEAPONS.map(weapon => {
                        const canAfford = (playerStats.gold || 0) >= weapon.price
                        const isEquipped = playerStats.equippedWeapon?.id === weapon.id

                        return (
                            <div
                                key={weapon.id}
                                style={{
                                    background: isEquipped
                                        ? 'rgba(78, 205, 196, 0.2)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    border: isEquipped
                                        ? '2px solid #4ecdc4'
                                        : '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                {/* Weapon Info */}
                                <div>
                                    <div style={{
                                        color: '#fff',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        marginBottom: '5px'
                                    }}>
                                        {weapon.emoji} {weapon.name}
                                        {isEquipped && (
                                            <span style={{
                                                color: '#4ecdc4',
                                                fontSize: '12px',
                                                marginLeft: '10px'
                                            }}>
                                                ✅ EQUIPPED
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ color: '#aaa', fontSize: '14px' }}>
                                        {weapon.description}
                                    </div>
                                    <div style={{ color: '#4ecdc4', fontSize: '14px', marginTop: '5px' }}>
                                        +{weapon.damageBonus} damage bonus
                                    </div>
                                </div>

                                {/* Buy Button */}
                                <div style={{ textAlign: 'right' }}>
                                    {weapon.price === 0 ? (
                                        <div style={{ color: '#4ecdc4', fontWeight: 'bold' }}>FREE</div>
                                    ) : isEquipped ? (
                                        <div style={{ color: '#4ecdc4', fontWeight: 'bold' }}>Owned</div>
                                    ) : (
                                        <>
                                            <div style={{
                                                color: canAfford ? '#ffd700' : '#ff6363',
                                                fontWeight: 'bold',
                                                marginBottom: '5px'
                                            }}>
                                                💰 {weapon.price}
                                            </div>
                                            <button
                                                onClick={() => handleBuyWeapon(weapon.id)}
                                                disabled={!canAfford}
                                                style={{
                                                    background: canAfford
                                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                        : '#555',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 20px',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    cursor: canAfford ? 'pointer' : 'not-allowed',
                                                    opacity: canAfford ? 1 : 0.5
                                                }}
                                            >
                                                {canAfford ? 'Buy' : 'Need More Gold'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* ═══════════════════════ CLOSE BUTTON ═══════════════════════ */}
                <button
                    onClick={onClose}
                    style={{
                        width: '100%',
                        marginTop: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '15px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Close Shop
                </button>
            </div>
        </div>
    )
}

export default ShopUI

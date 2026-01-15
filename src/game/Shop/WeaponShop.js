// ╔════════════════════════════════════════════════════════════════════════════╗
// ║                                                                             ║
// ║   🗡️ WEAPON SHOP 🗡️                                                        ║
// ║   ═════════════════                                                         ║
// ║                                                                             ║
// ║   WHAT IS THIS FILE?                                                        ║
// ║   This is the weapon shop! Players can spend their gold here to buy        ║
// ║   better weapons that do more damage to enemies.                           ║
// ║                                                                             ║
// ║   HOW IT WORKS:                                                             ║
// ║   1. Players earn gold by winning battles                                  ║
// ║   2. They can visit the shop between battles                               ║
// ║   3. Buying a weapon gives them bonus damage on all attacks!               ║
// ║                                                                             ║
// ╚════════════════════════════════════════════════════════════════════════════╝


// ═══════════════════════════════════════════════════════════════════════════════
// 🗡️ ALL THE WEAPONS YOU CAN BUY
// ═══════════════════════════════════════════════════════════════════════════════
//
// Each weapon has:
// - name: What it's called
// - price: How much gold it costs (0 = free!)
// - damageBonus: Extra damage added to every attack
// - description: A fun description of the weapon
// - emoji: An icon for the weapon

export const ALL_WEAPONS = [

    // ────────────────────────────────────────────────────────────────────────
    // 🪵 WOODEN SWORD (Starter Weapon - FREE!)
    // ────────────────────────────────────────────────────────────────────────
    {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        price: 0,
        damageBonus: 0,
        description: 'A basic training sword. Better than nothing!',
        emoji: '🪵'
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🔪 IRON BLADE (Beginner Upgrade)
    // ────────────────────────────────────────────────────────────────────────
    {
        id: 'iron_blade',
        name: 'Iron Blade',
        price: 100,
        damageBonus: 5,
        description: 'A sturdy iron blade. +5 damage per hit!',
        emoji: '🔪'
    },

    // ────────────────────────────────────────────────────────────────────────
    // ⚔️ STEEL SWORD (Solid Mid-Game Choice)
    // ────────────────────────────────────────────────────────────────────────
    {
        id: 'steel_sword',
        name: 'Steel Sword',
        price: 250,
        damageBonus: 10,
        description: 'Forged from fine steel. +10 damage per hit!',
        emoji: '⚔️'
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🔥 FLAME SWORD (Fire Power!)
    // ────────────────────────────────────────────────────────────────────────
    {
        id: 'flame_sword',
        name: 'Flame Sword',
        price: 500,
        damageBonus: 18,
        description: 'Burns with magical fire! +18 damage per hit!',
        emoji: '🔥'
    },

    // ────────────────────────────────────────────────────────────────────────
    // 🐉 DRAGON SLAYER (Ultimate Weapon!)
    // ────────────────────────────────────────────────────────────────────────
    {
        id: 'dragon_slayer',
        name: 'Dragon Slayer',
        price: 1000,
        damageBonus: 30,
        description: 'Legendary blade of heroes! +30 damage per hit!',
        emoji: '🐉'
    }
]


// ═══════════════════════════════════════════════════════════════════════════════
// 🏪 THE WEAPON SHOP CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class WeaponShop {

    /**
     * 📋 Get all weapons available for purchase
     * Returns the full list of weapons
     */
    static getAllWeapons() {
        return ALL_WEAPONS
    }


    /**
     * 💰 Check if player can afford a weapon
     * 
     * @param {Object} playerStats - The player's CharacterStats
     * @param {string} weaponId - The ID of the weapon to check
     * @returns {boolean} True if player has enough gold
     */
    static canAfford(playerStats, weaponId) {
        // Find the weapon in our list
        const weapon = ALL_WEAPONS.find(w => w.id === weaponId)

        // If weapon doesn't exist, return false
        if (!weapon) {
            return false
        }

        // Check if player has enough gold
        const playerGold = playerStats.gold || 0
        const weaponPrice = weapon.price

        return playerGold >= weaponPrice
    }


    /**
     * 🛒 Buy a weapon from the shop!
     * 
     * @param {Object} playerStats - The player's CharacterStats
     * @param {string} weaponId - The ID of the weapon to buy
     * @returns {Object} Result with success status and message
     */
    static buyWeapon(playerStats, weaponId) {

        // ──────────────────────────────────────────────────────────────
        // STEP 1: Find the weapon
        // ──────────────────────────────────────────────────────────────
        const weapon = ALL_WEAPONS.find(w => w.id === weaponId)

        if (!weapon) {
            return {
                success: false,
                message: "That weapon doesn't exist!"
            }
        }

        // ──────────────────────────────────────────────────────────────
        // STEP 2: Check if player has enough gold
        // ──────────────────────────────────────────────────────────────
        const playerGold = playerStats.gold || 0

        if (playerGold < weapon.price) {
            const needMore = weapon.price - playerGold
            return {
                success: false,
                message: `Not enough gold! You need ${needMore} more.`
            }
        }

        // ──────────────────────────────────────────────────────────────
        // STEP 3: Buy the weapon!
        // ──────────────────────────────────────────────────────────────

        // Take the gold from the player
        playerStats.gold = playerGold - weapon.price

        // Give the player the weapon
        playerStats.equippedWeapon = {
            id: weapon.id,
            name: weapon.name,
            damageBonus: weapon.damageBonus,
            description: weapon.description,
            emoji: weapon.emoji
        }

        return {
            success: true,
            message: `You bought the ${weapon.name}! +${weapon.damageBonus} damage!`,
            weapon: weapon
        }
    }


    /**
     * 🎁 Give gold to the player (called after winning battles)
     * 
     * @param {Object} playerStats - The player's CharacterStats
     * @param {number} amount - Amount of gold to give
     */
    static addGold(playerStats, amount) {
        const currentGold = playerStats.gold || 0
        playerStats.gold = currentGold + amount
        return playerStats.gold
    }


    /**
     * 🗡️ Get the player's current weapon damage bonus
     * 
     * @param {Object} playerStats - The player's CharacterStats
     * @returns {number} The damage bonus from equipped weapon
     */
    static getWeaponDamageBonus(playerStats) {
        if (playerStats.equippedWeapon && playerStats.equippedWeapon.damageBonus) {
            return playerStats.equippedWeapon.damageBonus
        }
        return 0
    }
}

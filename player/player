  // ============================================
// MINECRAFT - PLAYER ENGINE
// Movement, physics, collision, raycasting,
// combat, hunger, effects
// ============================================

// ============ PLAYER STATE ============
var player = {
    // Position & Rotation
    x: 0, y: 80, z: 0,
    yaw: 0, pitch: 0,

    // Velocity
    vx: 0, vy: 0, vz: 0,

    // Dimensions
    width: CONFIG.PLAYER_WIDTH,
    height: CONFIG.PLAYER_HEIGHT,
    eyeHeight: CONFIG.PLAYER_EYE_HEIGHT,

    // Movement State
    isSprinting: false,
    isSneaking: false,
    isFlying: false,
    isSwimming: false,
    onGround: false,
    inWater: false,
    inLava: false,
    inWeb: false,

    // Health
    health: CONFIG.PLAYER_MAX_HEALTH,
    maxHealth: CONFIG.PLAYER_MAX_HEALTH,
    absorption: 0,
    isDead: false,

    // Hunger
    hunger: CONFIG.PLAYER_MAX_HUNGER,
    maxHunger: CONFIG.PLAYER_MAX_HUNGER,
    saturation: CONFIG.PLAYER_STARTING_SATURATION,
    foodExhaustion: 0,
    hungerTimer: 0,

    // Armor
    armor: 0,
    armorToughness: 0,

    // Experience
    xp: 0,
    xpLevel: 0,
    xpTotal: 0,

    // Combat
    lastDamageTime: 0,
    invulnerabilityTicks: 0,
    fallDistance: 0,
    attackCooldown: 0,

    // Active Effects
    activeEffects: {},

    // Statistics
    blocksPlaced: 0,
    blocksBroken: 0,
    mobsKilled: 0,
    distanceWalked: 0,
    distanceFlown: 0,
    distanceSprinted: 0,
    distanceSwum: 0,
    distanceFallen: 0,
    jumps: 0,
    deaths: 0,
    itemsCrafted: 0,

    // Spawn Point
    spawnX: 0,
    spawnY: 80,
    spawnZ: 0,
    spawnDimension: CONFIG.DIMENSION_OVERWORLD,

    // Bed Spawn
    bedSpawnX: null,
    bedSpawnY: null,
    bedSpawnZ: null,

    // Game Mode
    gameMode: CONFIG.DEFAULT_GAMEMODE
};

// ============ INITIALIZATION ============
function initPlayer() {
    player.y = getTerrainHeight(0, 0) + 2;
    player.x = 0;
    player.z = 0;
    player.spawnX = player.x;
    player.spawnY = player.y;
    player.spawnZ = player.z;
    player.health = player.maxHealth;
    player.hunger = player.maxHunger;
    player.saturation = CONFIG.PLAYER_STARTING_SATURATION;
    player.vy = 0;
    player.isDead = false;
    player.isFlying = false;
}

// ============ COLLISION DETECTION ============
function checkPlayerCollision(x, y, z) {
    var minX = Math.floor(x - player.width / 2);
    var maxX = Math.floor(x + player.width / 2);
    var minY = Math.floor(y);
    var maxY = Math.floor(y + player.height);
    var minZ = Math.floor(z - player.width / 2);
    var maxZ = Math.floor(z + player.width / 2);

    for (var ix = minX; ix <= maxX; ix++) {
        for (var iy = minY; iy <= maxY; iy++) {
            for (var iz = minZ; iz <= maxZ; iz++) {
                var blockId = getBlock(ix, iy, iz);
                if (isSolid(blockId)) return true;
            }
        }
    }
    return false;
}

// ============ RAYCASTING ============
function raycast(maxDist) {
    if (!maxDist) maxDist = 5;

    for (var t = 0; t < maxDist; t += 0.05) {
        var rx = player.x - Math.sin(player.yaw) * Math.cos(player.pitch) * t;
        var rz = player.z + Math.cos(player.yaw) * Math.cos(player.pitch) * t;
        var ry = player.y + player.eyeHeight + Math.sin(player.pitch) * t;

        var bx = Math.floor(rx);
        var by = Math.floor(ry);
        var bz = Math.floor(rz);

        var blockId = getBlock(bx, by, bz);
        if (isSolid(blockId)) {
            return {
                x: bx, y: by, z: bz,
                id: blockId,
                hx: rx, hy: ry, hz: rz
            };
        }
    }
    return null;
}

// ============ PLAYER MOVEMENT ============
function updatePlayerMovement() {
    if (!gameState.started || !gameState.locked) return;

    // Get input direction
    var forward = 0, strafe = 0;
    if (keys[CONFIG.KEY_FORWARD] || keys.ArrowUp) forward++;
    if (keys[CONFIG.KEY_BACKWARD] || keys.ArrowDown) forward--;
    if (keys[CONFIG.KEY_LEFT] || keys.ArrowLeft) strafe--;
    if (keys[CONFIG.KEY_RIGHT] || keys.ArrowRight) strafe++;

    // Sprint & Sneak
    player.isSprinting = keys[CONFIG.KEY_SPRINT] && forward > 0 && player.hunger > 6 && !player.isFlying;
    player.isSneaking = keys[CONFIG.KEY_SNEAK] && !player.isFlying;

    // Fly toggle
    if (CONFIG.ALLOW_FLYING && keys[CONFIG.KEY_FLY] && !keys._fKeyPressed) {
        keys._fKeyPressed = true;
        player.isFlying = !player.isFlying;
        player.vy = 0;
        addChat("Flying: " + (player.isFlying ? "ON" : "OFF"));
    }
    if (!keys[CONFIG.KEY_FLY]) keys._fKeyPressed = false;

    // Calculate speed
    var speed = CONFIG.PLAYER_WALK_SPEED;
    if (player.isFlying) speed = CONFIG.PLAYER_FLY_SPEED;
    else if (player.isSprinting) speed = CONFIG.PLAYER_SPRINT_SPEED;
    else if (player.isSneaking) speed = CONFIG.PLAYER_SNEAK_SPEED;
    if (player.inWater && !player.isFlying) speed = CONFIG.PLAYER_SWIM_SPEED;

    // Effects
    if (player.activeEffects.speed) speed *= 1.2 * (1 + player.activeEffects.speed.amplifier);
    if (player.activeEffects.slowness) speed *= 0.85;

    // Calculate movement vector
    var angle = player.yaw;
    var moveX = forward * Math.cos(angle) + strafe * Math.sin(angle);
    var moveZ = forward * Math.sin(angle) - strafe * Math.cos(angle);

    // Normalize
    var len = Math.sqrt(moveX * moveX + moveZ * moveZ);
    if (len > 0) { moveX /= len; moveZ /= len; }

    player.vx = moveX * speed;
    player.vz = moveZ * speed;

    // Apply movement with collision
    var newX = player.x + player.vx;
    var newZ = player.z + player.vz;

    // X-axis
    if (!checkPlayerCollision(newX, player.y, player.z)) {
        player.x = newX;
    } else {
        player.vx = 0;
        if (!checkPlayerCollision(newX, player.y + 0.5, player.z)) {
            player.x = newX;
            player.y += 0.5;
        }
    }

    // Z-axis
    if (!checkPlayerCollision(player.x, player.y, newZ)) {
        player.z = newZ;
    } else {
        player.vz = 0;
        if (!checkPlayerCollision(player.x, player.y + 0.5, newZ)) {
            player.z = newZ;
            player.y += 0.5;
        }
    }

    // Sneak height
    if (player.isSneaking) {
        player.height = CONFIG.PLAYER_SNEAK_HEIGHT;
        player.eyeHeight = CONFIG.PLAYER_SNEAK_EYE_HEIGHT;
    } else {
        player.height = CONFIG.PLAYER_HEIGHT;
        player.eyeHeight = CONFIG.PLAYER_EYE_HEIGHT;
    }

    // Vertical movement
    if (player.isFlying) {
        player.vy = 0;
        if (keys[CONFIG.KEY_JUMP]) player.y += CONFIG.PLAYER_FLY_SPEED;
        if (keys[CONFIG.KEY_SNEAK]) player.y -= CONFIG.PLAYER_FLY_SPEED;
        player.onGround = false;
        player.fallDistance = 0;
    } else {
        var gravity = player.inWater ? CONFIG.PLAYER_WATER_GRAVITY : CONFIG.PLAYER_GRAVITY;
        player.vy -= gravity;

        // Jump
        if (keys[CONFIG.KEY_JUMP] && player.onGround && !player.isSneaking) {
            player.vy = CONFIG.PLAYER_JUMP_VELOCITY;
            player.onGround = false;
            player.jumps++;
            playSound(CONFIG.JUMP_SOUND_FREQ, CONFIG.JUMP_SOUND_DUR);
        }

        // Swim up
        if (keys[CONFIG.KEY_JUMP] && player.inWater && !player.onGround) {
            player.vy = 0.08;
        }

        var newY = player.y + player.vy;

        if (!checkPlayerCollision(player.x, newY, player.z)) {
            player.y = newY;
            player.onGround = false;
            if (player.vy < 0) {
                player.fallDistance += Math.abs(player.vy);
                player.distanceFallen += Math.abs(player.vy);
            }
        } else {
            // Landed
            if (CONFIG.DO_FALL_DAMAGE && player.vy < 0 && player.fallDistance > CONFIG.PLAYER_FALL_DAMAGE_THRESHOLD) {
                var fallDamage = Math.floor(player.fallDistance - CONFIG.PLAYER_FALL_DAMAGE_THRESHOLD);
                if (fallDamage > 0) damagePlayer(fallDamage, "fall");
            }
            player.y = Math.floor(player.y);
            player.vy = 0;
            player.onGround = true;
            player.fallDistance = 0;
        }
    }

    // Water/Lava detection
    var headBlock = getBlock(Math.floor(player.x), Math.floor(player.y + player.eyeHeight), Math.floor(player.z));
    var feetBlock = getBlock(Math.floor(player.x), Math.floor(player.y), Math.floor(player.z));
    player.inWater = isLiquid(headBlock) || isLiquid(feetBlock);
    player.inLava = (headBlock === BLOCKS.LAVA || feetBlock === BLOCKS.LAVA);

    if (player.inLava) {
        damagePlayer(4, "lava");
        player.vy += 0.04;
    }

    // Track distance
    var moved = Math.abs(player.vx) + Math.abs(player.vz);
    if (moved > 0.001) {
        if (player.isFlying) player.distanceFlown += moved;
        else if (player.isSprinting) player.distanceSprinted += moved;
        else if (player.inWater) player.distanceSwum += moved;
        else player.distanceWalked += moved;
    }
}

// ============ DAMAGE SYSTEM ============
function damagePlayer(amount, source) {
    if (!source) source = "generic";
    if (player.invulnerabilityTicks > 0) return;
    if (player.gameMode === "creative" || player.gameMode === "spectator") return;

    // Armor reduction
    var reduction = Math.min(20, player.armor) / 25;
    var toughnessFactor = player.armorToughness / 100;
    var finalReduction = reduction * (1 - toughnessFactor);
    var actualDamage = Math.max(1, amount * (1 - finalReduction));

    // Absorption first
    if (player.absorption > 0) {
        if (player.absorption >= actualDamage) {
            player.absorption -= actualDamage;
            actualDamage = 0;
        } else {
            actualDamage -= player.absorption;
            player.absorption = 0;
        }
    }

    player.health -= actualDamage;
    player.lastDamageTime = Date.now();
    player.invulnerabilityTicks = CONFIG.PLAYER_INVULNERABILITY_TICKS;
    playSound(CONFIG.BLOCK_BREAK_SOUND_FREQ, 0.3, "sawtooth");

    if (player.health <= 0) {
        playerDeath(source);
    }
}

function healPlayer(amount) {
    player.health = Math.min(player.maxHealth, player.health + amount);
}

function playerDeath(source) {
    player.health = 0;
    player.isDead = true;
    player.deaths++;
    addChat("You died! Respawning...");

    setTimeout(function () {
        respawnPlayer();
    }, 1500);
}

function respawnPlayer() {
    player.health = player.maxHealth;
    player.hunger = player.maxHunger;
    player.saturation = CONFIG.PLAYER_STARTING_SATURATION;
    player.vy = 0;
    player.isDead = false;
    player.activeEffects = {};
    player.fallDistance = 0;
    player.invulnerabilityTicks = CONFIG.PLAYER_RESPAWN_INVULNERABILITY;

    if (player.bedSpawnX !== null) {
        player.x = player.bedSpawnX;
        player.y = player.bedSpawnY;
        player.z = player.bedSpawnZ;
    } else {
        player.x = player.spawnX;
        player.y = player.spawnY;
        player.z = player.spawnZ;
    }
    addChat("Respawned!");
}

// ============ HUNGER SYSTEM ============
function updateHungerSystem() {
    if (player.gameMode === "creative" || player.gameMode === "spectator") return;

    if (player.isSprinting && (Math.abs(player.vx) > 0 || Math.abs(player.vz) > 0)) {
        player.foodExhaustion += 0.1;
    }
    if (player.isSneaking) player.foodExhaustion += 0.005;
    if (Math.abs(player.vx) > 0 || Math.abs(player.vz) > 0) player.foodExhaustion += 0.01;
    if (!player.onGround) player.foodExhaustion += 0.01;
    if (player.inWater && (Math.abs(player.vx) > 0 || Math.abs(player.vz) > 0)) player.foodExhaustion += 0.01;

    if (player.foodExhaustion > 4) {
        player.foodExhaustion -= 4;
        if (player.saturation > 0) {
            player.saturation = Math.max(0, player.saturation - 1);
        } else if (player.hunger > 0) {
            player.hunger--;
        }
    }

    // Health regen from full hunger
    if (player.hunger >= CONFIG.PLAYER_HUNGER_REGEN_THRESHOLD && player.health < player.maxHealth) {
        if (gameState.gameTime % 80 === 0) {
            healPlayer(1);
            player.foodExhaustion += 3;
        }
    }

    // Starvation
    if (player.hunger <= 0 && gameState.gameTime % 80 === 0) {
        damagePlayer(CONFIG.PLAYER_STARVATION_DAMAGE, "starvation");
    }
}

// ============ EFFECTS SYSTEM ============
function addPlayerEffect(effectId, duration, amplifier) {
    if (!amplifier) amplifier = 0;
    if (!duration) duration = 600;
    player.activeEffects[effectId] = {
        id: effectId,
        duration: duration,
        amplifier: amplifier,
        startTime: gameState.gameTime
    };
}

function removePlayerEffect(effectId) {
    delete player.activeEffects[effectId];
}

function hasPlayerEffect(effectId) {
    return !!player.activeEffects[effectId];
}

function updatePlayerEffects() {
    var now = gameState.gameTime;
    for (var id in player.activeEffects) {
        var effect = player.activeEffects[id];
        if (now - effect.startTime >= effect.duration) {
            delete player.activeEffects[id];
            continue;
        }
        switch (id) {
            case "regeneration":
                if (now % 50 === 0) healPlayer(1);
                break;
            case "poison":
                if (now % 25 === 0 && player.health > 1) player.health -= 1;
                break;
            case "wither":
                if (now % 40 === 0) player.health -= 1;
                break;
            case "absorption":
                player.absorption = 4 * (effect.amplifier + 1);
                break;
        }
    }
}

// ============ XP SYSTEM ============
function addXp(amount) {
    player.xp += amount;
    player.xpTotal += amount;

    var xpNeeded = getXpForLevel(player.xpLevel);
    while (player.xp >= xpNeeded) {
        player.xp -= xpNeeded;
        player.xpLevel++;
        xpNeeded = getXpForLevel(player.xpLevel);
        addChat("Level up! Now level " + player.xpLevel);
        playSound(800, 0.2, "sine");
    }
}

function getXpForLevel(level) {
    if (level <= 15) return 2 * level + 7;
    if (level <= 30) return 5 * level - 38;
    return 9 * level - 158;
}

// ============ UTILITY ============
function getPlayerEyePosition() {
    return {
        x: player.x,
        y: player.y + player.eyeHeight,
        z: player.z
    };
}

function getPlayerLookVector() {
    return {
        x: -Math.sin(player.yaw) * Math.cos(player.pitch),
        y: Math.sin(player.pitch),
        z: Math.cos(player.yaw) * Math.cos(player.pitch)
    };
}

function setSpawnPoint(x, y, z) {
    player.spawnX = x;
    player.spawnY = y;
    player.spawnZ = z;
}

function setBedSpawn(x, y, z) {
    player.bedSpawnX = x;
    player.bedSpawnY = y;
    player.bedSpawnZ = z;
}

console.log("Player engine loaded");

// ============================================
// MINECRAFT - ENTITY SYSTEM
// Mobs, AI, spawning, combat, drops
// ============================================

// ============ ENTITY LIST ============
var entities = [];

// ============ MOB TYPES ============
var MOB_TYPES = {
    // === PASSIVE ===
    PIG: {
        name: "Pig", color: "#f0a0a0", health: 10, passive: true,
        drops: [{ id: "raw_porkchop", count: 1, name: "Raw Porkchop" }],
        width: 0.6, height: 0.8
    },
    COW: {
        name: "Cow", color: "#3a2a1a", health: 10, passive: true,
        drops: [{ id: "raw_beef", count: 1, name: "Raw Beef" }, { id: "leather", count: 1, name: "Leather" }],
        width: 0.6, height: 1.4
    },
    SHEEP: {
        name: "Sheep", color: "#e8e8e8", health: 8, passive: true,
        drops: [{ id: 87, count: 1, name: "Wool" }],
        width: 0.6, height: 1.3
    },
    CHICKEN: {
        name: "Chicken", color: "#ffffff", health: 4, passive: true,
        drops: [{ id: "raw_chicken", count: 1, name: "Raw Chicken" }, { id: "feather", count: 1, name: "Feather" }],
        width: 0.4, height: 0.7, small: true
    },
    RABBIT: {
        name: "Rabbit", color: "#8b6b3b", health: 3, passive: true,
        drops: [{ id: "raw_rabbit", count: 1, name: "Raw Rabbit" }],
        width: 0.4, height: 0.5, small: true
    },
    HORSE: {
        name: "Horse", color: "#8b4513", health: 20, passive: true,
        drops: [{ id: "leather", count: 2, name: "Leather" }],
        width: 1.0, height: 1.6
    },
    SQUID: {
        name: "Squid", color: "#4a6b8a", health: 10, passive: true, water: true,
        drops: [{ id: "ink_sac", count: 1, name: "Ink Sac" }],
        width: 0.6, height: 0.6
    },
    BAT: {
        name: "Bat", color: "#4a3a2a", health: 6, passive: true, flying: true, ambient: true,
        drops: [],
        width: 0.4, height: 0.5, small: true
    },

    // === NEUTRAL ===
    WOLF: {
        name: "Wolf", color: "#8a8a8a", health: 10, neutral: true,
        drops: [],
        width: 0.6, height: 0.8
    },
    SPIDER: {
        name: "Spider", color: "#2a1a1a", health: 16, neutral: true, nightHostile: true,
        drops: [{ id: "string", count: 1, name: "String" }, { id: "spider_eye", count: 1, name: "Spider Eye" }],
        width: 1.0, height: 0.9, xp: 5
    },
    ENDERMAN: {
        name: "Enderman", color: "#1a1a1a", health: 40, neutral: true,
        drops: [{ id: "ender_pearl", count: 1, name: "Ender Pearl" }],
        width: 0.6, height: 2.9, tall: true, xp: 5
    },

    // === HOSTILE ===
    ZOMBIE: {
        name: "Zombie", color: "#2d4a1e", health: 20, hostile: true,
        drops: [{ id: "rotten_flesh", count: 1, name: "Rotten Flesh" }],
        width: 0.6, height: 1.95, damage: 3, xp: 5
    },
    SKELETON: {
        name: "Skeleton", color: "#c1c1c1", health: 20, hostile: true, ranged: true,
        drops: [{ id: "bone", count: 1, name: "Bone" }, { id: "arrow", count: 2, name: "Arrow" }],
        width: 0.6, height: 1.99, damage: 2, xp: 5
    },
    CREEPER: {
        name: "Creeper", color: "#4da132", health: 20, hostile: true, explosive: true,
        drops: [{ id: "gunpowder", count: 1, name: "Gunpowder" }],
        width: 0.6, height: 1.7, damage: 0, xp: 5
    },
    SLIME: {
        name: "Slime", color: "#6cc82c", health: 10, hostile: true,
        drops: [{ id: "slimeball", count: 1, name: "Slimeball" }],
        width: 0.5, height: 0.5, small: true, xp: 2
    },
    WITCH: {
        name: "Witch", color: "#4a2a6a", health: 26, hostile: true,
        drops: [{ id: "glowstone_dust", count: 1, name: "Glowstone Dust" }, { id: "redstone", count: 1, name: "Redstone" }],
        width: 0.6, height: 1.95, xp: 5
    },

    // === NETHER ===
    ZOMBIE_PIGMAN: {
        name: "Zombie Pigman", color: "#cc9999", health: 20, neutral: true, nether: true,
        drops: [{ id: "rotten_flesh", count: 1, name: "Rotten Flesh" }, { id: "gold_nugget", count: 1, name: "Gold Nugget" }],
        width: 0.6, height: 1.95, xp: 5
    },
    GHAST: {
        name: "Ghast", color: "#f0f0f0", health: 10, hostile: true, flying: true, nether: true,
        drops: [{ id: "gunpowder", count: 1, name: "Gunpowder" }, { id: "ghast_tear", count: 1, name: "Ghast Tear" }],
        width: 2.0, height: 2.0, xp: 5
    },
    BLAZE: {
        name: "Blaze", color: "#ffcc00", health: 20, hostile: true, flying: true, nether: true,
        drops: [{ id: "blaze_rod", count: 1, name: "Blaze Rod" }],
        width: 0.6, height: 1.8, xp: 10
    },
    WITHER_SKELETON: {
        name: "Wither Skeleton", color: "#2a2a2a", health: 20, hostile: true, nether: true,
        drops: [{ id: "bone", count: 1, name: "Bone" }, { id: "coal", count: 1, name: "Coal" }],
        width: 0.6, height: 2.4, tall: true, damage: 4, xp: 5
    },
    MAGMA_CUBE: {
        name: "Magma Cube", color: "#8b3a00", health: 10, hostile: true, nether: true,
        drops: [{ id: "magma_cream", count: 1, name: "Magma Cream" }],
        width: 0.5, height: 0.5, small: true, xp: 2
    },

    // === END ===
    ENDERMITE: {
        name: "Endermite", color: "#8a6b8a", health: 8, hostile: true, end: true,
        drops: [],
        width: 0.3, height: 0.3, small: true, xp: 3
    },
    SHULKER: {
        name: "Shulker", color: "#8a6b8a", health: 30, hostile: true, end: true,
        drops: [{ id: "shulker_shell", count: 1, name: "Shulker Shell" }],
        width: 1.0, height: 1.0, xp: 5
    },

    // === BOSSES ===
    ENDER_DRAGON: {
        name: "Ender Dragon", color: "#1a1a1a", health: 200, hostile: true, flying: true, end: true, boss: true,
        drops: [],
        width: 4.0, height: 3.0, damage: 10, xp: 12000
    },
    WITHER: {
        name: "Wither", color: "#2a2a2a", health: 300, hostile: true, flying: true, nether: true, boss: true,
        drops: [{ id: "nether_star", count: 1, name: "Nether Star" }],
        width: 1.0, height: 3.0, damage: 8, xp: 50
    }
};

// ============ SPAWN MOB ============
function spawnMob(type, x, y, z) {
    var mt = MOB_TYPES[type];
    if (!mt) return null;
    if (entities.length >= CONFIG.MAX_ENTITIES) return null;

    var mob = {
        id: Math.random().toString(36).substr(2, 9),
        type: type,
        x: x, y: y, z: z,
        vx: 0, vy: 0, vz: 0,
        yaw: 0,
        health: mt.health,
        maxHealth: mt.health,
        onGround: false,
        inWater: false,
        age: 0,
        dead: false,
        deathTime: 0,
        fireTicks: 0,
        width: mt.width || 0.6,
        height: mt.height || 1.8,
        color: mt.color || "#ffffff",
        attackCooldown: 0
    };

    entities.push(mob);
    return mob;
}

// ============ UPDATE ENTITIES ============
function updateEntities() {
    for (var ei = entities.length - 1; ei >= 0; ei--) {
        var e = entities[ei];
        if (e.dead) {
            e.deathTime++;
            if (e.deathTime > 40) entities.splice(ei, 1);
            continue;
        }

        e.age++;
        if (e.attackCooldown > 0) e.attackCooldown--;

        // Gravity
        var mt = MOB_TYPES[e.type];
        if (mt && mt.flying) {
            // Flying mobs hover
            e.vy = Math.sin(e.age * 0.05) * 0.05;
        } else if (!e.onGround) {
            e.vy -= CONFIG.PLAYER_GRAVITY;
        }

        e.y += e.vy;

        // Ground collision
        var below = getBlock(Math.floor(e.x), Math.floor(e.y - 0.1), Math.floor(e.z));
        if (isSolid(below)) {
            e.y = Math.floor(e.y);
            e.vy = 0;
            e.onGround = true;
        } else {
            e.onGround = false;
        }

        // AI
        if (mt) runMobAI(e, mt);

        // Apply velocity
        e.x += e.vx;
        e.z += e.vz;
        e.vx *= 0.8;
        e.vz *= 0.8;

        // Despawn check
        var dist = distance3D(e.x, e.y, e.z, player.x, player.y, player.z);
        if (dist > CONFIG.ENTITY_DESPAWN_DISTANCE && !mt.boss) {
            entities.splice(ei, 1);
        }

        // Fire damage
        if (e.fireTicks > 0) {
            e.fireTicks--;
            if (e.fireTicks % 20 === 0) e.health -= 1;
        }
    }
}

// ============ MOB AI ============
function runMobAI(e, mt) {
    var dx = player.x - e.x;
    var dy = player.y - e.y;
    var dz = player.z - e.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // === PASSIVE AI ===
    if (mt.passive || mt.ambient) {
        if (Math.random() < 0.02) {
            e.vx = (Math.random() - 0.5) * 0.1;
            e.vz = (Math.random() - 0.5) * 0.1;
        }
        if (Math.random() < 0.005 && e.onGround && !mt.flying) {
            e.vy = 0.35;
        }
        // Run from player if hit
        if (e.health < e.maxHealth && dist < 8) {
            e.vx = -(dx / dist) * 0.08;
            e.vz = -(dz / dist) * 0.08;
        }
        return;
    }

    // === HOSTILE AI ===
    var isHostile = mt.hostile || (mt.neutral && dist < 10) || (mt.nightHostile && isNightTime());
    if (!isHostile) {
        // Neutral when not provoked — wander
        if (Math.random() < 0.02) {
            e.vx = (Math.random() - 0.5) * 0.1;
            e.vz = (Math.random() - 0.5) * 0.1;
        }
        return;
    }

    var detectionRange = mt.boss ? 64 : 16;

    if (dist < detectionRange) {
        // Look at player
        e.yaw = Math.atan2(-dx, dz);

        // Move toward player
        if (dist > 1.5) {
            e.vx = (dx / dist) * 0.06;
            e.vz = (dz / dist) * 0.06;
        }

        // Jump over obstacles
        if (e.onGround && dist < 5 && Math.random() < 0.05 && !mt.flying) {
            e.vy = 0.35;
        }

        // Attack player
        if (dist < 1.5 && e.attackCooldown <= 0 && !mt.ranged && !mt.explosive) {
            var dmg = mt.damage || 2;
            if (mt.boss) dmg = mt.damage || 8;
            damagePlayer(dmg, mt.name);
            e.attackCooldown = 20;
        }

        // Creeper explode
        if (mt.explosive && dist < 2) {
            explode(e.x, e.y, e.z, 3);
            e.dead = true;
        }

        // Ranged attack (skeleton)
        if (mt.ranged && dist < 12 && dist > 2 && e.attackCooldown <= 0 && Math.random() < 0.01) {
            shootArrow(e, player);
            e.attackCooldown = 30;
        }
    }
}

// ============ COMBAT ============
function damageEntity(e, amount, source) {
    if (!e || e.dead) return;
    e.health -= amount;

    if (e.health <= 0) {
        e.health = 0;
        e.dead = true;
        e.deathTime = 0;
        player.mobsKilled++;

        // Drop loot
        var mt = MOB_TYPES[e.type];
        if (mt && mt.drops) {
            for (var i = 0; i < mt.drops.length; i++) {
                var drop = mt.drops[i];
                if (typeof addToInventory === "function") {
                    addToInventory(drop.id, drop.count);
                }
            }
        }

        // XP
        if (mt && mt.xp) {
            addXp(mt.xp);
        }
    }
}

function shootArrow(from, target) {
    // Simple arrow projectile
    var dx = target.x - from.x;
    var dy = (target.y + 1) - from.y;
    var dz = target.z - from.z;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (typeof spawnParticles === "function") {
        spawnParticles(from.x, from.y + 1, from.z, "#ffffff", 3);
    }
}

function explode(x, y, z, power) {
    var r = Math.ceil(power);
    for (var dx = -r; dx <= r; dx++) {
        for (var dy = -r; dy <= r; dy++) {
            for (var dz = -r; dz <= r; dz++) {
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist <= r && Math.random() < 0.5) {
                    var blockId = getBlock(Math.floor(x + dx), Math.floor(y + dy), Math.floor(z + dz));
                    if (blockId !== BLOCKS.BEDROCK && !getBlockDef(blockId).unbreakable) {
                        setBlock(Math.floor(x + dx), Math.floor(y + dy), Math.floor(z + dz), BLOCKS.AIR);
                    }
                }
            }
        }
    }

    // Damage entities
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        var edist = distance3D(e.x, e.y, e.z, x, y, z);
        if (edist < r * 2 && !e.dead) {
            damageEntity(e, Math.floor(power * 5 * (1 - edist / (r * 2))));
        }
    }

    // Damage player
    var pdist = distance3D(player.x, player.y, player.z, x, y, z);
    if (pdist < r * 2) {
        damagePlayer(Math.floor(power * 3 * (1 - pdist / (r * 2))), "explosion");
    }

    if (typeof spawnParticles === "function") {
        spawnParticles(x, y, z, "#ff6600", CONFIG.PARTICLE_EXPLOSION_COUNT);
    }
    playSound(CONFIG.EXPLOSION_SOUND_FREQ, CONFIG.EXPLOSION_SOUND_DUR, "sawtooth");
}

// ============ HELPERS ============
function isNightTime() {
    return gameState.timeOfDay > CONFIG.NIGHT_START && gameState.timeOfDay < CONFIG.NIGHT_END;
}

// ============ RENDER ENTITIES ============
function renderEntities() {
    var cosY = Math.cos(player.yaw), sinY = Math.sin(player.yaw);
    var fov = CONFIG.FOV;

    for (var ei = 0; ei < entities.length; ei++) {
        var e = entities[ei];
        if (e.dead && e.deathTime > 30) continue;

        var edx = e.x - player.x, edz = e.z - player.z;
        if (Math.sqrt(edx * edx + edz * edz) > CONFIG.ENTITY_RENDER_DISTANCE) continue;

        var edy = e.y + e.height / 2 - (player.y + player.eyeHeight);
        var erx = edx * cosY - edz * sinY, erz = edx * sinY + edz * cosY;
        if (erz <= 0.1) continue;

        var scale = H / (erz * Math.tan(fov / 2));
        var sx = W / 2 + erx * scale, sy = H / 2 - edy * scale;
        var size = scale * (e.width || 0.6);

        // Death animation
        if (e.dead) {
            ctx.globalAlpha = 1 - (e.deathTime / 40);
            sy += e.deathTime * 2;
        }

        // Body
        ctx.fillStyle = e.color || "#fff";
        ctx.fillRect(sx - size / 2, sy - size, size, size * 2);

        // Eyes
        if (size > 4) {
            ctx.fillStyle = e.dead ? "#ff0000" : "#ffffff";
            ctx.fillRect(sx - size / 4, sy - size * 0.8, size / 4, size / 4);
            ctx.fillRect(sx + size / 8, sy - size * 0.8, size / 4, size / 4);
        }

        // Health bar for damaged entities
        if (e.health < e.maxHealth && !e.dead) {
            var hpPct = e.health / e.maxHealth;
            ctx.fillStyle = "#000";
            ctx.fillRect(sx - size / 2, sy - size - 8, size, 3);
            ctx.fillStyle = hpPct > 0.5 ? "#0f0" : hpPct > 0.25 ? "#ff0" : "#f00";
            ctx.fillRect(sx - size / 2, sy - size - 8, size * hpPct, 3);
        }

        // Name tag
        if (size > 6 && !e.dead) {
            ctx.fillStyle = "#fff";
            ctx.font = Math.max(8, size / 3) + "px monospace";
            ctx.textAlign = "center";
            var name = MOB_TYPES[e.type] ? MOB_TYPES[e.type].name : "Mob";
            ctx.fillText(name, sx, sy - size - 12);
        }

        ctx.globalAlpha = 1;
    }
}

console.log("Entity system loaded - " + Object.keys(MOB_TYPES).length + " mob types");

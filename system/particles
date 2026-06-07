// ============================================
// MINECRAFT - PARTICLE SYSTEM
// Block break, place, explosion, effects
// ============================================

// ============ PARTICLE POOL ============
var particles = [];
var particlePool = [];

// Pre-create particle objects for recycling
function initParticlePool() {
    for (var i = 0; i < CONFIG.MAX_PARTICLES; i++) {
        particlePool.push({
            x: 0, y: 0, z: 0,
            vx: 0, vy: 0, vz: 0,
            life: 0, maxLife: 0,
            color: "#ffffff",
            size: 1,
            gravity: true,
            type: "default"
        });
    }
}

// ============ SPAWN PARTICLES ============
function spawnParticles(x, y, z, color, count, type) {
    if (!count) count = CONFIG.PARTICLE_BREAK_COUNT;
    if (!type) type = "default";
    if (!color) color = "#888888";

    count = Math.min(count, CONFIG.MAX_PARTICLES - particles.length);

    for (var i = 0; i < count; i++) {
        var p;

        // Get from pool or create new
        if (particlePool.length > 0) {
            p = particlePool.pop();
        } else if (particles.length < CONFIG.MAX_PARTICLES) {
            p = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0, color: "#fff", size: 1, gravity: true, type: "default" };
        } else {
            // Recycle oldest particle
            p = particles.shift();
        }

        // Set properties based on type
        switch (type) {
            case "break":
                p.x = x; p.y = y; p.z = z;
                p.vx = randomFloat(-0.15, 0.15);
                p.vy = randomFloat(0.05, 0.2);
                p.vz = randomFloat(-0.15, 0.15);
                p.life = CONFIG.PARTICLE_LIFE;
                p.maxLife = CONFIG.PARTICLE_LIFE;
                p.color = color;
                p.size = randomFloat(1, 3);
                p.gravity = true;
                p.type = "break";
                break;

            case "place":
                p.x = x; p.y = y; p.z = z;
                p.vx = randomFloat(-0.05, 0.05);
                p.vy = randomFloat(0.02, 0.1);
                p.vz = randomFloat(-0.05, 0.05);
                p.life = CONFIG.PARTICLE_LIFE * 0.5;
                p.maxLife = CONFIG.PARTICLE_LIFE * 0.5;
                p.color = color;
                p.size = randomFloat(1, 2);
                p.gravity = true;
                p.type = "place";
                break;

            case "explosion":
                p.x = x; p.y = y; p.z = z;
                var angle = randomFloat(0, Math.PI * 2);
                var pitch = randomFloat(-Math.PI / 2, Math.PI / 2);
                var speed = randomFloat(0.1, 0.5);
                p.vx = Math.cos(angle) * Math.cos(pitch) * speed;
                p.vy = Math.sin(pitch) * speed + 0.1;
                p.vz = Math.sin(angle) * Math.cos(pitch) * speed;
                p.life = CONFIG.PARTICLE_LIFE * 1.5;
                p.maxLife = CONFIG.PARTICLE_LIFE * 1.5;
                p.color = color;
                p.size = randomFloat(2, 6);
                p.gravity = true;
                p.type = "explosion";
                break;

            case "sparkle":
                p.x = x + randomFloat(-0.3, 0.3);
                p.y = y + randomFloat(-0.3, 0.3);
                p.z = z + randomFloat(-0.3, 0.3);
                p.vx = randomFloat(-0.02, 0.02);
                p.vy = randomFloat(0.01, 0.05);
                p.vz = randomFloat(-0.02, 0.02);
                p.life = CONFIG.PARTICLE_LIFE * 0.3;
                p.maxLife = CONFIG.PARTICLE_LIFE * 0.3;
                p.color = color;
                p.size = randomFloat(1, 2);
                p.gravity = false;
                p.type = "sparkle";
                break;

            case "smoke":
                p.x = x + randomFloat(-0.5, 0.5);
                p.y = y;
                p.z = z + randomFloat(-0.5, 0.5);
                p.vx = randomFloat(-0.02, 0.02);
                p.vy = randomFloat(0.02, 0.08);
                p.vz = randomFloat(-0.02, 0.02);
                p.life = CONFIG.PARTICLE_LIFE * 2;
                p.maxLife = CONFIG.PARTICLE_LIFE * 2;
                p.color = color;
                p.size = randomFloat(3, 8);
                p.gravity = false;
                p.type = "smoke";
                break;

            case "crit":
                p.x = x; p.y = y; p.z = z;
                p.vx = randomFloat(-0.1, 0.1);
                p.vy = randomFloat(0.05, 0.15);
                p.vz = randomFloat(-0.1, 0.1);
                p.life = CONFIG.PARTICLE_LIFE * 0.4;
                p.maxLife = CONFIG.PARTICLE_LIFE * 0.4;
                p.color = color;
                p.size = randomFloat(2, 4);
                p.gravity = true;
                p.type = "crit";
                break;

            case "bubble":
                p.x = x + randomFloat(-0.2, 0.2);
                p.y = y;
                p.z = z + randomFloat(-0.2, 0.2);
                p.vx = randomFloat(-0.01, 0.01);
                p.vy = randomFloat(0.02, 0.06);
                p.vz = randomFloat(-0.01, 0.01);
                p.life = CONFIG.PARTICLE_LIFE;
                p.maxLife = CONFIG.PARTICLE_LIFE;
                p.color = color || "#a0d0ff";
                p.size = randomFloat(1, 3);
                p.gravity = false;
                p.type = "bubble";
                break;

            default:
                p.x = x; p.y = y; p.z = z;
                p.vx = randomFloat(-0.1, 0.1);
                p.vy = randomFloat(0.05, 0.15);
                p.vz = randomFloat(-0.1, 0.1);
                p.life = CONFIG.PARTICLE_LIFE;
                p.maxLife = CONFIG.PARTICLE_LIFE;
                p.color = color;
                p.size = randomFloat(1, 3);
                p.gravity = true;
                p.type = "default";
        }

        particles.push(p);
    }
}

// ============ UPDATE PARTICLES ============
function updateParticles() {
    for (var pi = particles.length - 1; pi >= 0; pi--) {
        var p = particles[pi];

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Apply gravity
        if (p.gravity) {
            p.vy -= 0.02;
        }

        // Decay life
        p.life -= CONFIG.PARTICLE_DECAY;

        // Grow smoke particles
        if (p.type === "smoke") {
            p.size += 0.1;
        }

        // Check ground collision for break particles
        if (p.type === "break" && p.vy < 0) {
            var below = getBlock(Math.floor(p.x), Math.floor(p.y - 0.1), Math.floor(p.z));
            if (isSolid(below)) {
                p.vy *= -0.3;
                p.vx *= 0.5;
                p.vz *= 0.5;
                p.life *= 0.5;
            }
        }

        // Return to pool or remove
        if (p.life <= 0) {
            particlePool.push(p);
            particles.splice(pi, 1);
        }
    }
}

// ============ RENDER PARTICLES ============
function renderParticles() {
    var cosY = Math.cos(player.yaw), sinY = Math.sin(player.yaw);
    var fov = CONFIG.FOV;

    for (var pi = 0; pi < particles.length; pi++) {
        var p = particles[pi];

        var pdx = p.x - player.x;
        var pdy = p.y - (player.y + player.eyeHeight);
        var pdz = p.z - player.z;

        var prx = pdx * cosY - pdz * sinY;
        var prz = pdx * sinY + pdz * cosY;

        if (prz <= 0.05) continue;

        var scale = H / (prz * Math.tan(fov / 2));
        var sx = W / 2 + prx * scale;
        var sy = H / 2 - pdy * scale;

        var alpha = p.life / p.maxLife;
        var size = p.size * scale * 0.3;

        // Different rendering per type
        switch (p.type) {
            case "smoke":
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha * 0.5;
                ctx.beginPath();
                ctx.arc(sx, sy, size, 0, Math.PI * 2);
                ctx.fill();
                break;

            case "sparkle":
            case "crit":
                ctx.fillStyle = "#ffffff";
                ctx.globalAlpha = alpha;
                ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha * 0.7;
                ctx.fillRect(sx - size / 4, sy - size / 4, size / 2, size / 2);
                break;

            default:
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
        }

        ctx.globalAlpha = 1;
    }
}

// ============ CONVENIENCE FUNCTIONS ============

// Spawn block break particles
function spawnBreakParticles(x, y, z, blockId) {
    var color = getBlockColor(blockId);
    spawnParticles(x, y, z, color, CONFIG.PARTICLE_BREAK_COUNT, "break");
}

// Spawn block place particles
function spawnPlaceParticles(x, y, z, blockId) {
    var color = getBlockColor(blockId);
    spawnParticles(x, y, z, color, CONFIG.PARTICLE_PLACE_COUNT, "place");
}

// Spawn explosion particles
function spawnExplosionParticles(x, y, z) {
    spawnParticles(x, y, z, "#ff6600", CONFIG.PARTICLE_EXPLOSION_COUNT, "explosion");
    spawnParticles(x, y, z, "#ffcc00", 10, "sparkle");
    spawnParticles(x, y, z, "#444444", 15, "smoke");
}

// Spawn critical hit particles
function spawnCritParticles(x, y, z) {
    spawnParticles(x, y, z, "#ffd700", 8, "crit");
}

// Spawn bubble particles
function spawnBubbleParticles(x, y, z, count) {
    spawnParticles(x, y, z, "#a0d0ff", count || 3, "bubble");
}

// Spawn torch smoke
function spawnTorchSmoke(x, y, z) {
    if (gameState.tickCount % 10 === 0) {
        spawnParticles(x, y, z, "#888888", 1, "smoke");
    }
}

// Spawn rain splash
function spawnRainSplash(x, y, z) {
    spawnParticles(x, y, z, "#aaccff", 2, "sparkle");
}

// ============ INIT ============
initParticlePool();

console.log("Particle system loaded - pool size: " + particlePool.length);

// ============================================
// MINECRAFT - CANVAS 2D RENDERER
// World, entities, particles, weather, lighting
// ============================================

// ============ MAIN RENDER FUNCTION ============
function render() {
    ctx.clearRect(0, 0, W, H);

    // Sky
    renderSky();

    // Title screen
    if (!gameState.started) {
        renderTitleScreen();
        return;
    }

    // World
    renderWorld();

    // Weather effects
    if (CONFIG.RENDER_WEATHER) renderWeather();

    // Entities
    if (CONFIG.RENDER_ENTITIES) renderEntities();

    // Particles
    if (CONFIG.RENDER_PARTICLES) renderParticles();

    // HUD
    if (gameState.locked && !gameState.showInventory) {
        renderHUD();
    }

    // Inventory
    if (gameState.showInventory) renderInventoryScreen();

    // Debug
    if (gameState.showDebug) renderDebugScreen();

    // Chat
    renderChat();

    // Info display
    updateInfoDisplay();
}

// ============ SKY RENDERING ============
function renderSky() {
    var t = gameState.timeOfDay;
    var dim = currentDimension;
    var top, bottom, horizon;

    if (dim === CONFIG.DIMENSION_NETHER) {
        top = CONFIG.SKY_NETHER_TOP;
        bottom = CONFIG.SKY_NETHER_BOTTOM;
        horizon = "#3a1a1a";
    } else if (dim === CONFIG.DIMENSION_END) {
        top = CONFIG.SKY_END_TOP;
        bottom = CONFIG.SKY_END_BOTTOM;
        horizon = "#1a1a2a";
    } else {
        // Overworld sky
        if (t < CONFIG.SUNRISE_END) {
            top = CONFIG.SKY_NIGHT_TOP;
            bottom = CONFIG.SKY_NIGHT_BOTTOM;
            horizon = "#1a2a1a";
        } else if (t < CONFIG.DAY_START + 1000) {
            var sunriseT = (t - CONFIG.SUNRISE_END) / 1000;
            top = mixColors(CONFIG.SKY_NIGHT_TOP, CONFIG.SKY_SUNRISE_TOP, sunriseT);
            bottom = mixColors(CONFIG.SKY_NIGHT_BOTTOM, CONFIG.SKY_SUNRISE_BOTTOM, sunriseT);
            horizon = mixColors("#1a2a1a", "#7ec850", sunriseT);
        } else if (t < CONFIG.SUNSET_START) {
            top = CONFIG.SKY_DAY_TOP;
            bottom = CONFIG.SKY_DAY_BOTTOM;
            horizon = "#7ec850";
        } else if (t < CONFIG.SUNSET_END) {
            var sunsetT = (t - CONFIG.SUNSET_START) / (CONFIG.SUNSET_END - CONFIG.SUNSET_START);
            top = mixColors(CONFIG.SKY_DAY_TOP, CONFIG.SKY_SUNSET_TOP, sunsetT);
            bottom = mixColors(CONFIG.SKY_DAY_BOTTOM, CONFIG.SKY_SUNSET_BOTTOM, sunsetT);
            horizon = mixColors("#7ec850", "#1a2a1a", sunsetT);
        } else {
            top = CONFIG.SKY_NIGHT_TOP;
            bottom = CONFIG.SKY_NIGHT_BOTTOM;
            horizon = "#1a2a1a";
        }
    }

    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, top);
    grad.addColorStop(0.45, bottom);
    grad.addColorStop(1, horizon);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Cloud overlay
    if (cloudOpacity > 0 && dim === CONFIG.DIMENSION_OVERWORLD) {
        ctx.fillStyle = "rgba(200,200,210," + (cloudOpacity * 0.3) + ")";
        ctx.fillRect(0, 0, W, H);
    }
}

// ============ TITLE SCREEN ============
function renderTitleScreen() {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px 'Courier New'";
    ctx.textAlign = "center";
    ctx.fillText("Minecraft", W / 2, H / 2 - 70);

    ctx.font = "18px 'Courier New'";
    ctx.fillText("Browser Edition", W / 2, H / 2 - 40);

    ctx.font = "14px 'Courier New'";
    ctx.fillText("Click to Play", W / 2, H / 2 + 10);
    ctx.fillText("Seed: " + CONFIG.WORLD_SEED, W / 2, H / 2 + 30);

    ctx.font = "12px 'Courier New'";
    ctx.fillText("WASD: Move | Mouse: Look | Click: Mine/Place", W / 2, H / 2 + 60);
    ctx.fillText("Space: Jump | Shift: Sneak | Ctrl: Sprint | F: Fly", W / 2, H / 2 + 78);
    ctx.fillText("E: Inventory | /: Commands | F3: Debug | Esc: Pause", W / 2, H / 2 + 96);

    // Save info
    if (saveExists()) {
        ctx.fillStyle = "#88ff88";
        ctx.fillText("Saved game found - loading on start", W / 2, H / 2 + 120);
    }

    ctx.textAlign = "start";
}

// ============ WORLD RENDERING ============
function renderWorld() {
    var cosY = Math.cos(player.yaw), sinY = Math.sin(player.yaw);
    var fov = CONFIG.FOV;
    var visibleChunks = getVisibleChunks();

    for (var ci = 0; ci < visibleChunks.length; ci++) {
        var ch = visibleChunks[ci];
        var data = ch.chunk.data;
        var wx = ch.cx * CHUNK_SIZE;
        var wz = ch.cz * CHUNK_SIZE;

        for (var x = 0; x < CHUNK_SIZE; x++) {
            for (var z = 0; z < CHUNK_SIZE; z++) {
                var worldX = wx + x;
                var worldZ = wz + z;
                var colDX = worldX + 0.5 - player.x;
                var colDZ = worldZ + 0.5 - player.z;
                var colRZ = colDX * sinY + colDZ * cosY;
                if (colRZ <= 0.1) continue;

                for (var y = 0; y < WORLD_HEIGHT; y++) {
                    var blockId = data[x + y * CHUNK_SIZE + z * CHUNK_SIZE * WORLD_HEIGHT];
                    if (blockId === BLOCKS.AIR) continue;

                    var def = getBlockDef(blockId);
                    if (!def || (def.transparent && blockId !== BLOCKS.GLASS && blockId !== BLOCKS.ICE && blockId !== BLOCKS.OAK_LEAVES)) continue;

                    // Face culling
                    if (def.solid && !isExposed(worldX, y, worldZ)) continue;

                    var wY = y + 0.5;
                    var pdx = worldX + 0.5 - player.x;
                    var pdy = wY - (player.y + player.eyeHeight);
                    var pdz = worldZ + 0.5 - player.z;

                    var prx = pdx * cosY - pdz * sinY;
                    var prz = pdx * sinY + pdz * cosY;
                    if (prz <= 0.1) continue;

                    var scale = H / (prz * Math.tan(fov / 2));
                    var screenX = W / 2 + prx * scale;
                    var screenY = H / 2 - pdy * scale;
                    var size = scale;

                    if (screenX + size < -50 || screenX - size > W + 50 || screenY + size < -50 || screenY - size > H + 50) continue;

                    // Get color
                    var col = def.color || "#888888";

                    // Top color (grass, logs, etc.)
                    if (def.topColor && y + 1 < WORLD_HEIGHT) {
                        var aboveId = data[x + (y + 1) * CHUNK_SIZE + z * CHUNK_SIZE * WORLD_HEIGHT];
                        if (isTransparent(aboveId)) col = def.topColor;
                    }

                    // Night darkness
                    if (currentDimension === CONFIG.DIMENSION_OVERWORLD && gameState.timeOfDay > CONFIG.NIGHT_START && gameState.timeOfDay < CONFIG.NIGHT_END) {
                        var nightFactor = gameState.timeOfDay < 18000 ? (gameState.timeOfDay - CONFIG.NIGHT_START) / 5000 : 1 - (gameState.timeOfDay - 18000) / 5000;
                        col = darkenColor(col, 1 - nightFactor * CONFIG.NIGHT_DARKNESS_FACTOR);
                    }

                    // Nether dim light
                    if (currentDimension === CONFIG.DIMENSION_NETHER) {
                        col = darkenColor(col, 0.8);
                    }

                    // Render block
                    if (def.transparent && def.opacity) {
                        ctx.globalAlpha = def.opacity;
                    }

                    ctx.fillStyle = col;
                    ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);

                    // Block outline
                    if (CONFIG.SHOW_BLOCK_OUTLINES && size > 6 && !def.transparent) {
                        ctx.strokeStyle = CONFIG.BLOCK_OUTLINE_COLOR;
                        ctx.lineWidth = CONFIG.BLOCK_OUTLINE_WIDTH;
                        ctx.strokeRect(screenX - size / 2, screenY - size / 2, size, size);
                    }

                    ctx.globalAlpha = 1;
                }
            }
        }
    }
}

// ============ FACE EXPOSURE CHECK ============
function isExposed(wx, wy, wz) {
    if (isTransparent(getBlock(wx, wy + 1, wz))) return true;
    if (isTransparent(getBlock(wx, wy - 1, wz))) return true;
    if (isTransparent(getBlock(wx, wy, wz - 1))) return true;
    if (isTransparent(getBlock(wx, wy, wz + 1))) return true;
    if (isTransparent(getBlock(wx + 1, wy, wz))) return true;
    if (isTransparent(getBlock(wx - 1, wy, wz))) return true;
    return false;
}

// ============ VISIBLE CHUNKS ============
function getVisibleChunks() {
    var pcx = worldToChunk(player.x);
    var pcz = worldToChunk(player.z);
    var list = [];
    var vd = CONFIG.VIEW_DISTANCE;

    for (var cx = pcx - vd; cx <= pcx + vd; cx++) {
        for (var cz = pcz - vd; cz <= pcz + vd; cz++) {
            var dist = Math.sqrt((cx - pcx) * (cx - pcx) + (cz - pcz) * (cz - pcz));
            if (dist <= vd) {
                list.push({ cx: cx, cz: cz, chunk: getChunk(cx, cz), dist: dist });
            }
        }
    }

    list.sort(function (a, b) { return b.dist - a.dist; });
    return list;
}

console.log("Renderer loaded - Canvas 2D pipeline ready");

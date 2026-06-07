// ============================================
// MINECRAFT - MAIN GAME LOOP
// Connects all systems, runs the game
// ============================================

// ============ CANVAS SETUP ============
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var W = innerWidth, H = innerHeight;
canvas.width = W;
canvas.height = H;

// ============ GAME STATE ============
var keys = {};
// ============ HOTBAR ============
var selectedSlot = 0;
var selectedBlock = CONFIG.DEFAULT_HOTBAR[0];

// ============ CHAT ============
var chatMessages = [];

function addChat(msg) {
    chatMessages.push({ text: msg, time: gameState.gameTime });
    if (chatMessages.length > CONFIG.MAX_CHAT_MESSAGES) chatMessages.shift();
}

// ============ AUDIO ============



// ============ INITIALIZATION ============
function initGame() {
    initPlayer();
    initInventory();
    preGenerateSpawn(CONFIG.VIEW_DISTANCE + 1);
    addChat("Welcome to Minecraft!");
    addChat("Seed: " + CONFIG.WORLD_SEED);
    addChat("WASD: Move | Mouse: Look | Click: Mine/Place");
    addChat("F: Fly | E: Inventory | /: Commands | F3: Debug");
}

// ============ MAIN GAME LOOP ============
function update() {
    if (!gameState.started || !gameState.locked || gameState.paused) return;
    if (gameState.showInventory) return;

    updatePlayerMovement();

    if (CONFIG.DO_DAYLIGHT_CYCLE) {
        gameState.timeOfDay = (gameState.timeOfDay + 1) % CONFIG.DAY_LENGTH;
    }

    gameState.tickCount++;
    gameState.gameTime++;

    if (gameState.tickCount % 2 === 0) updateWeather();
    if (gameState.tickCount % 3 === 0) updateEntities();
    if (gameState.tickCount % 2 === 0) updateParticles();

    if (CONFIG.DO_MOB_SPAWNING && gameState.tickCount % CONFIG.MOB_SPAWN_INTERVAL === 0) {
        spawnAmbientMobs();
    }

    if (gameState.tickCount % CONFIG.CHUNK_UNLOAD_INTERVAL === 0) {
        unloadDistantChunks();
    }

    if (CONFIG.DO_HUNGER && gameState.tickCount % 40 === 0) {
        updateHungerSystem();
    }

    if (gameState.tickCount % 20 === 0) {
        updatePlayerEffects();
    }

    if (gameState.tickCount % Math.floor(CONFIG.SAVE_INTERVAL / 50) === 0) {
        if (typeof saveWorld === "function") saveWorld();
    }

    gameState.fpsFrames++;
    if (Date.now() - gameState.fpsLastTime >= 1000) {
        gameState.fps = gameState.fpsFrames;
        gameState.fpsFrames = 0;
        gameState.fpsLastTime = Date.now();
    }
}



// ============ SKY ============

// ============ TITLE SCREEN ============

// ============ MOB SPAWNING ============
function spawnAmbientMobs() {
    if (typeof entities === "undefined") return;
    if (entities.length >= CONFIG.MAX_ENTITIES) return;
    if (!randomChance(CONFIG.MOB_SPAWN_CHANCE)) return;

    var isNight = (gameState.timeOfDay > CONFIG.NIGHT_START && gameState.timeOfDay < CONFIG.NIGHT_END);
    var types;

    if (currentDimension === CONFIG.DIMENSION_NETHER) {
        types = ["ZOMBIE_PIGMAN", "GHAST", "BLAZE"];
    } else if (currentDimension === CONFIG.DIMENSION_END) {
        types = ["ENDERMAN"];
    } else {
        types = isNight ? ["ZOMBIE", "SKELETON", "CREEPER", "SPIDER"] : ["PIG", "COW", "SHEEP", "CHICKEN"];
    }

    var type = randomPick(types);
    var angle = randomFloat(0, Math.PI * 2);
    var dist = randomFloat(CONFIG.MOB_SPAWN_MIN_DISTANCE, CONFIG.MOB_SPAWN_MAX_DISTANCE);
    var sx = player.x + Math.cos(angle) * dist;
    var sz = player.z + Math.sin(angle) * dist;
    var sy = getTerrainHeight(Math.floor(sx), Math.floor(sz)) + 1;

    if (typeof spawnMob === "function") spawnMob(type, sx, sy, sz);
}

// ============ INPUT ============
document.addEventListener("keydown", function (e) {
    keys[e.code] = true;

    if (e.code === CONFIG.KEY_JUMP || e.code === CONFIG.KEY_FLY) e.preventDefault();

    if (e.code === CONFIG.KEY_PAUSE) {
        if (gameState.showInventory) {
            gameState.showInventory = false;
            document.getElementById("inventory-screen").style.display = "none";
        } else {
            document.exitPointerLock();
        }
    }

    if (e.code === CONFIG.KEY_INVENTORY) {
        gameState.showInventory = !gameState.showInventory;
        document.getElementById("inventory-screen").style.display = gameState.showInventory ? "block" : "none";
        if (gameState.showInventory) document.exitPointerLock();
    }

    if (e.code === CONFIG.KEY_DEBUG) {
        gameState.showDebug = !gameState.showDebug;
        document.getElementById("debug").style.display = gameState.showDebug ? "block" : "none";
    }

    if (e.code === CONFIG.KEY_SAVE && typeof saveWorld === "function") { saveWorld(); addChat("Saved!"); }
    if (e.code === CONFIG.KEY_LOAD && typeof loadWorld === "function") { loadWorld(); addChat("Loaded!"); }

for (var i = 1; i <= 9; i++) {
    if (e.code === CONFIG["KEY_HOTBAR_" + i]) {
        selectedSlot = i - 1;
        selectedBlock = (inventory[selectedSlot] && inventory[selectedSlot].id)
            ? inventory[selectedSlot].id
            : CONFIG.DEFAULT_HOTBAR[selectedSlot];
        updateHotbarUI();
    }
}

    if (e.code === CONFIG.KEY_COMMAND && gameState.locked && !gameState.showInventory) {
        e.preventDefault();
        openCommandInput();
    }
});

document.addEventListener("keyup", function (e) { keys[e.code] = false; });

document.addEventListener("mousemove", function (e) {
    if (!gameState.locked || gameState.showInventory) return;
    player.yaw -= e.movementX * CONFIG.MOUSE_SENSITIVITY;
    player.pitch -= e.movementY * CONFIG.MOUSE_SENSITIVITY;
    player.pitch = clamp(player.pitch, CONFIG.MIN_PITCH, CONFIG.MAX_PITCH);
});

document.addEventListener("mousedown", function (e) {
    if (!gameState.locked || !gameState.started || gameState.showInventory) return;

    var hit = raycast();
    if (!hit) return;

    if (e.button === CONFIG.MOUSE_BREAK) {
        if (hit.id !== BLOCKS.BEDROCK && !getBlockDef(hit.id).unbreakable) {
            setBlock(hit.x, hit.y, hit.z, BLOCKS.AIR);
            player.blocksBroken++;
            spawnParticles(hit.x + 0.5, hit.y + 0.5, hit.z + 0.5, getBlockColor(hit.id), CONFIG.PARTICLE_BREAK_COUNT);
            playSound(CONFIG.BLOCK_BREAK_SOUND_FREQ, CONFIG.BLOCK_BREAK_SOUND_DUR, "sawtooth");
        }
    }

   if (e.button === CONFIG.MOUSE_PLACE) {
    var dx = hit.hx - (hit.x + 0.5), dy = hit.hy - (hit.y + 0.5), dz = hit.hz - (hit.z + 0.5);
    var adx = Math.abs(dx), ady = Math.abs(dy), adz = Math.abs(dz);
    var px = hit.x, py = hit.y, pz = hit.z;
    if (adx >= ady && adx >= adz) px += dx > 0 ? 1 : -1;
    else if (ady >= adx && ady >= adz) py += dy > 0 ? 1 : -1;
    else pz += dz > 0 ? 1 : -1;

    if (getBlock(px, py, pz) === BLOCKS.AIR) {
        var blockToPlace = (inventory[selectedSlot] && inventory[selectedSlot].id)
            ? inventory[selectedSlot].id
            : CONFIG.DEFAULT_HOTBAR[selectedSlot];
        setBlock(px, py, pz, blockToPlace);
        player.blocksPlaced++;
        spawnParticles(px + 0.5, py + 0.5, pz + 0.5, getBlockColor(blockToPlace), CONFIG.PARTICLE_PLACE_COUNT);
        playSound(CONFIG.BLOCK_PLACE_SOUND_FREQ, CONFIG.BLOCK_PLACE_SOUND_DUR, "square");
    }
});
document.addEventListener("contextmenu", function (e) { e.preventDefault(); });

canvas.addEventListener("click", function () {
    if (!gameState.started) {
        gameState.started = true;
        initAudio();       
        initGame();
        if (typeof loadWorld === "function") loadWorld();
    }
    canvas.requestPointerLock();
});
document.addEventListener("pointerlockchange", function () {
    gameState.locked = document.pointerLockElement === canvas;
});

window.addEventListener("resize", function () {
    W = innerWidth; H = innerHeight;
    canvas.width = W; canvas.height = H;
});
function resumeGame() {
    document.getElementById("pause-menu").style.display = "none";
    canvas.requestPointerLock();
}

// ============ START ============
loop();

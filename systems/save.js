// ============================================
// MINECRAFT - SAVE/LOAD SYSTEM
// localStorage persistence for world data
// ============================================

// ============ SAVE WORLD ============
function saveWorld() {
    var saveData = {
        // Version info
        version: CONFIG.SAVE_VERSION,
        timestamp: Date.now(),
        seed: CONFIG.WORLD_SEED,

        // Player data
        player: {
            x: player.x,
            y: player.y,
            z: player.z,
            yaw: player.yaw,
            pitch: player.pitch,
            health: player.health,
            hunger: player.hunger,
            saturation: player.saturation,
            xp: player.xp,
            xpLevel: player.xpLevel,
            xpTotal: player.xpTotal,
            gameMode: player.gameMode,
            isFlying: player.isFlying,
            spawnX: player.spawnX,
            spawnY: player.spawnY,
            spawnZ: player.spawnZ,
            bedSpawnX: player.bedSpawnX,
            bedSpawnY: player.bedSpawnY,
            bedSpawnZ: player.bedSpawnZ,
            blocksPlaced: player.blocksPlaced,
            blocksBroken: player.blocksBroken,
            mobsKilled: player.mobsKilled,
            distanceWalked: player.distanceWalked,
            deaths: player.deaths,
            itemsCrafted: player.itemsCrafted
        },

        // World state
        timeOfDay: gameState.timeOfDay,
        currentDimension: currentDimension,
        weather: {
            type: weather.type,
            duration: weather.duration,
            intensity: weather.intensity
        },
        difficulty: difficulty,

        // Inventory
        inventory: inventory,
        armorSlots: armorSlots,

        // Statistics
        stats: {
            blocksPlaced: player.blocksPlaced,
            blocksBroken: player.blocksBroken,
            mobsKilled: player.mobsKilled,
            distanceWalked: player.distanceWalked,
            distanceFlown: player.distanceFlown
        }
    };

    try {
        var jsonString = JSON.stringify(saveData);
        localStorage.setItem(CONFIG.SAVE_KEY, jsonString);
        return true;
    } catch (e) {
        console.error("Save failed:", e);
        return false;
    }
}

// ============ LOAD WORLD ============
function loadWorld() {
    try {
        var jsonString = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!jsonString) {
            addChat("No save file found");
            return false;
        }

        var data = JSON.parse(jsonString);

        // Version check
        if (data.version !== CONFIG.SAVE_VERSION) {
            addChat("Save version mismatch - creating new world");
            return false;
        }

        // Restore world seed
        if (data.seed) CONFIG.WORLD_SEED = data.seed;
        CONFIG.WORLD_SEED = data.seed;

        // Restore player
        if (data.player) {
            player.x = data.player.x || 0;
            player.y = data.player.y || 80;
            player.z = data.player.z || 0;
            player.yaw = data.player.yaw || 0;
            player.pitch = data.player.pitch || 0;
            player.health = data.player.health || player.maxHealth;
            player.hunger = data.player.hunger || player.maxHunger;
            player.saturation = data.player.saturation || CONFIG.PLAYER_STARTING_SATURATION;
            player.xp = data.player.xp || 0;
            player.xpLevel = data.player.xpLevel || 0;
            player.xpTotal = data.player.xpTotal || 0;
            player.gameMode = data.player.gameMode || CONFIG.DEFAULT_GAMEMODE;
            player.isFlying = data.player.isFlying || false;
            player.spawnX = data.player.spawnX || 0;
            player.spawnY = data.player.spawnY || 80;
            player.spawnZ = data.player.spawnZ || 0;
            player.bedSpawnX = data.player.bedSpawnX || null;
            player.bedSpawnY = data.player.bedSpawnY || null;
            player.bedSpawnZ = data.player.bedSpawnZ || null;
            player.blocksPlaced = data.player.blocksPlaced || 0;
            player.blocksBroken = data.player.blocksBroken || 0;
            player.mobsKilled = data.player.mobsKilled || 0;
            player.distanceWalked = data.player.distanceWalked || 0;
            player.deaths = data.player.deaths || 0;
            player.itemsCrafted = data.player.itemsCrafted || 0;
        }

        // Restore time
        if (data.timeOfDay !== undefined) {
            gameState.timeOfDay = data.timeOfDay;
        }

        // Restore dimension
        if (data.currentDimension !== undefined) {
            currentDimension = data.currentDimension;
        }

        // Restore weather
        if (data.weather) {
            weather.type = data.weather.type || "clear";
            weather.duration = data.weather.duration || 0;
            weather.intensity = data.weather.intensity || 0;
        }

        // Restore difficulty
        if (data.difficulty) {
            difficulty = data.difficulty;
        }

        // Restore inventory
        if (data.inventory) {
            inventory = data.inventory;
        }
        if (data.armorSlots) {
            armorSlots = data.armorSlots;
            updateArmorStats();
        }

        // Regenerate chunks around player
        preGenerateSpawn(CONFIG.VIEW_DISTANCE + 1);

        return true;
    } catch (e) {
        console.error("Load failed:", e);
        return false;
    }
}

// ============ DELETE SAVE ============
function deleteSave() {
    try {
        localStorage.removeItem(CONFIG.SAVE_KEY);
        addChat("Save file deleted");
        return true;
    } catch (e) {
        console.error("Delete failed:", e);
        return false;
    }
}

// ============ CHECK SAVE EXISTS ============
function saveExists() {
    return localStorage.getItem(CONFIG.SAVE_KEY) !== null;
}

// ============ GET SAVE INFO ============
function getSaveInfo() {
    try {
        var jsonString = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!jsonString) return null;

        var data = JSON.parse(jsonString);
        return {
            version: data.version,
            timestamp: data.timestamp,
            seed: data.seed,
            playerX: data.player ? data.player.x : 0,
            playerY: data.player ? data.player.y : 0,
            playerZ: data.player ? data.player.z : 0,
            gameTime: data.timeOfDay || 0,
            dimension: data.currentDimension || 0,
            difficulty: data.difficulty || "normal",
            blocksPlaced: data.stats ? data.stats.blocksPlaced : 0,
            blocksBroken: data.stats ? data.stats.blocksBroken : 0,
            mobsKilled: data.stats ? data.stats.mobsKilled : 0
        };
    } catch (e) {
        return null;
    }
}

// ============ EXPORT SAVE (download as file) ============
function exportSave() {
    try {
        var jsonString = localStorage.getItem(CONFIG.SAVE_KEY);
        if (!jsonString) {
            addChat("No save to export");
            return;
        }

        var blob = new Blob([jsonString], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "minecraft_save_" + Date.now() + ".json";
        a.click();
        URL.revokeObjectURL(url);
        addChat("Save exported!");
    } catch (e) {
        addChat("Export failed");
    }
}

// ============ IMPORT SAVE (upload from file) ============
function importSave(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
        try {
            var data = JSON.parse(e.target.result);
            localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
            addChat("Save imported! Reload to apply");
        } catch (err) {
            addChat("Invalid save file");
        }
    };
    reader.readAsText(file);
}

// ============ AUTO-SAVE ============
function autoSave() {
    if (!gameState.started) return;
    if (gameState.tickCount % Math.floor(CONFIG.SAVE_INTERVAL / 50) === 0) {
        if (saveWorld()) {
            addChat("World auto-saved");
        }
    }
}

// ============ INIT ============
console.log("Save system loaded - " + (saveExists() ? "Save found" : "No save"));

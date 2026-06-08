// ============================================
// MINECRAFT - COMMAND SYSTEM
// Chat commands for gameplay control
// ============================================

// ============ COMMAND LIST ============
var COMMANDS = {
    "/help":      { desc: "Show all commands",              args: "",                    perm: "all" },
    "/fly":       { desc: "Toggle flying mode",             args: "",                    perm: "all" },
    "/time":      { desc: "Show current time",              args: "",                    perm: "all" },
    "/day":       { desc: "Set time to day",                args: "",                    perm: "all" },
    "/night":     { desc: "Set time to night",              args: "",                    perm: "all" },
    "/spawn":     { desc: "Teleport to spawn point",        args: "",                    perm: "all" },
    "/tp":        { desc: "Teleport to coordinates",        args: "<x> <y> <z>",         perm: "all" },
    "/heal":      { desc: "Restore full health and hunger", args: "",                    perm: "all" },
    "/feed":      { desc: "Restore full hunger",            args: "",                    perm: "all" },
    "/seed":      { desc: "Show world seed",                args: "",                    perm: "all" },
    "/save":      { desc: "Save the world",                 args: "",                    perm: "all" },
    "/load":      { desc: "Load saved world",               args: "",                    perm: "all" },
    "/weather":   { desc: "Set weather",                    args: "<clear|rain|thunder>", perm: "all" },
    "/gamemode":  { desc: "Change game mode",               args: "<creative|survival|spectator>", perm: "all" },
    "/give":      { desc: "Give yourself a block/item",     args: "<blockId> [amount]",  perm: "all" },
    "/killall":   { desc: "Remove all entities",            args: "",                    perm: "all" },
    "/where":     { desc: "Show current coordinates",       args: "",                    perm: "all" },
    "/biome":     { desc: "Show current biome",             args: "",                    perm: "all" },
    "/clear":     { desc: "Clear your inventory",           args: "",                    perm: "all" },
    "/summon":    { desc: "Spawn a mob",                    args: "<mobType>",           perm: "all" },
    "/speed":     { desc: "Set walk speed",                 args: "<value>",             perm: "all" },
    "/view":      { desc: "Set view distance",              args: "<chunks>",            perm: "all" },
    "/difficulty":{ desc: "Show/set difficulty",            args: "[peaceful|easy|normal|hard]", perm: "all" },
    "/xp":        { desc: "Add experience points",          args: "<amount>",            perm: "all" },
    "/enchant":   { desc: "Add an effect",                  args: "<effect> [duration] [level]", perm: "all" },
    "/version":   { desc: "Show game version",              args: "",                    perm: "all" }
};

// ============ GAME DIFFICULTY ============
var difficulty = "normal";

// ============ HANDLE COMMAND ============
function handleCommand(cmd) {
    var parts = cmd.split(" ");
    var command = parts[0].toLowerCase();

    // Add command to chat as sent
    addChat("> " + cmd);

    switch (command) {
        case "/help":
            showHelp(parts[1]);
            return;

        case "/fly":
            player.isFlying = !player.isFlying;
            player.vy = 0;
            addChat("Flying: " + (player.isFlying ? "ON" : "OFF"));
            playSound(600, 0.1, "sine");
            return;

        case "/time":
            addChat("Current time: " + gameState.timeOfDay + " / " + CONFIG.DAY_LENGTH);
            addChat("Formatted: " + formatTime(gameState.timeOfDay));
            return;

        case "/day":
            gameState.timeOfDay = CONFIG.DAY_START;
            addChat("Time set to day");
            return;

        case "/night":
            gameState.timeOfDay = CONFIG.NIGHT_START;
            addChat("Time set to night");
            return;

        case "/spawn":
            player.x = player.spawnX;
            player.y = player.spawnY;
            player.z = player.spawnZ;
            addChat("Teleported to spawn");
            return;

        case "/tp":
            if (parts.length >= 4) {
                player.x = parseFloat(parts[1]);
                player.y = parseFloat(parts[2]);
                player.z = parseFloat(parts[3]);
                addChat("Teleported to " + parts[1] + ", " + parts[2] + ", " + parts[3]);
            } else {
                addChat("Usage: /tp <x> <y> <z>");
            }
            return;

        case "/heal":
            player.health = player.maxHealth;
            player.hunger = player.maxHunger;
            player.saturation = CONFIG.PLAYER_STARTING_SATURATION;
            player.activeEffects = {};
            addChat("Fully healed!");
            playSound(800, 0.2, "sine");
            return;

        case "/feed":
            player.hunger = player.maxHunger;
            player.saturation = CONFIG.PLAYER_STARTING_SATURATION;
            addChat("Hunger restored!");
            return;

        case "/seed":
            addChat("World Seed: " + CONFIG.WORLD_SEED);
            return;

        case "/save":
            if (typeof saveWorld === "function") {
                saveWorld();
                addChat("World saved!");
                playSound(CONFIG.SAVE_SOUND_FREQ, CONFIG.SAVE_SOUND_DUR, "sine");
            } else {
                addChat("Save system not available");
            }
            return;

        case "/load":
            if (typeof loadWorld === "function") {
                loadWorld();
                addChat("World loaded!");
            } else {
                addChat("Load system not available");
            }
            return;

        case "/weather":
            if (parts[1]) {
                var type = parts[1].toLowerCase();
                if (type === "clear" || type === "rain" || type === "thunder" || type === "snow") {
                    setWeather(type);
                } else {
                    addChat("Usage: /weather <clear|rain|thunder|snow>");
                }
            } else {
                addChat("Current weather: " + weather.type);
            }
            return;

        case "/gamemode":
            if (parts[1]) {
                var mode = parts[1].toLowerCase();
                if (mode === "creative") {
                    player.gameMode = "creative";
                    player.isFlying = true;
                    addChat("Gamemode: Creative");
                } else if (mode === "survival") {
                    player.gameMode = "survival";
                    player.isFlying = false;
                    addChat("Gamemode: Survival");
                } else if (mode === "spectator") {
                    player.gameMode = "spectator";
                    player.isFlying = true;
                    addChat("Gamemode: Spectator");
                } else {
                    addChat("Usage: /gamemode <creative|survival|spectator>");
                }
            } else {
                addChat("Current gamemode: " + player.gameMode);
            }
            return;

        case "/give":
            if (parts.length >= 2) {
                var blockId = parseInt(parts[1]);
                var amount = parts[2] ? parseInt(parts[2]) : 1;
                if (!isNaN(blockId) && blockId >= 0 && blockId <= 244) {
                    if (typeof addToInventory === "function") {
                        addToInventory(blockId, amount);
                    }
                    addChat("Gave " + amount + "x " + getBlockName(blockId));
                    playSound(600, 0.15, "sine");
                } else {
                    addChat("Invalid block ID. Use 0-244");
                }
            } else {
                addChat("Usage: /give <blockId> [amount]");
            }
            return;

        case "/killall":
            var count = entities.length;
            entities = [];
            addChat("Removed " + count + " entities");
            return;

        case "/where":
            addChat("X: " + player.x.toFixed(2));
            addChat("Y: " + player.y.toFixed(2));
            addChat("Z: " + player.z.toFixed(2));
            addChat("Chunk: " + worldToChunk(player.x) + ", " + worldToChunk(player.z));
            addChat("Dimension: " + (currentDimension === CONFIG.DIMENSION_OVERWORLD ? "Overworld" : currentDimension === CONFIG.DIMENSION_NETHER ? "Nether" : "End"));
            return;

        case "/biome":
            var biome = getBiome(player.x, player.z);
            addChat("Biome: " + biome.name + " (ID: " + biome.id + ")");
            addChat("Temperature: " + biome.temp + " | Rainfall: " + biome.rain);
            return;

        case "/clear":
            if (typeof inventory !== "undefined") {
                for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
                    inventory[i] = null;
                }
            }
            addChat("Inventory cleared");
            return;

        case "/summon":
            if (parts[1]) {
                var mobType = parts[1].toUpperCase();
                if (MOB_TYPES[mobType]) {
                    var sx = player.x + Math.sin(player.yaw) * 3;
                    var sz = player.z - Math.cos(player.yaw) * 3;
                    spawnMob(mobType, sx, player.y, sz);
                    addChat("Summoned: " + MOB_TYPES[mobType].name);
                } else {
                    addChat("Unknown mob: " + parts[1]);
                    addChat("Available: " + Object.keys(MOB_TYPES).join(", "));
                }
            } else {
                addChat("Usage: /summon <mobType>");
            }
            return;

        case "/speed":
            if (parts[1]) {
                var newSpeed = parseFloat(parts[1]);
                if (!isNaN(newSpeed) && newSpeed > 0 && newSpeed <= 1) {
                    CONFIG.PLAYER_WALK_SPEED = newSpeed;
                    addChat("Walk speed set to: " + newSpeed);
                } else {
                    addChat("Speed must be between 0.01 and 1");
                }
            } else {
                addChat("Current speed: " + CONFIG.PLAYER_WALK_SPEED);
            }
            return;

        case "/view":
            if (parts[1]) {
                var newView = parseInt(parts[1]);
                if (!isNaN(newView) && newView >= 2 && newView <= 10) {
                    CONFIG.VIEW_DISTANCE = newView;
                    addChat("View distance set to: " + newView + " chunks");
                } else {
                    addChat("View distance must be between 2 and 10");
                }
            } else {
                addChat("Current view distance: " + CONFIG.VIEW_DISTANCE + " chunks");
            }
            return;

        case "/difficulty":
            if (parts[1]) {
                var diff = parts[1].toLowerCase();
                if (diff === "peaceful" || diff === "easy" || diff === "normal" || diff === "hard") {
                    difficulty = diff;
                    addChat("Difficulty set to: " + diff);
                } else {
                    addChat("Usage: /difficulty <peaceful|easy|normal|hard>");
                }
            } else {
                addChat("Current difficulty: " + difficulty);
            }
            return;

        case "/xp":
            if (parts[1]) {
                var xpAmount = parseInt(parts[1]);
                if (!isNaN(xpAmount)) {
                    addXp(xpAmount);
                    addChat("Added " + xpAmount + " XP");
                }
            } else {
                addChat("XP Level: " + player.xpLevel + " (" + player.xp + "/" + getXpForLevel(player.xpLevel) + ")");
            }
            return;

        case "/enchant":
            if (parts[1]) {
                var effect = parts[1].toLowerCase();
                var dur = parts[2] ? parseInt(parts[2]) : 600;
                var lvl = parts[3] ? parseInt(parts[3]) : 0;
                addPlayerEffect(effect, dur, lvl);
                addChat("Applied: " + effect + " (duration: " + dur + ", level: " + lvl + ")");
            } else {
                addChat("Usage: /enchant <effect> [duration] [level]");
            }
            return;

        case "/version":
            addChat("Minecraft Browser Edition v1.0.0");
            addChat("Seed: " + CONFIG.WORLD_SEED);
            addChat("245 blocks, 22 mobs, 3 dimensions");
            return;

        default:
            addChat("Unknown command. Type /help for list");
            return;
    }
}

// ============ SHOW HELP ============
function showHelp(page) {
    var cmds = Object.keys(COMMANDS);

    if (page) {
        // Show specific command help
        var cmd = "/" + page.toLowerCase();
        if (COMMANDS[cmd]) {
            addChat(cmd + " " + COMMANDS[cmd].args);
            addChat(COMMANDS[cmd].desc);
        } else {
            addChat("Unknown command: " + cmd);
        }
        return;
    }

    // Show all commands
    addChat("=== Commands (" + cmds.length + ") ===");
    var helpText = "";
    for (var i = 0; i < cmds.length; i++) {
        var c = cmds[i];
        if (i > 0) helpText += " | ";
        helpText += c;
    }
    addChat(helpText);
    addChat("Type /help <command> for details");
}

// ============ ENABLE COMMAND INPUT ============
function openCommandInput() {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "command-input";
    input.style.cssText = "position:fixed;bottom:56px;left:4px;width:400px;padding:4px 8px;background:rgba(0,0,0,0.85);color:#fff;border:1px solid #555;font-family:monospace;font-size:13px;z-index:200;outline:none;";
    input.placeholder = "Type command... (/help for list)";
    input.maxLength = 256;

    input.onkeydown = function (ev) {
        if (ev.code === "Enter") {
            var cmd = input.value.trim();
            if (cmd) handleCommand(cmd);
            input.remove();
            canvas.requestPointerLock();
        }
        if (ev.code === "Escape") {
            input.remove();
            canvas.requestPointerLock();
        }
        ev.stopPropagation();
    };

    document.body.appendChild(input);
    input.focus();
}

console.log("Command system loaded - " + Object.keys(COMMANDS).length + " commands");

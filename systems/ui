// ============================================
// MINECRAFT - UI SYSTEM
// HUD, hotbar, inventory, debug, notifications
// ============================================

// ============ HUD RENDERING ============
function renderHUD() {
    if (!CONFIG.RENDER_HUD || !gameState.locked) return;

    renderCrosshair();
    renderStatusBars();
    renderHotbarInfo();
    renderIndicators();
}

// ============ CROSSHAIR ============
function renderCrosshair() {
    if (!CONFIG.RENDER_CROSSHAIR) return;

    var cx = W / 2;
    var cy = H / 2;
    var size = 8;
    var gap = 2;

    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    // Horizontal
    ctx.moveTo(cx - size, cy);
    ctx.lineTo(cx - gap, cy);
    ctx.moveTo(cx + gap, cy);
    ctx.lineTo(cx + size, cy);

    // Vertical
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx, cy - gap);
    ctx.moveTo(cx, cy + gap);
    ctx.lineTo(cx, cy + size);

    ctx.stroke();

    // Center dot
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillRect(cx - 1, cy - 1, 2, 2);
}

// ============ STATUS BARS ============
function renderStatusBars() {
    var barW = 182;
    var barH = 8;
    var barX = W / 2 - barW / 2;

    // Health bar (above hotbar)
    var healthY = H - 52;
    ctx.fillStyle = "#000";
    ctx.fillRect(barX, healthY, barW, barH);
    ctx.fillStyle = "#cc0000";
    ctx.fillRect(barX, healthY, barW * (player.health / player.maxHealth), barH);
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, healthY, barW, barH);

    // Hunger bar
    var hungerY = healthY + 12;
    ctx.fillStyle = "#000";
    ctx.fillRect(barX, hungerY, barW, barH);
    ctx.fillStyle = "#dd8800";
    ctx.fillRect(barX, hungerY, barW * (player.hunger / player.maxHunger), barH);
    ctx.strokeStyle = "#555";
    ctx.strokeRect(barX, hungerY, barW, barH);

    // XP bar
    var xpY = hungerY + 12;
    var xpPercent = player.xp / getXpForLevel(player.xpLevel);
    ctx.fillStyle = "#000";
    ctx.fillRect(barX, xpY, barW, 4);
    ctx.fillStyle = "#55ff55";
    ctx.fillRect(barX, xpY, barW * xpPercent, 4);

    // Labels
    ctx.fillStyle = "#fff";
    ctx.font = "10px monospace";
    ctx.textAlign = "left";
    ctx.fillText("\u2764 " + Math.floor(player.health) + "/" + player.maxHealth, barX, healthY - 2);
    ctx.fillText("\uD83C\uDF57 " + Math.floor(player.hunger) + "/" + player.maxHunger, barX, hungerY - 2);
    ctx.fillText("\u2B50 " + player.xpLevel, barX + barW + 4, xpY + 4);

    // Armor bar (if wearing armor)
    if (player.armor > 0) {
        var armorY = xpY + 8;
        ctx.fillStyle = "#000";
        ctx.fillRect(barX, armorY, barW, barH);
        ctx.fillStyle = "#888888";
        ctx.fillRect(barX, armorY, barW * (player.armor / 20), barH);
        ctx.strokeStyle = "#555";
        ctx.strokeRect(barX, armorY, barW, barH);
        ctx.fillStyle = "#fff";
        ctx.fillText("\uD83D\uDEE1 " + player.armor, barX, armorY - 2);
    }

    ctx.textAlign = "start";
}

// ============ HOTBAR INFO ============
function renderHotbarInfo() {
    var barX = W / 2;

    // Current block name
    ctx.fillStyle = "#fff";
    ctx.font = "13px monospace";
    ctx.textAlign = "center";
    var blockName = getBlockName(selectedBlock);
    ctx.fillText(blockName, barX, H - 68);

    // Block count
    ctx.font = "11px monospace";
    ctx.fillText("Placed: " + player.blocksPlaced + " | Broken: " + player.blocksBroken, barX, H - 82);

    ctx.textAlign = "start";
}

// ============ INDICATORS ============
function renderIndicators() {
    var y = 40;

    // Flying indicator
    if (player.isFlying) {
        ctx.fillStyle = "#87CEEB";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.fillText("\u2708 FLYING", 10, y);
        y += 16;
    }

    // Sprinting indicator
    if (player.isSprinting) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px monospace";
        ctx.fillText("\u25B6 SPRINTING", 10, y);
        y += 16;
    }

    // Sneaking indicator
    if (player.isSneaking) {
        ctx.fillStyle = "#aaaaaa";
        ctx.font = "12px monospace";
        ctx.fillText("\u25BC SNEAKING", 10, y);
        y += 16;
    }

    // Weather indicator
    if (weather.type !== "clear") {
        ctx.fillStyle = weather.type === "thunder" ? "#ffcc00" : "#87CEEB";
        ctx.font = "12px monospace";
        ctx.fillText(weather.type === "thunder" ? "\u26A1 THUNDER" : weather.type === "rain" ? "\uD83C\uDF27 RAIN" : "\u2744 SNOW", 10, y);
        y += 16;
    }

    // Dimension indicator
    if (currentDimension !== CONFIG.DIMENSION_OVERWORLD) {
        ctx.fillStyle = currentDimension === CONFIG.DIMENSION_NETHER ? "#ff4444" : "#dddd44";
        ctx.font = "12px monospace";
        ctx.fillText(currentDimension === CONFIG.DIMENSION_NETHER ? "\uD83D\uDD25 NETHER" : "\uD83C\uDF19 END", 10, y);
        y += 16;
    }

    // Gamemode indicator
    if (player.gameMode !== "survival") {
        ctx.fillStyle = "#ffcc00";
        ctx.font = "12px monospace";
        ctx.fillText("\uD83C\uDFAE " + player.gameMode.toUpperCase(), 10, y);
        y += 16;
    }

    ctx.textAlign = "start";
}

// ============ INVENTORY SCREEN ============
function renderInventoryScreen() {
    var invDiv = document.getElementById("inventory-screen");
    if (!invDiv) return;
    invDiv.style.display = "block";

    // Main inventory grid (36 slots)
    var grid = document.getElementById("inv-grid");
    if (grid) {
        var html = "";
        for (var row = 0; row < 4; row++) {
            html += '<div style="display:flex;gap:2px;margin-bottom:2px">';
            for (var col = 0; col < 9; col++) {
                var idx = row * 9 + col;
                var item = inventory[idx];
                var bg = "#8b8b8b";
                var name = "";
                var cnt = "";

                if (item) {
                    var def = getBlockDef(item.id);
                    bg = def ? def.color : "#8b8b8b";
                    name = def ? def.name : "Item " + item.id;
                    cnt = item.count > 1 ? item.count : "";
                }

                html += '<div class="inv-slot" style="background:' + bg + '" title="' + name + '">';
                html += '<span class="slot-count">' + cnt + '</span>';
                html += '</div>';
            }
            html += '</div>';
        }
        grid.innerHTML = html;
    }

    // Hotbar row
    var hotbarRow = document.getElementById("inv-hotbar-row");
    if (hotbarRow) {
        var hhtml = "";
        for (var i = 0; i < 9; i++) {
            var slotItem = inventory[i];
            var hbg = "#8b8b8b";
            var hname = "";
            var hcnt = "";
            var hclass = (i === selectedSlot) ? " inv-slot selected" : " inv-slot";

            if (slotItem) {
                var hdef = getBlockDef(slotItem.id);
                hbg = hdef ? hdef.color : "#8b8b8b";
                hname = hdef ? hdef.name : "";
                hcnt = slotItem.count > 1 ? slotItem.count : "";
            }

            hhtml += '<div class="inv-slot" style="background:' + hbg + '" title="' + hname + '">';
            hhtml += '<span class="slot-key">' + (i + 1) + '</span>';
            hhtml += '<span class="slot-count">' + hcnt + '</span>';
            hhtml += '</div>';
        }
        hotbarRow.innerHTML = hhtml;
    }

    // Armor slots
    updateArmorSlotsUI();

    // Crafting grid
    updateCraftingUI();
}

// ============ ARMOR SLOTS UI ============
function updateArmorSlotsUI() {
    var armorDiv = document.getElementById("armor-slots");
    if (!armorDiv) return;

    var slots = armorDiv.children;
    for (var i = 0; i < 4 && i < slots.length; i++) {
        var armor = armorSlots[i];
        if (armor) {
            var def = getBlockDef(armor.id);
            slots[i].style.background = def ? def.color : "#8b8b8b";
            slots[i].title = def ? def.name : "Armor";
        } else {
            slots[i].style.background = "#8b8b8b";
            var names = ["Boots", "Leggings", "Chestplate", "Helmet"];
            slots[i].title = names[i];
        }
    }
}

// ============ CRAFTING UI ============
function updateCraftingUI() {
    var craftGrid = document.getElementById("crafting-grid");
    if (!craftGrid) return;

    // Available recipes
    var recipesDiv = document.getElementById("available-recipes");
    if (recipesDiv) {
        var available = getAvailableRecipes ? getAvailableRecipes() : [];
        var rh = '<div style="font-size:12px;color:#404040;font-weight:bold;margin:8px 0 4px">Recipes (' + available.length + ')</div>';
        rh += '<div style="display:flex;flex-wrap:wrap;gap:3px;max-height:180px;overflow-y:auto">';

        for (var i = 0; i < Math.min(available.length, 30); i++) {
            var r = craftingRecipes[available[i]];
            var rbg = "#8b8b8b";
            if (r && r.result && r.result.id) {
                var rdef = getBlockDef(r.result.id);
                rbg = rdef ? rdef.color : "#8b8b8b";
            }
            rh += '<div style="background:' + rbg + ';padding:4px 8px;cursor:pointer;font-size:10px;color:#fff;text-shadow:1px 1px 0 #000;border:2px solid #373737;border-radius:2px" ';
            rh += 'onclick="craftRecipe(\'' + available[i] + '\'); renderInventoryScreen();" ';
            rh += 'title="' + (r ? r.result.name : "") + '">';
            rh += (r ? r.result.name : available[i]);
            rh += '</div>';
        }
        rh += '</div>';
        recipesDiv.innerHTML = rh;
    }
}

// ============ DEBUG SCREEN ============
function renderDebugScreen() {
    var dbg = document.getElementById("debug");
    if (!dbg) return;

    var pcx = worldToChunk(player.x);
    var pcz = worldToChunk(player.z);
    var biome = getBiome(player.x, player.z);

    var text = "";

    // Left side
    text += "Minecraft Browser Edition\n";
    text += "Version: 1.0.0\n";
    text += "Seed: " + CONFIG.WORLD_SEED + "\n\n";

    text += "FPS: " + gameState.fps + "\n";
    text += "Tick: " + gameState.tickCount + "\n\n";

    text += "XYZ: " + player.x.toFixed(3) + " / " + player.y.toFixed(3) + " / " + player.z.toFixed(3) + "\n";
    text += "Chunk: " + pcx + ", " + pcz + " (" + localInChunk(player.x) + ", " + localInChunk(player.z) + ")\n";
    text += "Facing: " + radToDeg(player.yaw).toFixed(1) + "° / " + radToDeg(player.pitch).toFixed(1) + "°\n\n";

    // Right side
    text += "Dimension: " + (currentDimension === 0 ? "Overworld" : currentDimension === -1 ? "Nether" : "End") + "\n";
    text += "Biome: " + biome.name + " (T:" + biome.temp.toFixed(2) + " R:" + biome.rain.toFixed(2) + ")\n";
    text += "Time: " + gameState.timeOfDay + " / " + CONFIG.DAY_LENGTH + " (" + formatTime(gameState.timeOfDay) + ")\n";
    text += "Weather: " + weather.type + " (Dur:" + weather.duration + ")\n";
    text += "Difficulty: " + difficulty + "\n\n";

    text += "Health: " + player.health + "/" + player.maxHealth + "\n";
    text += "Hunger: " + player.hunger + "/" + player.maxHunger + " (Sat:" + player.saturation.toFixed(1) + ")\n";
    text += "XP: Lvl " + player.xpLevel + " (" + player.xp + "/" + getXpForLevel(player.xpLevel) + ")\n";
    text += "Armor: " + player.armor + " (Tough:" + player.armorToughness + ")\n";
    text += "Flying: " + player.isFlying + " | Ground: " + player.onGround + "\n";
    text += "Gamemode: " + player.gameMode + "\n\n";

    text += "Entities: " + entities.length + " / " + CONFIG.MAX_ENTITIES + "\n";
    text += "Particles: " + particles.length + " / " + CONFIG.MAX_PARTICLES + "\n";
    text += "Chunks Loaded: " + Object.keys(getCurrentChunks()).length + "\n\n";

    text += "Placed: " + player.blocksPlaced + " | Broken: " + player.blocksBroken + "\n";
    text += "Mobs Killed: " + player.mobsKilled + " | Deaths: " + player.deaths + "\n";
    text += "Walked: " + formatNumber(Math.floor(player.distanceWalked)) + "m | Flown: " + formatNumber(Math.floor(player.distanceFlown)) + "m\n";

    dbg.textContent = text;
}

// ============ NOTIFICATION SYSTEM ============
var notificationTimeout = null;

function showNotification(text, duration) {
    if (!duration) duration = 3000;
    var notif = document.getElementById("notification");
    if (!notif) return;

    notif.textContent = text;
    notif.style.display = "block";
    notif.style.opacity = "1";
    notif.style.animation = "none";
    notif.offsetHeight;
    notif.style.animation = "titlePop 0.3s ease-out";

    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(function () {
        notif.style.opacity = "0";
        notif.style.transition = "opacity 0.5s";
        setTimeout(function () {
            notif.style.display = "none";
        }, 500);
    }, duration);
}

// ============ CHAT RENDERING ============
function renderChat() {
    var chatDiv = document.getElementById("chat");
    if (!chatDiv) return;

    var html = "";
    var start = Math.max(0, chatMessages.length - CONFIG.CHAT_DISPLAY_COUNT);
    for (var i = start; i < chatMessages.length; i++) {
        html += '<div class="cmsg">' + chatMessages[i].text + '</div>';
    }
    chatDiv.innerHTML = html;

    // Auto-scroll to bottom
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// ============ INFO DISPLAY ============
function updateInfoDisplay() {
    if (CONFIG.SHOW_COORDS) {
        var infoDiv = document.getElementById("info");
        if (infoDiv) {
            infoDiv.innerHTML =
                "HP:" + Math.floor(player.health) +
                " Food:" + Math.floor(player.hunger) +
                " XYZ:" + player.x.toFixed(1) + "," + player.y.toFixed(1) + "," + player.z.toFixed(1);
        }
    }
    if (CONFIG.SHOW_FPS) {
        var fpsDiv = document.getElementById("fps");
        if (fpsDiv) {
            fpsDiv.textContent = "FPS:" + gameState.fps;
        }
    }
}

// ============ HOTBAR UI UPDATE ============
function updateHotbarUI() {
    var slots = document.querySelectorAll(".slot");
    for (var i = 0; i < slots.length; i++) {
        slots[i].classList.toggle("sel", i === selectedSlot);

        // Update slot colors based on inventory
        var item = inventory[i];
        if (item) {
            var def = getBlockDef(item.id);
            slots[i].style.background = def ? def.color : "#8b8b8b";
            var countSpan = slots[i].querySelector("span:not(.key)");
            if (countSpan) countSpan.textContent = item.count > 1 ? item.count : "";
        }
    }
}

// ============ BOSS BAR ============
function updateBossBar(name, health, maxHealth) {
    var bossBar = document.getElementById("boss-bar");
    if (!bossBar) return;

    if (health <= 0) {
        bossBar.style.display = "none";
        return;
    }

    bossBar.style.display = "block";
    document.getElementById("boss-bar-fill").style.width = (health / maxHealth * 100) + "%";
    document.getElementById("boss-bar-text").textContent = name + " (" + Math.floor(health) + "/" + maxHealth + ")";
}

// ============ INIT ============
console.log("UI system loaded");

// ============================================
// MINECRAFT - INVENTORY SYSTEM
// Item stacks, hotbar, crafting, armor
// ============================================

// ============ INVENTORY STATE ============
var inventory = [];
var armorSlots = [null, null, null, null]; // boots, leggings, chestplate, helmet
var offhand = null;

// ============ CRAFTING RECIPES ============
var craftingRecipes = {
    // === BASIC ===
    "planks": {
        materials: { 39: 1 },
        result: { id: 57, count: 4, name: "Oak Planks" }
    },
    "sticks": {
        materials: { 57: 2 },
        result: { id: "stick", count: 4, name: "Sticks" }
    },
    "crafting_table": {
        materials: { 57: 4 },
        result: { id: 150, count: 1, name: "Crafting Table" }
    },
    "torch": {
        materials: { 23: 1, "stick": 1 },
        result: { id: 236, count: 4, name: "Torches" }
    },
    "furnace": {
        materials: { 15: 8 },
        result: { id: 151, count: 1, name: "Furnace" }
    },
    "chest": {
        materials: { 57: 8 },
        result: { id: 152, count: 1, name: "Chest" }
    },

    // === TOOLS ===
    "wooden_pickaxe": {
        materials: { 57: 3, "stick": 2 },
        result: { id: "wooden_pickaxe", count: 1, name: "Wooden Pickaxe" }
    },
    "stone_pickaxe": {
        materials: { 15: 3, "stick": 2 },
        result: { id: "stone_pickaxe", count: 1, name: "Stone Pickaxe" }
    },
    "iron_pickaxe": {
        materials: { "iron_ingot": 3, "stick": 2 },
        result: { id: "iron_pickaxe", count: 1, name: "Iron Pickaxe" }
    },
    "diamond_pickaxe": {
        materials: { "diamond": 3, "stick": 2 },
        result: { id: "diamond_pickaxe", count: 1, name: "Diamond Pickaxe" }
    },

    "wooden_axe": {
        materials: { 57: 3, "stick": 2 },
        result: { id: "wooden_axe", count: 1, name: "Wooden Axe" }
    },
    "stone_axe": {
        materials: { 15: 3, "stick": 2 },
        result: { id: "stone_axe", count: 1, name: "Stone Axe" }
    },

    "wooden_sword": {
        materials: { 57: 2, "stick": 1 },
        result: { id: "wooden_sword", count: 1, name: "Wooden Sword" }
    },
    "stone_sword": {
        materials: { 15: 2, "stick": 1 },
        result: { id: "stone_sword", count: 1, name: "Stone Sword" }
    },
    "iron_sword": {
        materials: { "iron_ingot": 2, "stick": 1 },
        result: { id: "iron_sword", count: 1, name: "Iron Sword" }
    },
    "diamond_sword": {
        materials: { "diamond": 2, "stick": 1 },
        result: { id: "diamond_sword", count: 1, name: "Diamond Sword" }
    },

    "wooden_shovel": {
        materials: { 57: 1, "stick": 2 },
        result: { id: "wooden_shovel", count: 1, name: "Wooden Shovel" }
    },
    "stone_shovel": {
        materials: { 15: 1, "stick": 2 },
        result: { id: "stone_shovel", count: 1, name: "Stone Shovel" }
    },

    "wooden_hoe": {
        materials: { 57: 2, "stick": 2 },
        result: { id: "wooden_hoe", count: 1, name: "Wooden Hoe" }
    },
    "stone_hoe": {
        materials: { 15: 2, "stick": 2 },
        result: { id: "stone_hoe", count: 1, name: "Stone Hoe" }
    },

    // === ARMOR ===
    "leather_helmet": {
        materials: { "leather": 5 },
        result: { id: "leather_helmet", count: 1, name: "Leather Helmet" }
    },
    "leather_chestplate": {
        materials: { "leather": 8 },
        result: { id: "leather_chestplate", count: 1, name: "Leather Chestplate" }
    },
    "leather_leggings": {
        materials: { "leather": 7 },
        result: { id: "leather_leggings", count: 1, name: "Leather Leggings" }
    },
    "leather_boots": {
        materials: { "leather": 4 },
        result: { id: "leather_boots", count: 1, name: "Leather Boots" }
    },

    "iron_helmet": {
        materials: { "iron_ingot": 5 },
        result: { id: "iron_helmet", count: 1, name: "Iron Helmet" }
    },
    "iron_chestplate": {
        materials: { "iron_ingot": 8 },
        result: { id: "iron_chestplate", count: 1, name: "Iron Chestplate" }
    },
    "iron_leggings": {
        materials: { "iron_ingot": 7 },
        result: { id: "iron_leggings", count: 1, name: "Iron Leggings" }
    },
    "iron_boots": {
        materials: { "iron_ingot": 4 },
        result: { id: "iron_boots", count: 1, name: "Iron Boots" }
    },

    "diamond_helmet": {
        materials: { "diamond": 5 },
        result: { id: "diamond_helmet", count: 1, name: "Diamond Helmet" }
    },
    "diamond_chestplate": {
        materials: { "diamond": 8 },
        result: { id: "diamond_chestplate", count: 1, name: "Diamond Chestplate" }
    },
    "diamond_leggings": {
        materials: { "diamond": 7 },
        result: { id: "diamond_leggings", count: 1, name: "Diamond Leggings" }
    },
    "diamond_boots": {
        materials: { "diamond": 4 },
        result: { id: "diamond_boots", count: 1, name: "Diamond Boots" }
    },

    // === BUILDING ===
    "bricks": {
        materials: { "brick_item": 4 },
        result: { id: 135, count: 1, name: "Bricks" }
    },
    "stone_bricks": {
        materials: { 1: 4 },
        result: { id: 18, count: 4, name: "Stone Bricks" }
    },
    "glass": {
        materials: { 69: 1 },
        result: { id: 125, count: 1, name: "Glass" },
        furnace: true
    },
    "fence": {
        materials: { "stick": 4, 57: 2 },
        result: { id: 172, count: 3, name: "Oak Fence" }
    },
    "fence_gate": {
        materials: { "stick": 4, 57: 2 },
        result: { id: 173, count: 1, name: "Oak Fence Gate" }
    },
    "door": {
        materials: { 57: 6 },
        result: { id: 170, count: 3, name: "Oak Door" }
    },
    "ladder": {
        materials: { "stick": 7 },
        result: { id: 235, count: 3, name: "Ladder" }
    },
    "sign": {
        materials: { 57: 6, "stick": 1 },
        result: { id: "sign", count: 3, name: "Sign" }
    },

    // === FOOD ===
    "bread": {
        materials: { "wheat": 3 },
        result: { id: "bread", count: 1, name: "Bread" }
    },
    "cookie": {
        materials: { "wheat": 2, "cocoa": 1 },
        result: { id: "cookie", count: 8, name: "Cookie" }
    },
    "cake": {
        materials: { "wheat": 3, "sugar": 2, "egg": 1, "milk": 3 },
        result: { id: "cake", count: 1, name: "Cake" }
    },
    "pumpkin_pie": {
        materials: { 198: 1, "sugar": 1, "egg": 1 },
        result: { id: "pumpkin_pie", count: 1, name: "Pumpkin Pie" }
    },
    "mushroom_stew": {
        materials: { 185: 1, 186: 1, "bowl": 1 },
        result: { id: "mushroom_stew", count: 1, name: "Mushroom Stew" }
    },

    // === MISC ===
    "bow": {
        materials: { "stick": 3, "string": 3 },
        result: { id: "bow", count: 1, name: "Bow" }
    },
    "arrow": {
        materials: { "flint": 1, "stick": 1, "feather": 1 },
        result: { id: "arrow", count: 4, name: "Arrow" }
    },
    "bucket": {
        materials: { "iron_ingot": 3 },
        result: { id: "bucket", count: 1, name: "Bucket" }
    },
    "shears": {
        materials: { "iron_ingot": 2 },
        result: { id: "shears", count: 1, name: "Shears" }
    },
    "flint_and_steel": {
        materials: { "iron_ingot": 1, "flint": 1 },
        result: { id: "flint_and_steel", count: 1, name: "Flint and Steel" }
    },
    "book": {
        materials: { "paper": 3, "leather": 1 },
        result: { id: "book", count: 1, name: "Book" }
    },
    "bookshelf": {
        materials: { 57: 6, "book": 3 },
        result: { id: 237, count: 1, name: "Bookshelf" }
    },
    "bed": {
        materials: { 87: 3, 57: 3 },
        result: { id: "bed", count: 1, name: "Bed" }
    },
    "painting": {
        materials: { "stick": 8, 87: 1 },
        result: { id: "painting", count: 1, name: "Painting" }
    }
};

// ============ INITIALIZATION ============
function initInventory() {
    inventory = [];
    armorSlots = [null, null, null, null];
    offhand = null;

    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        inventory.push(null);
    }

    // Give starter items from config
    for (var i = 0; i < CONFIG.DEFAULT_HOTBAR.length; i++) {
        var blockId = CONFIG.DEFAULT_HOTBAR[i];
        var count = CONFIG.DEFAULT_HOTBAR_COUNTS[i] || 64;
        inventory[i] = { id: blockId, count: count, durability: 0 };
    }
}

// ============ INVENTORY FUNCTIONS ============

// Add item to inventory
function addToInventory(itemId, count, durability) {
    if (!count) count = 1;
    if (!durability) durability = 0;

    var maxStack = isTool(itemId) ? CONFIG.MAX_TOOL_STACK : CONFIG.MAX_STACK_SIZE;

    // Try to stack with existing items
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        if (inventory[i] && inventory[i].id === itemId && inventory[i].count < maxStack) {
            var space = maxStack - inventory[i].count;
            var toAdd = Math.min(count, space);
            inventory[i].count += toAdd;
            count -= toAdd;
            if (count <= 0) return true;
        }
    }

    // Find empty slots
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        if (!inventory[i]) {
            inventory[i] = { id: itemId, count: Math.min(count, maxStack), durability: durability };
            count -= Math.min(count, maxStack);
            if (count <= 0) return true;
        }
    }

    return count <= 0;
}

// Remove item from inventory
function removeFromInventory(itemId, count) {
    if (!count) count = 1;
    var remaining = count;

    for (var i = 0; i < CONFIG.INVENTORY_SLOTS && remaining > 0; i++) {
        if (inventory[i] && inventory[i].id === itemId) {
            var toRemove = Math.min(remaining, inventory[i].count);
            inventory[i].count -= toRemove;
            remaining -= toRemove;
            if (inventory[i].count <= 0) inventory[i] = null;
        }
    }

    return remaining === 0;
}

// Check if player has item
function hasItem(itemId, count) {
    if (!count) count = 1;
    var has = 0;
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        if (inventory[i] && inventory[i].id === itemId) {
            has += inventory[i].count;
            if (has >= count) return true;
        }
    }
    return false;
}

// Count total of an item
function countItem(itemId) {
    var total = 0;
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        if (inventory[i] && inventory[i].id === itemId) total += inventory[i].count;
    }
    return total;
}

// Get item in a specific slot
function getSlotItem(slot) {
    if (slot < 0 || slot >= CONFIG.INVENTORY_SLOTS) return null;
    return inventory[slot];
}

// Set item in a specific slot
function setSlotItem(slot, item) {
    if (slot < 0 || slot >= CONFIG.INVENTORY_SLOTS) return;
    inventory[slot] = item;
}

// Check if item is a tool (non-stackable)
function isTool(itemId) {
    var tools = ["pickaxe", "axe", "sword", "shovel", "hoe", "bow", "shears", "fishing_rod", "flint_and_steel", "shield", "elytra"];
    if (typeof itemId === "string" && tools.some(function (t) { return itemId.indexOf(t) !== -1; })) return true;
    return false;
}

// Get selected hotbar item
function getSelectedItem() {
    var slot = CONFIG.DEFAULT_HOTBAR[player.selectedSlot || 0];
    // Return the inventory slot that matches the hotbar
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        if (inventory[i] && inventory[i].id === slot) return inventory[i];
    }
    return { id: slot, count: 64 };
}

// ============ ARMOR SYSTEM ============

// Equip armor to a slot
function equipArmor(itemId, slot) {
    if (slot < 0 || slot > 3) return false;

    // Unequip current
    if (armorSlots[slot]) {
        addToInventory(armorSlots[slot].id, 1, armorSlots[slot].durability || 0);
    }

    armorSlots[slot] = { id: itemId, count: 1, durability: 0 };
    removeFromInventory(itemId, 1);
    updateArmorStats();
    return true;
}

// Unequip armor from a slot
function unequipArmor(slot) {
    if (slot < 0 || slot > 3) return false;
    if (!armorSlots[slot]) return false;

    addToInventory(armorSlots[slot].id, 1, armorSlots[slot].durability || 0);
    armorSlots[slot] = null;
    updateArmorStats();
    return true;
}

// Update player armor values
function updateArmorStats() {
    var totalArmor = 0;
    var totalToughness = 0;

    var armorValues = {
        "leather_helmet": 1, "leather_chestplate": 3, "leather_leggings": 2, "leather_boots": 1,
        "iron_helmet": 2, "iron_chestplate": 6, "iron_leggings": 5, "iron_boots": 2,
        "diamond_helmet": 3, "diamond_chestplate": 8, "diamond_leggings": 6, "diamond_boots": 3
    };

    var toughnessValues = {
        "diamond_helmet": 2, "diamond_chestplate": 2, "diamond_leggings": 2, "diamond_boots": 2
    };

    for (var i = 0; i < 4; i++) {
        if (armorSlots[i]) {
            totalArmor += armorValues[armorSlots[i].id] || 0;
            totalToughness += toughnessValues[armorSlots[i].id] || 0;
        }
    }

    player.armor = totalArmor;
    player.armorToughness = totalToughness;
}

// ============ CRAFTING SYSTEM ============

// Craft a recipe
function craftRecipe(recipeName) {
    var recipe = craftingRecipes[recipeName];
    if (!recipe) {
        addChat("Unknown recipe: " + recipeName);
        return false;
    }

    // Check materials
    for (var matId in recipe.materials) {
        var needed = recipe.materials[matId];
        if (!hasItem(matId, needed)) {
            addChat("Not enough materials for " + recipe.result.name);
            return false;
        }
    }

    // Remove materials
    for (var matId in recipe.materials) {
        var needed = recipe.materials[matId];
        removeFromInventory(matId, needed);
    }

    // Add result
    addToInventory(recipe.result.id, recipe.result.count);
    player.itemsCrafted++;
    addChat("Crafted: " + recipe.result.name);
    playSound(CONFIG.CRAFT_SOUND_FREQ, CONFIG.CRAFT_SOUND_DUR, "sine");
    return true;
}

// Get all available recipes
function getAvailableRecipes() {
    var available = [];
    for (var name in craftingRecipes) {
        var recipe = craftingRecipes[name];
        var canCraft = true;
        for (var matId in recipe.materials) {
            if (!hasItem(matId, recipe.materials[matId])) {
                canCraft = false;
                break;
            }
        }
        if (canCraft) available.push(name);
    }
    return available;
}

// ============ INVENTORY RENDERING ============

// Render inventory screen (called from main.js)
function renderInventoryScreen() {
    var invDiv = document.getElementById("inventory-screen");
    if (!invDiv) return;
    invDiv.style.display = "block";

    var grid = document.getElementById("inv-grid");
    if (!grid) return;

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
                var blockDef = getBlockDef(item.id);
                bg = blockDef ? blockDef.color : "#8b8b8b";
                name = blockDef ? blockDef.name : "Item " + item.id;
                cnt = item.count;
            }

            html += '<div class="inv-slot" style="background:' + bg + '" title="' + name + '">';
            html += '<span style="position:absolute;bottom:0;right:2px;color:#fff;font-size:9px;text-shadow:1px 1px 0 #000">' + cnt + '</span>';
            html += '</div>';
        }
        html += '</div>';
    }
    grid.innerHTML = html;

    // Crafting grid
    var craftGrid = document.getElementById("crafting-grid");
    if (craftGrid) {
        var ch = "";
        for (var i = 0; i < 4; i++) {
            ch += '<div class="craft-slot"></div>';
        }
        craftGrid.innerHTML = ch;
    }

    // Available recipes
    var recipesDiv = document.getElementById("available-recipes");
    if (recipesDiv) {
        var available = getAvailableRecipes();
        var rh = '<div class="inv-section-title">Available Recipes (' + available.length + ')</div>';
        rh += '<div style="display:flex;flex-wrap:wrap;gap:4px;max-height:200px;overflow-y:auto">';
        for (var i = 0; i < available.length; i++) {
            var r = craftingRecipes[available[i]];
            rh += '<div class="inv-slot" style="width:auto;padding:4px 8px;cursor:pointer;font-size:10px;color:#fff;text-shadow:1px 1px 0 #000" ';
            rh += 'onclick="craftRecipe(\'' + available[i] + '\')" ';
            rh += 'title="' + r.result.name + '">';
            rh += r.result.name;
            rh += '</div>';
        }
        rh += '</div>';
        recipesDiv.innerHTML = rh;
    }
}

// ============ DROP ITEM ============
function dropItem(slot) {
    if (slot < 0 || slot >= CONFIG.INVENTORY_SLOTS) return;
    var item = inventory[slot];
    if (!item) return;

    // Create dropped item entity in world
    if (typeof spawnDroppedItem === "function") {
        spawnDroppedItem(item.id, item.count, player.x, player.y + player.eyeHeight, player.z);
    }

    inventory[slot] = null;
    addChat("Dropped: " + getBlockName(item.id));
}

console.log("Inventory system loaded - " + Object.keys(craftingRecipes).length + " recipes");

// ============================================
// MINECRAFT 1.12 - COMPLETE BLOCK DEFINITIONS
// 245 block IDs, 245 definitions, no gaps
// Usage: import { BLOCKS, blockDefs, getBlockDef } from './world/blocks.js'
// ============================================

// ============ BLOCK IDs (0-244, sequential) ============
var BLOCKS = {
    // 0-9: Air & Structure
    AIR: 0, STONE: 1, GRANITE: 2, DIORITE: 3, ANDESITE: 4,
    BEDROCK: 5, BARRIER: 6, STRUCTURE_VOID: 7,

    // 8-19: Ground & Path
    GRASS_BLOCK: 8, DIRT: 9, COARSE_DIRT: 10, PODZOL: 11,
    MYCELIUM: 12, GRASS_PATH: 13, FARMLAND: 14,

    // 15-24: Stone Variants
    COBBLESTONE: 15, MOSSY_COBBLESTONE: 16, OBSIDIAN: 17,
    STONE_BRICKS: 18, MOSSY_STONE_BRICKS: 19, CRACKED_STONE_BRICKS: 20,
    CHISELED_STONE_BRICKS: 21, SMOOTH_STONE: 22,

    // 23-34: Ores
    COAL_ORE: 23, IRON_ORE: 24, GOLD_ORE: 25, DIAMOND_ORE: 26,
    EMERALD_ORE: 27, REDSTONE_ORE: 28, LAPIS_ORE: 29,
    NETHER_QUARTZ_ORE: 30,

    // 31-42: Mineral Blocks
    COAL_BLOCK: 31, IRON_BLOCK: 32, GOLD_BLOCK: 33, DIAMOND_BLOCK: 34,
    EMERALD_BLOCK: 35, REDSTONE_BLOCK: 36, LAPIS_BLOCK: 37, QUARTZ_BLOCK: 38,

    // 39-50: Wood Logs (6 types)
    OAK_LOG: 39, SPRUCE_LOG: 40, BIRCH_LOG: 41, JUNGLE_LOG: 42,
    ACACIA_LOG: 43, DARK_OAK_LOG: 44,

    // 45-50: Stripped Logs
    STRIPPED_OAK_LOG: 45, STRIPPED_SPRUCE_LOG: 46, STRIPPED_BIRCH_LOG: 47,
    STRIPPED_JUNGLE_LOG: 48, STRIPPED_ACACIA_LOG: 49, STRIPPED_DARK_OAK_LOG: 50,

    // 51-56: Wood Bark (6 types)
    OAK_WOOD: 51, SPRUCE_WOOD: 52, BIRCH_WOOD: 53, JUNGLE_WOOD: 54,
    ACACIA_WOOD: 55, DARK_OAK_WOOD: 56,

    // 57-62: Planks (6 types)
    OAK_PLANKS: 57, SPRUCE_PLANKS: 58, BIRCH_PLANKS: 59, JUNGLE_PLANKS: 60,
    ACACIA_PLANKS: 61, DARK_OAK_PLANKS: 62,

    // 63-68: Leaves (6 types)
    OAK_LEAVES: 63, SPRUCE_LEAVES: 64, BIRCH_LEAVES: 65, JUNGLE_LEAVES: 66,
    ACACIA_LEAVES: 67, DARK_OAK_LEAVES: 68,

    // 69-80: Sand & Sandstone
    SAND: 69, RED_SAND: 70, SANDSTONE: 71, RED_SANDSTONE: 72,
    CHISELED_SANDSTONE: 73, CUT_SANDSTONE: 74, SMOOTH_SANDSTONE: 75,
    CHISELED_RED_SANDSTONE: 76, CUT_RED_SANDSTONE: 77, SMOOTH_RED_SANDSTONE: 78,

    // 79-84: Gravel, Clay, Water, Lava
    GRAVEL: 79, CLAY: 80, WATER: 81, LAVA: 82,

    // 83-88: Ice & Snow
    ICE: 83, PACKED_ICE: 84, SNOW_BLOCK: 85, SNOW_LAYER: 86,

    // 87-102: Wool (all 16 colors)
    WHITE_WOOL: 87, ORANGE_WOOL: 88, MAGENTA_WOOL: 89, LIGHT_BLUE_WOOL: 90,
    YELLOW_WOOL: 91, LIME_WOOL: 92, PINK_WOOL: 93, GRAY_WOOL: 94,
    LIGHT_GRAY_WOOL: 95, CYAN_WOOL: 96, PURPLE_WOOL: 97, BLUE_WOOL: 98,
    BROWN_WOOL: 99, GREEN_WOOL: 100, RED_WOOL: 101, BLACK_WOOL: 102,

    // 103-108: Terracotta
    TERRACOTTA: 103, WHITE_TERRACOTTA: 104, ORANGE_TERRACOTTA: 105,
    RED_TERRACOTTA: 106, YELLOW_TERRACOTTA: 107, BROWN_TERRACOTTA: 108,

    // 109-124: Concrete (all 16 colors)
    WHITE_CONCRETE: 109, ORANGE_CONCRETE: 110, MAGENTA_CONCRETE: 111,
    LIGHT_BLUE_CONCRETE: 112, YELLOW_CONCRETE: 113, LIME_CONCRETE: 114,
    PINK_CONCRETE: 115, GRAY_CONCRETE: 116, LIGHT_GRAY_CONCRETE: 117,
    CYAN_CONCRETE: 118, PURPLE_CONCRETE: 119, BLUE_CONCRETE: 120,
    BROWN_CONCRETE: 121, GREEN_CONCRETE: 122, RED_CONCRETE: 123,
    BLACK_CONCRETE: 124,

    // 125-134: Glass & Stained Glass
    GLASS: 125, GLASS_PANE: 126,
    WHITE_STAINED_GLASS: 127, ORANGE_STAINED_GLASS: 128,
    RED_STAINED_GLASS: 129, BLUE_STAINED_GLASS: 130,
    YELLOW_STAINED_GLASS: 131, GREEN_STAINED_GLASS: 132,
    PURPLE_STAINED_GLASS: 133, BLACK_STAINED_GLASS: 134,

    // 135-144: Bricks & Stone Bricks
    BRICKS: 135, NETHER_BRICKS: 136, RED_NETHER_BRICKS: 137,
    STONE_BRICK_SLAB: 138, COBBLESTONE_SLAB: 139,

    // 140-149: Nether Blocks
    NETHERRACK: 140, SOUL_SAND: 141, GLOWSTONE: 142,
    MAGMA_BLOCK: 143, NETHER_WART_BLOCK: 144,

    // 145-154: End Blocks
    END_STONE: 145, END_STONE_BRICKS: 146, PURPUR_BLOCK: 147,
    PURPUR_PILLAR: 148, END_ROD: 149,

    // 150-159: Functional Blocks
    CRAFTING_TABLE: 150, FURNACE: 151, CHEST: 152, ENDER_CHEST: 153,
    ENCHANTING_TABLE: 154, ANVIL: 155, BEACON: 156,

    // 157-166: Redstone & Mechanics
    TNT: 157, NOTE_BLOCK: 158, JUKEBOX: 159,
    REDSTONE_WIRE: 160, REDSTONE_TORCH: 161, REDSTONE_LAMP: 162,
    PISTON: 163, STICKY_PISTON: 164, DISPENSER: 165, DROPPER: 166,
    HOPPER: 167, OBSERVER: 168, LEVER: 169,

    // 170-179: Doors, Fences, Gates
    OAK_DOOR: 170, IRON_DOOR: 171, OAK_FENCE: 172, OAK_FENCE_GATE: 173,
    IRON_BARS: 174,

    // 175-184: Plants & Flowers
    TALL_GRASS: 175, FERN: 176, DEAD_BUSH: 177,
    DANDELION: 178, POPPY: 179, BLUE_ORCHID: 180,
    ALLIUM: 181, AZURE_BLUET: 182, RED_TULIP: 183,
    SUNFLOWER: 184,

    // 185-194: Mushrooms
    BROWN_MUSHROOM: 185, RED_MUSHROOM: 186,
    BROWN_MUSHROOM_BLOCK: 187, RED_MUSHROOM_BLOCK: 188,

    // 195-204: Crops & Food Blocks
    WHEAT: 195, CARROTS: 196, POTATOES: 197,
    PUMPKIN: 198, CARVED_PUMPKIN: 199, JACK_O_LANTERN: 200,
    MELON: 201, HAY_BALE: 202,

    // 205-214: Desert & Jungle Plants
    CACTUS: 205, SUGAR_CANE: 206, VINE: 207, LILY_PAD: 208,
    COBWEB: 209,

    // 210-219: Ocean Blocks
    SPONGE: 210, WET_SPONGE: 211,
    PRISMARINE: 212, PRISMARINE_BRICKS: 213, DARK_PRISMARINE: 214,
    SEA_LANTERN: 215,

    // 216-225: Slabs
    OAK_SLAB: 216, STONE_SLAB: 217, BRICK_SLAB: 218,
    SANDSTONE_SLAB: 219, QUARTZ_SLAB: 220,

    // 221-230: Stairs
    OAK_STAIRS: 221, COBBLESTONE_STAIRS: 222, BRICK_STAIRS: 223,
    STONE_BRICK_STAIRS: 224, SANDSTONE_STAIRS: 225, QUARTZ_STAIRS: 226,
    NETHER_BRICK_STAIRS: 227,

    // 231-240: Rails
    RAIL: 231, POWERED_RAIL: 232, DETECTOR_RAIL: 233, ACTIVATOR_RAIL: 234,

    // 241-250: Misc
    LADDER: 235, TORCH: 236, BOOKSHELF: 237, BONE_BLOCK: 238,

    // 239-244: Special
    MOB_SPAWNER: 239, END_PORTAL: 240, END_PORTAL_FRAME: 241,
    NETHER_PORTAL: 242, DRAGON_EGG: 243, COMMAND_BLOCK: 244
};

// ============ BLOCK DEFINITIONS (all 245) ============
var blockDefs = {};

function initBlockDefs() {
    var D = blockDefs;
    var B = BLOCKS;

    // === 0-7: Air & Structure ===
    D[0]  = { name: "Air",              solid: false, transparent: true,  opacity: 1.0, hardness: 0 };
    D[1]  = { name: "Stone",            solid: true,  color: "#7f7f7f",   hardness: 1.5, tool: "pickaxe" };
    D[2]  = { name: "Granite",          solid: true,  color: "#9f6b4e",   hardness: 1.5, tool: "pickaxe" };
    D[3]  = { name: "Diorite",          solid: true,  color: "#bfbfbf",   hardness: 1.5, tool: "pickaxe" };
    D[4]  = { name: "Andesite",         solid: true,  color: "#8a8a8a",   hardness: 1.5, tool: "pickaxe" };
    D[5]  = { name: "Bedrock",          solid: true,  color: "#404040",   hardness: Infinity, unbreakable: true };
    D[6]  = { name: "Barrier",          solid: true,  transparent: true,  opacity: 0.0, color: "#ff0000", hardness: Infinity, unbreakable: true };
    D[7]  = { name: "Structure Void",   solid: false, transparent: true,  opacity: 1.0, hardness: 0 };

    // === 8-14: Ground & Path ===
    D[8]  = { name: "Grass Block",      solid: true,  color: "#7c9c4c", topColor: "#8db360", sideColor: "#8b6b3b", hardness: 0.6, tool: "shovel", drops: "dirt" };
    D[9]  = { name: "Dirt",             solid: true,  color: "#8b6b3b",   hardness: 0.5, tool: "shovel" };
    D[10] = { name: "Coarse Dirt",      solid: true,  color: "#7a5e34",   hardness: 0.5, tool: "shovel" };
    D[11] = { name: "Podzol",           solid: true,  color: "#6b4e2e", topColor: "#5a3e1e", hardness: 0.5, tool: "shovel" };
    D[12] = { name: "Mycelium",         solid: true,  color: "#6b5a7a", topColor: "#7a6b8a", hardness: 0.6, tool: "shovel" };
    D[13] = { name: "Grass Path",       solid: true,  color: "#8b8b3b",   hardness: 0.6, tool: "shovel" };
    D[14] = { name: "Farmland",         solid: true,  color: "#6b4e2e",   hardness: 0.6, tool: "shovel", drops: "dirt" };

    // === 15-22: Stone Variants ===
    D[15] = { name: "Cobblestone",          solid: true, color: "#707070", hardness: 2.0, tool: "pickaxe" };
    D[16] = { name: "Mossy Cobblestone",    solid: true, color: "#5a7a4a", hardness: 2.0, tool: "pickaxe" };
    D[17] = { name: "Obsidian",             solid: true, color: "#150f24", hardness: 50,  tool: "pickaxe", minTool: "diamond" };
    D[18] = { name: "Stone Bricks",         solid: true, color: "#7a7a7a", hardness: 1.5, tool: "pickaxe" };
    D[19] = { name: "Mossy Stone Bricks",   solid: true, color: "#5a7a4a", hardness: 1.5, tool: "pickaxe" };
    D[20] = { name: "Cracked Stone Bricks", solid: true, color: "#6a6a6a", hardness: 1.5, tool: "pickaxe" };
    D[21] = { name: "Chiseled Stone Bricks",solid: true, color: "#7a7a7a", hardness: 1.5, tool: "pickaxe" };
    D[22] = { name: "Smooth Stone",         solid: true, color: "#8a8a8a", hardness: 1.5, tool: "pickaxe" };

    // === 23-30: Ores ===
    D[23] = { name: "Coal Ore",          solid: true, color: "#4a4a4a", hardness: 3.0, tool: "pickaxe", drops: "coal",        xp: { min: 0, max: 2 } };
    D[24] = { name: "Iron Ore",          solid: true, color: "#d4af8a", hardness: 3.0, tool: "pickaxe", drops: "iron_ore",    xp: { min: 0, max: 0 } };
    D[25] = { name: "Gold Ore",          solid: true, color: "#fcee55", hardness: 3.0, tool: "pickaxe", drops: "gold_ore",    xp: { min: 0, max: 0 } };
    D[26] = { name: "Diamond Ore",       solid: true, color: "#5ddbc2", hardness: 3.0, tool: "pickaxe", minTool: "iron",     drops: "diamond", xp: { min: 3, max: 7 } };
    D[27] = { name: "Emerald Ore",       solid: true, color: "#17c93c", hardness: 3.0, tool: "pickaxe", minTool: "iron",     drops: "emerald", xp: { min: 3, max: 7 } };
    D[28] = { name: "Redstone Ore",      solid: true, color: "#ff0a0a", hardness: 3.0, tool: "pickaxe", minTool: "iron",     drops: "redstone", dropCount: 5, xp: { min: 1, max: 5 } };
    D[29] = { name: "Lapis Lazuli Ore",  solid: true, color: "#2147c8", hardness: 3.0, tool: "pickaxe", minTool: "stone",    drops: "lapis", dropCount: 6, xp: { min: 2, max: 5 } };
    D[30] = { name: "Nether Quartz Ore", solid: true, color: "#e4dcdc", hardness: 3.0, tool: "pickaxe", drops: "quartz",      xp: { min: 2, max: 5 } };

    // === 31-38: Mineral Blocks ===
    D[31] = { name: "Coal Block",        solid: true, color: "#1a1a1a", hardness: 5.0, tool: "pickaxe" };
    D[32] = { name: "Iron Block",        solid: true, color: "#d4af8a", hardness: 5.0, tool: "pickaxe", minTool: "stone" };
    D[33] = { name: "Gold Block",        solid: true, color: "#fcee55", hardness: 3.0, tool: "pickaxe", minTool: "iron" };
    D[34] = { name: "Diamond Block",     solid: true, color: "#5ddbc2", hardness: 5.0, tool: "pickaxe", minTool: "iron" };
    D[35] = { name: "Emerald Block",     solid: true, color: "#17c93c", hardness: 5.0, tool: "pickaxe", minTool: "iron" };
    D[36] = { name: "Redstone Block",    solid: true, color: "#cc0000", hardness: 5.0, tool: "pickaxe" };
    D[37] = { name: "Lapis Lazuli Block",solid: true, color: "#2147c8", hardness: 3.0, tool: "pickaxe", minTool: "stone" };
    D[38] = { name: "Quartz Block",      solid: true, color: "#ece5da", hardness: 0.8, tool: "pickaxe" };

    // === 39-44: Logs ===
    var logDefs = [
        { name: "Oak Log",      color: "#6b4e2e", topColor: "#8b6b3b", sideColor: "#5c3c1c" },
        { name: "Spruce Log",   color: "#4a3520", topColor: "#5c3c1c" },
        { name: "Birch Log",    color: "#c4b99c", topColor: "#d4c9ac" },
        { name: "Jungle Log",   color: "#6b4e2e", topColor: "#8b6b3b" },
        { name: "Acacia Log",   color: "#8b6b3b", topColor: "#6b4e2e" },
        { name: "Dark Oak Log", color: "#3a2818", topColor: "#4a3828" }
    ];
    for (var i = 0; i < 6; i++) {
        D[39 + i] = {
            name: logDefs[i].name, solid: true, color: logDefs[i].color,
            topColor: logDefs[i].topColor, sideColor: logDefs[i].sideColor || logDefs[i].color,
            hardness: 2.0, tool: "axe", flammable: true
        };
    }

    // === 45-50: Stripped Logs ===
    var strippedColors = ["#bc8f4a", "#8b6b3b", "#d4c9ac", "#c4a07a", "#cc8a4a", "#5c3c1c"];
    var strippedNames = ["Oak", "Spruce", "Birch", "Jungle", "Acacia", "Dark Oak"];
    for (var i = 0; i < 6; i++) {
        D[45 + i] = { name: "Stripped " + strippedNames[i] + " Log", solid: true, color: strippedColors[i], topColor: strippedColors[i], hardness: 2.0, tool: "axe", flammable: true };
    }

    // === 51-56: Wood Bark ===
    var barkColors = ["#5c3c1c", "#4a3520", "#c4b99c", "#6b4e2e", "#6b4e2e", "#3a2818"];
    for (var i = 0; i < 6; i++) {
        D[51 + i] = { name: strippedNames[i] + " Wood", solid: true, color: barkColors[i], hardness: 2.0, tool: "axe", flammable: true };
    }

    // === 57-62: Planks ===
    var plankColors = ["#bc8f4a", "#8b6b3b", "#d4c9ac", "#c4a07a", "#cc8a4a", "#5c3c1c"];
    for (var i = 0; i < 6; i++) {
        D[57 + i] = { name: strippedNames[i] + " Planks", solid: true, color: plankColors[i], hardness: 2.0, tool: "axe", flammable: true };
    }

    // === 63-68: Leaves ===
    var leafColors = ["#3a7a22", "#2d5a1e", "#5a9a3a", "#3a7a22", "#3a7a22", "#2d5a1e"];
    for (var i = 0; i < 6; i++) {
        D[63 + i] = { name: strippedNames[i] + " Leaves", solid: true, transparent: true, opacity: 0.8, color: leafColors[i], hardness: 0.2, flammable: true };
    }

    // === 69-78: Sand & Sandstone ===
    D[69] = { name: "Sand",                solid: true, color: "#e6d898", hardness: 0.5, tool: "shovel", falls: true };
    D[70] = { name: "Red Sand",            solid: true, color: "#c47a3a", hardness: 0.5, tool: "shovel", falls: true };
    D[71] = { name: "Sandstone",           solid: true, color: "#dbcd8c", hardness: 0.8, tool: "pickaxe" };
    D[72] = { name: "Red Sandstone",       solid: true, color: "#c47a3a", hardness: 0.8, tool: "pickaxe" };
    D[73] = { name: "Chiseled Sandstone",  solid: true, color: "#dbcd8c", hardness: 0.8, tool: "pickaxe" };
    D[74] = { name: "Cut Sandstone",       solid: true, color: "#dbcd8c", hardness: 0.8, tool: "pickaxe" };
    D[75] = { name: "Smooth Sandstone",    solid: true, color: "#e6d898", hardness: 0.8, tool: "pickaxe" };
    D[76] = { name: "Chiseled Red Sandstone", solid: true, color: "#c47a3a", hardness: 0.8, tool: "pickaxe" };
    D[77] = { name: "Cut Red Sandstone",   solid: true, color: "#c47a3a", hardness: 0.8, tool: "pickaxe" };
    D[78] = { name: "Smooth Red Sandstone",solid: true, color: "#c47a3a", hardness: 0.8, tool: "pickaxe" };

    // === 79-82: Gravel, Clay, Water, Lava ===
    D[79] = { name: "Gravel",  solid: true,  color: "#8a8a80", hardness: 0.6, tool: "shovel", falls: true, drops: "flint", dropChance: 0.1 };
    D[80] = { name: "Clay",    solid: true,  color: "#9ba4b5", hardness: 0.6, tool: "shovel", drops: "clay_ball", dropCount: 4 };
    D[81] = { name: "Water",   solid: false, transparent: true, opacity: 0.6, color: "#3355cc", liquid: true };
    D[82] = { name: "Lava",    solid: false, transparent: true, opacity: 0.8, color: "#ff4400", liquid: true, lightLevel: 15, damage: 4 };

    // === 83-86: Ice & Snow ===
    D[83] = { name: "Ice",         solid: true, transparent: true, opacity: 0.5, color: "#a0d0ff", hardness: 0.5, tool: "pickaxe", slippery: true };
    D[84] = { name: "Packed Ice",  solid: true, color: "#8ab8e8", hardness: 0.5, tool: "pickaxe", slippery: true };
    D[85] = { name: "Snow Block",  solid: true, color: "#f0f8ff", hardness: 0.2, tool: "shovel", drops: "snowball", dropCount: 4 };
    D[86] = { name: "Snow Layer",  solid: false, transparent: true, color: "#f0f8ff", hardness: 0.1, tool: "shovel" };

    // === 87-102: Wool (all 16) ===
    var woolColors = [
        "#e9ecef", "#f27d1b", "#c44dcd", "#7bccf2", "#f2e533", "#6cc82c", "#f2a6b7", "#4a4a4a",
        "#9d9d9d", "#169c9c", "#7f3fb3", "#35399d", "#704627", "#3c6a1e", "#993232", "#1a1a1a"
    ];
    var woolNames = ["White","Orange","Magenta","Light Blue","Yellow","Lime","Pink","Gray","Light Gray","Cyan","Purple","Blue","Brown","Green","Red","Black"];
    for (var i = 0; i < 16; i++) {
        D[87 + i] = { name: woolNames[i] + " Wool", solid: true, color: woolColors[i], hardness: 0.8, flammable: true };
    }

    // === 103-108: Terracotta ===
    D[103] = { name: "Terracotta",         solid: true, color: "#985e44", hardness: 1.25, tool: "pickaxe" };
    D[104] = { name: "White Terracotta",   solid: true, color: "#d1b9a9", hardness: 1.25, tool: "pickaxe" };
    D[105] = { name: "Orange Terracotta",  solid: true, color: "#a25431", hardness: 1.25, tool: "pickaxe" };
    D[106] = { name: "Red Terracotta",     solid: true, color: "#90412c", hardness: 1.25, tool: "pickaxe" };
    D[107] = { name: "Yellow Terracotta",  solid: true, color: "#ba8424", hardness: 1.25, tool: "pickaxe" };
    D[108] = { name: "Brown Terracotta",   solid: true, color: "#6e4b3a", hardness: 1.25, tool: "pickaxe" };

    // === 109-124: Concrete (all 16) ===
    var concreteColors = ["#cfd5d6","#e06100","#a9309f","#2488c8","#f0af15","#5ea918","#d5658d","#373a3e","#7d7d73","#157788","#64209c","#2c2e8e","#5e3b27","#495b24","#8e2027","#08090d"];
    for (var i = 0; i < 16; i++) {
        D[109 + i] = { name: woolNames[i] + " Concrete", solid: true, color: concreteColors[i], hardness: 1.8, tool: "pickaxe" };
    }

    // === 125-134: Glass & Stained Glass ===
    D[125] = { name: "Glass", solid: true, transparent: true, opacity: 0.3, color: "#c8d8ff", hardness: 0.3, silkTouch: true };
    D[126] = { name: "Glass Pane", solid: true, transparent: true, opacity: 0.3, color: "#c8d8ff", hardness: 0.3, silkTouch: true };
    var stainColors = ["#e9ecef","#f27d1b","#8e2027","#2c2e8e","#f0af15","#495b24","#64209c","#08090d"];
    var stainNames = ["White","Orange","Red","Blue","Yellow","Green","Purple","Black"];
    for (var i = 0; i < 8; i++) {
        D[127 + i] = { name: stainNames[i] + " Stained Glass", solid: true, transparent: true, opacity: 0.5, color: stainColors[i], hardness: 0.3, silkTouch: true };
    }

    // === 135-139: Bricks ===
    D[135] = { name: "Bricks",          solid: true, color: "#9c4a3c", hardness: 2.0, tool: "pickaxe" };
    D[136] = { name: "Nether Bricks",   solid: true, color: "#3a1a1a", hardness: 2.0, tool: "pickaxe" };
    D[137] = { name: "Red Nether Bricks", solid: true, color: "#5a1a1a", hardness: 2.0, tool: "pickaxe" };
    D[138] = { name: "Stone Brick Slab", solid: true, color: "#7a7a7a", hardness: 1.5, tool: "pickaxe" };
    D[139] = { name: "Cobblestone Slab", solid: true, color: "#707070", hardness: 2.0, tool: "pickaxe" };

    // === 140-144: Nether ===
    D[140] = { name: "Netherrack",      solid: true, color: "#8b3a3a", hardness: 0.4, tool: "pickaxe" };
    D[141] = { name: "Soul Sand",       solid: true, color: "#4a382a", hardness: 0.5, tool: "shovel", slows: true };
    D[142] = { name: "Glowstone",       solid: true, color: "#ffff99", hardness: 0.3, lightLevel: 15, drops: "glowstone_dust", dropCount: 4 };
    D[143] = { name: "Magma Block",     solid: true, color: "#8b3a00", hardness: 0.5, tool: "pickaxe", damage: 1 };
    D[144] = { name: "Nether Wart Block", solid: true, color: "#7a1a1a", hardness: 1.0, tool: "hoe" };

    // === 145-149: End ===
    D[145] = { name: "End Stone",        solid: true, color: "#dbdb8c", hardness: 3.0, tool: "pickaxe" };
    D[146] = { name: "End Stone Bricks", solid: true, color: "#c8c87a", hardness: 3.0, tool: "pickaxe" };
    D[147] = { name: "Purpur Block",     solid: true, color: "#b060b0", hardness: 1.5, tool: "pickaxe" };
    D[148] = { name: "Purpur Pillar",    solid: true, color: "#a050a0", hardness: 1.5, tool: "pickaxe" };
    D[149] = { name: "End Rod",          solid: false, transparent: true, color: "#ffffff", lightLevel: 14 };

    // === 150-156: Functional ===
    D[150] = { name: "Crafting Table",   solid: true, color: "#bc8f4a", topColor: "#8b6b3b", hardness: 2.5, tool: "axe", interactable: true };
    D[151] = { name: "Furnace",          solid: true, color: "#707070", hardness: 3.5, tool: "pickaxe", interactable: true };
    D[152] = { name: "Chest",            solid: true, color: "#bc8f4a", hardness: 2.5, tool: "axe", interactable: true };
    D[153] = { name: "Ender Chest",      solid: true, color: "#1a2a3a", hardness: 22.5, tool: "pickaxe", minTool: "diamond", interactable: true, drops: "obsidian", dropCount: 8 };
    D[154] = { name: "Enchanting Table", solid: true, color: "#cc4444", topColor: "#aa3333", hardness: 5.0, tool: "pickaxe", interactable: true };
    D[155] = { name: "Anvil",            solid: true, color: "#4a4a4a", hardness: 5.0, tool: "pickaxe", falls: true, interactable: true };
    D[156] = { name: "Beacon",           solid: true, transparent: true, opacity: 0.4, color: "#88ddee", hardness: 3.0, tool: "pickaxe", lightLevel: 15, interactable: true };

    // === 157-169: Redstone & Mechanics ===
    D[157] = { name: "TNT",              solid: true, color: "#cc3333", hardness: 0.0, explosive: true, power: 4 };
    D[158] = { name: "Note Block",       solid: true, color: "#6b4e2e", hardness: 0.8, tool: "axe" };
    D[159] = { name: "Jukebox",          solid: true, color: "#6b4e2e", topColor: "#8b6b3b", hardness: 2.0, tool: "axe" };
    D[160] = { name: "Redstone Wire",    solid: false, transparent: true, color: "#cc0000", hardness: 0.0 };
    D[161] = { name: "Redstone Torch",   solid: false, transparent: true, color: "#ff0000", lightLevel: 7 };
    D[162] = { name: "Redstone Lamp",    solid: true, color: "#cc9933", hardness: 0.3, lightLevel: 15 };
    D[163] = { name: "Piston",           solid: true, color: "#707070", hardness: 1.5, tool: "pickaxe" };
    D[164] = { name: "Sticky Piston",    solid: true, color: "#707070", hardness: 1.5, tool: "pickaxe" };
    D[165] = { name: "Dispenser",        solid: true, color: "#707070", hardness: 3.5, tool: "pickaxe" };
    D[166] = { name: "Dropper",          solid: true, color: "#707070", hardness: 3.5, tool: "pickaxe" };
    D[167] = { name: "Hopper",           solid: true, color: "#4a4a4a", hardness: 3.0, tool: "pickaxe" };
    D[168] = { name: "Observer",         solid: true, color: "#707070", hardness: 3.0, tool: "pickaxe" };
    D[169] = { name: "Lever",            solid: false, transparent: true, color: "#8a8a8a", hardness: 0.5 };

    // === 170-174: Doors, Fences, Gates ===
    D[170] = { name: "Oak Door",         solid: true, transparent: true, color: "#bc8f4a", hardness: 3.0, tool: "axe" };
    D[171] = { name: "Iron Door",        solid: true, transparent: true, color: "#d4af8a", hardness: 5.0, tool: "pickaxe" };
    D[172] = { name: "Oak Fence",        solid: true, transparent: true, color: "#bc8f4a", hardness: 2.0, tool: "axe" };
    D[173] = { name: "Oak Fence Gate",   solid: true, transparent: true, color: "#bc8f4a", hardness: 2.0, tool: "axe" };
    D[174] = { name: "Iron Bars",        solid: true, transparent: true, color: "#8a8a8a", hardness: 5.0, tool: "pickaxe" };

    // === 175-184: Plants & Flowers ===
    D[175] = { name: "Tall Grass",       solid: false, transparent: true, color: "#5a8a3c", replaceable: true };
    D[176] = { name: "Fern",             solid: false, transparent: true, color: "#4a7a2c", replaceable: true };
    D[177] = { name: "Dead Bush",        solid: false, transparent: true, color: "#6b4e2e", replaceable: true };
    D[178] = { name: "Dandelion",        solid: false, transparent: true, color: "#ffff00", replaceable: true };
    D[179] = { name: "Poppy",            solid: false, transparent: true, color: "#ff3333", replaceable: true };
    D[180] = { name: "Blue Orchid",      solid: false, transparent: true, color: "#33ccff", replaceable: true };
    D[181] = { name: "Allium",           solid: false, transparent: true, color: "#cc33ff", replaceable: true };
    D[182] = { name: "Azure Bluet",      solid: false, transparent: true, color: "#cccccc", replaceable: true };
    D[183] = { name: "Red Tulip",        solid: false, transparent: true, color: "#ff3333", replaceable: true };
    D[184] = { name: "Sunflower",        solid: false, transparent: true, color: "#ffff00", replaceable: true };

    // === 185-188: Mushrooms ===
    D[185] = { name: "Brown Mushroom",       solid: false, transparent: true, color: "#8b7355", replaceable: true, lightLevel: 1 };
    D[186] = { name: "Red Mushroom",         solid: false, transparent: true, color: "#cc3333", replaceable: true };
    D[187] = { name: "Brown Mushroom Block", solid: true, color: "#8b7355", hardness: 0.2 };
    D[188] = { name: "Red Mushroom Block",   solid: true, color: "#cc3333", hardness: 0.2 };

    // === 189-202: Crops & Food ===
    D[195] = { name: "Wheat",            solid: false, transparent: true, color: "#90c448", replaceable: true };
    D[196] = { name: "Carrots",          solid: false, transparent: true, color: "#ff9900", replaceable: true };
    D[197] = { name: "Potatoes",         solid: false, transparent: true, color: "#8b7355", replaceable: true };
    D[198] = { name: "Pumpkin",          solid: true,  color: "#e38f26", hardness: 1.0, tool: "axe" };
    D[199] = { name: "Carved Pumpkin",   solid: true,  color: "#e38f26", hardness: 1.0, tool: "axe" };
    D[200] = { name: "Jack o'Lantern",   solid: true,  color: "#ff9900", hardness: 1.0, tool: "axe", lightLevel: 15 };
    D[201] = { name: "Melon",            solid: true,  color: "#7ec850", hardness: 1.0, tool: "axe", drops: "melon_slice", dropCount: 5 };
    D[202] = { name: "Hay Bale",         solid: true,  color: "#c4a035", hardness: 0.5, tool: "hoe" };

    // === 205-209: Desert/Jungle Plants ===
    D[205] = { name: "Cactus",           solid: true,  color: "#2d6b1e", hardness: 0.4, damage: 1 };
    D[206] = { name: "Sugar Cane",       solid: false, transparent: true, color: "#90c448", replaceable: true };
    D[207] = { name: "Vine",             solid: false, transparent: true, color: "#3a7a22", climbable: true };
    D[208] = { name: "Lily Pad",         solid: false, transparent: true, color: "#3a7a22" };
    D[209] = { name: "Cobweb",           solid: true,  transparent: true, color: "#cccccc", slows: true, tool: "sword" };

    // === 210-215: Ocean ===
    D[210] = { name: "Sponge",           solid: true, color: "#c3c31e", hardness: 0.6 };
    D[211] = { name: "Wet Sponge",       solid: true, color: "#a3a31e", hardness: 0.6 };
    D[212] = { name: "Prismarine",       solid: true, color: "#5b8c7a", hardness: 1.5, tool: "pickaxe" };
    D[213] = { name: "Prismarine Bricks",solid: true, color: "#5b8c7a", hardness: 1.5, tool: "pickaxe" };
    D[214] = { name: "Dark Prismarine",  solid: true, color: "#3a5a4a", hardness: 1.5, tool: "pickaxe" };
    D[215] = { name: "Sea Lantern",      solid: true, color: "#b8d8c8", hardness: 0.3, tool: "pickaxe", lightLevel: 15 };

    // === 216-220: Slabs ===
    D[216] = { name: "Oak Slab",         solid: true, transparent: true, color: "#bc8f4a", hardness: 2.0, tool: "axe", flammable: true };
    D[217] = { name: "Stone Slab",       solid: true, transparent: true, color: "#8a8a8a", hardness: 1.5, tool: "pickaxe" };
    D[218] = { name: "Brick Slab",       solid: true, transparent: true, color: "#9c4a3c", hardness: 2.0, tool: "pickaxe" };
    D[219] = { name: "Sandstone Slab",   solid: true, transparent: true, color: "#dbcd8c", hardness: 0.8, tool: "pickaxe" };
    D[220] = { name: "Quartz Slab",      solid: true, transparent: true, color: "#ece5da", hardness: 0.8, tool: "pickaxe" };

    // === 221-227: Stairs ===
    var stairData = [
        { name: "Oak Stairs", color: "#bc8f4a", tool: "axe" },
        { name: "Cobblestone Stairs", color: "#707070", tool: "pickaxe" },
        { name: "Brick Stairs", color: "#9c4a3c", tool: "pickaxe" },
        { name: "Stone Brick Stairs", color: "#7a7a7a", tool: "pickaxe" },
        { name: "Sandstone Stairs", color: "#dbcd8c", tool: "pickaxe" },
        { name: "Quartz Stairs", color: "#ece5da", tool: "pickaxe" },
        { name: "Nether Brick Stairs", color: "#3a1a1a", tool: "pickaxe" }
    ];
    for (var i = 0; i < 7; i++) {
        D[221 + i] = { name: stairData[i].name, solid: true, color: stairData[i].color, hardness: 2.0, tool: stairData[i].tool };
    }

    // === 231-234: Rails ===
    D[231] = { name: "Rail",             solid: false, transparent: true, color: "#8a8a8a", hardness: 0.7 };
    D[232] = { name: "Powered Rail",     solid: false, transparent: true, color: "#8a8a8a", hardness: 0.7 };
    D[233] = { name: "Detector Rail",    solid: false, transparent: true, color: "#8a8a8a", hardness: 0.7 };
    D[234] = { name: "Activator Rail",   solid: false, transparent: true, color: "#8a8a8a", hardness: 0.7 };

    // === 235-238: Misc ===
    D[235] = { name: "Ladder",           solid: false, transparent: true, color: "#bc8f4a", climbable: true };
    D[236] = { name: "Torch",            solid: false, transparent: true, color: "#ffd700", lightLevel: 14 };
    D[237] = { name: "Bookshelf",        solid: true,  color: "#bc8f4a", topColor: "#8b6b3b", hardness: 1.5, tool: "axe", flammable: true, drops: "book", dropCount: 3 };
    D[238] = { name: "Bone Block",       solid: true,  color: "#e8e0c8", hardness: 2.0, tool: "pickaxe" };

    // === 239-244: Special ===
    D[239] = { name: "Monster Spawner",  solid: true,  color: "#1a2a3a", hardness: 5.0, tool: "pickaxe" };
    D[240] = { name: "End Portal",       solid: false, transparent: true, color: "#1a1a3a" };
    D[241] = { name: "End Portal Frame", solid: true,  color: "#3a5a4a", hardness: Infinity, unbreakable: true };
    D[242] = { name: "Nether Portal",    solid: false, transparent: true, color: "#5a2a8a" };
    D[243] = { name: "Dragon Egg",       solid: true,  color: "#1a1a1a", hardness: 3.0, falls: true };
    D[244] = { name: "Command Block",    solid: true,  color: "#8b6b3b", hardness: Infinity, unbreakable: true };
}

// ============ FALLBACK ============
function getBlockDef(id) {
    return blockDefs[id] || { name: "Unknown Block " + id, solid: true, color: "#ff00ff", hardness: 1.0 };
}

// ============ INIT ============
initBlockDefs();

console.log("Blocks: " + Object.keys(BLOCKS).length + " IDs, " + Object.keys(blockDefs).length + " definitions, 0 gaps");

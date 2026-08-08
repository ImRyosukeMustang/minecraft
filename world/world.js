// ============================================
// MINECRAFT - WORLD GENERATION ENGINE
// Terrain, chunks, biomes, caves, structures
// ============================================

// ============ WORLD SEED ============
var WORLD_SEED = CONFIG.WORLD_SEED;

// ============ CHUNK SYSTEM ============
var dimensionChunks = {};
dimensionChunks[CONFIG.DIMENSION_OVERWORLD] = {};
dimensionChunks[CONFIG.DIMENSION_NETHER] = {};
dimensionChunks[CONFIG.DIMENSION_END] = {};

var currentDimension = CONFIG.DIMENSION_OVERWORLD;

function getCurrentChunks() {
    return dimensionChunks[currentDimension];
}

// ============ BLOCK ACCESS ============
function getChunk(cx, cz, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    var chunks = dimensionChunks[dim];
    var key = cx + "," + cz;
    
    if (!chunks[key]) {
        if (Object.keys(chunks).length > CONFIG.MAX_LOADED_CHUNKS) {
            var oldestKey = Object.keys(chunks)[0];
            delete chunks[oldestKey];
        }
        chunks[key] = generateChunk(cx, cz, dim);
    }
    
    return chunks[key];
}

function getBlock(x, y, z, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    if (y < 0 || y >= CONFIG.WORLD_HEIGHT) return BLOCKS.AIR;
    
    var cx = worldToChunk(x), cz = worldToChunk(z);
    var lx = localInChunk(x), lz = localInChunk(z);
    var chunk = getChunk(cx, cz, dim);
    return chunk.data[lx + y * CONFIG.CHUNK_SIZE + lz * CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT];
}

function setBlock(x, y, z, id, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    if (y < 0 || y >= CONFIG.WORLD_HEIGHT) return;
    
    var cx = worldToChunk(x), cz = worldToChunk(z);
    var lx = localInChunk(x), lz = localInChunk(z);
    var chunk = getChunk(cx, cz, dim);
    chunk.data[lx + y * CONFIG.CHUNK_SIZE + lz * CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT] = id;
    chunk.meshDirty = true;
    
    // Check falling blocks
    if (getBlockDef(id) && getBlockDef(id).falls) {
        scheduleBlockUpdate(x, y, z, 2, checkFallingBlock);
    }
}

// ============ TERRAIN ============
function getTerrainHeight(x, z, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    
    if (dim === CONFIG.DIMENSION_NETHER) {
        return Math.floor(40 + octaveNoise(x * 0.03, z * 0.03, 3, WORLD_SEED + 999) * 50);
    }
    if (dim === CONFIG.DIMENSION_END) {
        return Math.floor(55 + octaveNoise(x * 0.02, z * 0.02, 2, WORLD_SEED + 888) * 15);
    }
    
    var continentalness = octaveNoise(x * 0.0003, z * 0.0003, 6, WORLD_SEED);
    var hills = octaveNoise(x * 0.005, z * 0.005, 5, WORLD_SEED + 100) * 15;
    var mountains = octaveNoise(x * 0.003, z * 0.003, 4, WORLD_SEED + 200) * 40;
    var details = octaveNoise(x * 0.05, z * 0.05, 3, WORLD_SEED + 300) * 3;
    
    var height = CONFIG.SEA_LEVEL + continentalness * 25 + hills + details;
    if (continentalness > 0.55) height += mountains * (continentalness - 0.55) * 2.5;
    
    return Math.floor(Math.max(1, Math.min(120, height)));
}

// ============ BIOMES ============
var BIOMES = {
    OCEAN:           { id: 0,  name: "Ocean",           temp: 0.5,  rain: 0.5,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT },
    PLAINS:          { id: 1,  name: "Plains",          temp: 0.8,  rain: 0.4,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.01 },
    DESERT:          { id: 2,  name: "Desert",          temp: 2.0,  rain: 0.0,  surfaceBlock: BLOCKS.SAND,        subSurfaceBlock: BLOCKS.SAND, cactusChance: 0.05 },
    FOREST:          { id: 3,  name: "Forest",          temp: 0.7,  rain: 0.8,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.12 },
    TAIGA:           { id: 4,  name: "Taiga",           temp: 0.25, rain: 0.8,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.10, treeType: "spruce" },
    SWAMP:           { id: 5,  name: "Swamp",           temp: 0.8,  rain: 0.9,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.05, treeType: "swamp_oak" },
    SAVANNA:         { id: 6,  name: "Savanna",         temp: 1.2,  rain: 0.0,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.02, treeType: "acacia" },
    BEACH:           { id: 7,  name: "Beach",           temp: 0.8,  rain: 0.4,  surfaceBlock: BLOCKS.SAND,        subSurfaceBlock: BLOCKS.SAND },
    MOUNTAINS:       { id: 8,  name: "Mountains",       temp: 0.2,  rain: 0.3,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT },
    MUSHROOM_ISLAND: { id: 9,  name: "Mushroom Island", temp: 0.9,  rain: 1.0,  surfaceBlock: BLOCKS.MYCELIUM,    subSurfaceBlock: BLOCKS.DIRT },
    JUNGLE:          { id: 12, name: "Jungle",          temp: 0.95, rain: 0.9,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.35, treeType: "jungle" },
    DARK_FOREST:     { id: 13, name: "Dark Forest",     temp: 0.6,  rain: 0.8,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.25, treeType: "dark_oak" },
    HELL:            { id: 10, name: "Nether",          temp: 2.0,  rain: 0.0,  surfaceBlock: BLOCKS.NETHERRACK,  subSurfaceBlock: BLOCKS.NETHERRACK, nether: true },
    END_VOID:        { id: 11, name: "End",              temp: 0.5,  rain: 0.0,  surfaceBlock: BLOCKS.END_STONE,   subSurfaceBlock: BLOCKS.END_STONE, end: true }
};

function getBiome(x, z, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    if (dim === CONFIG.DIMENSION_NETHER) return BIOMES.HELL;
    if (dim === CONFIG.DIMENSION_END) return BIOMES.END_VOID;
    
    var temp = octaveNoise(x * 0.0005, z * 0.0005, 4, WORLD_SEED);
    var rain = octaveNoise(x * 0.0005 + 500, z * 0.0005 + 500, 4, WORLD_SEED);
    var h = getTerrainHeight(x, z);
    
    if (h <= CONFIG.SEA_LEVEL) return BIOMES.OCEAN;
    if (h <= CONFIG.SEA_LEVEL + 3) return BIOMES.BEACH;
    if (temp > 0.7 && rain < 0.2) return BIOMES.DESERT;
    if (temp > 0.6 && rain < 0.3) return BIOMES.SAVANNA;
    if (temp > 0.8 && rain > 0.8) return BIOMES.JUNGLE;
    if (rain > 0.7 && temp < 0.3) return BIOMES.TAIGA;
    if (rain > 0.8 && temp > 0.4 && h < CONFIG.SEA_LEVEL + 15) return BIOMES.SWAMP;
    if (h > 80) return BIOMES.MOUNTAINS;
    if (rain > 0.7 && temp > 0.5) return BIOMES.DARK_FOREST;
    if (rain > 0.6) return BIOMES.FOREST;
    if (temp > 0.9 && rain > 0.9 && Math.abs(x) < 200 && Math.abs(z) < 200) return BIOMES.MUSHROOM_ISLAND;
    return BIOMES.PLAINS;
}

// ============ CAVES ============
function isCave(wx, wy, wz) {
    var n1 = octaveNoise(wx * 0.05, wz * 0.05, 3, WORLD_SEED + 500);
    var n2 = octaveNoise(wx * 0.1, wy * 0.1, 3, WORLD_SEED + 600);
    var n3 = octaveNoise(wz * 0.1, wy * 0.1, 3, WORLD_SEED + 700);
    return ((n1 + n2 + n3) / 3) > 0.55 && wy < 50 && wy > 5;
}

// ============ TREES (WITH VARIETY) ============
function generateTree(chunk, lx, y, lz, type) {
    var data = chunk.data;
    if (!type) type = "oak";
    
    var height, logBlock, leafBlock;
    var rand = seededRandom(lx, y, lz);
    
    switch(type) {
        case "oak":
            height = 4 + Math.floor(rand * 3); 
            logBlock = BLOCKS.OAK_LOG; 
            leafBlock = BLOCKS.OAK_LEAVES; 
            break;
        case "spruce":
            height = 6 + Math.floor(rand * 5); 
            logBlock = BLOCKS.SPRUCE_LOG; 
            leafBlock = BLOCKS.SPRUCE_LEAVES; 
            break;
        case "birch":
            height = 5 + Math.floor(rand * 2); 
            logBlock = BLOCKS.BIRCH_LOG; 
            leafBlock = BLOCKS.BIRCH_LEAVES; 
            break;
        case "acacia":
            height = 5 + Math.floor(rand * 3); 
            logBlock = BLOCKS.ACACIA_LOG; 
            leafBlock = BLOCKS.ACACIA_LEAVES; 
            break;
        case "jungle":
            height = 8 + Math.floor(rand * 10); // Much taller
            logBlock = BLOCKS.JUNGLE_LOG; 
            leafBlock = BLOCKS.JUNGLE_LEAVES; 
            break;
        case "dark_oak":
            height = 6 + Math.floor(rand * 2); 
            logBlock = BLOCKS.DARK_OAK_LOG; 
            leafBlock = BLOCKS.DARK_OAK_LEAVES; 
            break;
        case "swamp_oak":
            height = 4 + Math.floor(rand * 3); 
            logBlock = BLOCKS.OAK_LOG; 
            leafBlock = BLOCKS.OAK_LEAVES; // Could append vines dynamically
            break;
        default:
            height = 4 + Math.floor(rand * 3); 
            logBlock = BLOCKS.OAK_LOG; 
            leafBlock = BLOCKS.OAK_LEAVES;
    }
    
    // Trunk Generation
    var isLargeTree = (type === "jungle" && rand > 0.5) || type === "dark_oak";
    var thickness = isLargeTree ? 2 : 1;
    
    for (var i = 0; i < height; i++) {
        for (var txOffset = 0; txOffset < thickness; txOffset++) {
            for (var tzOffset = 0; tzOffset < thickness; tzOffset++) {
                var clx = lx + txOffset, clz = lz + tzOffset;
                if (y + i < CONFIG.WORLD_HEIGHT && clx >= 0 && clx < CONFIG.CHUNK_SIZE && clz >= 0 && clz < CONFIG.CHUNK_SIZE) {
                    var idx = clx + (y + i) * CONFIG.CHUNK_SIZE + clz * CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT;
                    data[idx] = logBlock;
                }
            }
        }
    }
    
    // Canopy Generation
    var leafStart = y + height - 3;
    for (var ly = leafStart; ly <= y + height + 1; ly++) {
        var baseRadius = (ly >= y + height) ? 1 : 2;
        var radius = isLargeTree ? baseRadius + 1 : baseRadius;
        
        for (var dx = -radius; dx <= radius + (thickness - 1); dx++) {
            for (var dz = -radius; dz <= radius + (thickness - 1); dz++) {
                // Avoid replacing trunks or making perfect square leaf blocks
                if (dx >= 0 && dx < thickness && dz >= 0 && dz < thickness && ly < y + height) continue;
                if (Math.abs(dx) === radius && Math.abs(dz) === radius && seededRandom(lx + dx, ly, lz + dz) < 0.4) continue;
                
                var tx = lx + dx, tz = lz + dz;
                if (tx >= 0 && tx < CONFIG.CHUNK_SIZE && tz >= 0 && tz < CONFIG.CHUNK_SIZE && ly < CONFIG.WORLD_HEIGHT) {
                    var leafIdx = tx + ly * CONFIG.CHUNK_SIZE + tz * CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT;
                    if (data[leafIdx] === BLOCKS.AIR) data[leafIdx] = leafBlock;
                }
            }
        }
    }
}

// ============ CACTUS FIELD GENERATION ============
function generateCactusField(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var height = 2 + Math.floor(seededRandom(lx, y, lz, WORLD_SEED + 123) * 2); // 2 to 3 blocks high
    
    for (var i = 0; i < height; i++) {
        var ty = y + i;
        if (lx >= 0 && lx < CS && lz >= 0 && lz < CS && ty < WH) {
            var idx = lx + ty * CS + lz * CS * WH;
            if (data[idx] === BLOCKS.AIR) {
                data[idx] = BLOCKS.CACTUS;
            }
        }
    }
}

// ============ CHUNK GENERATION ============
function generateChunk(cx, cz, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var data = new Uint8Array(CS * WH * CS);
    var chunk = { data: data, cx: cx, cz: cz, mesh: null, meshDirty: true };
    
    for (var lx = 0; lx < CS; lx++) {
        for (var lz = 0; lz < CS; lz++) {
            var wx = cx * CS + lx, wz = cz * CS + lz;
            var biome = getBiome(wx, wz, dim);
            var h = getTerrainHeight(wx, wz, dim);
            
            for (var y = 0; y < WH; y++) {
                var block = BLOCKS.AIR;
                
                if (dim === CONFIG.DIMENSION_OVERWORLD) {
                    if (y === 0) {
                        block = BLOCKS.BEDROCK;
                    } else if (y <= 4) {
                        block = BLOCKS.STONE;
                    } else if (isCave(wx, y, wz) && y < h - 4) {
                        block = BLOCKS.AIR;
                    } else if (isRavine(wx, y, wz) && y < h - 2) {
                        block = BLOCKS.AIR;
                    } else if (y < h - 4) {
                        block = BLOCKS.STONE;
                        var oreRoll = seededRandom(wx, y, wz, WORLD_SEED + 400);
                        if (oreRoll > 0.998 && y < 16) block = BLOCKS.DIAMOND_ORE;
                        else if (oreRoll > 0.994 && y < 32) block = BLOCKS.GOLD_ORE;
                        else if (oreRoll > 0.988 && y < 64) block = BLOCKS.IRON_ORE;
                        else if (oreRoll > 0.97) block = BLOCKS.COAL_ORE;
                        else if (oreRoll > 0.996 && y < 20) block = BLOCKS.REDSTONE_ORE;
                        else if (oreRoll > 0.995 && y < 24) block = BLOCKS.LAPIS_ORE;
                        else if (oreRoll > 0.999 && y < 32 && biome === BIOMES.MOUNTAINS) block = BLOCKS.EMERALD_ORE;
                    } else if (y < h) {
                        block = biome.subSurfaceBlock || BLOCKS.DIRT;
                        if (block === BLOCKS.DIRT && seededRandom(wx, y, wz) > 0.98) block = BLOCKS.GRAVEL;
                    } else if (y === h) {
                        block = biome.surfaceBlock || BLOCKS.GRASS_BLOCK;
                    } else if (y <= CONFIG.SEA_LEVEL) {
                        block = BLOCKS.WATER;
                    }
                } else if (dim === CONFIG.DIMENSION_NETHER) {
                    if (y === 0 || y === WH - 1) block = BLOCKS.BEDROCK;
                    else if (y < h) block = BLOCKS.NETHERRACK;
                    else if (y < 100 && seededRandom(wx, y, wz, WORLD_SEED + 802) > 0.98) block = BLOCKS.GLOWSTONE;
                } else if (dim === CONFIG.DIMENSION_END) {
                    if (y < h) block = BLOCKS.END_STONE;
                }
                
                data[lx + y * CS + lz * CS * WH] = block;
            }
            
            // Surface features & structural anchors
            if (dim === CONFIG.DIMENSION_OVERWORLD) {
                var surfaceIdx = lx + h * CS + lz * CS * WH;
                var structRoll = seededRandom(wx, 777, wz);
                
                if (h > CONFIG.SEA_LEVEL) {
                    // Tree distribution
                    var treeChance = biome.treeChance || 0;
                    if (data[surfaceIdx] === BLOCKS.GRASS_BLOCK && treeChance > 0 && seededRandom(wx, 0, wz) > (1 - treeChance)) {
                        generateTree(chunk, lx, h + 1, lz, biome.treeType || "oak");
                    }
                    
                    // Cacti Fields
                    var cactusChance = biome.cactusChance || 0;
                    if (data[surfaceIdx] === BLOCKS.SAND && cactusChance > 0 && seededRandom(wx, 12, wz) > (1 - cactusChance)) {
                        generateCactusField(chunk, lx, h + 1, lz);
                    }
                    
                    // Flowers / Ground Coverage
                    if (data[surfaceIdx] === BLOCKS.GRASS_BLOCK && h + 1 < WH && seededRandom(wx, 1, wz) > 0.85) {
                        var flowerRoll = seededRandom(wx, 2, wz);
                        var flowerIdx = lx + (h + 1) * CS + lz * CS * WH;
                        if (flowerRoll > 0.95) data[flowerIdx] = BLOCKS.POPPY;
                        else if (flowerRoll > 0.90) data[flowerIdx] = BLOCKS.DANDELION;
                        else data[flowerIdx] = BLOCKS.TALL_GRASS;
                    }
                    
                    // Structures (Rare triggers evaluated on chunk local spaces)
                    if (lx === 8 && lz === 8) {
                        if (biome === BIOMES.DESERT && structRoll > 0.98) generateDesertPyramid(chunk, lx, h, lz);
                        else if (biome === BIOMES.TAIGA && structRoll > 0.98 && h > 70) generateIgloo(chunk, lx, h + 1, lz);
                        else if (biome === BIOMES.SWAMP && structRoll > 0.97) generateWitchHut(chunk, lx, h, lz);
                        else if (biome === BIOMES.JUNGLE && structRoll > 0.98) generateJungleTemple(chunk, lx, h, lz);
                    }
                } else {
                    // Underwater structure check
                    if (lx === 8 && lz === 8 && biome === BIOMES.OCEAN) {
                        if (structRoll > 0.98) generateShipwreck(chunk, lx, h, lz);
                        else if (structRoll > 0.995) generateOceanMonument(chunk, lx, h, lz);
                    }
                    
                    // Underwater vegetation
                    if (y === h && data[surfaceIdx] === BLOCKS.DIRT || data[surfaceIdx] === BLOCKS.SAND) {
                        var waterVeg = seededRandom(wx, 45, wz);
                        if (waterVeg > 0.95) generateKelp(chunk, lx, h + 1, lz);
                        else if (waterVeg > 0.88) generateSeagrass(chunk, lx, h + 1, lz);
                    }
                }
                
                // Underground Structures
                if (lx === 8 && lz === 8 && h > 40) {
                    var undergroundRoll = seededRandom(wx, 999, wz);
                    if (undergroundRoll > 0.98) generateSmallDungeon(chunk, lx, 20, lz);
                    else if (undergroundRoll > 0.96) generateMineshaft(chunk, lx, 30, lz, 12, "x");
                    else if (undergroundRoll > 0.995) generateStrongholdRoom(chunk, lx, 15, lz, 9, 9, 5);
                    else if (undergroundRoll < 0.01) generateFossil(chunk, lx, 12, lz);
                }
            }
        }
    }
    
    // Dynamic generation injection for custom ore frequency passes
    if (dim === CONFIG.DIMENSION_OVERWORLD) {
        generateOreVein(chunk, BLOCKS.IRON_ORE, 16, 64, 2, 8);
        generateOreVein(chunk, BLOCKS.COAL_ORE, 0, 128, 3, 15);
    }
    
    return chunk;
}

// ============ CHUNK MESH ============
function buildChunkMesh(chunk) {
    if (!chunk || !chunk.data) return;
    
    var mesh = [];
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var data = chunk.data;
    var wx = chunk.cx * CS, wz = chunk.cz * CS;
    
    for (var x = 0; x < CS; x++) {
        for (var z = 0; z < CS; z++) {
            var worldX = wx + x, worldZ = wz + z;
            for (var y = 0; y < WH; y++) {
                var blockId = data[x + y * CS + z * CS * WH];
                if (blockId === BLOCKS.AIR) continue;
                var def = getBlockDef(blockId);
                if (!def || !def.solid) continue;
                if (!isBlockExposed(worldX, y, worldZ)) continue;
                mesh.push({ x: worldX + 0.5, y: y + 0.5, z: worldZ + 0.5, id: blockId });
            }
        }
    }
    
    chunk.mesh = mesh;
    chunk.meshDirty = false;
}

function isBlockExposed(wx, wy, wz) {
    return isTransparent(getBlock(wx, wy + 1, wz)) || isTransparent(getBlock(wx, wy - 1, wz)) ||
           isTransparent(getBlock(wx, wy, wz - 1)) || isTransparent(getBlock(wx, wy, wz + 1)) ||
           isTransparent(getBlock(wx + 1, wy, wz)) || isTransparent(getBlock(wx - 1, wy, wz));
}

// ============ CHUNK LOADING/UNLOADING ============
function preGenerateSpawn(radius) {
    if (typeof radius === "undefined") radius = CONFIG.VIEW_DISTANCE + 1;
    var cx = -radius, cz = -radius;
    function genNext() {
        if (cx <= radius) { 
            getChunk(cx, cz); 
            cz++; 
            if (cz > radius) { cz = -radius; cx++; } 
            setTimeout(genNext, 0); 
        }
    }
    setTimeout(genNext, 10);
}

function unloadDistantChunks() {
    if (typeof player === "undefined") return;
    var pcx = worldToChunk(player.x), pcz = worldToChunk(player.z);
    var chunks = getCurrentChunks();
    for (var key in chunks) {
        if (!chunks.hasOwnProperty(key)) continue;
        var parts = key.split(",");
        var cx = parseInt(parts[0]), cz = parseInt(parts[1]);
        if (Math.abs(cx - pcx) > CONFIG.VIEW_DISTANCE + 3 || Math.abs(cz - pcz) > CONFIG.VIEW_DISTANCE + 3) {
            delete chunks[key];
        }
    }
}

// ============ NEW STRUCTURES GENERATION ============

// 1. IGLOO GENERATION
function generateIgloo(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Simple dome calculation radius = 3
    for (var dx = -3; dx <= 3; dx++) {
        for (var dz = -3; dz <= 3; dz++) {
            for (var dy = 0; dy <= 3; dy++) {
                var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                var tx = lx + dx, ty = y + dy, tz = lz + dz;
                
                if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
                    if (dist <= 3.2 && dist >= 2.0) {
                        data[tx + ty * CS + tz * CS * WH] = BLOCKS.SNOW_BLOCK;
                    } else if (dist < 2.0) {
                        data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                    }
                }
            }
        }
    }
    // Cut open a door entryway facing North (negative z)
    for (var dy = 0; dy < 2; dy++) {
        if (lx >= 0 && lx < CS && lz - 3 >= 0 && lz - 3 < CS) {
            data[lx + (y + dy) * CS + (lz - 3) * CS * WH] = BLOCKS.AIR;
            data[lx + (y + dy) * CS + (lz - 2) * CS * WH] = BLOCKS.AIR;
        }
    }
}

// 2. WITCH HUT GENERATION
function generateWitchHut(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // 4 Stilts made out of oak logs down into the dirt/swamp floor
    var stiltOffsets = [[-2, -2], [2, -2], [-2, 2], [2, 2]];
    stiltOffsets.forEach(function(offset) {
        var sx = lx + offset[0], sz = lz + offset[1];
        for (var sy = y - 3; sy <= y; sy++) {
            if (sx >= 0 && sx < CS && sz >= 0 && sz < CS && sy < WH && sy >= 0) {
                data[sx + sy * CS + sz * CS * WH] = BLOCKS.OAK_LOG;
            }
        }
    });

    // Hut walls 7x7 base platform, 4 height rooms
    for (var bx = -3; bx <= 3; bx++) {
        for (var bz = -3; bz <= 3; bz++) {
            for (var by = 1; by <= 4; by++) {
                var tx = lx + bx, ty = y + by, tz = lz + bz;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                
                var isWall = (Math.abs(bx) === 3 || Math.abs(bz) === 3);
                var isFloor = (by === 1);
                var isRoof = (by === 4);
                
                if (isFloor || isRoof) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
                } else if (isWall) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.DARK_OAK_PLANKS;
                } else {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                }
            }
        }
    }
    // Decorative Cauldron Placeholder inside center
    if (lx >= 0 && lx < CS && lz >= 0 && lz < CS) {
        data[lx + (y + 2) * CS + lz * CS * WH] = BLOCKS.CAULDRON || BLOCKS.ANVIL;
    }
}

// 3. JUNGLE TEMPLE GENERATION
function generateJungleTemple(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var w = 10, d = 12, h = 6;
    
    for (var by = 0; by < h; by++) {
        var inset = Math.floor(by / 2); // Tiered step pattern
        for (var bx = inset; bx < w - inset; bx++) {
            for (var bz = inset; bz < d - inset; bz++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                
                var isWall = (bx === inset || bx === w - inset - 1 || bz === inset || bz === d - inset - 1);
                var isFloor = (by === 0);
                
                if (isWall || isFloor) {
                    var randBlock = seededRandom(tx, ty, tz);
                    data[tx + ty * CS + tz * CS * WH] = (randBlock > 0.4) ? BLOCKS.MOSSY_COBBLESTONE : BLOCKS.COBBLESTONE;
                } else {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                }
            }
        }
    }
}

// 4. SHIPWRECK GENERATION
function generateShipwreck(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var length = 12;
    
    // Generate a simple horizontal capsule on the ocean bed floor using wood hulls
    for (var bz = 0; bz < length; bz++) {
        var radius = (bz === 0 || bz === length - 1) ? 1 : 2;
        for (var dx = -radius; dx <= radius; dx++) {
            for (var dy = -radius; dy <= radius; dy++) {
                var tx = lx + dx, ty = y + dy, tz = lz + bz;
                if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH && ty >= 0) {
                    var dist = Math.sqrt(dx*dx + dy*dy);
                    var isHull = (dist <= radius && dist >= radius - 0.8);
                    
                    if (isHull) {
                        data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
                    } else if (dist < radius) {
                        // Interior cabin cargo loot box placeholder mapping
                        if (bz === Math.floor(length / 2) && dx === 0 && dy === 0) {
                            data[tx + ty * CS + tz * CS * WH] = BLOCKS.CHEST || BLOCKS.OAK_PLANKS;
                        } else {
                            data[tx + ty * CS + tz * CS * WH] = BLOCKS.WATER;
                        }
                    }
                }
            }
        }
    }
}

// ============ LEGACY STRUCTURE ALGORITHMS ============
function generateDesertPyramid(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    for (var bx = -10; bx <= 10; bx++) {
        for (var bz = -10; bz <= 10; bz++) {
            var tx = lx + bx, tz = lz + bz;
            if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && y < WH) {
                data[tx + y * CS + tz * CS * WH] = BLOCKS.SANDSTONE;
            }
        }
    }
    for (var level = 0; level < 10; level++) {
        var size = 10 - level;
        for (var bx = -size; bx <= size; bx++) {
            for (var bz = -size; bz <= size; bz++) {
                var tx = lx + bx, tz = lz + bz;
                var ty = y + 1 + level;
                if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
                    if (Math.abs(bx) === size || Math.abs(bz) === size) {
                        data[tx + ty * CS + tz * CS * WH] = BLOCKS.SANDSTONE;
                    }
                }
            }
        }
    }
}

function generateSmallDungeon(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var size = 5;
    
    for (var bx = -size; bx <= size; bx++) {
        for (var bz = -size; bz <= size; bz++) {
            for (var by = 0; by < 4; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
                    var isWall = (Math.abs(bx) === size || Math.abs(bz) === size || by === 0 || by === 3);
                    var isFloor = (by === 0);
                    if (isWall) data[tx + ty * CS + tz * CS * WH] = BLOCKS.COBBLESTONE;
                    else if (isFloor) data[tx + ty * CS + tz * CS * WH] = BLOCKS.MOSSY_COBBLESTONE;
                }
            }
        }
    }
    if (lx >= 0 && lx < CS && lz >= 0 && lz < CS && y + 1 < WH) {
        data[lx + (y + 1) * CS + lz * CS * WH] = BLOCKS.MOB_SPAWNER;
    }
}

// ============ ORE VEIN GENERATION ============
function generateOreVein(chunk, blockId, minY, maxY, veinSize, frequency) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    for (var attempt = 0; attempt < frequency; attempt++) {
        var vx = Math.floor(Math.random() * CS);
        var vz = Math.floor(Math.random() * CS);
        var vy = minY + Math.floor(Math.random() * (maxY - minY));
        
        for (var dx = -veinSize; dx <= veinSize; dx++) {
            for (var dy = -veinSize; dy <= veinSize; dy++) {
                for (var dz = -veinSize; dz <= veinSize; dz++) {
                    var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                    if (dist <= veinSize && Math.random() < (1 - dist/veinSize)) {
                        var tx = vx + dx, ty = vy + dy, tz = vz + dz;
                        if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty >= 0 && ty < WH) {
                            var existingBlock = data[tx + ty * CS + tz * CS * WH];
                            if (existingBlock === BLOCKS.STONE) {
                                data[tx + ty * CS + tz * CS * WH] = blockId;
                            }
                        }
                    }
                }
            }
        }
    }
}

// ============ RAVINE GENERATION ============
function isRavine(wx, wy, wz) {
    var ravineNoise = octaveNoise(wx * 0.02, wz * 0.02, 3, WORLD_SEED + 900);
    var absNoise = Math.abs(ravineNoise - 0.5) * 2;
    var ravineWidth = 2 + absNoise * 4;
    
    var distToCenter = Math.abs(ravineNoise - 0.5) * 20;
    if (distToCenter < ravineWidth && wy < 40 && wy > 5) {
        var wallNoise = octaveNoise(wx * 0.1, wy * 0.1, 2, WORLD_SEED + 1000);
        return wallNoise > 0.4;
    }
    return false;
}

// ============ UNDERWATER FEATURES ============
function generateKelp(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var height = 2 + Math.floor(seededRandom(lx, y, lz, WORLD_SEED + 1100) * 8);
    
    for (var i = 0; i < height && y + i < WH; i++) {
        if (lx >= 0 && lx < CS && lz >= 0 && lz < CS) {
            var idx = lx + (y + i) * CS + lz * CS * WH;
            if (data[idx] === BLOCKS.WATER) data[idx] = BLOCKS.SUGAR_CANE; 
        }
    }
}

function generateSeagrass(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    if (lx >= 0 && lx < CS && lz >= 0 && lz < CS && y < WH) {
        var idx = lx + y * CS + lz * CS * WH;
        if (data[idx] === BLOCKS.WATER) data[idx] = BLOCKS.TALL_GRASS;
    }
}

// ============ SNOW ACCUMULATION ============
function shouldSnowAt(wx, wy, wz) {
    if (wy < CONFIG.SEA_LEVEL) return false;
    var biome = getBiome(wx, wz);
    return (biome === BIOMES.TAIGA || biome === BIOMES.MOUNTAINS) && wy > 70;
}

// ============ BLOCK TICK SYSTEM ============
function tickBlock(x, y, z) {
    var blockId = getBlock(x, y, z);
    
    if (blockId === BLOCKS.GRASS_BLOCK) {
        var above = getBlock(x, y + 1, z);
        if (isSolid(above)) setBlock(x, y, z, BLOCKS.DIRT);
        for (var dx = -1; dx <= 1; dx++) {
            for (var dz = -1; dz <= 1; dz++) {
                if (dx === 0 && dz === 0) continue;
                var neighbor = getBlock(x + dx, y, z + dz);
                var neighborAbove = getBlock(x + dx, y + 1, z + dz);
                if (neighbor === BLOCKS.DIRT && !isSolid(neighborAbove) && getLightLevel(x + dx, y + 1, z + dz) >= 9) {
                    if (Math.random() < 0.1) setBlock(x + dx, y, z + dz, BLOCKS.GRASS_BLOCK);
                }
            }
        }
    }
    
    if (blockId === BLOCKS.ICE && getLightLevel(x, y, z) >= 12) {
        setBlock(x, y, z, BLOCKS.WATER);
    }
    if (blockId === BLOCKS.WATER && shouldSnowAt(x, y, z) && getLightLevel(x, y, z) < 8) {
        setBlock(x, y, z, BLOCKS.ICE);
    }
}

// ============ WORLD WEATHER EFFECTS ============
function applyWeatherToWorld() {
    if (typeof weather === "undefined" || weather.type === "clear") return;
    
    if (weather.type === "snow") {
        var px = Math.floor(player.x), pz = Math.floor(player.z);
        for (var dx = -10; dx <= 10; dx++) {
            for (var dz = -10; dz <= 10; dz++) {
                var wx = px + dx, wz = pz + dz;
                if (shouldSnowAt(wx, getTerrainHeight(wx, wz) + 1, wz)) {
                    var h = getTerrainHeight(wx, wz);
                    var block = getBlock(wx, h + 1, wz);
                    if (block === BLOCKS.AIR && Math.random() < 0.01) {
                        setBlock(wx, h + 1, wz, BLOCKS.SNOW_LAYER);
                    }
                }
            }
        }
    }
}

// ============ CHUNK STATISTICS ============
function getChunkStats(cx, cz) {
    var chunk = getChunk(cx, cz);
    if (!chunk || !chunk.data) return null;
    
    var stats = { total: 0, stone: 0, dirt: 0, grass: 0, water: 0, air: 0, ores: 0 };
    var data = chunk.data;
    var size = CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT * CONFIG.CHUNK_SIZE;
    
    for (var i = 0; i < size; i++) {
        stats.total++;
        switch(data[i]) {
            case BLOCKS.STONE: stats.stone++; break;
            case BLOCKS.DIRT: stats.dirt++; break;
            case BLOCKS.GRASS_BLOCK: stats.grass++; break;
            case BLOCKS.WATER: stats.water++; break;
            case BLOCKS.AIR: stats.air++; break;
            default:
                if (data[i] >= BLOCKS.COAL_ORE && data[i] <= BLOCKS.NETHER_QUARTZ_ORE) stats.ores++;
        }
    }
    return stats;
}

// ============ WORLD BORDER ============
var worldBorderSize = 10000;
var worldBorderCenter = { x: 0, z: 0 };

function setWorldBorder(size, centerX, centerZ) {
    worldBorderSize = size;
    worldBorderCenter.x = centerX || 0;
    worldBorderCenter.z = centerZ || 0;
}

function isInsideWorldBorder(x, z) {
    return Math.abs(x - worldBorderCenter.x) <= worldBorderSize && 
           Math.abs(z - worldBorderCenter.z) <= worldBorderSize;
}

// ============ DIMENSION TRAVEL ============
function switchDimension(dim) {
    currentDimension = dim;
    if (typeof player !== "undefined") {
        player.y = getTerrainHeight(Math.floor(player.x), Math.floor(player.z), dim) + 2;
    }
    preGenerateSpawn(CONFIG.VIEW_DISTANCE + 1);
}

// ============ SEED MANAGEMENT ============
function setWorldSeed(newSeed) {
    WORLD_SEED = newSeed;
    CONFIG.WORLD_SEED = newSeed;
    dimensionChunks[CONFIG.DIMENSION_OVERWORLD] = {};
    dimensionChunks[CONFIG.DIMENSION_NETHER] = {};
    dimensionChunks[CONFIG.DIMENSION_END] = {};
    preGenerateSpawn(CONFIG.VIEW_DISTANCE + 1);
}

// ============ ABANDONED MINESHAFT GENERATOR ============
function generateMineshaft(chunk, lx, y, lz, length, direction) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var dx = direction === "x" ? 1 : 0;
    var dz = direction === "z" ? 1 : 0;
    
    for (var i = 0; i < length; i++) {
        var tx = lx + (dx * i);
        var tz = lz + (dz * i);
        var ty = y;
        
        if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty < 0 || ty >= WH) continue;
        
        for (var bx = -1; bx <= 1; bx++) {
            for (var bz = -1; bz <= 1; bz++) {
                for (var by = 0; by < 3; by++) {
                    var cx2 = tx + bx, cz2 = tz + bz, cy2 = ty + by;
                    if (cx2 >= 0 && cx2 < CS && cz2 >= 0 && cz2 < CS && cy2 < WH) {
                        var isWall = (Math.abs(bx) === 1 || Math.abs(bz) === 1 || by === 2);
                        var isSupport = (i % 4 === 0 && bx === 0 && bz === 0 && by < 2);
                        if (by < 2 && bx === 0 && bz === 0) {
                            data[cx2 + cy2 * CS + cz2 * CS * WH] = BLOCKS.AIR;
                        } else if (isSupport) {
                            data[cx2 + cy2 * CS + cz2 * CS * WH] = BLOCKS.OAK_LOG;
                        } else if (isWall && by < 2) {
                            data[cx2 + cy2 * CS + cz2 * CS * WH] = BLOCKS.COBBLESTONE;
                        }
                    }
                }
            }
        }
        
        var railIdx = tx + ty * CS + tz * CS * WH;
        if (i % 3 === 0 && tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
            data[railIdx] = BLOCKS.RAIL;
        }
        
        if (i > 3 && Math.random() < 0.08) {
            var sideDir = direction === "x" ? "z" : "x";
            generateMineshaft(chunk, tx, ty, tz, 3 + Math.floor(Math.random() * 5), sideDir);
        }
    }
}

// ============ STRONGHOLD GENERATOR ============
function generateStrongholdRoom(chunk, lx, y, lz, width, depth, height) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    for (var bx = 0; bx < width; bx++) {
        for (var bz = 0; bz < depth; bz++) {
            for (var by = 0; by < height; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                
                var isWall = (bx === 0 || bx === width-1 || bz === 0 || bz === depth-1 || by === 0 || by === height-1);
                var isPillar = (bx === Math.floor(width/3) || bx === Math.floor(2*width/3)) && 
                              (bz === Math.floor(depth/3) || bz === Math.floor(2*depth/3)) && by < height-1;
                
                if (isWall || isPillar) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.STONE_BRICKS;
                } else {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                }
            }
        }
    }
    var cx2 = lx + Math.floor(width/2);
    var cz2 = lz + Math.floor(depth/2);
    if (cx2 >= 0 && cx2 < CS && cz2 >= 0 && cz2 < CS && y + 1 < WH) {
        data[cx2 + (y+1) * CS + cz2 * CS * WH] = BLOCKS.END_PORTAL_FRAME;
    }
}

// ============ OCEAN MONUMENT GENERATOR ============
function generateOceanMonument(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var size = 12;
    
    for (var bx = -size; bx <= size; bx++) {
        for (var bz = -size; bz <= size; bz++) {
            for (var by = 0; by < 8; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                
                var dist = Math.max(Math.abs(bx), Math.abs(bz));
                var isOuterWall = (dist === size);
                var isInnerWall = (dist === size - 4);
                var isFloor = (by === 0);
                var isRoof = (by === 7);
                
                if (isOuterWall || isInnerWall) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.PRISMARINE;
                } else if (isFloor || isRoof) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.PRISMARINE_BRICKS;
                } else if (Math.random() < 0.02) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.SEA_LANTERN;
                }
            }
        }
    }
}

// ============ FOSSIL GENERATOR ============
function generateFossil(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var spineLength = 6 + Math.floor(Math.random() * 8);
    
    for (var i = 0; i < spineLength; i++) {
        var tx = lx + i, ty = y + Math.floor(Math.sin(i * 0.8) * 2);
        if (tx >= 0 && tx < CS && ty >= 0 && ty < WH) {
            data[tx + ty * CS + lz * CS * WH] = BLOCKS.BONE_BLOCK;
        }
    }
    for (var i = 2; i < spineLength - 2; i += 2) {
        for (var rib = -2; rib <= 2; rib++) {
            if (rib === 0) continue;
            var tx = lx + i, tz = lz + rib;
            var ty = y + Math.floor(Math.sin(i * 0.8) * 2);
            if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
                data[tx + ty * CS + tz * CS * WH] = BLOCKS.BONE_BLOCK;
            }
        }
    }
}

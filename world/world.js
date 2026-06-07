// ============================================
// MINECRAFT - WORLD GENERATION ENGINE
// Terrain, chunks, biomes, caves, structures
// ============================================

// ============ WORLD CONSTANTS ============
var CHUNK_SIZE = 16;
var WORLD_HEIGHT = 128;
var SEA_LEVEL = 50;
var MAX_LOADED_CHUNKS = 200;

// ============ DIMENSIONS ============
var DIMENSION = {
    OVERWORLD: 0,
    NETHER: -1,
    END: 1
};

var currentDimension = DIMENSION.OVERWORLD;

var dimensionChunks = {};
dimensionChunks[DIMENSION.OVERWORLD] = {};
dimensionChunks[DIMENSION.NETHER] = {};
dimensionChunks[DIMENSION.END] = {};

function getCurrentChunks() {
    return dimensionChunks[currentDimension];
}

// ============ BIOME SYSTEM ============
var BIOMES = {
    OCEAN:           { id: 0,  name: "Ocean",           temp: 0.5,  rain: 0.5,  grassColor: "#7ec850", surfaceBlock: 8,  subSurfaceBlock: 9 },
    PLAINS:          { id: 1,  name: "Plains",          temp: 0.8,  rain: 0.4,  grassColor: "#7ec850", surfaceBlock: 8,  subSurfaceBlock: 9 },
    DESERT:          { id: 2,  name: "Desert",          temp: 2.0,  rain: 0.0,  grassColor: "#bfb755", surfaceBlock: 69, subSurfaceBlock: 69 },
    FOREST:          { id: 3,  name: "Forest",          temp: 0.7,  rain: 0.8,  grassColor: "#4a8c2a", surfaceBlock: 8,  subSurfaceBlock: 9, treeChance: 0.12 },
    TAIGA:           { id: 4,  name: "Taiga",           temp: 0.25, rain: 0.8,  grassColor: "#6b8c42", surfaceBlock: 8,  subSurfaceBlock: 9, treeChance: 0.10, treeType: "spruce" },
    SWAMP:           { id: 5,  name: "Swamp",           temp: 0.8,  rain: 0.9,  grassColor: "#4a6b2a", surfaceBlock: 8,  subSurfaceBlock: 9 },
    SAVANNA:         { id: 6,  name: "Savanna",         temp: 1.2,  rain: 0.0,  grassColor: "#bfb755", surfaceBlock: 8,  subSurfaceBlock: 9, treeChance: 0.02, treeType: "acacia" },
    BEACH:           { id: 7,  name: "Beach",           temp: 0.8,  rain: 0.4,  grassColor: "#7ec850", surfaceBlock: 69, subSurfaceBlock: 69 },
    MOUNTAINS:       { id: 8,  name: "Mountains",       temp: 0.2,  rain: 0.3,  grassColor: "#7ec850", surfaceBlock: 8,  subSurfaceBlock: 9 },
    MUSHROOM_ISLAND: { id: 9,  name: "Mushroom Island", temp: 0.9,  rain: 1.0,  grassColor: "#7ec850", surfaceBlock: 12, subSurfaceBlock: 9 },
    HELL:            { id: 10, name: "Hell",             temp: 2.0,  rain: 0.0,  grassColor: "#8b3a3a", surfaceBlock: 140, subSurfaceBlock: 140, nether: true },
    END_VOID:        { id: 11, name: "End",              temp: 0.5,  rain: 0.0,  grassColor: "#dbdb8c", surfaceBlock: 145, subSurfaceBlock: 145, end: true }
};

function getBiome(x, z, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    
    if (dim === DIMENSION.NETHER) return BIOMES.HELL;
    if (dim === DIMENSION.END) return BIOMES.END_VOID;
    
    var temp = octaveNoise(x * 0.0005, z * 0.0005, 4, CONFIG.WORLD_SEED);
    var rain = octaveNoise(x * 0.0005 + 500, z * 0.0005 + 500, 4, CONFIG.WORLD_SEED);
    var height = getTerrainHeight(x, z);
    
    if (height <= SEA_LEVEL) return BIOMES.OCEAN;
    if (height <= SEA_LEVEL + 3) return BIOMES.BEACH;
    if (temp > 0.7 && rain < 0.2) return BIOMES.DESERT;
    if (temp > 0.6 && rain < 0.3) return BIOMES.SAVANNA;
    if (rain > 0.7 && temp < 0.3) return BIOMES.TAIGA;
    if (rain > 0.8 && temp > 0.4 && height < SEA_LEVEL + 15) return BIOMES.SWAMP;
    if (height > 80) return BIOMES.MOUNTAINS;
    if (rain > 0.6) return BIOMES.FOREST;
    if (temp > 0.9 && rain > 0.9 && Math.abs(x) < 200 && Math.abs(z) < 200) return BIOMES.MUSHROOM_ISLAND;
    
    return BIOMES.PLAINS;
}

// ============ TERRAIN HEIGHT ============
function getTerrainHeight(x, z, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    
    if (dim === DIMENSION.NETHER) {
        return Math.floor(40 + octaveNoise(x * 0.03, z * 0.03, 3, CONFIG.WORLD_SEED + 999) * 50);
    }
    if (dim === DIMENSION.END) {
        return Math.floor(55 + octaveNoise(x * 0.02, z * 0.02, 2, CONFIG.WORLD_SEED + 888) * 15);
    }
    
    var base = 50;
    var continentalness = octaveNoise(x * 0.0003, z * 0.0003, 6, CONFIG.WORLD_SEED);
    var hills = octaveNoise(x * 0.005, z * 0.005, 5, CONFIG.WORLD_SEED + 100) * 15;
    var mountains = octaveNoise(x * 0.003, z * 0.003, 4, CONFIG.WORLD_SEED + 200) * 40;
    var details = octaveNoise(x * 0.05, z * 0.05, 3, CONFIG.WORLD_SEED + 300) * 3;
    
    var height = base + continentalness * 25 + hills + details;
    
    if (continentalness > 0.55) {
        height += mountains * (continentalness - 0.55) * 2.5;
    }
    
    return Math.floor(Math.max(1, Math.min(120, height)));
}

// ============ CAVE GENERATION ============
function isCave(wx, wy, wz) {
    var caveNoise1 = octaveNoise(wx * 0.05, wz * 0.05, 3, CONFIG.WORLD_SEED + 500);
    var caveNoise2 = octaveNoise(wx * 0.1, wy * 0.1, 3, CONFIG.WORLD_SEED + 600);
    var caveNoise3 = octaveNoise(wz * 0.1, wy * 0.1, 3, CONFIG.WORLD_SEED + 700);
    
    var caveValue = (caveNoise1 + caveNoise2 + caveNoise3) / 3;
    
    return caveValue > 0.55 && wy < 50 && wy > 5;
}

// ============ CHUNK HELPERS ============
function chunkKey(cx, cz, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    return dim + ":" + cx + "," + cz;
}

function worldToChunk(v) {
    return Math.floor(v / CHUNK_SIZE);
}

function localInChunk(v) {
    return ((v % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
}

function getChunk(cx, cz, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    var chunks = dimensionChunks[dim];
    var key = chunkKey(cx, cz, dim);
    
    if (!chunks[key]) {
        // Unload old chunks if too many
        var keys = Object.keys(chunks);
        if (keys.length > MAX_LOADED_CHUNKS) {
            delete chunks[keys[0]];
        }
        chunks[key] = generateChunk(cx, cz, dim);
    }
    
    return chunks[key];
}

function getBlock(x, y, z, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    if (y < 0 || y >= WORLD_HEIGHT) return BLOCKS.AIR;
    
    var cx = worldToChunk(x);
    var cz = worldToChunk(z);
    var lx = localInChunk(x);
    var lz = localInChunk(z);
    
    var chunk = getChunk(cx, cz, dim);
    return chunk.data[lx + y * CHUNK_SIZE + lz * CHUNK_SIZE * WORLD_HEIGHT];
}

function setBlock(x, y, z, id, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    if (y < 0 || y >= WORLD_HEIGHT) return;
    
    var cx = worldToChunk(x);
    var cz = worldToChunk(z);
    var lx = localInChunk(x);
    var lz = localInChunk(z);
    
    var chunk = getChunk(cx, cz, dim);
    chunk.data[lx + y * CHUNK_SIZE + lz * CHUNK_SIZE * WORLD_HEIGHT] = id;
    chunk.dirty = true;
}

// ============ TREE GENERATION ============
function generateTree(chunk, lx, y, lz, type) {
    var data = chunk.data;
    if (!type) type = "oak";
    
    var height, logBlock, leafBlock;
    
    switch(type) {
        case "oak":
            height = 4 + Math.floor(seededRandom(lx, y, lz) * 3);
            logBlock = BLOCKS.OAK_LOG;
            leafBlock = BLOCKS.OAK_LEAVES;
            break;
        case "spruce":
            height = 6 + Math.floor(seededRandom(lx, y, lz) * 5);
            logBlock = BLOCKS.SPRUCE_LOG;
            leafBlock = BLOCKS.SPRUCE_LEAVES;
            break;
        case "birch":
            height = 5 + Math.floor(seededRandom(lx, y, lz) * 2);
            logBlock = BLOCKS.BIRCH_LOG;
            leafBlock = BLOCKS.BIRCH_LEAVES;
            break;
        case "acacia":
            height = 4 + Math.floor(seededRandom(lx, y, lz) * 3);
            logBlock = BLOCKS.ACACIA_LOG;
            leafBlock = BLOCKS.ACACIA_LEAVES;
            break;
        case "dark_oak":
            height = 5 + Math.floor(seededRandom(lx, y, lz) * 2);
            logBlock = BLOCKS.DARK_OAK_LOG;
            leafBlock = BLOCKS.DARK_OAK_LEAVES;
            break;
        default:
            height = 4 + Math.floor(seededRandom(lx, y, lz) * 3);
            logBlock = BLOCKS.OAK_LOG;
            leafBlock = BLOCKS.OAK_LEAVES;
    }
    
    // Trunk
    for (var i = 0; i < height; i++) {
        if (y + i < WORLD_HEIGHT) {
            var idx = lx + (y + i) * CHUNK_SIZE + lz * CHUNK_SIZE * WORLD_HEIGHT;
            if (lx >= 0 && lx < CHUNK_SIZE && lz >= 0 && lz < CHUNK_SIZE) data[idx] = logBlock;
        }
    }
    
    // Leaves
    var leafStart = y + height - 3;
    for (var ly = leafStart; ly <= y + height; ly++) {
        var radius = (ly >= y + height - 1) ? 1 : 2;
        for (var dx = -radius; dx <= radius; dx++) {
            for (var dz = -radius; dz <= radius; dz++) {
                if (dx === 0 && dz === 0 && ly < y + height - 1) continue;
                if (Math.abs(dx) === radius && Math.abs(dz) === radius && seededRandom(lx + dx, ly, lz + dz) < 0.4) continue;
                
                var tx = lx + dx, tz = lz + dz;
                if (tx >= 0 && tx < CHUNK_SIZE && tz >= 0 && tz < CHUNK_SIZE && ly < WORLD_HEIGHT) {
                    var leafIdx = tx + ly * CHUNK_SIZE + tz * CHUNK_SIZE * WORLD_HEIGHT;
                    if (data[leafIdx] === BLOCKS.AIR) data[leafIdx] = leafBlock;
                }
            }
        }
    }
}

// ============ CHUNK GENERATION ============
function generateChunk(cx, cz, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    
    var data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);
    var chunk = { data: data, cx: cx, cz: cz, dirty: true };
    
    for (var lx = 0; lx < CHUNK_SIZE; lx++) {
        for (var lz = 0; lz < CHUNK_SIZE; lz++) {
            var wx = cx * CHUNK_SIZE + lx;
            var wz = cz * CHUNK_SIZE + lz;
            var biome = getBiome(wx, wz, dim);
            var terrainHeight = getTerrainHeight(wx, wz, dim);
            
            for (var y = 0; y < WORLD_HEIGHT; y++) {
                var block = BLOCKS.AIR;
                
                // Overworld generation
                if (dim === DIMENSION.OVERWORLD) {
                    if (y === 0) {
                        block = BLOCKS.BEDROCK;
                    } else if (y <= 4) {
                        block = BLOCKS.STONE;
                    } else if (isCave(wx, y, wz) && y < terrainHeight - 4) {
                        block = BLOCKS.AIR;
                    } else if (y < terrainHeight - 4) {
                        block = BLOCKS.STONE;
                        // Ore generation
                        var oreRoll = seededRandom(wx, y, wz, CONFIG.WORLD_SEED + 400);
                        if (oreRoll > 0.998 && y < 16) block = BLOCKS.DIAMOND_ORE;
                        else if (oreRoll > 0.994 && y < 32) block = BLOCKS.GOLD_ORE;
                        else if (oreRoll > 0.988 && y < 64) block = BLOCKS.IRON_ORE;
                        else if (oreRoll > 0.97) block = BLOCKS.COAL_ORE;
                        else if (oreRoll > 0.996 && y < 20) block = BLOCKS.REDSTONE_ORE;
                        else if (oreRoll > 0.995 && y < 24) block = BLOCKS.LAPIS_ORE;
                        else if (oreRoll > 0.999 && y < 32 && biome === BIOMES.MOUNTAINS) block = BLOCKS.EMERALD_ORE;
                    } else if (y < terrainHeight) {
                        block = biome.subSurfaceBlock || BLOCKS.DIRT;
                        if (block === BLOCKS.DIRT && seededRandom(wx, y, wz) > 0.98) block = BLOCKS.GRAVEL;
                    } else if (y === terrainHeight) {
                        block = biome.surfaceBlock || BLOCKS.GRASS_BLOCK;
                    } else if (y <= SEA_LEVEL) {
                        block = BLOCKS.WATER;
                    }
                }
                
                // Nether generation
                else if (dim === DIMENSION.NETHER) {
                    if (y === 0) {
                        block = BLOCKS.BEDROCK;
                    } else if (y === WORLD_HEIGHT - 1) {
                        block = BLOCKS.BEDROCK;
                    } else if (y < terrainHeight) {
                        block = BLOCKS.NETHERRACK;
                        var netherRoll = seededRandom(wx, y, wz, CONFIG.WORLD_SEED + 800);
                        if (netherRoll > 0.97) block = BLOCKS.NETHER_QUARTZ_ORE;
                        if (netherRoll > 0.96 && netherRoll < 0.97) block = BLOCKS.GLOWSTONE;
                    } else if (y < 100 && seededRandom(wx, y, wz, CONFIG.WORLD_SEED + 802) > 0.98) {
                        block = BLOCKS.GLOWSTONE;
                    }
                }
                
                // End generation
                else if (dim === DIMENSION.END) {
                    if (y < terrainHeight) {
                        block = BLOCKS.END_STONE;
                    }
                }
                
                if (lx >= 0 && lx < CHUNK_SIZE && lz >= 0 && lz < CHUNK_SIZE && y < WORLD_HEIGHT) {
                    data[lx + y * CHUNK_SIZE + lz * CHUNK_SIZE * WORLD_HEIGHT] = block;
                }
            }
            
            // Trees & surface features
            if (dim === DIMENSION.OVERWORLD && terrainHeight > SEA_LEVEL) {
                var surfaceBlock = data[lx + terrainHeight * CHUNK_SIZE + lz * CHUNK_SIZE * WORLD_HEIGHT];
                var treeChance = biome.treeChance || 0;
                
                if (surfaceBlock === BLOCKS.GRASS_BLOCK && treeChance > 0 && seededRandom(wx, 0, wz) > (1 - treeChance)) {
                    generateTree(chunk, lx, terrainHeight + 1, lz, biome.treeType || "oak");
                }
                
                // Flowers and grass
                if (surfaceBlock === BLOCKS.GRASS_BLOCK && terrainHeight + 1 < WORLD_HEIGHT && seededRandom(wx, 1, wz) > 0.85) {
                    var flowerRoll = seededRandom(wx, 2, wz);
                    var flowerIdx = lx + (terrainHeight + 1) * CHUNK_SIZE + lz * CHUNK_SIZE * WORLD_HEIGHT;
                    if (flowerRoll > 0.95) data[flowerIdx] = BLOCKS.POPPY;
                    else if (flowerRoll > 0.90) data[flowerIdx] = BLOCKS.DANDELION;
                    else data[flowerIdx] = BLOCKS.TALL_GRASS;
                }
            }
        }
    }
    
    return chunk;
}

// ============ PRE-GENERATE SPAWN AREA ============
function preGenerateSpawn(radius) {
    if (typeof radius === "undefined") radius = 5;
    
    var cx = -radius, cz = -radius;
    
    function genNext() {
        if (cx <= radius) {
            getChunk(cx, cz, currentDimension);
            cz++;
            if (cz > radius) { cz = -radius; cx++; }
            setTimeout(genNext, 0);
        }
    }
    
    setTimeout(genNext, 10);
}

// ============ CHUNK UNLOADING ============
function unloadDistantChunks() {
    if (typeof player === "undefined") return;

    var pcx = worldToChunk(player.x);
    var pcz = worldToChunk(player.z);
    var chunks = getCurrentChunks();

    for (var key in chunks) {
        if (!chunks.hasOwnProperty(key)) continue;
        var parts = key.split(":")[1].split(",");
        var cx = parseInt(parts[0]);
        var cz = parseInt(parts[1]);

        if (Math.abs(cx - pcx) > CONFIG.VIEW_DISTANCE + 3 || Math.abs(cz - pcz) > CONFIG.VIEW_DISTANCE + 3) {
            delete chunks[key];
        }
    }
}
console.log("World engine loaded - Seed: " + CONFIG.WORLD_SEED);

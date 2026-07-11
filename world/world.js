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
    DESERT:          { id: 2,  name: "Desert",          temp: 2.0,  rain: 0.0,  surfaceBlock: BLOCKS.SAND,        subSurfaceBlock: BLOCKS.SAND },
    FOREST:          { id: 3,  name: "Forest",          temp: 0.7,  rain: 0.8,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.12 },
    TAIGA:           { id: 4,  name: "Taiga",           temp: 0.25, rain: 0.8,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.10, treeType: "spruce" },
    SWAMP:           { id: 5,  name: "Swamp",           temp: 0.8,  rain: 0.9,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT },
    SAVANNA:         { id: 6,  name: "Savanna",         temp: 1.2,  rain: 0.0,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT, treeChance: 0.02, treeType: "acacia" },
    BEACH:           { id: 7,  name: "Beach",           temp: 0.8,  rain: 0.4,  surfaceBlock: BLOCKS.SAND,        subSurfaceBlock: BLOCKS.SAND },
    MOUNTAINS:       { id: 8,  name: "Mountains",       temp: 0.2,  rain: 0.3,  surfaceBlock: BLOCKS.GRASS_BLOCK, subSurfaceBlock: BLOCKS.DIRT },
    MUSHROOM_ISLAND: { id: 9,  name: "Mushroom Island", temp: 0.9,  rain: 1.0,  surfaceBlock: BLOCKS.MYCELIUM,    subSurfaceBlock: BLOCKS.DIRT },
    HELL:            { id: 10, name: "Nether",           temp: 2.0,  rain: 0.0,  surfaceBlock: BLOCKS.NETHERRACK,  subSurfaceBlock: BLOCKS.NETHERRACK, nether: true },
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
    if (rain > 0.7 && temp < 0.3) return BIOMES.TAIGA;
    if (rain > 0.8 && temp > 0.4 && h < CONFIG.SEA_LEVEL + 15) return BIOMES.SWAMP;
    if (h > 80) return BIOMES.MOUNTAINS;
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

// ============ TREES ============
function generateTree(chunk, lx, y, lz, type) {
    var data = chunk.data;
    if (!type) type = "oak";
    
    var height, logBlock, leafBlock;
    switch(type) {
        case "oak":     height = 4 + Math.floor(seededRandom(lx, y, lz) * 3); logBlock = BLOCKS.OAK_LOG; leafBlock = BLOCKS.OAK_LEAVES; break;
        case "spruce":  height = 6 + Math.floor(seededRandom(lx, y, lz) * 5); logBlock = BLOCKS.SPRUCE_LOG; leafBlock = BLOCKS.SPRUCE_LEAVES; break;
        case "birch":   height = 5 + Math.floor(seededRandom(lx, y, lz) * 2); logBlock = BLOCKS.BIRCH_LOG; leafBlock = BLOCKS.BIRCH_LEAVES; break;
        case "acacia":  height = 4 + Math.floor(seededRandom(lx, y, lz) * 3); logBlock = BLOCKS.ACACIA_LOG; leafBlock = BLOCKS.ACACIA_LEAVES; break;
        default:        height = 4 + Math.floor(seededRandom(lx, y, lz) * 3); logBlock = BLOCKS.OAK_LOG; leafBlock = BLOCKS.OAK_LEAVES;
    }
    
    // Trunk
    for (var i = 0; i < height; i++) {
        var idx = lx + (y + i) * CONFIG.CHUNK_SIZE + lz * CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT;
        if (y + i < CONFIG.WORLD_HEIGHT && lx >= 0 && lx < CONFIG.CHUNK_SIZE && lz >= 0 && lz < CONFIG.CHUNK_SIZE) {
            data[idx] = logBlock;
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
                if (tx >= 0 && tx < CONFIG.CHUNK_SIZE && tz >= 0 && tz < CONFIG.CHUNK_SIZE && ly < CONFIG.WORLD_HEIGHT) {
                    var leafIdx = tx + ly * CONFIG.CHUNK_SIZE + tz * CONFIG.CHUNK_SIZE * CONFIG.WORLD_HEIGHT;
                    if (data[leafIdx] === BLOCKS.AIR) data[leafIdx] = leafBlock;
                }
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
            
            // Surface features
            if (dim === CONFIG.DIMENSION_OVERWORLD && h > CONFIG.SEA_LEVEL) {
                var surfaceIdx = lx + h * CS + lz * CS * WH;
                var treeChance = biome.treeChance || 0;
                
                if (data[surfaceIdx] === BLOCKS.GRASS_BLOCK && treeChance > 0 && seededRandom(wx, 0, wz) > (1 - treeChance)) {
                    generateTree(chunk, lx, h + 1, lz, biome.treeType || "oak");
                }
                
                // Flowers
                if (data[surfaceIdx] === BLOCKS.GRASS_BLOCK && h + 1 < WH && seededRandom(wx, 1, wz) > 0.85) {
                    var flowerRoll = seededRandom(wx, 2, wz);
                    var flowerIdx = lx + (h + 1) * CS + lz * CS * WH;
                    if (flowerRoll > 0.95) data[flowerIdx] = BLOCKS.POPPY;
                    else if (flowerRoll > 0.90) data[flowerIdx] = BLOCKS.DANDELION;
                    else data[flowerIdx] = BLOCKS.TALL_GRASS;
                }
            }
        }
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
        if (cx <= radius) { getChunk(cx, cz); cz++; if (cz > radius) { cz = -radius; cx++; } setTimeout(genNext, 0); }
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
// ============ STRUCTURE GENERATION ============
function generateDesertPyramid(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Base
    for (var bx = -10; bx <= 10; bx++) {
        for (var bz = -10; bz <= 10; bz++) {
            var tx = lx + bx, tz = lz + bz;
            if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && y < WH) {
                data[tx + y * CS + tz * CS * WH] = BLOCKS.SANDSTONE;
            }
        }
    }
    
    // Walls (pyramid shape)
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
    
    // Spawner in center
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

// ============ VILLAGE GENERATOR ============
function generateVillageHouse(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    var w = 5, d = 5, h = 4;
    
    for (var bx = 0; bx < w; bx++) {
        for (var bz = 0; bz < d; bz++) {
            for (var by = 0; by < h; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
                    var isWall = (bx === 0 || bx === w-1 || bz === 0 || bz === d-1);
                    var isRoof = (by === h-1);
                    var isFloor = (by === 0);
                    var isDoor = (bx === Math.floor(w/2) && bz === 0 && by < 2);
                    
                    if (isDoor) data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                    else if (isRoof) data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
                    else if (isWall) data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_LOG;
                    else if (isFloor) data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
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
            if (data[idx] === BLOCKS.WATER) data[idx] = BLOCKS.SUGAR_CANE; // Using sugar cane as kelp placeholder
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
    
    // Grass spreading
    if (blockId === BLOCKS.GRASS_BLOCK) {
        var above = getBlock(x, y + 1, z);
        if (isSolid(above)) setBlock(x, y, z, BLOCKS.DIRT);
        // Spread to nearby dirt
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
    
    // Ice melting
    if (blockId === BLOCKS.ICE && getLightLevel(x, y, z) >= 12) {
        setBlock(x, y, z, BLOCKS.WATER);
    }
    
    // Water freezing
    if (blockId === BLOCKS.WATER && shouldSnowAt(x, y, z) && getLightLevel(x, y, z) < 8) {
        setBlock(x, y, z, BLOCKS.ICE);
    }
}

// ============ WORLD WEATHER EFFECTS ============
function applyWeatherToWorld() {
    if (typeof weather === "undefined" || weather.type === "clear") return;
    
    // Snow accumulation during snow weather
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

function getWorldBorderDamage(x, z) {
    var distX = Math.abs(x - worldBorderCenter.x) - worldBorderSize;
    var distZ = Math.abs(z - worldBorderCenter.z) - worldBorderSize;
    var dist = Math.max(distX, distZ);
    if (dist <= 0) return 0;
    return Math.ceil(dist / 2);
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
    // Clear all chunks
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
        
        // Main tunnel (3x3)
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
        
        // Rails on floor
        var railIdx = tx + ty * CS + tz * CS * WH;
        if (i % 3 === 0 && tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty < WH) {
            data[railIdx] = BLOCKS.RAIL;
        }
        
        // Random side tunnels
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
                
                if (isWall) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.STONE_BRICKS;
                } else if (isPillar) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.STONE_BRICKS;
                } else {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                }
            }
        }
    }
    
    // End portal frame in center
    var cx2 = lx + Math.floor(width/2);
    var cz2 = lz + Math.floor(depth/2);
    if (cx2 >= 0 && cx2 < CS && cz2 >= 0 && cz2 < CS && y + 1 < WH) {
        data[cx2 + (y+1) * CS + cz2 * CS * WH] = BLOCKS.END_PORTAL_FRAME;
    }
}

// ============ NETHER FORTRESS GENERATOR ============
function generateNetherFortress(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Bridge
    for (var bx = -2; bx <= 2; bx++) {
        for (var length = 0; length < 20; length++) {
            var tx = lx + bx, tz = lz + length;
            if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && y < WH) {
                data[tx + y * CS + tz * CS * WH] = BLOCKS.NETHER_BRICKS;
            }
        }
    }
    
    // Pillars
    for (var i = 0; i < 20; i += 4) {
        var px = lx, pz = lz + i;
        for (var py = 0; py < 8; py++) {
            var ty = y + py;
            if (px >= 0 && px < CS && pz >= 0 && pz < CS && ty < WH) {
                data[px + ty * CS + pz * CS * WH] = BLOCKS.NETHER_BRICKS;
            }
        }
    }
    
    // Blaze spawner
    if (lx >= 0 && lx < CS && lz + 10 >= 0 && lz + 10 < CS && y + 1 < WH) {
        data[lx + (y+1) * CS + (lz+10) * CS * WH] = BLOCKS.MOB_SPAWNER;
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
    
    // Spine
    var spineLength = 6 + Math.floor(Math.random() * 8);
    for (var i = 0; i < spineLength; i++) {
        var tx = lx + i, ty = y + Math.floor(Math.sin(i * 0.8) * 2);
        if (tx >= 0 && tx < CS && ty >= 0 && ty < WH) {
            data[tx + ty * CS + lz * CS * WH] = BLOCKS.BONE_BLOCK;
        }
    }
    
    // Ribs
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

// ============ IGLOO GENERATOR ============
function generateIgloo(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    for (var bx = -3; bx <= 3; bx++) {
        for (var bz = -3; bz <= 3; bz++) {
            for (var by = 0; by < 5; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                
                var dist = Math.sqrt(bx*bx + bz*bz);
                var isDome = (dist <= 3 - by * 0.5 && by > 0);
                var isFloor = (by === 0 && dist <= 3);
                var isDoor = (bx === 0 && bz === 3 && by < 2);
                
                if (isDoor) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
                } else if (isDome || isFloor) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.SNOW_BLOCK;
                }
            }
        }
    }
}

// ============ WITCH HUT GENERATOR ============
function generateWitchHut(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Platform on stilts
    for (var bx = -3; bx <= 3; bx++) {
        for (var bz = -3; bz <= 3; bz++) {
            var tx = lx + bx, tz = lz + bz;
            if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && y < WH) {
                data[tx + y * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
            }
        }
    }
    
    // Stilts
    for (var px = -2; px <= 2; px += 4) {
        for (var pz = -2; pz <= 2; pz += 4) {
            for (var sy = 1; sy <= 3; sy++) {
                var tx = lx + px, tz = lz + pz, ty = y - sy;
                if (tx >= 0 && tx < CS && tz >= 0 && tz < CS && ty >= 0 && ty < WH) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_LOG;
                }
            }
        }
    }
    
    // Walls
    for (var bx = -2; bx <= 2; bx++) {
        for (var bz = -2; bz <= 2; bz++) {
            for (var by = 1; by < 4; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                var isWall = (Math.abs(bx) === 2 || Math.abs(bz) === 2);
                var isRoof = (by === 3);
                if (isWall || isRoof) {
                    data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
                }
            }
        }
    }
}

// ============ SHIPWRECK GENERATOR ============
function generateShipwreck(chunk, lx, y, lz, rotation) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Hull
    for (var bx = -2; bx <= 2; bx++) {
        for (var length = 0; length < 12; length++) {
            for (var by = 0; by < 4; by++) {
                var tx = lx + bx, tz = lz + length, ty = y - by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty < 0 || ty >= WH) continue;
                
                var isHull = (by < 3 && Math.abs(bx) === 2) || (by === 0 && Math.abs(bx) <= 2);
                var isDeck = (by === 3 && Math.abs(bx) <= 2);
                
                if (isHull) data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
                else if (isDeck) data[tx + ty * CS + tz * CS * WH] = BLOCKS.OAK_PLANKS;
                
                // Random holes for "wrecked" look
                if (Math.random() < 0.05) data[tx + ty * CS + tz * CS * WH] = BLOCKS.AIR;
            }
        }
    }
    
    // Mast
    for (var my = 0; my < 8; my++) {
        var mx = lx, mz = lz + 5, mty = y + my;
        if (mx >= 0 && mx < CS && mz >= 0 && mz < CS && mty < WH) {
            data[mx + mty * CS + mz * CS * WH] = BLOCKS.OAK_LOG;
        }
    }
    
    // Treasure chest
    var cx2 = lx, cz2 = lz + 8;
    if (cx2 >= 0 && cx2 < CS && cz2 >= 0 && cz2 < CS && y < WH) {
        data[cx2 + y * CS + cz2 * CS * WH] = BLOCKS.CHEST;
    }
}

// ============ JUNGLE TEMPLE GENERATOR ============
function generateJungleTemple(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Base
    for (var bx = -5; bx <= 5; bx++) {
        for (var bz = -5; bz <= 5; bz++) {
            for (var by = 0; by < 8; by++) {
                var tx = lx + bx, tz = lz + bz, ty = y + by;
                if (tx < 0 || tx >= CS || tz < 0 || tz >= CS || ty >= WH) continue;
                
                var isWall = (Math.abs(bx) === 5 || Math.abs(bz) === 5);
                var isFloor = (by === 0);
                var isStair = (Math.abs(bx) === 5 - by && by < 5 && Math.abs(bz) <= 5 - by);
                
                if (isWall) data[tx + ty * CS + tz * CS * WH] = BLOCKS.COBBLESTONE;
                else if (isFloor) data[tx + ty * CS + tz * CS * WH] = BLOCKS.MOSSY_COBBLESTONE;
                else if (isStair) data[tx + ty * CS + tz * CS * WH] = BLOCKS.COBBLESTONE_STAIRS;
            }
        }
    }
}

// ============ TREE VARIETY GENERATOR ============
function generateFancyTree(chunk, lx, y, lz) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    // Extra thick trunk (2x2)
    var height = 6 + Math.floor(seededRandom(lx, y, lz, WORLD_SEED + 1200) * 4);
    for (var i = 0; i < height; i++) {
        for (var tx = 0; tx < 2; tx++) {
            for (var tz = 0; tz < 2; tz++) {
                var wx = lx + tx, wz = lz + tz, wy = y + i;
                if (wx >= 0 && wx < CS && wz >= 0 && wz < CS && wy < WH) {
                    data[wx + wy * CS + wz * CS * WH] = BLOCKS.OAK_LOG;
                }
            }
        }
    }
    
    // Large canopy
    for (var ly = y + height - 4; ly <= y + height + 2; ly++) {
        var radius = (ly >= y + height) ? 2 : 3;
        for (var dx = -radius; dx <= radius; dx++) {
            for (var dz = -radius; dz <= radius; dz++) {
                if (Math.abs(dx) === radius && Math.abs(dz) === radius && Math.random() < 0.5) continue;
                var wx = lx + dx, wz = lz + dz;
                if (wx >= 0 && wx < CS && wz >= 0 && wz < CS && ly < WH) {
                    if (data[wx + ly * CS + wz * CS * WH] === BLOCKS.AIR) {
                        data[wx + ly * CS + wz * CS * WH] = BLOCKS.OAK_LEAVES;
                    }
                }
            }
        }
    }
}

// ============ CACTUS FIELD GENERATOR ============
function generateCactusField(chunk, lx, y, lz, count) {
    var data = chunk.data;
    var CS = CONFIG.CHUNK_SIZE, WH = CONFIG.WORLD_HEIGHT;
    
    for (var i = 0; i < count; i++) {
        var cx2 = lx + Math.floor(seededRandom(lx + i, y, lz + i, WORLD_SEED + 1300) * 8) - 4;
        var cz2 = lz + Math.floor(seededRandom(lx + i + 1, y, lz + i + 1, WORLD_SEED + 1301) * 8) - 4;
        var ch = 2 + Math.floor(seededRandom(cx2, y, cz2, WORLD_SEED + 1302) * 3);
        
        for (var j = 0; j < ch; j++) {
            if (cx2 >= 0 && cx2 < CS && cz2 >= 0 && cz2 < CS && y + j < WH) {
                data[cx2 + (y + j) * CS + cz2 * CS * WH] = BLOCKS.CACTUS;
            }
        }
    }
}
console.log("World engine loaded - Seed: " + WORLD_SEED);

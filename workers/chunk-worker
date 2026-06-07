// ============================================
// MINECRAFT - CHUNK WORKER
// Background terrain generation via Web Worker
// ============================================

// This file runs in a separate thread.
// It receives chunk requests from the main thread,
// generates the terrain, and sends the chunk data back.

// ============ WORKER RNG (independent from main thread) ============
var WORKER_SEED = 0;

function workerRandom(x, y, z, seed) {
    if (typeof z === "undefined") z = 0;
    if (typeof seed === "undefined") seed = WORKER_SEED;
    var n = (((x * 374761393) | 0) + ((y * 668265263) | 0) + ((z * 1274126177) | 0) + ((seed * 1013904223) | 0)) | 0;
    n = ((n ^ (n >>> 13)) * 1274126177) | 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

// ============ WORKER NOISE ============
function workerSmoothNoise(x, z, seed) {
    var ix = Math.floor(x), iz = Math.floor(z);
    var fx = x - ix, fz = z - iz;
    var sx = fx * fx * (3 - 2 * fx);
    var sz = fz * fz * (3 - 2 * fz);
    var n00 = workerRandom(ix, iz, 0, seed);
    var n10 = workerRandom(ix + 1, iz, 0, seed);
    var n01 = workerRandom(ix, iz + 1, 0, seed);
    var n11 = workerRandom(ix + 1, iz + 1, 0, seed);
    return n00 * (1 - sx) * (1 - sz) + n10 * sx * (1 - sz) + n01 * (1 - sx) * sz + n11 * sx * sz;
}

function workerOctaveNoise(x, z, octaves, seed) {
    if (typeof octaves === "undefined") octaves = 4;
    var value = 0, amplitude = 1, frequency = 1, maxValue = 0;
    for (var i = 0; i < octaves; i++) {
        value += workerSmoothNoise(x * frequency, z * frequency, seed + i * 1000) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }
    return value / maxValue;
}

// ============ BLOCK IDS (minimal set for worker) ============
var BLOCKS_WORKER = {
    AIR: 0, STONE: 1, GRANITE: 2, DIORITE: 3, ANDESITE: 4,
    BEDROCK: 5, GRASS_BLOCK: 8, DIRT: 9, COARSE_DIRT: 10, PODZOL: 11,
    MYCELIUM: 12, GRASS_PATH: 13, FARMLAND: 14,
    COBBLESTONE: 15, OBSIDIAN: 17,
    COAL_ORE: 23, IRON_ORE: 24, GOLD_ORE: 25, DIAMOND_ORE: 26,
    EMERALD_ORE: 27, REDSTONE_ORE: 28, LAPIS_ORE: 29, NETHER_QUARTZ_ORE: 30,
    SAND: 69, RED_SAND: 70, SANDSTONE: 71, GRAVEL: 79, CLAY: 80,
    WATER: 81, LAVA: 82, ICE: 83, PACKED_ICE: 84, SNOW_BLOCK: 85,
    NETHERRACK: 140, SOUL_SAND: 141, GLOWSTONE: 142, MAGMA_BLOCK: 143,
    END_STONE: 145, OAK_LOG: 39, OAK_LEAVES: 63, TALL_GRASS: 175,
    DANDELION: 178, POPPY: 179, CACTUS: 205, SUGAR_CANE: 206
};

// ============ TERRAIN GENERATION ============
function workerGetTerrainHeight(x, z) {
    var base = 50;
    var continentalness = workerOctaveNoise(x * 0.0003, z * 0.0003, 6, WORKER_SEED);
    var hills = workerOctaveNoise(x * 0.005, z * 0.005, 5, WORKER_SEED + 100) * 15;
    var mountains = workerOctaveNoise(x * 0.003, z * 0.003, 4, WORKER_SEED + 200) * 40;
    var details = workerOctaveNoise(x * 0.05, z * 0.05, 3, WORKER_SEED + 300) * 3;
    var height = base + continentalness * 25 + hills + details;
    if (continentalness > 0.55) height += mountains * (continentalness - 0.55) * 2.5;
    return Math.floor(Math.max(1, Math.min(120, height)));
}

function workerIsCave(wx, wy, wz) {
    var caveNoise1 = workerOctaveNoise(wx * 0.05, wz * 0.05, 3, WORKER_SEED + 500);
    var caveNoise2 = workerOctaveNoise(wx * 0.1, wy * 0.1, 3, WORKER_SEED + 600);
    var caveNoise3 = workerOctaveNoise(wz * 0.1, wy * 0.1, 3, WORKER_SEED + 700);
    var caveValue = (caveNoise1 + caveNoise2 + caveNoise3) / 3;
    return caveValue > 0.55 && wy < 50 && wy > 5;
}

// ============ CHUNK GENERATION ============
function workerGenerateChunk(cx, cz) {
    var CHUNK_SIZE = 16;
    var WORLD_HEIGHT = 128;
    var data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);

    for (var x = 0; x < CHUNK_SIZE; x++) {
        for (var z = 0; z < CHUNK_SIZE; z++) {
            var wx = cx * CHUNK_SIZE + x;
            var wz = cz * CHUNK_SIZE + z;
            var terrainHeight = workerGetTerrainHeight(wx, wz);

            for (var y = 0; y < WORLD_HEIGHT; y++) {
                var block = BLOCKS_WORKER.AIR;

                if (y === 0) {
                    block = BLOCKS_WORKER.BEDROCK;
                } else if (y <= 4) {
                    block = BLOCKS_WORKER.STONE;
                } else if (workerIsCave(wx, y, wz) && y < terrainHeight - 4) {
                    block = BLOCKS_WORKER.AIR;
                } else if (y < terrainHeight - 4) {
                    block = BLOCKS_WORKER.STONE;
                    var oreRoll = workerRandom(wx, y, wz, WORKER_SEED + 400);
                    if (oreRoll > 0.998 && y < 16) block = BLOCKS_WORKER.DIAMOND_ORE;
                    else if (oreRoll > 0.994 && y < 32) block = BLOCKS_WORKER.GOLD_ORE;
                    else if (oreRoll > 0.988 && y < 64) block = BLOCKS_WORKER.IRON_ORE;
                    else if (oreRoll > 0.97) block = BLOCKS_WORKER.COAL_ORE;
                    else if (oreRoll > 0.996 && y < 20) block = BLOCKS_WORKER.REDSTONE_ORE;
                    else if (oreRoll > 0.995 && y < 24) block = BLOCKS_WORKER.LAPIS_ORE;
                } else if (y < terrainHeight) {
                    block = BLOCKS_WORKER.DIRT;
                } else if (y === terrainHeight) {
                    block = BLOCKS_WORKER.GRASS_BLOCK;
                } else if (y <= 50) {
                    block = BLOCKS_WORKER.WATER;
                }

                if (x >= 0 && x < CHUNK_SIZE && z >= 0 && z < CHUNK_SIZE && y < WORLD_HEIGHT) {
                    data[x + y * CHUNK_SIZE + z * CHUNK_SIZE * WORLD_HEIGHT] = block;
                }
            }
        }
    }

    return data;
}

// ============ MESSAGE HANDLER ============
self.onmessage = function (e) {
    var msg = e.data;

    switch (msg.type) {
        case "init":
            // Receive seed from main thread
            WORKER_SEED = msg.seed;
            self.postMessage({ type: "ready" });
            break;

        case "generate":
            // Generate a chunk and send it back
            var cx = msg.cx;
            var cz = msg.cz;
            var chunkData = workerGenerateChunk(cx, cz);
            self.postMessage({
                type: "chunk",
                cx: cx,
                cz: cz,
                data: chunkData.buffer
            }, [chunkData.buffer]); // Transfer buffer for performance
            break;

        case "generateBatch":
            // Generate multiple chunks
            var chunks = msg.chunks;
            var results = [];
            for (var i = 0; i < chunks.length; i++) {
                var c = chunks[i];
                var cData = workerGenerateChunk(c.cx, c.cz);
                results.push({
                    cx: c.cx,
                    cz: c.cz,
                    data: cData.buffer
                });
            }
            // Send all results back
            for (var j = 0; j < results.length; j++) {
                self.postMessage({
                    type: "chunk",
                    cx: results[j].cx,
                    cz: results[j].cz,
                    data: results[j].data
                }, [results[j].data]);
            }
            self.postMessage({ type: "batchComplete", count: results.length });
            break;

        case "ping":
            self.postMessage({ type: "pong" });
            break;
    }
};

// Signal that worker is ready
self.postMessage({ type: "loaded" });

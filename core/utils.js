// ============================================
// MINECRAFT - UTILITY FUNCTIONS
// RNG, noise, math, colors, collision, helpers
// ============================================

// ============ SEEDED RANDOM (32-bit safe, deterministic) ============
function seededRandom(x, y, z, seed) {
    if (typeof z === "undefined") z = 0;
    if (typeof seed === "undefined") seed = CONFIG.WORLD_SEED;
    var n = (((x * 374761393) | 0) + ((y * 668265263) | 0) + ((z * 1274126177) | 0) + ((seed * 1013904223) | 0)) | 0;
    n = ((n ^ (n >>> 13)) * 1274126177) | 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

// ============ SIMPLE RANDOM (non-seeded) ============
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomChance(probability) {
    return Math.random() < probability;
}

function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ============ PERLIN / SMOOTH NOISE ============
function smoothNoise(x, z, seed) {
    if (typeof seed === "undefined") seed = CONFIG.WORLD_SEED;
    var ix = Math.floor(x), iz = Math.floor(z);
    var fx = x - ix, fz = z - iz;
    var sx = fx * fx * (3 - 2 * fx);
    var sz = fz * fz * (3 - 2 * fz);
    var n00 = seededRandom(ix, iz, 0, seed);
    var n10 = seededRandom(ix + 1, iz, 0, seed);
    var n01 = seededRandom(ix, iz + 1, 0, seed);
    var n11 = seededRandom(ix + 1, iz + 1, 0, seed);
    return n00 * (1 - sx) * (1 - sz) + n10 * sx * (1 - sz) + n01 * (1 - sx) * sz + n11 * sx * sz;
}

function octaveNoise(x, z, octaves, seed) {
    if (typeof octaves === "undefined") octaves = 4;
    if (typeof seed === "undefined") seed = CONFIG.WORLD_SEED;
    var value = 0, amplitude = 1, frequency = 1, maxValue = 0;
    for (var i = 0; i < octaves; i++) {
        value += smoothNoise(x * frequency, z * frequency, seed + i * 1000) * amplitude;
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }
    return value / maxValue;
}

function noise3D(x, y, z, seed) {
    if (typeof seed === "undefined") seed = CONFIG.WORLD_SEED;
    return seededRandom(Math.floor(x), Math.floor(y), Math.floor(z), seed);
}

// ============ MATH HELPERS ============
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function smoothstep(a, b, t) {
    t = clamp(t, 0, 1);
    t = t * t * (3 - 2 * t);
    return a + (b - a) * t;
}

function distance2D(x1, z1, x2, z2) {
    var dx = x2 - x1, dz = z2 - z1;
    return Math.sqrt(dx * dx + dz * dz);
}

function distance3D(x1, y1, z1, x2, y2, z2) {
    var dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

function wrapAngle(angle) {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
}

function floorTo(value, step) {
    return Math.floor(value / step) * step;
}

// ============ COLOR HELPERS ============
function darkenColor(hex, factor) {
    if (!hex || hex.length < 7 || hex[0] !== "#") return hex || "#888888";
    try {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
        return "#" +
            Math.round(r * factor).toString(16).padStart(2, "0") +
            Math.round(g * factor).toString(16).padStart(2, "0") +
            Math.round(b * factor).toString(16).padStart(2, "0");
    } catch (e) { return hex; }
}

function lightenColor(hex, factor) {
    if (!hex || hex.length < 7 || hex[0] !== "#") return hex || "#888888";
    try {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return hex;
        return "#" +
            clamp(Math.round(r * factor), 0, 255).toString(16).padStart(2, "0") +
            clamp(Math.round(g * factor), 0, 255).toString(16).padStart(2, "0") +
            clamp(Math.round(b * factor), 0, 255).toString(16).padStart(2, "0");
    } catch (e) { return hex; }
}

function mixColors(hex1, hex2, t) {
    if (!hex1 || !hex2) return hex1 || hex2 || "#888888";
    try {
        var r1 = parseInt(hex1.slice(1, 3), 16), g1 = parseInt(hex1.slice(3, 5), 16), b1 = parseInt(hex1.slice(5, 7), 16);
        var r2 = parseInt(hex2.slice(1, 3), 16), g2 = parseInt(hex2.slice(3, 5), 16), b2 = parseInt(hex2.slice(5, 7), 16);
        return "#" +
            Math.round(lerp(r1, r2, t)).toString(16).padStart(2, "0") +
            Math.round(lerp(g1, g2, t)).toString(16).padStart(2, "0") +
            Math.round(lerp(b1, b2, t)).toString(16).padStart(2, "0");
    } catch (e) { return hex1; }
}

function hexToRgb(hex) {
    if (!hex || hex.length < 7) return { r: 136, g: 136, b: 136 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

function rgbToHex(r, g, b) {
    return "#" +
        clamp(r, 0, 255).toString(16).padStart(2, "0") +
        clamp(g, 0, 255).toString(16).padStart(2, "0") +
        clamp(b, 0, 255).toString(16).padStart(2, "0");
}

// ============ BLOCK HELPERS ============
function isTransparent(id) {
    if (typeof id === "undefined" || id === null) return true;
    if (id === BLOCKS.AIR) return true;
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? (def.transparent || !def.solid) : false;
}

function isSolid(id) {
    if (typeof id === "undefined" || id === null) return false;
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? def.solid : false;
}

function isLiquid(id) {
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? def.liquid : false;
}

function getBlockName(id) {
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? def.name : "Unknown";
}

function getBlockColor(id) {
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? (def.color || "#ff00ff") : "#ff00ff";
}

// ============ CHUNK HELPERS ============
function worldToChunk(v) {
    return Math.floor(v / CONFIG.CHUNK_SIZE);
}

function localInChunk(v) {
    return ((v % CONFIG.CHUNK_SIZE) + CONFIG.CHUNK_SIZE) % CONFIG.CHUNK_SIZE;
}

function chunkKey(cx, cz, dim) {
    if (typeof dim === "undefined") dim = currentDimension;
    return dim + ":" + cx + "," + cz;
}

// ============ AABB COLLISION ============
function aabbColliding(ax, ay, az, aw, ah, ad, bx, by, bz, bw, bh, bd) {
    return (
        ax < bx + bw && ax + aw > bx &&
        ay < by + bh && ay + ah > by &&
        az < bz + bd && az + ad > bz
    );
}

function pointInAABB(px, py, pz, bx, by, bz, bw, bh, bd) {
    return (
        px >= bx && px <= bx + bw &&
        py >= by && py <= by + bh &&
        pz >= bz && pz <= bz + bd
    );
}

// ============ ARRAY HELPERS ============
function arrayRemove(arr, index) {
    if (index > -1) arr.splice(index, 1);
}

function arrayShuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
}

// ============ PERFORMANCE ============
function throttle(fn, delay) {
    var lastCall = 0;
    return function () {
        var now = Date.now();
        if (now - lastCall >= delay) { lastCall = now; return fn.apply(this, arguments); }
    };
}

function debounce(fn, delay) {
    var timer;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () { fn.apply(context, args); }, delay);
    };
}

// ============ FORMATTING ============
function formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function padNumber(n, width) {
    return n.toString().padStart(width, "0");
}

function formatTime(ticks) {
    var hours = Math.floor((ticks / 1000 + 6) % 24);
    var minutes = Math.floor((ticks % 1000) / 16.67);
    return padNumber(hours, 2) + ":" + padNumber(minutes, 2);
}

// ============ LOGGING ============
function logDebug(msg) { if (CONFIG.SHOW_DEBUG_ON_F3) console.log("[DEBUG]", msg); }
function logWarning(msg) { console.warn("[WARN]", msg); }
function logError(msg) { console.error("[ERROR]", msg); }

// ============ STRING HELPERS ============
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function toSnakeCase(str) {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
}

// ============ CANVAS HELPERS ============
function createCanvas(width, height) {
    var c = document.createElement("canvas");
    c.width = width; c.height = height;
    return c;
}

function getCanvasContext(canvas, type) {
    return canvas.getContext(type || "2d");
}

// ============ TEXTURE ATLAS ============
var textureAtlas = new Image();
textureAtlas.src = "atlas.png";
textureAtlas.onload = function () { console.log("Texture atlas loaded"); };
textureAtlas.onerror = function () { console.log("No texture atlas found - using colors"); };

// ============ VECTOR3 HELPERS ============
function vec3(x, y, z) {
    return { x: x || 0, y: y || 0, z: z || 0 };
}

function vec3Add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function vec3Sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function vec3Scale(v, s) {
    return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function vec3Length(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function vec3Normalize(v) {
    var len = vec3Length(v);
    if (len === 0) return { x: 0, y: 0, z: 0 };
    return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function vec3Dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function vec3Cross(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}

function vec3Distance(a, b) {
    return distance3D(a.x, a.y, a.z, b.x, b.y, b.z);
}

function vec3Lerp(a, b, t) {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t),
        z: lerp(a.z, b.z, t)
    };
}

function vec3Floor(v) {
    return { x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) };
}

// ============ RAY-BLOCK INTERSECTION ============
function rayBlockIntersection(origin, direction, maxDist) {
    if (!maxDist) maxDist = CONFIG.PLAYER_REACH_DISTANCE;
    var pos = { x: origin.x, y: origin.y, z: origin.z };
    var step = 0.05;
    var traveled = 0;

    while (traveled < maxDist) {
        var bx = Math.floor(pos.x), by = Math.floor(pos.y), bz = Math.floor(pos.z);
        var blockId = typeof getBlock === "function" ? getBlock(bx, by, bz) : 0;
        if (isSolid(blockId)) {
            return { x: bx, y: by, z: bz, id: blockId, distance: traveled, hitX: pos.x, hitY: pos.y, hitZ: pos.z };
        }
        pos.x += direction.x * step;
        pos.y += direction.y * step;
        pos.z += direction.z * step;
        traveled += step;
    }
    return null;
}

// ============ FRUSTUM HELPERS ============
function isChunkInFrustum(cx, cz, playerX, playerZ, yaw, fov, viewDist) {
    var dx = (cx * CONFIG.CHUNK_SIZE + CONFIG.CHUNK_SIZE / 2) - playerX;
    var dz = (cz * CONFIG.CHUNK_SIZE + CONFIG.CHUNK_SIZE / 2) - playerZ;
    var dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > viewDist * CONFIG.CHUNK_SIZE) return false;

    var angle = Math.atan2(dx, dz);
    var diff = wrapAngle(angle - yaw);
    return Math.abs(diff) < fov * 1.3;
}

// ============ BIOME HELPERS ============
function getBiomeColor(biome, type) {
    var colors = {
        OCEAN: { grass: "#7ec850", water: "#3f76e4", foliage: "#4a8c2a" },
        PLAINS: { grass: "#7ec850", water: "#3f76e4", foliage: "#6a9c3a" },
        DESERT: { grass: "#bfb755", water: "#3f76e4", foliage: "#8a9c2a" },
        FOREST: { grass: "#4a8c2a", water: "#3f76e4", foliage: "#3a7a22" },
        TAIGA: { grass: "#6b8c42", water: "#3f76e4", foliage: "#5a7a32" },
        SWAMP: { grass: "#4a6b2a", water: "#4c6559", foliage: "#3a5a22" },
        SAVANNA: { grass: "#bfb755", water: "#3f76e4", foliage: "#7a9c2a" },
        MOUNTAINS: { grass: "#7ec850", water: "#3f76e4", foliage: "#6a8c3a" }
    };
    var biomeColors = colors[biome] || colors.PLAINS;
    return biomeColors[type] || "#7ec850";
}

// ============ SKY COLOR HELPERS ============
function getSkyColorAtTime(timeOfDay, type) {
    var t = timeOfDay;
    var isNight = (t < CONFIG.SUNRISE_END || t > CONFIG.SUNSET_END);
    var isSunrise = (t >= CONFIG.SUNRISE_END && t < CONFIG.DAY_START + 1000);
    var isSunset = (t >= CONFIG.SUNSET_START && t < CONFIG.SUNSET_END);

    if (isNight) return type === "top" ? CONFIG.SKY_NIGHT_TOP : CONFIG.SKY_NIGHT_BOTTOM;
    if (isSunrise) {
        var sr = (t - CONFIG.SUNRISE_END) / 1000;
        return type === "top" ? mixColors(CONFIG.SKY_NIGHT_TOP, CONFIG.SKY_SUNRISE_TOP, sr) : mixColors(CONFIG.SKY_NIGHT_BOTTOM, CONFIG.SKY_SUNRISE_BOTTOM, sr);
    }
    if (isSunset) {
        var ss = (t - CONFIG.SUNSET_START) / (CONFIG.SUNSET_END - CONFIG.SUNSET_START);
        return type === "top" ? mixColors(CONFIG.SKY_DAY_TOP, CONFIG.SKY_SUNSET_TOP, ss) : mixColors(CONFIG.SKY_DAY_BOTTOM, CONFIG.SKY_SUNSET_BOTTOM, ss);
    }
    return type === "top" ? CONFIG.SKY_DAY_TOP : CONFIG.SKY_DAY_BOTTOM;
}

// ============ BLOCK FACE DETECTION ============
function getBlockFaceFromHit(hitX, hitY, hitZ, blockX, blockY, blockZ) {
    var dx = hitX - (blockX + 0.5);
    var dy = hitY - (blockY + 0.5);
    var dz = hitZ - (blockZ + 0.5);
    var adx = Math.abs(dx), ady = Math.abs(dy), adz = Math.abs(dz);

    if (adx >= ady && adx >= adz) return { face: dx > 0 ? "east" : "west", x: blockX + (dx > 0 ? 1 : -1), y: blockY, z: blockZ };
    if (ady >= adx && ady >= adz) return { face: dy > 0 ? "top" : "bottom", x: blockX, y: blockY + (dy > 0 ? 1 : -1), z: blockZ };
    return { face: dz > 0 ? "south" : "north", x: blockX, y: blockY, z: blockZ + (dz > 0 ? 1 : -1) };
}

// ============ COMPRESSION HELPERS ============
function compressChunkData(data) {
    var compressed = [];
    var current = data[0], count = 1;
    for (var i = 1; i < data.length; i++) {
        if (data[i] === current && count < 255) {
            count++;
        } else {
            compressed.push(count, current);
            current = data[i];
            count = 1;
        }
    }
    compressed.push(count, current);
    return compressed;
}

function decompressChunkData(compressed) {
    var data = [];
    for (var i = 0; i < compressed.length; i += 2) {
        var count = compressed[i], value = compressed[i + 1];
        for (var j = 0; j < count; j++) data.push(value);
    }
    return data;
}

// ============ MEMOIZATION ============
function memoize(fn) {
    var cache = {};
    return function () {
        var key = JSON.stringify(arguments);
        if (cache[key] === undefined) cache[key] = fn.apply(this, arguments);
        return cache[key];
    };
}

// ============ ID GENERATOR ============
function generateId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ============ EVENT EMITTER ============
function createEventEmitter() {
    var listeners = {};
    return {
        on: function (event, fn) {
            if (!listeners[event]) listeners[event] = [];
            listeners[event].push(fn);
        },
        off: function (event, fn) {
            if (!listeners[event]) return;
            listeners[event] = listeners[event].filter(function (l) { return l !== fn; });
        },
        emit: function (event, data) {
            if (!listeners[event]) return;
            for (var i = 0; i < listeners[event].length; i++) {
                listeners[event][i](data);
            }
        }
    };
}

// ============ TIMER ============
function createTimer() {
    var startTime = Date.now();
    return {
        reset: function () { startTime = Date.now(); },
        elapsed: function () { return Date.now() - startTime; },
        elapsedSeconds: function () { return (Date.now() - startTime) / 1000; }
    };
}

// ============ QUEUE ============
function createQueue() {
    var items = [];
    return {
        enqueue: function (item) { items.push(item); },
        dequeue: function () { return items.shift(); },
        peek: function () { return items[0]; },
        size: function () { return items.length; },
        isEmpty: function () { return items.length === 0; },
        clear: function () { items = []; }
    };
}
// ============ SOUND HELPER ============
function playBlockSound(blockId, type) {
    if (!audioCtx) return;
    var baseFreq = 100;
    var def = getBlockDef(blockId);
    
    if (def) {
        if (def.tool === "pickaxe") baseFreq = 120;
        if (def.tool === "axe") baseFreq = 90;
        if (def.tool === "shovel") baseFreq = 70;
        if (blockId === BLOCKS.SAND || blockId === BLOCKS.GRAVEL) baseFreq = 60;
        if (blockId === BLOCKS.WOOL_WHITE || blockId === BLOCKS.WHITE_WOOL) baseFreq = 50;
    }
    
    if (type === "break") {
        playSound(baseFreq, 0.15, "sawtooth", 0.6);
        setTimeout(function() { playSound(baseFreq * 0.7, 0.1, "square", 0.3); }, 40);
    } else if (type === "place") {
        playSound(baseFreq * 1.5, 0.1, "square", 0.5);
    } else if (type === "step") {
        playSound(baseFreq, 0.05, "square", 0.15);
    } else if (type === "dig") {
        playSound(baseFreq * 0.8, 0.08, "sawtooth", 0.2);
    }
}

// ============ SPAWN POINT VALIDATOR ============
function findSafeSpawnPoint(wx, wz) {
    var h = typeof getTerrainHeight === "function" ? getTerrainHeight(wx, wz) : 50;
    for (var y = h + 1; y < CONFIG.WORLD_HEIGHT - 3; y++) {
        var below = typeof getBlock === "function" ? getBlock(wx, y - 1, wz) : 0;
        var feet = typeof getBlock === "function" ? getBlock(wx, y, wz) : 0;
        var head = typeof getBlock === "function" ? getBlock(wx, y + 1, wz) : 0;
        if (isSolid(below) && !isSolid(feet) && !isSolid(head) && !isLiquid(feet)) {
            return y;
        }
    }
    return h + 2;
}

// ============ BLOCK UPDATE SCHEDULER ============
var blockUpdateQueue = [];
function scheduleBlockUpdate(x, y, z, delay, callback) {
    blockUpdateQueue.push({
        x: x, y: y, z: z,
        tick: gameState ? gameState.tickCount + (delay || 1) : 1,
        callback: callback
    });
}

function processBlockUpdates() {
    if (!gameState) return;
    for (var i = blockUpdateQueue.length - 1; i >= 0; i--) {
        if (gameState.tickCount >= blockUpdateQueue[i].tick) {
            var update = blockUpdateQueue[i];
            if (update.callback) update.callback(update.x, update.y, update.z);
            blockUpdateQueue.splice(i, 1);
        }
    }
}

// ============ GRAVITY / FALLING BLOCKS ============
function checkFallingBlock(x, y, z) {
    var blockId = typeof getBlock === "function" ? getBlock(x, y, z) : 0;
    var def = getBlockDef(blockId);
    if (!def || !def.falls) return;
    
    var below = typeof getBlock === "function" ? getBlock(x, y - 1, z) : 0;
    if (!isSolid(below)) {
        if (typeof setBlock === "function") {
            setBlock(x, y, z, BLOCKS.AIR);
            setBlock(x, y - 1, z, blockId);
            scheduleBlockUpdate(x, y - 1, z, 2, checkFallingBlock);
        }
    }
}

// ============ LIQUID SPREADING ============
function spreadLiquid(x, y, z) {
    var blockId = typeof getBlock === "function" ? getBlock(x, y, z) : 0;
    if (!isLiquid(blockId)) return;
    
    var directions = [
        [1,0,0], [-1,0,0], [0,-1,0], [0,0,1], [0,0,-1]
    ];
    
    for (var i = 0; i < directions.length; i++) {
        var nx = x + directions[i][0], ny = y + directions[i][1], nz = z + directions[i][2];
        var neighbor = typeof getBlock === "function" ? getBlock(nx, ny, nz) : 0;
        if (neighbor === BLOCKS.AIR && typeof setBlock === "function") {
            setBlock(nx, ny, nz, blockId);
            scheduleBlockUpdate(nx, ny, nz, 4, spreadLiquid);
            break;
        }
    }
}

// ============ LIGHTING PROPAGATION ============
function getLightLevel(x, y, z) {
    var blockId = typeof getBlock === "function" ? getBlock(x, y, z) : 0;
    var def = getBlockDef(blockId);
    
    // Blocks that emit light
    if (def && def.lightLevel) return def.lightLevel;
    
    // Sky light
    var skyLight = 15;
    for (var checkY = y + 1; checkY < CONFIG.WORLD_HEIGHT; checkY++) {
        var checkBlock = typeof getBlock === "function" ? getBlock(x, checkY, z) : 0;
        if (isSolid(checkBlock)) {
            skyLight = Math.max(0, 15 - (checkY - y));
            break;
        }
    }
    
    // Night reduces sky light
    if (gameState && gameState.timeOfDay > CONFIG.NIGHT_START && gameState.timeOfDay < CONFIG.NIGHT_END) {
        skyLight = Math.floor(skyLight * 0.3);
    }
    
    return Math.max(0, skyLight);
}

function getBlockBrightness(x, y, z) {
    var light = getLightLevel(x, y, z);
    return clamp(light / 15, 0.2, 1.0);
}

// ============ PLANT GROWTH ============
function canPlantGrow(x, y, z) {
    var above = typeof getBlock === "function" ? getBlock(x, y + 1, z) : 0;
    var light = getLightLevel(x, y, z);
    return !isSolid(above) && light >= 8;
}

// ============ BLOCK HARDNESS HELPER ============
function getBlockHardness(blockId) {
    var def = getBlockDef(blockId);
    if (!def) return 1;
    if (def.hardness === Infinity) return Infinity;
    return def.hardness || 1;
}

function canBreakBlock(blockId, toolType) {
    var def = getBlockDef(blockId);
    if (!def) return true;
    if (def.unbreakable) return false;
    if (!def.tool) return true;
    if (!toolType) return true;
    if (def.minTool && toolType !== def.minTool) return false;
    return true;
}

// ============ INVENTORY QUICK SORT ============
function sortInventory() {
    if (typeof inventory === "undefined") return;
    var items = [];
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        if (inventory[i]) items.push(inventory[i]);
    }
    items.sort(function(a, b) { return a.id - b.id; });
    for (var i = 0; i < CONFIG.INVENTORY_SLOTS; i++) {
        inventory[i] = items[i] || null;
    }
}

// ============ HOTBAR SCROLL ============
function scrollHotbar(direction) {
    if (typeof selectedSlot === "undefined") return;
    selectedSlot = ((selectedSlot + direction) % CONFIG.HOTBAR_SLOTS + CONFIG.HOTBAR_SLOTS) % CONFIG.HOTBAR_SLOTS;
    if (typeof updateHotbarUI === "function") updateHotbarUI();
}

// ============ WORLD BORDER CHECK ============
function isInsideWorldBorder(x, z, borderSize) {
    if (!borderSize) borderSize = 10000;
    return Math.abs(x) <= borderSize && Math.abs(z) <= borderSize;
}

// ============ SAFE TELEPORT ============
function safeTeleport(x, y, z) {
    var safeY = findSafeSpawnPoint(Math.floor(x), Math.floor(z));
    if (typeof player !== "undefined") {
        player.x = x;
        player.y = safeY;
        player.z = z;
        player.vy = 0;
        player.fallDistance = 0;
    }
}

// ============ SPAWN PARTICLE EFFECTS BY TYPE ============
function spawnBlockParticles(x, y, z, blockId, count) {
    var color = getBlockColor(blockId);
    if (typeof spawnParticles === "function") {
        spawnParticles(x, y, z, color, count || 8, "break");
    }
}

function spawnCritParticles(x, y, z) {
    if (typeof spawnParticles === "function") {
        spawnParticles(x, y, z, "#ffd700", 6, "crit");
    }
}

function spawnHeartParticles(x, y, z) {
    if (typeof spawnParticles === "function") {
        spawnParticles(x, y, z, "#ff69b4", 4, "sparkle");
    }
}

function spawnSmokeParticles(x, y, z, count) {
    if (typeof spawnParticles === "function") {
        spawnParticles(x, y, z, "#888888", count || 5, "smoke");
    }
}
console.log("Utilities loaded");

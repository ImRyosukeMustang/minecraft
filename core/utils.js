// ============================================
// MINECRAFT - UTILITY FUNCTIONS
// Shared math, RNG, colors, helpers
// ============================================

// ============ RANDOM NUMBER GENERATION ============

// 32-bit safe seeded random (deterministic)
function seededRandom(x, y, z, seed) {
    if (typeof z === "undefined") z = 0;
    if (typeof seed === "undefined") seed = CONFIG.WORLD_SEED;
    var n = (((x * 374761393) | 0) + ((y * 668265263) | 0) + ((z * 1274126177) | 0) + ((seed * 1013904223) | 0)) | 0;
    n = ((n ^ (n >>> 13)) * 1274126177) | 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

// Simple random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Simple random float between min and max
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Random boolean with probability
function randomChance(probability) {
    return Math.random() < probability;
}

// Pick random element from array
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

// 3D noise for caves
function noise3D(x, y, z, seed) {
    if (typeof seed === "undefined") seed = CONFIG.WORLD_SEED;
    return seededRandom(Math.floor(x), Math.floor(y), Math.floor(z), seed);
}

// ============ MATH HELPERS ============

// Clamp value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Linear interpolation
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Smooth step interpolation
function smoothstep(a, b, t) {
    t = clamp(t, 0, 1);
    t = t * t * (3 - 2 * t);
    return a + (b - a) * t;
}

// Distance between two 2D points
function distance2D(x1, z1, x2, z2) {
    var dx = x2 - x1;
    var dz = z2 - z1;
    return Math.sqrt(dx * dx + dz * dz);
}

// Distance between two 3D points
function distance3D(x1, y1, z1, x2, y2, z2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Convert degrees to radians
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

// Convert radians to degrees
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

// Wrap angle to -PI to PI
function wrapAngle(angle) {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
}

// ============ COLOR HELPERS ============

// Darken a hex color by factor (0-1)
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
    } catch (e) {
        return hex;
    }
}

// Lighten a hex color by factor (>1 to lighten)
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
    } catch (e) {
        return hex;
    }
}

// Mix two hex colors
function mixColors(hex1, hex2, t) {
    if (!hex1 || !hex2) return hex1 || hex2 || "#888888";
    try {
        var r1 = parseInt(hex1.slice(1, 3), 16);
        var g1 = parseInt(hex1.slice(3, 5), 16);
        var b1 = parseInt(hex1.slice(5, 7), 16);
        var r2 = parseInt(hex2.slice(1, 3), 16);
        var g2 = parseInt(hex2.slice(3, 5), 16);
        var b2 = parseInt(hex2.slice(5, 7), 16);
        return "#" +
            Math.round(lerp(r1, r2, t)).toString(16).padStart(2, "0") +
            Math.round(lerp(g1, g2, t)).toString(16).padStart(2, "0") +
            Math.round(lerp(b1, b2, t)).toString(16).padStart(2, "0");
    } catch (e) {
        return hex1;
    }
}

// Hex to RGB object
function hexToRgb(hex) {
    if (!hex || hex.length < 7) return { r: 136, g: 136, b: 136 };
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

// RGB to hex string
function rgbToHex(r, g, b) {
    return "#" +
        clamp(r, 0, 255).toString(16).padStart(2, "0") +
        clamp(g, 0, 255).toString(16).padStart(2, "0") +
        clamp(b, 0, 255).toString(16).padStart(2, "0");
}

// ============ BLOCK HELPERS ============

// Check if a block ID is transparent (air or transparent blocks)
function isTransparent(id) {
    if (typeof id === "undefined" || id === null) return true;
    if (id === BLOCKS.AIR) return true;
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? (def.transparent || !def.solid) : false;
}

// Check if a block ID is solid
function isSolid(id) {
    if (typeof id === "undefined" || id === null) return false;
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? def.solid : false;
}

// Check if a block ID is a liquid
function isLiquid(id) {
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? def.liquid : false;
}

// Get block name safely
function getBlockName(id) {
    var def = typeof getBlockDef === "function" ? getBlockDef(id) : blockDefs[id];
    return def ? def.name : "Unknown Block " + id;
}

// Get block color safely
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
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by &&
        az < bz + bd &&
        az + ad > bz
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
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// ============ PERFORMANCE ============

// Throttle function calls
function throttle(fn, delay) {
    var lastCall = 0;
    return function () {
        var now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, arguments);
        }
    };
}

// Debounce function calls
function debounce(fn, delay) {
    var timer;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
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

function logDebug(msg) {
    if (CONFIG.SHOW_DEBUG_ON_F3) {
        console.log("[DEBUG] " + msg);
    }
}

function logWarning(msg) {
    console.warn("[WARN] " + msg);
}

function logError(msg) {
    console.error("[ERROR] " + msg);
}

console.log("Utilities loaded - " + Object.keys(typeof BLOCKS !== "undefined" ? BLOCKS : {}).length + " block helpers ready");

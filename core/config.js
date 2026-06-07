// ============================================
// MINECRAFT - GAME CONFIGURATION
// All settings, constants, and keybinds
// ============================================

var CONFIG = {
    // ============ WORLD ============
    WORLD_SEED: Math.floor(Math.random() * 2147483647),
    CHUNK_SIZE: 16,
    WORLD_HEIGHT: 128,
    SEA_LEVEL: 50,
    VIEW_DISTANCE: 5,
    MAX_LOADED_CHUNKS: 200,
    CHUNK_UNLOAD_INTERVAL: 80,

    // ============ DIMENSIONS ============
    DIMENSION_OVERWORLD: 0,
    DIMENSION_NETHER: -1,
    DIMENSION_END: 1,

    // ============ PLAYER ============
    PLAYER_WALK_SPEED: 0.1,
    PLAYER_SPRINT_SPEED: 0.13,
    PLAYER_SNEAK_SPEED: 0.03,
    PLAYER_FLY_SPEED: 0.15,
    PLAYER_SWIM_SPEED: 0.04,
    PLAYER_JUMP_VELOCITY: 0.42,
    PLAYER_GRAVITY: 0.08,
    PLAYER_WATER_GRAVITY: 0.02,
    PLAYER_EYE_HEIGHT: 1.62,
    PLAYER_SNEAK_EYE_HEIGHT: 1.54,
    PLAYER_HEIGHT: 1.8,
    PLAYER_SNEAK_HEIGHT: 1.65,
    PLAYER_WIDTH: 0.6,
    PLAYER_MAX_HEALTH: 20,
    PLAYER_MAX_HUNGER: 20,
    PLAYER_STARTING_SATURATION: 5,
    PLAYER_INVULNERABILITY_TICKS: 20,
    PLAYER_RESPAWN_INVULNERABILITY: 60,
    PLAYER_FALL_DAMAGE_THRESHOLD: 3,
    PLAYER_HUNGER_REGEN_THRESHOLD: 18,
    PLAYER_STARVATION_DAMAGE: 1,

    // ============ RENDERING ============
    FOV: Math.PI / 3,
    RENDER_DISTANCE: 5,
    MOUSE_SENSITIVITY: 0.002,
    MAX_PITCH: 1.5,
    MIN_PITCH: -1.5,
    BLOCK_OUTLINE_WIDTH: 0.5,
    BLOCK_OUTLINE_COLOR: "rgba(0,0,0,0.1)",

    // ============ DAY/NIGHT ============
    DAY_LENGTH: 24000,
    SUNRISE_START: 0,
    SUNRISE_END: 2000,
    DAY_START: 2000,
    SUNSET_START: 11000,
    SUNSET_END: 13000,
    NIGHT_START: 13000,
    NIGHT_END: 23000,
    NIGHT_DARKNESS_FACTOR: 0.5,
    
    // Sky colors
    SKY_DAY_TOP: "#87CEEB",
    SKY_DAY_BOTTOM: "#b8d8f0",
    SKY_NIGHT_TOP: "#0a0a2e",
    SKY_NIGHT_BOTTOM: "#1a1a3e",
    SKY_SUNRISE_TOP: "#ff9a76",
    SKY_SUNRISE_BOTTOM: "#ffd89b",
    SKY_SUNSET_TOP: "#ff6b4a",
    SKY_SUNSET_BOTTOM: "#ffa07a",
    SKY_NETHER_TOP: "#2a0a0a",
    SKY_NETHER_BOTTOM: "#1a0000",
    SKY_END_TOP: "#0a0a1a",
    SKY_END_BOTTOM: "#0a0a0a",

    // ============ ENTITIES ============
    MAX_ENTITIES: 30,
    MAX_HOSTILE_MOBS: 20,
    MAX_PASSIVE_MOBS: 15,
    ENTITY_RENDER_DISTANCE: 30,
    ENTITY_DESPAWN_DISTANCE: 50,
    MOB_SPAWN_INTERVAL: 25,
    MOB_SPAWN_CHANCE: 0.3,
    MOB_SPAWN_MIN_DISTANCE: 20,
    MOB_SPAWN_MAX_DISTANCE: 30,

    // ============ PARTICLES ============
    MAX_PARTICLES: 200,
    PARTICLE_BREAK_COUNT: 10,
    PARTICLE_PLACE_COUNT: 6,
    PARTICLE_EXPLOSION_COUNT: 30,
    PARTICLE_LIFE: 1.0,
    PARTICLE_DECAY: 0.03,

    // ============ WEATHER ============
    WEATHER_CHANGE_CHANCE: 0.0001,
    WEATHER_CLEAR_DURATION_MIN: 6000,
    WEATHER_CLEAR_DURATION_MAX: 18000,
    WEATHER_RAIN_DURATION_MIN: 3000,
    WEATHER_RAIN_DURATION_MAX: 9000,
    WEATHER_THUNDER_CHANCE: 0.3,
    MAX_RAINDROPS: 150,
    RAINDROP_SPEED_MIN: 0.3,
    RAINDROP_SPEED_MAX: 0.9,

    // ============ AUDIO ============
    MASTER_VOLUME: 0.5,
    MUSIC_VOLUME: 0.3,
    SFX_VOLUME: 0.7,
    BLOCK_BREAK_SOUND_FREQ: 150,
    BLOCK_BREAK_SOUND_DUR: 0.15,
    BLOCK_PLACE_SOUND_FREQ: 300,
    BLOCK_PLACE_SOUND_DUR: 0.1,
    JUMP_SOUND_FREQ: 200,
    JUMP_SOUND_DUR: 0.1,
    EXPLOSION_SOUND_FREQ: 50,
    EXPLOSION_SOUND_DUR: 0.5,
    CRAFT_SOUND_FREQ: 600,
    CRAFT_SOUND_DUR: 0.15,
    SAVE_SOUND_FREQ: 800,
    SAVE_SOUND_DUR: 0.1,

    // ============ INVENTORY ============
    INVENTORY_SLOTS: 36,
    HOTBAR_SLOTS: 9,
    ARMOR_SLOTS: 4,
    MAX_STACK_SIZE: 64,
    MAX_TOOL_STACK: 1,

    // ============ CRAFTING ============
    CRAFTING_GRID_SIZE: 2,

    // ============ SAVE SYSTEM ============
    SAVE_INTERVAL: 120000,
    SAVE_KEY: "minecraft_world_save",
    SAVE_VERSION: "1.0.0",

    // ============ CHAT ============
    MAX_CHAT_MESSAGES: 60,
    CHAT_DISPLAY_COUNT: 8,
    CHAT_FADE_TIME: 200,

    // ============ DEBUG ============
    SHOW_FPS: true,
    SHOW_COORDS: true,
    SHOW_DEBUG_ON_F3: true,

    // ============ HOTBAR DEFAULT BLOCKS ============
    DEFAULT_HOTBAR: [1, 8, 15, 57, 39, 69, 125, 87, 135],
    DEFAULT_HOTBAR_COUNTS: [64, 64, 64, 64, 32, 32, 16, 16, 32],

    // ============ KEYBINDS ============
    KEY_FORWARD: "KeyW",
    KEY_BACKWARD: "KeyS",
    KEY_LEFT: "KeyA",
    KEY_RIGHT: "KeyD",
    KEY_JUMP: "Space",
    KEY_SNEAK: "ShiftLeft",
    KEY_SPRINT: "ControlLeft",
    KEY_FLY: "KeyF",
    KEY_INVENTORY: "KeyE",
    KEY_CHAT: "KeyT",
    KEY_COMMAND: "Slash",
    KEY_DEBUG: "F3",
    KEY_SAVE: "KeyP",
    KEY_LOAD: "KeyL",
    KEY_PAUSE: "Escape",
    KEY_SCREENSHOT: "F2",
    KEY_FULLSCREEN: "F11",
    KEY_DROP: "KeyQ",
    KEY_HOTBAR_1: "Digit1",
    KEY_HOTBAR_2: "Digit2",
    KEY_HOTBAR_3: "Digit3",
    KEY_HOTBAR_4: "Digit4",
    KEY_HOTBAR_5: "Digit5",
    KEY_HOTBAR_6: "Digit6",
    KEY_HOTBAR_7: "Digit7",
    KEY_HOTBAR_8: "Digit8",
    KEY_HOTBAR_9: "Digit9",

    // ============ MOUSE BUTTONS ============
    MOUSE_BREAK: 0,
    MOUSE_PLACE: 2,
    MOUSE_PICK_BLOCK: 1,

    // ============ GRAPHICS ============
    PIXEL_RATIO: 1,
    ANTIALIASING: false,
    SHOW_BLOCK_OUTLINES: true,
    RENDER_TRANSPARENT_BLOCKS: true,
    RENDER_ENTITIES: true,
    RENDER_PARTICLES: true,
    RENDER_WEATHER: true,
    RENDER_HUD: true,
    RENDER_CROSSHAIR: true,

    // ============ GAMEPLAY ============
    DEFAULT_GAMEMODE: "survival",
    ALLOW_FLYING: true,
    KEEP_INVENTORY_ON_DEATH: false,
    DO_DAYLIGHT_CYCLE: true,
    DO_WEATHER_CYCLE: true,
    DO_MOB_SPAWNING: true,
    DO_FALL_DAMAGE: true,
    DO_HUNGER: true,
    DO_BLOCK_DROPS: true,
    DO_TILE_DROPS: true,
    DO_EXPLOSIONS: true,

    // ============ NETWORK (future) ============
    MAX_PLAYERS: 8,
    SERVER_TICK_RATE: 20,
    NETWORK_UPDATE_INTERVAL: 50
};
// Game state (needs to exist before renderer.js loads)
var gameState = {
    started: false,
    locked: false,
    paused: false,
    gameTime: 0,
    tickCount: 0,
    fps: 0,
    fpsFrames: 0,
    fpsLastTime: Date.now(),
    timeOfDay: 6000,
    currentDimension: CONFIG.DIMENSION_OVERWORLD,
    showInventory: false,
    showDebug: false
};
console.log("Config loaded - Seed: " + CONFIG.WORLD_SEED);
console.log("View Distance: " + CONFIG.VIEW_DISTANCE + " chunks");

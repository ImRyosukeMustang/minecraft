// ============================================
// MINECRAFT - AUDIO SYSTEM
// Sound effects, ambient, music
// ============================================

// ============ AUDIO STATE ============
var audioCtx = null;
var masterGain = null;
var musicGain = null;
var sfxGain = null;
var currentMusic = null;
var musicSource = null;

// ============ INIT AUDIO ============
function initAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        // Master volume
        masterGain = audioCtx.createGain();
        masterGain.gain.value = CONFIG.MASTER_VOLUME;
        masterGain.connect(audioCtx.destination);

        // Music channel
        musicGain = audioCtx.createGain();
        musicGain.gain.value = CONFIG.MUSIC_VOLUME;
        musicGain.connect(masterGain);

        // SFX channel
        sfxGain = audioCtx.createGain();
        sfxGain.gain.value = CONFIG.SFX_VOLUME;
        sfxGain.connect(masterGain);

        console.log("Audio system initialized");
    } catch (e) {
        audioCtx = null;
        console.log("Audio not available");
    }
}

// ============ RESUME AUDIO (for browser autoplay policy) ============
function resumeAudio() {
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

// ============ PLAY SOUND ============
function playSound(freq, dur, type, vol, pan) {
    if (!audioCtx) return;
    if (!type) type = "square";
    if (!vol) vol = 1;
    if (!pan) pan = 0;

    try {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        var panner = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

        osc.type = type;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.3 * vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

        if (panner) {
            panner.pan.value = pan;
            osc.connect(panner);
            panner.connect(gain);
        } else {
            osc.connect(gain);
        }

        gain.connect(sfxGain);

        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + dur);

        // Cleanup
        setTimeout(function () {
            osc.disconnect();
            gain.disconnect();
            if (panner) panner.disconnect();
        }, (dur + 0.1) * 1000);

    } catch (e) {
        // Silently fail
    }
}

// ============ PLAY NOISE ============
function playNoise(dur, vol, pan) {
    if (!audioCtx) return;

    try {
        var bufferSize = audioCtx.sampleRate * dur;
        var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        var data = buffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (vol || 0.3);
        }

        var source = audioCtx.createBufferSource();
        source.buffer = buffer;

        var gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3 * (vol || 1), audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

        source.connect(gain);
        gain.connect(sfxGain);

        source.start(audioCtx.currentTime);
        source.stop(audioCtx.currentTime + dur);
    } catch (e) {}
}

// ============ SOUND EFFECTS ============

// Block sounds
function sfxBlockBreak(blockId) {
    var freq = 150;
    var dur = CONFIG.BLOCK_BREAK_SOUND_DUR;
    playSound(freq, dur, "sawtooth", 0.8);
    setTimeout(function () { playSound(freq * 0.7, dur, "sawtooth", 0.4); }, 50);
}

function sfxBlockPlace(blockId) {
    var freq = 300;
    playSound(freq, CONFIG.BLOCK_PLACE_SOUND_DUR, "square", 0.6);
}

function sfxBlockStep(blockId) {
    var def = getBlockDef(blockId);
    var baseFreq = 100;

    if (def && def.color) {
        // Different sounds based on block type
        if (blockId === BLOCKS.GRASS_BLOCK || blockId === BLOCKS.DIRT) baseFreq = 80;
        if (blockId === BLOCKS.STONE || blockId === BLOCKS.COBBLESTONE) baseFreq = 120;
        if (blockId === BLOCKS.SAND || blockId === BLOCKS.GRAVEL) baseFreq = 60;
        if (blockId === BLOCKS.OAK_PLANKS || blockId === BLOCKS.OAK_LOG) baseFreq = 100;
    }

    playSound(baseFreq, 0.05, "square", 0.15);
}

// Player sounds
function sfxPlayerHurt() {
    playSound(300, 0.3, "sawtooth", 0.8);
}

function sfxPlayerDeath() {
    playSound(100, 0.5, "sawtooth", 1);
}

function sfxJump() {
    playSound(CONFIG.JUMP_SOUND_FREQ, CONFIG.JUMP_SOUND_DUR, "square", 0.3);
}

function sfxSplash() {
    playNoise(0.3, 0.5);
    playSound(400, 0.2, "triangle", 0.4);
}

function sfxSwim() {
    if (gameState.tickCount % 20 === 0) {
        playSound(200, 0.1, "triangle", 0.2);
    }
}

// Mob sounds
function sfxMobHurt(type) {
    var freq = 200;
    if (type === "ZOMBIE") freq = 100;
    if (type === "SKELETON") freq = 150;
    if (type === "CREEPER") freq = 80;
    if (type === "SPIDER") freq = 250;
    playSound(freq, 0.2, "sawtooth", 0.6);
}

function sfxMobDeath(type) {
    var freq = 80;
    playSound(freq, 0.4, "sawtooth", 0.7);
    setTimeout(function () { playSound(freq * 0.5, 0.3, "square", 0.4); }, 100);
}

function sfxExplosion() {
    playNoise(0.5, 1);
    playSound(CONFIG.EXPLOSION_SOUND_FREQ, CONFIG.EXPLOSION_SOUND_DUR, "sawtooth", 1);
    setTimeout(function () { playSound(30, 0.3, "square", 0.6); }, 200);
}

// UI sounds
function sfxClick() {
    playSound(600, 0.1, "sine", 0.3);
}

function sfxInventoryOpen() {
    playSound(500, 0.15, "square", 0.3);
}

function sfxInventoryClose() {
    playSound(400, 0.15, "square", 0.3);
}

function sfxCraft() {
    playSound(CONFIG.CRAFT_SOUND_FREQ, CONFIG.CRAFT_SOUND_DUR, "sine", 0.5);
}

function sfxPickup() {
    playSound(700, 0.08, "sine", 0.3);
    setTimeout(function () { playSound(900, 0.08, "sine", 0.3); }, 50);
}

function sfxLevelUp() {
    playSound(800, 0.2, "sine", 0.6);
    setTimeout(function () { playSound(1000, 0.15, "sine", 0.5); }, 100);
    setTimeout(function () { playSound(1200, 0.1, "sine", 0.4); }, 200);
}

// Ambient sounds
function sfxAmbientCave() {
    if (player.y < 40 && !player.inWater && randomChance(0.0003)) {
        playSound(60, 2, "sine", 0.1);
    }
}

function sfxAmbientNether() {
    if (currentDimension === CONFIG.DIMENSION_NETHER && randomChance(0.001)) {
        playNoise(1, 0.2);
    }
}

function sfxThunder() {
    playNoise(0.8, 0.8);
    playSound(30, 0.6, "sawtooth", 0.9);
    setTimeout(function () { playSound(20, 0.4, "square", 0.5); }, 300);
}

// ============ MUSIC SYSTEM ============
var musicTracks = {
    calm1: { freq: 130.81, dur: 60, type: "sine" },
    calm2: { freq: 196.00, dur: 60, type: "triangle" },
    calm3: { freq: 261.63, dur: 60, type: "sine" },
    creative1: { freq: 164.81, dur: 60, type: "sine" },
    creative2: { freq: 220.00, dur: 60, type: "triangle" },
    nether1: { freq: 98.00, dur: 60, type: "sawtooth" },
    end1: { freq: 146.83, dur: 60, type: "sine" }
};

function playMusic(trackName) {
    if (!audioCtx || !musicGain) return;

    var track = musicTracks[trackName];
    if (!track) return;

    // Stop current music
    stopMusic();

    try {
        var osc = audioCtx.createOscillator();
        osc.type = track.type;
        osc.frequency.value = track.freq;

        var gain = audioCtx.createGain();
        gain.gain.value = 0.1;

        osc.connect(gain);
        gain.connect(musicGain);

        osc.start(audioCtx.currentTime);

        musicSource = osc;
        currentMusic = trackName;

        // Auto-stop
        setTimeout(function () {
            if (currentMusic === trackName) stopMusic();
        }, track.dur * 1000);
    } catch (e) {}
}

function stopMusic() {
    if (musicSource) {
        try {
            musicSource.stop();
            musicSource.disconnect();
        } catch (e) {}
        musicSource = null;
        currentMusic = null;
    }
}

// ============ AMBIENT MUSIC LOOP ============
function updateAmbientMusic() {
    if (!audioCtx || !musicGain) return;

    // Don't play music if already playing
    if (currentMusic) return;

    // Different music per dimension
    var dim = currentDimension;
    var chance = 0.0001;

    if (randomChance(chance)) {
        if (dim === CONFIG.DIMENSION_NETHER) {
            playMusic("nether1");
        } else if (dim === CONFIG.DIMENSION_END) {
            playMusic("end1");
        } else if (player.gameMode === "creative") {
            playMusic(randomPick(["creative1", "creative2"]));
        } else {
            playMusic(randomPick(["calm1", "calm2", "calm3"]));
        }
    }
}

// ============ VOLUME CONTROL ============
function setMasterVolume(vol) {
    CONFIG.MASTER_VOLUME = clamp(vol, 0, 1);
    if (masterGain) masterGain.gain.value = CONFIG.MASTER_VOLUME;
}

function setMusicVolume(vol) {
    CONFIG.MUSIC_VOLUME = clamp(vol, 0, 1);
    if (musicGain) musicGain.gain.value = CONFIG.MUSIC_VOLUME;
}

function setSfxVolume(vol) {
    CONFIG.SFX_VOLUME = clamp(vol, 0, 1);
    if (sfxGain) sfxGain.gain.value = CONFIG.SFX_VOLUME;
}

// ============ INIT ============
// Audio context must be created after user interaction (browser policy)
// initAudio() is called on first click from main.js

console.log("Audio system ready (waiting for user interaction)");

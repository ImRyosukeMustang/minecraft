// ============================================
// MINECRAFT - WEATHER SYSTEM
// Rain, thunder, snow, weather cycle
// ============================================

// ============ WEATHER STATE ============
var weather = {
    type: "clear",        // clear, rain, thunder, snow
    duration: 0,
    intensity: 0,
    transitioning: false,
    transitionProgress: 0
};

var raindrops = [];
var snowflakes = [];
var cloudOpacity = 0;

// ============ UPDATE WEATHER ============
function updateWeather() {
    if (!CONFIG.DO_WEATHER_CYCLE) return;

    // Duration countdown
    if (weather.duration > 0) {
        weather.duration--;
    } else if (weather.type !== "clear") {
        // Transition back to clear
        weather.type = "clear";
        weather.duration = randomInt(CONFIG.WEATHER_CLEAR_DURATION_MIN, CONFIG.WEATHER_CLEAR_DURATION_MAX);
        weather.intensity = 0;
        raindrops = [];
        snowflakes = [];
        addChat("Weather cleared up");
    }

    // Random weather change
    if (weather.type === "clear" && randomChance(CONFIG.WEATHER_CHANGE_CHANCE)) {
        if (randomChance(CONFIG.WEATHER_THUNDER_CHANCE)) {
            weather.type = "thunder";
            weather.duration = randomInt(CONFIG.WEATHER_RAIN_DURATION_MIN, CONFIG.WEATHER_RAIN_DURATION_MAX);
            addChat("Thunderstorm approaching...");
        } else {
            weather.type = "rain";
            weather.duration = randomInt(CONFIG.WEATHER_RAIN_DURATION_MIN, CONFIG.WEATHER_RAIN_DURATION_MAX);
            addChat("It's starting to rain...");
        }
        weather.intensity = 0.3;
    }

    // Intensity ramp up/down
    if (weather.type !== "clear" && weather.intensity < 1 && weather.duration > 100) {
        weather.intensity = Math.min(1, weather.intensity + 0.01);
    } else if (weather.duration < 100 && weather.intensity > 0) {
        weather.intensity = Math.max(0, weather.intensity - 0.02);
    }

    // Cloud opacity
    if (weather.type !== "clear") {
        cloudOpacity = Math.min(0.6, cloudOpacity + 0.005);
    } else {
        cloudOpacity = Math.max(0, cloudOpacity - 0.002);
    }

    // Spawn rain/snow particles
    if (weather.type === "rain" || weather.type === "thunder") {
        spawnRaindrops();
    }

    if (weather.type === "thunder" && randomChance(0.001)) {
        triggerLightning();
    }
}

// ============ SPAWN RAINDROPS ============
function spawnRaindrops() {
    var maxDrops = Math.floor(CONFIG.MAX_RAINDROPS * weather.intensity);
    var spread = 20;

    while (raindrops.length < maxDrops) {
        raindrops.push({
            x: player.x + randomFloat(-spread, spread),
            y: player.y + randomFloat(5, 20),
            z: player.z + randomFloat(-spread, spread),
            speed: randomFloat(CONFIG.RAINDROP_SPEED_MIN, CONFIG.RAINDROP_SPEED_MAX),
            life: 1,
            length: randomFloat(8, 14)
        });
    }
}

// ============ UPDATE RAINDROPS ============
function updateRaindrops() {
    for (var i = raindrops.length - 1; i >= 0; i--) {
        var r = raindrops[i];
        r.y -= r.speed;

        // Hit ground
        var groundY = getTerrainHeight(Math.floor(r.x), Math.floor(r.z));
        if (r.y <= groundY) {
            // Splash effect
            if (randomChance(0.1)) {
                spawnRainSplash(r.x, groundY + 0.1, r.z);
            }
            raindrops.splice(i, 1);
            continue;
        }

        // Out of range
        var dist = distance3D(r.x, r.y, r.z, player.x, player.y, player.z);
        if (dist > 30 || r.y < 0) {
            raindrops.splice(i, 1);
        }
    }
}

// ============ UPDATE SNOWFLAKES ============
function updateSnowflakes() {
    for (var i = snowflakes.length - 1; i >= 0; i--) {
        var s = snowflakes[i];
        s.y -= s.speed;
        s.x += Math.sin(gameState.gameTime * 0.01 + s.x) * 0.02;
        s.z += Math.cos(gameState.gameTime * 0.01 + s.z) * 0.02;

        var groundY = getTerrainHeight(Math.floor(s.x), Math.floor(s.z));
        if (s.y <= groundY) {
            snowflakes.splice(i, 1);
            continue;
        }

        var dist = distance3D(s.x, s.y, s.z, player.x, player.y, player.z);
        if (dist > 30 || s.y < 0) {
            snowflakes.splice(i, 1);
        }
    }
}

// ============ LIGHTNING ============
function triggerLightning() {
    var lx = player.x + randomFloat(-25, 25);
    var lz = player.z + randomFloat(-25, 25);
    var ly = getTerrainHeight(Math.floor(lx), Math.floor(lz));

    // Flash effect
    var flashDuration = 5;

    // Damage nearby entities
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        var dist = distance3D(e.x, e.y, e.z, lx, ly, lz);
        if (dist < 3 && !e.dead) {
            damageEntity(e, 5, "lightning");
            e.fireTicks = 80;
        }
    }

    // Damage player
    var pdist = distance3D(player.x, player.y, player.z, lx, ly, lz);
    if (pdist < 3) {
        damagePlayer(5, "lightning");
    }

    // Set fire
    if (getBlock(Math.floor(lx), Math.floor(ly), Math.floor(lz)) === BLOCKS.AIR) {
        setBlock(Math.floor(lx), Math.floor(ly), Math.floor(lz), 157); // Fire
    }

    spawnParticles(lx, ly, lz, "#ffffff", 20, "sparkle");
    playSound(30, 0.5, "sawtooth");
    addChat("*Thunder roars*");
}

// ============ RENDER WEATHER ============
function renderWeather() {
    if (weather.type === "clear") return;

    // Update particles
    if (weather.type === "rain" || weather.type === "thunder") {
        updateRaindrops();
    } else if (weather.type === "snow") {
        updateSnowflakes();
    }

    // Render cloud overlay
    if (cloudOpacity > 0) {
        ctx.fillStyle = "rgba(60,60,70," + (cloudOpacity * 0.4) + ")";
        ctx.fillRect(0, 0, W, H);
    }

    var cosY = Math.cos(player.yaw), sinY = Math.sin(player.yaw);
    var fov = CONFIG.FOV;

    // Render rain
    if (weather.type === "rain" || weather.type === "thunder") {
        ctx.strokeStyle = "rgba(174,194,208," + (0.4 * weather.intensity) + ")";
        ctx.lineWidth = 1;

        for (var i = 0; i < raindrops.length; i++) {
            var r = raindrops[i];
            var rdx = r.x - player.x;
            var rdy = r.y - (player.y + player.eyeHeight);
            var rdz = r.z - player.z;

            var rrx = rdx * cosY - rdz * sinY;
            var rrz = rdx * sinY + rdz * cosY;

            if (rrz <= 0.1) continue;

            var rscale = H / (rrz * Math.tan(fov / 2));
            var rsx = W / 2 + rrx * rscale;
            var rsy = H / 2 - rdy * rscale;

            ctx.beginPath();
            ctx.moveTo(rsx, rsy);
            ctx.lineTo(rsx - 1, rsy + r.length);
            ctx.stroke();
        }
    }

    // Render snowflakes
    if (weather.type === "snow") {
        ctx.fillStyle = "rgba(255,255,255," + (0.6 * weather.intensity) + ")";

        for (var j = 0; j < snowflakes.length; j++) {
            var s = snowflakes[j];
            var sdx = s.x - player.x;
            var sdy = s.y - (player.y + player.eyeHeight);
            var sdz = s.z - player.z;

            var srx = sdx * cosY - sdz * sinY;
            var srz = sdx * sinY + sdz * cosY;

            if (srz <= 0.1) continue;

            var sscale = H / (srz * Math.tan(fov / 2));
            var ssx = W / 2 + srx * sscale;
            var ssy = H / 2 - sdy * sscale;
            var ssize = sscale * 0.02;

            ctx.fillRect(ssx - ssize / 2, ssy - ssize / 2, ssize, ssize);
        }
    }

    // Lightning flash
    if (weather.type === "thunder" && randomChance(0.0005)) {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(0, 0, W, H);
    }
}

// ============ SET WEATHER ============
function setWeather(type, duration) {
    weather.type = type;
    weather.duration = duration || randomInt(CONFIG.WEATHER_RAIN_DURATION_MIN, CONFIG.WEATHER_RAIN_DURATION_MAX);
    weather.intensity = type !== "clear" ? 0.3 : 0;
    raindrops = [];
    snowflakes = [];
    addChat("Weather set to: " + type);
}

console.log("Weather system loaded");

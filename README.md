# 🎮 Minecraft - Browser Edition

A fully playable Minecraft-style voxel engine running entirely in the browser using HTML5 Canvas and JavaScript. Features 245 block types, 22 mobs, 3 dimensions, crafting, weather, and more.

---

## 🎯 Play Now

**[▶️ Play Minecraft Browser Edition](https://yourusername.github.io/Minecraft/)**

> Just open `index.html` in any modern browser — no installation, no downloads, no server required!

---

## 📸 Features

### 🌍 World
- **245 Block Types** — All your favorite Minecraft blocks with accurate colors
- **3 Dimensions** — Overworld, Nether, and The End
- **11 Biomes** — Plains, Desert, Forest, Taiga, Swamp, Savanna, Mountains, Ocean, Beach, Mushroom Island, and Hell
- **Infinite Terrain** — Procedurally generated with seeded RNG (same seed = same world)
- **Caves** — 3D noise-based underground cave systems
- **Ores** — Coal, Iron, Gold, Diamond, Emerald, Redstone, Lapis Lazuli, Nether Quartz
- **Trees** — 6 wood types (Oak, Spruce, Birch, Jungle, Acacia, Dark Oak) with proper leaf canopies
- **Day/Night Cycle** — 24,000 tick cycle with smooth sky color transitions
- **Weather** — Rain, thunder with lightning strikes, snow in cold biomes

### 👤 Player
- **Health & Hunger** — Full survival mechanics with regeneration and starvation
- **Armor System** — Leather, Iron, Diamond with toughness calculation
- **Experience & Leveling** — Gain XP from mining and killing mobs
- **36-Slot Inventory** — Plus 9 hotbar slots, 4 armor slots, and offhand
- **Movement** — Walk, sprint, sneak, swim, and fly
- **Fall Damage** — Realistic fall damage calculation
- **Potion Effects** — Speed, slowness, regeneration, poison, absorption

### 🛠️ Crafting & Items
- **50+ Crafting Recipes** — Tools, weapons, armor, food, building blocks
- **Tool Tiers** — Wood, Stone, Iron, Diamond (each with unique speed/durability)
- **2×2 Crafting Grid** — Craft basic items anywhere
- **Block Drops** — Proper drop tables for all ores and blocks

### 👹 Mobs (22 Types)
- **Passive** — Pig, Cow, Sheep, Chicken, Rabbit, Horse, Squid, Bat
- **Neutral** — Wolf, Spider (hostile at night), Enderman
- **Hostile** — Zombie, Skeleton, Creeper, Slime, Witch
- **Nether** — Zombie Pigman, Ghast, Blaze, Wither Skeleton, Magma Cube
- **End** — Endermite, Shulker
- **Bosses** — Ender Dragon, Wither
- **AI** — Hostile mobs track and attack, creepers explode, skeletons shoot
- **Drops** — Each mob drops appropriate loot and XP

### 🎨 Visuals
- **First-Person 3D Rendering** — Software-rendered voxel engine
- **Dynamic Sky** — Colors change with time and dimension
- **Face Culling** — Only exposed block faces are rendered
- **Lighting** — Blocks darken at night and in the Nether
- **Rain & Snow** — Weather particles with biome detection
- **Particles** — Block break, place, explosion, crit, bubble effects
- **HUD** — Health bar, hunger bar, armor bar, XP bar, crosshair
- **Debug Screen** — Full F3 overlay with all game stats

### 🎮 Commands (26 Total)
| Command | Description |
|---------|-------------|
| `/help` | Show all commands |
| `/fly` | Toggle flying mode |
| `/time` | Show current time |
| `/day` `/night` | Set time |
| `/spawn` | Teleport to spawn |
| `/tp x y z` | Teleport to coordinates |
| `/heal` `/feed` | Restore health/hunger |
| `/seed` | Show world seed |
| `/save` `/load` | Save/Load world |
| `/weather` | Set weather |
| `/gamemode` | Change game mode |
| `/give` | Give blocks/items |
| `/summon` | Spawn any mob |
| `/killall` | Remove all entities |
| `/where` `/biome` | Show position |
| `/xp` `/enchant` | XP and effects |
| `/speed` `/view` | Adjust settings |

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| `W A S D` | Move |
| `Mouse` | Look around |
| `Left Click` | Break block / Attack |
| `Right Click` | Place block / Use item |
| `Space` | Jump / Fly up |
| `Shift` | Sneak / Fly down |
| `Ctrl` | Sprint |
| `F` | Toggle flying |
| `E` | Open/Close inventory |
| `1-9` | Select hotbar slot |
| `Q` | Drop item |
| `/` | Open chat/commands |
| `F3` | Toggle debug screen |
| `Esc` | Pause menu |
| `P` | Save world |
| `L` | Load world |

---

## 🚀 Quick Start

### Option 1: Direct Play
1. Download or clone this repository
2. Open `index.html` in Chrome, Firefox, or Edge
3. Click the screen to start playing!

### Option 2: GitHub Pages
1. Fork this repository
2. Go to **Settings > Pages**
3. Set source to `main` branch
4. Your game will be live at `https://yourusername.github.io/Minecraft/`

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Then open http://localhost:8000

# Hockey vs Soccer - Tower Defense Game (V3)

A modern, production-quality tower defense game built with Three.js, featuring Hockey and Soccer themed gameplay across multiple maps.

## 🎮 Play the Game

**Production:** https://SeanCFAFinlay.github.io/hockey-vs-soccer-v3/

**Original Version:** [HOCKEYVSOCCERV3.html](./HOCKEYVSOCCERV3.html) (legacy monolithic version)

---

## ✨ Features

- **Dual Themes**: Choose between Hockey Arena or Soccer Stadium
- **20 Maps**: 10 maps per theme with increasing difficulty
- **16 Unique Towers**: 8 specialized towers per theme with upgrade paths
- **14 Enemy Types**: Various enemies with special abilities (flying, armored, fire, bosses)
- **Star Rating System**: Earn 1-5 stars based on performance
- **Persistent Progress**: Save system tracks unlocked maps and stars
- **Adaptive Performance**: Auto-adjusts graphics quality for smooth 60fps
- **Mobile Optimized**: Touch controls and responsive design

---

## 🏗️ Architecture (V3)

This version has been completely refactored into a modular, production-ready codebase:

### Project Structure

```
hockey-vs-soccer-v3/
├── src/
│   ├── core/              # Core engine systems
│   │   ├── engine.js          # Three.js initialization
│   │   ├── qualityManager.js  # FPS monitoring & adaptive quality
│   │   └── saveManager.js     # localStorage persistence
│   ├── game/              # Game logic
│   │   ├── config.js          # Towers, enemies, maps, themes
│   │   ├── gameController.js  # Main game orchestration
│   │   ├── gameState.js       # State management
│   │   ├── terrain.js         # Grid & terrain generation
│   │   └── (towers.js, enemies.js, projectiles.js - TODO)
│   ├── graphics/          # Visual effects
│   │   ├── postprocessing.js  # Bloom, SMAA passes
│   │   └── effects.js         # Particles, flashes, shockwaves
│   ├── ui/                # User interface
│   │   └── uiManager.js       # Screen management, HUD
│   ├── utils/             # Helper functions
│   │   └── gameUtils.js       # Wave gen, pathfinding, etc.
│   └── main.js            # Application entry point
├── index.html             # Modern entry point
├── HOCKEYVSOCCERV3.html   # Legacy monolithic version
├── vite.config.js         # Build configuration
└── package.json           # Dependencies
```

### Tech Stack

- **Engine**: Three.js v0.160 (ES modules)
- **Build**: Vite v5
- **Postprocessing**: EffectComposer, UnrealBloomPass, SMAAPass
- **Animations**: GSAP v3.12 (for UI transitions)
- **State**: localStorage (IndexedDB-ready architecture)

---

## 🚀 Development

### Prerequisites

- Node.js 16+ and npm

### Setup

```bash
# Clone repository
git clone https://github.com/SeanCFAFinlay/hockey-vs-soccer-v3.git
cd hockey-vs-soccer-v3

# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server

The dev server runs at `http://localhost:3000/hockey-vs-soccer-v3/` with hot module replacement.

---

## 🎯 Game Mechanics

### Towers

Each theme has 8 unique towers with 4 upgrade levels:

**Hockey Towers:**
- Slap Shot - Fast basic tower
- Sniper - Long range, high damage
- Enforcer - Splash damage
- Ice Spray - Slows enemies
- Goalie - Close range powerhouse
- Power Play - Chain lightning
- Hot Stick - Burn damage over time
- Captain - Critical hit specialist

**Soccer Towers:**
- Striker - Fast basic tower
- Free Kick - Long range, high damage
- Header - Splash damage
- Tackle - Slows enemies
- Keeper - Close range powerhouse
- Playmaker - Chain lightning
- Flare - Burn damage over time
- Legend - Critical hit specialist

### Enemies

7 enemy types per theme with scaling HP:
- Basic units (fast, low HP)
- Fire variants (special visual)
- Flying units (different pathing)
- Armored units (damage reduction)
- Inferno units (fire + armor)
- Flying fire (flying + fire)
- Bosses (high HP, every 5 waves)

### Progression

- **Map Unlocking**: Complete maps to unlock the next
- **Star Ratings**: 
  - 5 stars = Perfect (no lives lost)
  - 3 stars = Strong (70%+ lives remaining)
  - 1 star = Victory (any lives remaining)
- **Save System**: Auto-saves progress after each game

---

## 📱 Performance

### Optimization Features

- **Adaptive Quality**: Auto-adjusts graphics based on FPS
  - High: 60+ FPS - Full effects
  - Medium: 45-60 FPS - Reduced particles
  - Low: <45 FPS - Minimal effects
- **Pixel Ratio Cap**: Max 2x for mobile performance
- **Shadow Optimization**: Adaptive shadow map sizes
- **Postprocessing Toggle**: Can disable effects for low-end devices

### Quality Settings

Users can manually select:
- **Auto**: Adaptive quality (recommended)
- **High**: Full effects (desktop)
- **Medium**: Balanced (modern mobile)
- **Low**: Performance mode (older devices)

---

## 🔧 Configuration

Game balance can be adjusted in `src/game/config.js`:

```javascript
// Tower stats: [level 0, level 1, level 2, level 3]
damage: [25, 40, 60, 90]
range: [2.8, 3.2, 3.6, 4.1]
fireRate: [1.2, 1.4, 1.7, 2.0]

// Enemy scaling
HP_SCALE_PER_WAVE: 0.12  // 12% HP increase per wave

// Progression
SELL_VALUE_MULTIPLIER: 0.6  // 60% refund on sell
```

---

## 🎨 Themes

### Hockey Theme
- **Colors**: Ice blue (#00d4ff), white rink
- **Environment**: Indoor arena lighting
- **Details**: Boards, goal circles, center line

### Soccer Theme
- **Colors**: Grass green (#22c55e), striped pitch
- **Environment**: Outdoor stadium lighting
- **Details**: Penalty boxes, center circle, goal areas

---

## 📝 Save Data Schema

```json
{
  "version": 1,
  "settings": {
    "graphics": "auto",
    "sound": true
  },
  "progress": {
    "hockey": {
      "unlockedMaps": 1,
      "stars": { "map1": 5, "map2": 3 },
      "lastPlayed": "map2"
    },
    "soccer": {
      "unlockedMaps": 1,
      "stars": {},
      "lastPlayed": null
    }
  },
  "meta": {
    "totalWins": 5,
    "totalGames": 8,
    "currency": 0,
    "lastTheme": "hockey",
    "lastMap": "map2"
  }
}
```

---

## 🧪 Testing

```bash
# Run production build
npm run build

# Verify output
ls -lh dist/

# Test in browser
npm run preview
```

### Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (iOS/macOS)
- ✅ Edge 90+

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

- **Three.js** - 3D rendering engine
- **Vite** - Build tooling
- **GSAP** - Animation library

---

## 🔜 Roadmap

Current status: **Core architecture complete**

Remaining work:
- [ ] Implement tower entity system (placement, targeting, firing)
- [ ] Implement enemy entity system (spawning, pathfinding)
- [ ] Implement projectile entity system (physics, collision)
- [ ] Create 3D models for towers and enemies
- [ ] Add tower selection UI and upgrade panel
- [ ] Implement victory/defeat modals with animations
- [ ] Add sound effects and background music
- [ ] Mobile testing (Safari, Chrome)

---

**Version**: 3.0.0  
**Status**: In Development (Architecture Complete)  
**Last Updated**: February 2026

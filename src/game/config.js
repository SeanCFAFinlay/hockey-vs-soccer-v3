/**
 * Game Configuration
 * Tower, enemy, and map definitions
 */

// Tower definitions for Hockey theme
export const HOCKEY_TOWERS = [
  {
    id: 't1', name: 'Slap Shot', icon: '🏒', cost: 80, color: '#00d4ff',
    damage: [25, 40, 60, 90],
    range: [2.8, 3.2, 3.6, 4.1],
    fireRate: [1.2, 1.4, 1.7, 2.0],
    upgradeCosts: [60, 100, 170],
    projectile: 'puck'
  },
  {
    id: 't2', name: 'Sniper', icon: '🎯', cost: 150, color: '#ef4444',
    damage: [70, 110, 165, 250],
    range: [4.5, 5.0, 5.6, 6.2],
    fireRate: [0.5, 0.6, 0.72, 0.85],
    upgradeCosts: [110, 190, 320],
    projectile: 'dart'
  },
  {
    id: 't3', name: 'Enforcer', icon: '👊', cost: 120, color: '#f97316',
    damage: [45, 70, 105, 160],
    range: [2.5, 2.9, 3.3, 3.8],
    fireRate: [0.55, 0.65, 0.78, 0.92],
    upgradeCosts: [90, 155, 260],
    splash: [1.2, 1.5, 1.8, 2.2],
    projectile: 'hammer'
  },
  {
    id: 't4', name: 'Ice Spray', icon: '❄️', cost: 90, color: '#38bdf8',
    damage: [18, 28, 42, 60],
    range: [3.0, 3.4, 3.8, 4.3],
    fireRate: [1.3, 1.55, 1.8, 2.1],
    upgradeCosts: [65, 115, 190],
    slowPower: 0.5,
    slowDuration: [2, 2.5, 3.2, 4],
    projectile: 'shard'
  },
  {
    id: 't5', name: 'Goalie', icon: '🥅', cost: 200, color: '#ffd700',
    damage: [100, 155, 230, 350],
    range: [2.0, 2.4, 2.8, 3.2],
    fireRate: [0.7, 0.85, 1.0, 1.2],
    upgradeCosts: [140, 250, 420],
    projectile: 'glove'
  },
  {
    id: 't6', name: 'Power Play', icon: '⚡', cost: 160, color: '#a855f7',
    damage: [35, 55, 82, 125],
    range: [3.5, 4.0, 4.5, 5.1],
    fireRate: [0.85, 1.0, 1.15, 1.35],
    upgradeCosts: [120, 200, 340],
    chainTargets: [2, 3, 4, 6],
    chainRange: 2.2,
    projectile: 'lightning'
  },
  {
    id: 't7', name: 'Hot Stick', icon: '🔥', cost: 140, color: '#f97316',
    damage: [15, 24, 36, 52],
    range: [2.6, 3.0, 3.4, 3.9],
    fireRate: [3.5, 4.2, 5.0, 6.0],
    upgradeCosts: [100, 175, 290],
    burnDamage: [10, 16, 24, 35],
    burnDuration: 3,
    projectile: 'fireball'
  },
  {
    id: 't8', name: 'Captain', icon: '👑', cost: 280, color: '#fbbf24',
    damage: [200, 320, 480, 720],
    range: [5.5, 6.1, 6.8, 7.5],
    fireRate: [0.2, 0.26, 0.33, 0.42],
    upgradeCosts: [200, 360, 600],
    critChance: 0.4,
    projectile: 'star'
  }
];

// Tower definitions for Soccer theme
export const SOCCER_TOWERS = [
  {
    id: 't1', name: 'Striker', icon: '⚽', cost: 80, color: '#22c55e',
    damage: [28, 44, 66, 100],
    range: [2.6, 3.0, 3.4, 3.9],
    fireRate: [1.15, 1.35, 1.6, 1.9],
    upgradeCosts: [60, 100, 170],
    projectile: 'ball'
  },
  {
    id: 't2', name: 'Free Kick', icon: '🎯', cost: 150, color: '#fbbf24',
    damage: [75, 118, 175, 265],
    range: [4.8, 5.3, 5.9, 6.5],
    fireRate: [0.48, 0.58, 0.7, 0.84],
    upgradeCosts: [110, 190, 320],
    projectile: 'curveBall'
  },
  {
    id: 't3', name: 'Header', icon: '🤕', cost: 120, color: '#3b82f6',
    damage: [50, 78, 118, 178],
    range: [2.8, 3.2, 3.6, 4.1],
    fireRate: [0.5, 0.6, 0.72, 0.86],
    upgradeCosts: [90, 155, 260],
    splash: [1.3, 1.6, 2.0, 2.4],
    projectile: 'headButt'
  },
  {
    id: 't4', name: 'Tackle', icon: '🦶', cost: 90, color: '#f97316',
    damage: [20, 32, 48, 70],
    range: [2.8, 3.2, 3.6, 4.1],
    fireRate: [1.25, 1.48, 1.72, 2.0],
    upgradeCosts: [65, 115, 190],
    slowPower: 0.5,
    slowDuration: [1.8, 2.4, 3.0, 3.8],
    projectile: 'tackle'
  },
  {
    id: 't5', name: 'Keeper', icon: '🧤', cost: 200, color: '#a855f7',
    damage: [110, 170, 255, 385],
    range: [1.8, 2.2, 2.6, 3.0],
    fireRate: [0.75, 0.9, 1.05, 1.25],
    upgradeCosts: [140, 250, 420],
    projectile: 'glove'
  },
  {
    id: 't6', name: 'Playmaker', icon: '🔄', cost: 160, color: '#06b6d4',
    damage: [38, 60, 90, 135],
    range: [3.8, 4.3, 4.9, 5.5],
    fireRate: [0.82, 0.96, 1.12, 1.3],
    upgradeCosts: [120, 200, 340],
    chainTargets: [2, 3, 5, 7],
    chainRange: 2.5,
    projectile: 'chain'
  },
  {
    id: 't7', name: 'Flare', icon: '🔥', cost: 140, color: '#ef4444',
    damage: [16, 26, 40, 58],
    range: [2.4, 2.8, 3.2, 3.7],
    fireRate: [3.2, 3.9, 4.7, 5.6],
    upgradeCosts: [100, 175, 290],
    burnDamage: [12, 18, 28, 40],
    burnDuration: 3.5,
    projectile: 'flare'
  },
  {
    id: 't8', name: 'Legend', icon: '👑', cost: 280, color: '#fbbf24',
    damage: [220, 350, 525, 790],
    range: [5.2, 5.8, 6.5, 7.2],
    fireRate: [0.18, 0.24, 0.31, 0.4],
    upgradeCosts: [200, 360, 600],
    critChance: 0.45,
    projectile: 'legend'
  }
];

// Enemy definitions for Hockey theme
export const HOCKEY_ENEMIES = [
  { id: 'e1', name: 'Puck', hp: 50, speed: 2.4, reward: 10, size: 1.0 },
  { id: 'e2', name: 'Hot Puck', hp: 70, speed: 2.0, reward: 15, fire: true, size: 1.0 },
  { id: 'e3', name: 'Flying Puck', hp: 45, speed: 2.8, reward: 12, flying: true, size: 0.9 },
  { id: 'e4', name: 'Heavy Puck', hp: 250, speed: 0.7, reward: 35, armor: 0.4, size: 1.4 },
  { id: 'e5', name: 'Inferno Puck', hp: 400, speed: 0.55, reward: 55, fire: true, armor: 0.3, size: 1.5 },
  { id: 'e6', name: 'Flying Fire', hp: 120, speed: 2.2, reward: 25, flying: true, fire: true, size: 1.0 },
  { id: 'e7', name: 'Boss Puck', hp: 2500, speed: 0.35, reward: 350, armor: 0.35, boss: true, size: 2.2 }
];

// Enemy definitions for Soccer theme
export const SOCCER_ENEMIES = [
  { id: 'e1', name: 'Ball', hp: 45, speed: 2.5, reward: 10, size: 1.0 },
  { id: 'e2', name: 'Fire Ball', hp: 65, speed: 2.1, reward: 15, fire: true, size: 1.0 },
  { id: 'e3', name: 'Flying Ball', hp: 40, speed: 3.0, reward: 12, flying: true, size: 0.9 },
  { id: 'e4', name: 'Heavy Ball', hp: 280, speed: 0.65, reward: 35, armor: 0.45, size: 1.4 },
  { id: 'e5', name: 'Inferno Ball', hp: 450, speed: 0.5, reward: 55, fire: true, armor: 0.35, size: 1.5 },
  { id: 'e6', name: 'Flying Fire', hp: 130, speed: 2.3, reward: 25, flying: true, fire: true, size: 1.0 },
  { id: 'e7', name: 'Boss Ball', hp: 2800, speed: 0.32, reward: 400, armor: 0.38, boss: true, size: 2.2 }
];

// Map definitions for Hockey theme
export const HOCKEY_MAPS = [
  { id: 'map1', name: 'Practice Rink', cols: 18, rows: 11, waves: 15, startMoney: 650, lives: 20, difficulty: 1 },
  { id: 'map2', name: 'Local Arena', cols: 20, rows: 12, waves: 20, startMoney: 700, lives: 18, difficulty: 2 },
  { id: 'map3', name: 'College Ice', cols: 22, rows: 13, waves: 25, startMoney: 750, lives: 15, difficulty: 3 },
  { id: 'map4', name: 'Pro Stadium', cols: 24, rows: 14, waves: 30, startMoney: 850, lives: 12, difficulty: 4 },
  { id: 'map5', name: 'Stanley Cup', cols: 26, rows: 15, waves: 40, startMoney: 1000, lives: 10, difficulty: 5 },
  { id: 'map6', name: 'Frozen Lake', cols: 28, rows: 16, waves: 45, startMoney: 1200, lives: 8, difficulty: 6 },
  { id: 'map7', name: 'Winter Classic', cols: 30, rows: 17, waves: 50, startMoney: 1300, lives: 7, difficulty: 7 },
  { id: 'map8', name: 'World Championships', cols: 32, rows: 18, waves: 55, startMoney: 1400, lives: 6, difficulty: 8 },
  { id: 'map9', name: 'All-Star Arena', cols: 34, rows: 19, waves: 60, startMoney: 1500, lives: 5, difficulty: 9 },
  { id: 'map10', name: 'Hall of Fame', cols: 36, rows: 20, waves: 65, startMoney: 1600, lives: 4, difficulty: 10 }
];

// Map definitions for Soccer theme
export const SOCCER_MAPS = [
  { id: 'map1', name: 'Backyard', cols: 18, rows: 11, waves: 15, startMoney: 650, lives: 20, difficulty: 1 },
  { id: 'map2', name: 'School Field', cols: 20, rows: 12, waves: 20, startMoney: 700, lives: 18, difficulty: 2 },
  { id: 'map3', name: 'Club Ground', cols: 22, rows: 13, waves: 25, startMoney: 750, lives: 15, difficulty: 3 },
  { id: 'map4', name: 'Premier League', cols: 24, rows: 14, waves: 30, startMoney: 850, lives: 12, difficulty: 4 },
  { id: 'map5', name: 'World Cup', cols: 26, rows: 15, waves: 40, startMoney: 1000, lives: 10, difficulty: 5 },
  { id: 'map6', name: 'Street Pitch', cols: 28, rows: 16, waves: 45, startMoney: 1200, lives: 8, difficulty: 6 },
  { id: 'map7', name: 'Beach Field', cols: 30, rows: 17, waves: 50, startMoney: 1300, lives: 7, difficulty: 7 },
  { id: 'map8', name: 'Champions League', cols: 32, rows: 18, waves: 55, startMoney: 1400, lives: 6, difficulty: 8 },
  { id: 'map9', name: 'Olympic Stadium', cols: 34, rows: 19, waves: 60, startMoney: 1500, lives: 5, difficulty: 9 },
  { id: 'map10', name: 'Legendary Final', cols: 36, rows: 20, waves: 65, startMoney: 1600, lives: 4, difficulty: 10 }
];

// Theme color configurations
export const THEMES = {
  hockey: {
    name: 'Hockey Arena',
    icon: '🏒',
    primaryColor: '#00d4ff',
    groundColor: 0xe0f0f8,
    pathColor: 0xc8dce8,
    environmentColor: 0x0a1520,
    accentColor: '#00d4ff',
    towers: HOCKEY_TOWERS,
    enemies: HOCKEY_ENEMIES,
    maps: HOCKEY_MAPS
  },
  soccer: {
    name: 'Soccer Stadium',
    icon: '⚽',
    primaryColor: '#22c55e',
    groundColor: 0x2d8a3a,
    pathColor: 0x215a28,
    environmentColor: 0x0a1a0a,
    accentColor: '#22c55e',
    towers: SOCCER_TOWERS,
    enemies: SOCCER_ENEMIES,
    maps: SOCCER_MAPS
  }
};

// Game constants
export const GAME_CONSTANTS = {
  PROJECTILE_SPEED: 14,
  ENEMY_SPAWN_DELAY: 450,
  ENEMY_HP_SCALE_PER_WAVE: 0.12,
  SELL_VALUE_MULTIPLIER: 0.6,
  GAME_SPEED_OPTIONS: [1, 2, 3]
};

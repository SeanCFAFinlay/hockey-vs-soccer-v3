/**
 * Game State Manager
 * Central state management for the game
 */

import { generateWaves } from '../utils/gameUtils.js';

class GameState {
  constructor(theme, map) {
    this.theme = theme;
    this.map = map;
    
    // Game resources
    this.money = map.startMoney;
    this.lives = map.lives;
    this.score = 0;
    this.wave = 0;
    
    // Game speed
    this.gameSpeed = 1;
    
    // Collections
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    
    // Game flags
    this.waveActive = false;
    this.running = false;
    this.paused = false;
    
    // Wave data
    this.waves = generateWaves(map.waves, theme.enemies);
    
    // Selected items
    this.selectedTowerType = null;
    this.selectedTower = null;
  }

  // Resource management
  canAfford(cost) {
    return this.money >= cost;
  }

  spendMoney(amount) {
    this.money -= amount;
  }

  earnMoney(amount) {
    this.money += amount;
  }

  loseLife() {
    this.lives--;
  }

  addScore(points) {
    this.score += points;
  }

  // Tower management
  addTower(tower) {
    this.towers.push(tower);
  }

  removeTower(tower) {
    const index = this.towers.indexOf(tower);
    if (index > -1) {
      this.towers.splice(index, 1);
    }
  }

  // Enemy management
  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
  }

  // Projectile management
  addProjectile(projectile) {
    this.projectiles.push(projectile);
  }

  removeProjectile(projectile) {
    const index = this.projectiles.indexOf(projectile);
    if (index > -1) {
      this.projectiles.splice(index, 1);
    }
  }

  // Wave management
  canStartWave() {
    return !this.waveActive && this.wave < this.map.waves;
  }

  startNextWave() {
    if (!this.canStartWave()) return false;
    
    this.wave++;
    this.waveActive = true;
    return true;
  }

  isWaveComplete() {
    return this.waveActive && 
           this.enemies.length === 0 && 
           this.projectiles.length === 0;
  }

  endWave() {
    this.waveActive = false;
  }

  // Game state checks
  isVictory() {
    return this.wave >= this.map.waves && 
           this.enemies.length === 0 && 
           this.projectiles.length === 0;
  }

  isDefeat() {
    return this.lives <= 0;
  }

  // Get current wave data
  getCurrentWaveData() {
    if (this.wave < 1 || this.wave > this.waves.length) {
      return null;
    }
    return this.waves[this.wave - 1];
  }

  // Export state for HUD
  getHUDState() {
    return {
      money: this.money,
      lives: this.lives,
      score: this.score,
      wave: this.wave
    };
  }
}

export default GameState;

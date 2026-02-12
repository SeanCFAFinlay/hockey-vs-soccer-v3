/**
 * Game Controller
 * Main game orchestration and loop
 */

import * as THREE from 'three';
import Terrain from './terrain.js';
import GameState from './gameState.js';
import { THEMES } from './config.js';

class GameController {
  constructor(engine, postprocessing, effects, uiManager, saveManager) {
    this.engine = engine;
    this.postprocessing = postprocessing;
    this.effects = effects;
    this.uiManager = uiManager;
    this.saveManager = saveManager;
    
    this.terrain = null;
    this.gameState = null;
    this.lastTime = 0;
    this.running = false;
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Constants
    this.MAX_DELTA_TIME = 0.1; // Cap delta time at 100ms
  }

  startGame(themeName, mapData) {
    console.log(`Starting game: ${themeName} - ${mapData.name}`);
    
    // Get theme data
    const theme = THEMES[themeName];
    if (!theme) {
      console.error('Invalid theme:', themeName);
      return;
    }
    
    // Clear previous game
    this.cleanup();
    
    // Initialize game state
    this.gameState = new GameState(theme, mapData);
    
    // Create terrain
    this.terrain = new Terrain(this.engine.scene, theme, mapData);
    
    // Setup camera position based on map size
    const camDist = Math.max(mapData.cols, mapData.rows) * 1.2;
    this.engine.camera.position.set(0, camDist * 0.8, camDist * 0.8);
    this.engine.camera.lookAt(0, 0, 0);
    
    // Setup input handlers
    this.setupInputHandlers();
    
    // Update HUD
    this.uiManager.updateHUD(this.gameState.getHUDState());
    
    // Save last played
    this.saveManager.setLastPlayed(themeName, mapData.id);
    
    // Start game loop
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop();
    
    console.log('Game started successfully');
  }

  setupInputHandlers() {
    // Mouse click for tower placement
    const canvas = this.engine.renderer.domElement;
    
    canvas.addEventListener('click', (event) => {
      this.handleClick(event);
    });
    
    // Start wave button
    const startWaveBtn = document.querySelector('.start-btn');
    if (startWaveBtn) {
      startWaveBtn.addEventListener('click', () => this.startWave());
    }
  }

  handleClick(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = this.engine.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycast to find clicked cell
    this.raycaster.setFromCamera(this.mouse, this.engine.camera);
    const intersects = this.raycaster.intersectObjects(this.terrain.cells);
    
    if (intersects.length > 0) {
      const cell = intersects[0].object;
      const { gridX, gridY } = cell.userData;
      console.log(`Clicked grid cell: ${gridX}, ${gridY}`);
      
      // TODO: Handle tower placement
      // if (this.gameState.selectedTowerType) {
      //   this.placeTower(gridX, gridY);
      // }
    }
  }

  startWave() {
    if (!this.gameState.canStartWave()) {
      console.log('Cannot start wave');
      return;
    }
    
    const started = this.gameState.startNextWave();
    if (started) {
      console.log(`Wave ${this.gameState.wave} started!`);
      this.uiManager.updateHUD(this.gameState.getHUDState());
      
      // TODO: Spawn enemies based on wave data
      // const waveData = this.gameState.getCurrentWaveData();
      // this.spawnWave(waveData);
    }
  }

  gameLoop() {
    if (!this.running) return;
    
    requestAnimationFrame(() => this.gameLoop());
    
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, this.MAX_DELTA_TIME) * this.gameState.gameSpeed;
    this.lastTime = currentTime;
    
    // Update game systems
    this.update(deltaTime);
    
    // Render
    this.postprocessing.render();
  }

  update(deltaTime) {
    // Update effects
    this.effects.update(deltaTime);
    
    // TODO: Update towers
    // this.updateTowers(deltaTime);
    
    // TODO: Update enemies
    // this.updateEnemies(deltaTime);
    
    // TODO: Update projectiles
    // this.updateProjectiles(deltaTime);
    
    // Check win/lose conditions
    if (this.gameState.isVictory()) {
      this.handleVictory();
    } else if (this.gameState.isDefeat()) {
      this.handleDefeat();
    } else if (this.gameState.isWaveComplete()) {
      this.gameState.endWave();
      console.log(`Wave ${this.gameState.wave} complete!`);
    }
  }

  handleVictory() {
    this.running = false;
    console.log('Victory!');
    
    // Calculate stars
    const stars = this.calculateStars();
    this.uiManager.showVictory(stars, this.gameState.theme.name, this.gameState.map.id);
  }

  handleDefeat() {
    this.running = false;
    console.log('Defeat!');
    this.uiManager.showDefeat();
  }

  calculateStars() {
    const livesRatio = this.gameState.lives / this.gameState.map.lives;
    if (livesRatio === 1) return 5;
    if (livesRatio >= 0.7) return 3;
    return 1;
  }

  cleanup() {
    this.running = false;
    
    if (this.terrain) {
      this.terrain.dispose();
      this.terrain = null;
    }
    
    // TODO: Clean up towers, enemies, projectiles
    
    if (this.gameState) {
      this.gameState = null;
    }
  }

  stop() {
    this.cleanup();
  }
}

export default GameController;

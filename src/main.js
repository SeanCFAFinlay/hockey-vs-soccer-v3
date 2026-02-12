/**
 * Main Application Entry Point
 */

import Engine from './core/engine.js';
import QualityManager from './core/qualityManager.js';
import SaveManager from './core/saveManager.js';
import PostProcessing from './graphics/postprocessing.js';
import Effects from './graphics/effects.js';
import UIManager from './ui/uiManager.js';

class Game {
  constructor() {
    this.engine = null;
    this.qualityManager = null;
    this.saveManager = null;
    this.postprocessing = null;
    this.effects = null;
    this.uiManager = null;
    this.running = false;
    
    this.init();
  }

  init() {
    console.log('🏒⚽ Hockey vs Soccer Tower Defense V3');
    console.log('Initializing production build...');
    
    // Initialize managers
    this.saveManager = new SaveManager();
    this.qualityManager = new QualityManager();
    
    // Set quality from saved settings
    const savedQuality = this.saveManager.getSetting('graphics');
    this.qualityManager.setQuality(savedQuality);
    
    // Initialize engine
    const container = document.getElementById('game-container');
    this.engine = new Engine(container);
    
    // Initialize postprocessing
    this.postprocessing = new PostProcessing(
      this.engine.renderer,
      this.engine.scene,
      this.engine.camera
    );
    
    // Initialize effects
    this.effects = new Effects(this.engine.scene, this.qualityManager);
    
    // Initialize UI
    this.uiManager = new UIManager(this.saveManager);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Show menu screen
    this.uiManager.showScreen('menu');
    
    // Start render loop
    this.start();
    
    console.log('✅ Game initialized successfully');
  }

  setupEventListeners() {
    // Theme selection buttons
    const hockeyBtn = document.querySelector('.menu-card.hockey');
    const soccerBtn = document.querySelector('.menu-card.soccer');
    
    if (hockeyBtn) {
      hockeyBtn.addEventListener('click', () => this.selectTheme('hockey'));
    }
    
    if (soccerBtn) {
      soccerBtn.addEventListener('click', () => this.selectTheme('soccer'));
    }
    
    // Back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.uiManager.showScreen('menu'));
    }
  }

  selectTheme(theme) {
    console.log(`Selected theme: ${theme}`);
    this.uiManager.showMapSelection(theme);
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    this.animate();
  }

  animate() {
    if (!this.running) return;
    
    requestAnimationFrame(() => this.animate());
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Update quality manager (FPS monitoring)
    this.qualityManager.update();
    
    // Update effects
    this.effects.update(deltaTime);
    
    // Apply quality settings
    const qualitySettings = this.qualityManager.getSettings();
    this.postprocessing.setQuality(qualitySettings);
    
    // Render
    this.postprocessing.render();
  }

  stop() {
    this.running = false;
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Game());
} else {
  new Game();
}

export default Game;

/**
 * Main Application Entry Point
 */

import Engine from './core/engine.js';
import QualityManager from './core/qualityManager.js';
import SaveManager from './core/saveManager.js';
import PostProcessing from './graphics/postprocessing.js';
import Effects from './graphics/effects.js';
import UIManager from './ui/uiManager.js';
import GameController from './game/gameController.js';

class Game {
  constructor() {
    this.engine = null;
    this.qualityManager = null;
    this.saveManager = null;
    this.postprocessing = null;
    this.effects = null;
    this.uiManager = null;
    this.gameController = null;
    this.running = false;
    this.lastQualitySettings = null;
    
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
    const savedGraphicsOptions = this.saveManager.getSetting('graphicsOptions');
    this.qualityManager.setQuality(savedQuality);
    this.qualityManager.setGraphicsOptions(savedGraphicsOptions);
    
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
    
    // Initialize game controller
    this.gameController = new GameController(
      this.engine,
      this.postprocessing,
      this.effects,
      this.uiManager,
      this.saveManager,
      this.qualityManager
    );
    
    // Pass game controller to UI manager for map selection callback
    this.uiManager.setGameController(this.gameController);
    
    // Setup event listeners
    this.setupEventListeners();
    this.setupGraphicsSettings();
    
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

    window.addEventListener('resize', () => {
      this.postprocessing.onResize();
    });
  }

  setupGraphicsSettings() {
    const panel = document.getElementById('graphicsSettings');
    const openBtn = document.getElementById('openGraphicsSettings');
    const closeBtn = document.getElementById('closeGraphicsSettings');
    const presetSelect = document.getElementById('graphicsPreset');
    const resolutionSelect = document.getElementById('resolutionScale');
    const shadowSelect = document.getElementById('shadowQuality');
    const postSelect = document.getElementById('postProcessing');
    const textureSelect = document.getElementById('textureQuality');
    const particleSelect = document.getElementById('particleDensity');
    
    const elements = {
      panel,
      openBtn,
      closeBtn,
      presetSelect,
      resolutionSelect,
      shadowSelect,
      postSelect,
      textureSelect,
      particleSelect
    };
    const missingElements = Object.entries(elements)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    
    if (missingElements.length) {
      console.warn('Graphics settings UI missing elements:', missingElements.join(', '));
      return;
    }
    
    const savedPreset = this.saveManager.getSetting('graphics') || 'auto';
    const savedOptions = this.saveManager.getSetting('graphicsOptions') || {};
    
    const normalizeToggle = (value) => {
      if (value === true) return 'on';
      if (value === false) return 'off';
      return value || 'auto';
    };
    const normalizeResolutionScale = (value) => (value !== undefined ? String(value) : 'auto');
    const parseResolutionScale = (value) => (value === 'auto' ? 'auto' : Number(value));
    
    presetSelect.value = savedPreset;
    resolutionSelect.value = normalizeResolutionScale(savedOptions.resolutionScale);
    shadowSelect.value = savedOptions.shadowQuality || 'auto';
    postSelect.value = normalizeToggle(savedOptions.postprocessing);
    textureSelect.value = savedOptions.textureQuality || 'auto';
    particleSelect.value = savedOptions.particleDensity || 'auto';
    
    const applySettings = () => {
      const options = {
        resolutionScale: parseResolutionScale(resolutionSelect.value),
        shadowQuality: shadowSelect.value,
        postprocessing: postSelect.value,
        textureQuality: textureSelect.value,
        particleDensity: particleSelect.value
      };
      
      this.saveManager.setSetting('graphics', presetSelect.value);
      this.saveManager.setSetting('graphicsOptions', options);
      this.qualityManager.setQuality(presetSelect.value);
      this.qualityManager.setGraphicsOptions(options);
    };
    
    const settingSelects = [
      presetSelect,
      resolutionSelect,
      shadowSelect,
      postSelect,
      textureSelect,
      particleSelect
    ];
    
    settingSelects.forEach(select => {
      select.addEventListener('change', applySettings);
    });
    
    if (openBtn) {
      openBtn.addEventListener('click', () => panel.classList.add('show'));
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => panel.classList.remove('show'));
    }
    
    panel.addEventListener('click', (event) => {
      if (event.target === panel) {
        panel.classList.remove('show');
      }
    });
    
    applySettings();
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
    if (this.hasQualitySettingsChanged(qualitySettings)) {
      const didResize = this.engine.applyQualitySettings(qualitySettings);
      if (didResize) {
        this.postprocessing.onResize();
      }
      this.gameController.applyQualitySettings(qualitySettings);
      this.postprocessing.setQuality(qualitySettings);
      this.lastQualitySettings = { ...qualitySettings };
    }
    
    // Render
    this.postprocessing.render();
  }

  stop() {
    this.running = false;
  }

  hasQualitySettingsChanged(settings) {
    if (!this.lastQualitySettings) {
      return true;
    }
    
    const keys = new Set([
      ...Object.keys(settings),
      ...Object.keys(this.lastQualitySettings)
    ]);
    
    return Array.from(keys).some(key => settings[key] !== this.lastQualitySettings[key]);
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new Game());
} else {
  new Game();
}

export default Game;

/**
 * UI Manager
 * Handles screen transitions and UI updates
 */

import { THEMES } from '../game/config.js';

class UIManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.currentScreen = 'menu';
    this.currentTheme = null;
    this.gameController = null;
    this.screens = {};
    
    // Cache screen elements
    this.screens.menu = document.getElementById('menuScreen');
    this.screens.map = document.getElementById('mapScreen');
    this.screens.game = document.getElementById('gameScreen');
  }

  setGameController(gameController) {
    this.gameController = gameController;
  }

  showScreen(screenName) {
    // Hide all screens
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.remove('active');
    });
    
    // Show requested screen
    if (this.screens[screenName]) {
      this.screens[screenName].classList.add('active');
      this.currentScreen = screenName;
    }
  }

  showMapSelection(theme) {
    this.currentTheme = theme;
    const themeData = THEMES[theme];
    
    // Update header
    const mapTitle = document.querySelector('.map-title');
    if (mapTitle) {
      mapTitle.textContent = `${themeData.name} - Select Map`;
      mapTitle.style.color = themeData.primaryColor;
    }
    
    // Populate map grid
    const mapGrid = document.querySelector('.map-grid');
    if (!mapGrid) return;
    
    mapGrid.innerHTML = '';
    
    themeData.maps.forEach((map, index) => {
      const mapNumber = index + 1;
      const isUnlocked = this.saveManager.isMapUnlocked(theme, mapNumber);
      const stars = this.saveManager.getStars(theme, map.id);
      
      const card = document.createElement('div');
      card.className = 'map-card';
      card.style.setProperty('--c', themeData.primaryColor);
      
      if (!isUnlocked) {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
      }
      
      card.innerHTML = `
        <div class="map-card-icon">${index === 0 ? '🏠' : index === themeData.maps.length - 1 ? '👑' : '🎯'}</div>
        <div class="map-card-name">${map.name}</div>
        <div class="map-card-info">Waves: ${map.waves} | Lives: ${map.lives}</div>
        <div class="map-stars">
          ${[1, 2, 3, 4, 5].map(i => `<span class="${i <= stars ? 'on' : ''}">⭐</span>`).join('')}
        </div>
      `;
      
      if (isUnlocked) {
        card.addEventListener('click', () => this.selectMap(theme, map));
      }
      
      mapGrid.appendChild(card);
    });
    
    this.showScreen('map');
  }

  selectMap(theme, map) {
    console.log(`Selected map: ${map.name} (${theme})`);
    this.showScreen('game');
    
    // Start the game
    if (this.gameController) {
      this.gameController.startGame(theme, map);
    }
  }

  updateHUD(gameState) {
    // Update wave display
    const waveEl = document.querySelector('.hud-wave');
    if (waveEl && gameState.wave !== undefined) {
      waveEl.textContent = `Wave ${gameState.wave}`;
    }
    
    // Update money
    const moneyEl = document.querySelector('.hud-stat.money');
    if (moneyEl && gameState.money !== undefined) {
      moneyEl.innerHTML = `💰 ${gameState.money}`;
    }
    
    // Update lives
    const livesEl = document.querySelector('.hud-stat.lives');
    if (livesEl && gameState.lives !== undefined) {
      livesEl.innerHTML = `❤️ ${gameState.lives}`;
    }
    
    // Update score
    const scoreEl = document.querySelector('.hud-stat.score');
    if (scoreEl && gameState.score !== undefined) {
      scoreEl.innerHTML = `⭐ ${gameState.score}`;
    }
  }

  showVictory(stars, theme, mapId) {
    // Save progress
    this.saveManager.setStars(theme, mapId, stars);
    this.saveManager.recordWin();
    
    // TODO: Show victory modal with star animation
    console.log(`Victory! ${stars} stars earned`);
  }

  showDefeat() {
    this.saveManager.recordLoss();
    
    // TODO: Show defeat modal
    console.log('Defeat!');
  }
}

export default UIManager;

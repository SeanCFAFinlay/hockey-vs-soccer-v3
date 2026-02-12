/**
 * UI Manager
 * Handles screen transitions and UI updates
 */

class UIManager {
  constructor(saveManager) {
    this.saveManager = saveManager;
    this.currentScreen = 'menu';
    this.screens = {};
    
    // Cache screen elements
    this.screens.menu = document.getElementById('menuScreen');
    this.screens.map = document.getElementById('mapScreen');
    this.screens.game = document.getElementById('gameScreen');
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

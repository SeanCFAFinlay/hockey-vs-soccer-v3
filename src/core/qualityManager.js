/**
 * Quality Manager
 * Monitors FPS and adaptively adjusts graphics quality
 */

class QualityManager {
  constructor() {
    this.fps = 60;
    this.fpsHistory = [];
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.qualityLevel = 'auto'; // 'low', 'medium', 'high', 'auto'
    this.userQualityLevel = 'auto';
    
    // Quality settings
    this.settings = {
      low: {
        pixelRatio: 1,
        shadowMapSize: 1024,
        bloomStrength: 0.3,
        particleCount: 0.3,
        postprocessing: false
      },
      medium: {
        pixelRatio: 1.5,
        shadowMapSize: 1024,
        bloomStrength: 0.5,
        particleCount: 0.6,
        postprocessing: true
      },
      high: {
        pixelRatio: 2,
        shadowMapSize: 2048,
        bloomStrength: 0.8,
        particleCount: 1.0,
        postprocessing: true
      }
    };
    
    this.thresholds = {
      targetFps: 60,
      minFps: 45,
      maxFps: 65
    };
  }

  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;
    
    // Update FPS every second
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.fpsHistory.push(this.fps);
      
      // Keep only last 5 seconds of history
      if (this.fpsHistory.length > 5) {
        this.fpsHistory.shift();
      }
      
      this.frameCount = 0;
      this.lastTime = currentTime;
      
      // Auto-adjust quality if in auto mode
      if (this.userQualityLevel === 'auto') {
        this.autoAdjustQuality();
      }
    }
  }

  autoAdjustQuality() {
    const avgFps = this.getAverageFps();
    
    // Downgrade if consistently low FPS
    if (avgFps < this.thresholds.minFps) {
      if (this.qualityLevel === 'high') {
        this.setQuality('medium');
        console.log('Auto-adjusting quality: HIGH → MEDIUM');
      } else if (this.qualityLevel === 'medium') {
        this.setQuality('low');
        console.log('Auto-adjusting quality: MEDIUM → LOW');
      }
    }
    
    // Upgrade if consistently high FPS
    if (avgFps > this.thresholds.maxFps && this.fpsHistory.length >= 5) {
      if (this.qualityLevel === 'low') {
        this.setQuality('medium');
        console.log('Auto-adjusting quality: LOW → MEDIUM');
      } else if (this.qualityLevel === 'medium') {
        this.setQuality('high');
        console.log('Auto-adjusting quality: MEDIUM → HIGH');
      }
    }
  }

  getAverageFps() {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
  }

  setQuality(level) {
    if (level === 'auto') {
      this.userQualityLevel = 'auto';
      this.qualityLevel = 'high'; // Start high and auto-adjust
    } else {
      this.userQualityLevel = level;
      this.qualityLevel = level;
    }
  }

  getSettings() {
    return this.settings[this.qualityLevel];
  }

  getCurrentQuality() {
    return this.qualityLevel;
  }

  getUserQuality() {
    return this.userQualityLevel;
  }

  getFps() {
    return this.fps;
  }
}

export default QualityManager;

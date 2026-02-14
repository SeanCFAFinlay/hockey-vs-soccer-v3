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
    this.qualityLevel = 'auto'; // 'low', 'medium', 'high', 'ultra', 'auto'
    this.userQualityLevel = 'auto';
    this.qualityLevels = ['low', 'medium', 'high', 'ultra'];
    
    // Quality settings
    this.settings = {
      low: {
        pixelRatio: 1,
        shadowMapSize: 1024,
        bloomStrength: 0.25,
        bloomRadius: 0.35,
        bloomThreshold: 0.9,
        particleCount: 0.3,
        postprocessing: false,
        toneMappingExposure: 0.95,
        textureAnisotropy: 1,
        materialQuality: 'basic',
        shadowSoftness: 1
      },
      medium: {
        pixelRatio: 1.5,
        shadowMapSize: 1536,
        bloomStrength: 0.5,
        bloomRadius: 0.4,
        bloomThreshold: 0.88,
        particleCount: 0.6,
        postprocessing: true,
        toneMappingExposure: 1,
        textureAnisotropy: 2,
        materialQuality: 'standard',
        shadowSoftness: 2
      },
      high: {
        pixelRatio: 2,
        shadowMapSize: 2048,
        bloomStrength: 0.8,
        bloomRadius: 0.45,
        bloomThreshold: 0.85,
        particleCount: 1.0,
        postprocessing: true,
        toneMappingExposure: 1.05,
        textureAnisotropy: 4,
        materialQuality: 'standard',
        shadowSoftness: 3
      },
      ultra: {
        pixelRatio: 2,
        shadowMapSize: 3072,
        bloomStrength: 0.95,
        bloomRadius: 0.5,
        bloomThreshold: 0.82,
        particleCount: 1.2,
        postprocessing: true,
        toneMappingExposure: 1.12,
        textureAnisotropy: 8,
        materialQuality: 'standard',
        shadowSoftness: 4
      }
    };

    this.userSettings = {
      resolutionScale: 'auto',
      shadowQuality: 'auto',
      postprocessing: 'auto',
      textureQuality: 'auto',
      particleDensity: 'auto',
      materialQuality: 'auto'
    };

    this.qualityOverrides = {
      shadowQuality: {
        low: 1024,
        medium: 1536,
        high: 2048,
        ultra: 3072
      },
      textureQuality: {
        low: 1,
        medium: 2,
        high: 4,
        ultra: 8
      },
      particleDensity: {
        low: 0.5,
        medium: 0.75,
        high: 1,
        ultra: 1.25
      },
      materialQuality: {
        low: 'basic',
        medium: 'standard',
        high: 'standard',
        ultra: 'standard'
      }
    };
    
    this.thresholds = {
      targetFps: 60,
      minFps: 45,
      maxFps: 65
    };
    
    this.defaultParticleDensity = 1;
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
    const currentIndex = this.qualityLevels.indexOf(this.qualityLevel);
    
    // Downgrade if consistently low FPS
    if (avgFps < this.thresholds.minFps && currentIndex > 0) {
      const previousLevel = this.qualityLevel;
      const nextLevel = this.qualityLevels[currentIndex - 1];
      this.qualityLevel = nextLevel;
      console.log(`Auto-adjusting quality: ${previousLevel.toUpperCase()} → ${nextLevel.toUpperCase()}`);
    }
    
    // Upgrade if consistently high FPS
    if (avgFps > this.thresholds.maxFps && this.fpsHistory.length >= 5 && currentIndex < this.qualityLevels.length - 1) {
      const previousLevel = this.qualityLevel;
      const nextLevel = this.qualityLevels[currentIndex + 1];
      this.qualityLevel = nextLevel;
      console.log(`Auto-adjusting quality: ${previousLevel.toUpperCase()} → ${nextLevel.toUpperCase()}`);
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
      if (!this.settings[level]) {
        console.warn(`Unknown quality setting "${level}". Valid options: low, medium, high, ultra. Defaulting to high.`);
      }
      const nextLevel = this.settings[level] ? level : 'high';
      this.userQualityLevel = nextLevel;
      this.qualityLevel = nextLevel;
    }
  }

  setGraphicsOptions(options = {}) {
    this.userSettings = {
      ...this.userSettings,
      ...options
    };
  }

  getSettings() {
    const baseSettings = this.settings[this.qualityLevel] || this.settings.high;
    const resolutionScale = this.resolveResolutionScale(this.userSettings.resolutionScale);
    const shadowMapSize = this.resolveQualityOverride(
      this.userSettings.shadowQuality,
      this.qualityOverrides.shadowQuality,
      baseSettings.shadowMapSize
    );
    const textureAnisotropy = this.resolveQualityOverride(
      this.userSettings.textureQuality,
      this.qualityOverrides.textureQuality,
      baseSettings.textureAnisotropy
    );
    const materialQuality = this.resolveQualityOverride(
      this.userSettings.materialQuality,
      this.qualityOverrides.materialQuality,
      baseSettings.materialQuality
    );
    const particleDensity = this.resolveQualityOverride(
      this.userSettings.particleDensity,
      this.qualityOverrides.particleDensity,
      this.defaultParticleDensity
    );
    const particleCount = Math.max(0.1, baseSettings.particleCount * particleDensity);
    const postprocessing = this.resolvePostprocessing(baseSettings.postprocessing);
    
    return {
      ...baseSettings,
      resolutionScale,
      shadowMapSize,
      textureAnisotropy,
      materialQuality,
      particleCount,
      postprocessing
    };
  }

  resolveQualityOverride(value, map, fallback) {
    if (!value || value === 'auto') {
      return fallback;
    }
    
    return map[value] ?? fallback;
  }

  resolveResolutionScale(value) {
    if (!value || value === 'auto') {
      return 1;
    }
    
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed)) {
      return 1;
    }
    
    return Math.min(Math.max(parsed, 0.5), 1.5);
  }

  resolvePostprocessing(fallback) {
    if (this.userSettings.postprocessing === 'on') {
      return true;
    }
    
    if (this.userSettings.postprocessing === 'off') {
      return false;
    }
    
    return fallback;
  }

  getCurrentQuality() {
    return this.qualityLevel;
  }

  getUserQuality() {
    return this.userQualityLevel;
  }

  getGraphicsOptions() {
    return {
      ...this.userSettings
    };
  }

  getFps() {
    return this.fps;
  }
}

export default QualityManager;

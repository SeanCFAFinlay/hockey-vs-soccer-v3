/**
 * Save Manager
 * Handles game persistence using localStorage
 */

class SaveManager {
  constructor() {
    this.storageKey = 'hockeyVsSoccerV3_save';
    this.currentVersion = 1;
    this.defaultSave = {
      version: 1,
      settings: {
        graphics: 'auto',
        graphicsOptions: {
          resolutionScale: 'auto',
          shadowQuality: 'auto',
          postprocessing: 'auto',
          textureQuality: 'auto',
          particleDensity: 'auto'
        },
        sound: true
      },
      progress: {
        hockey: {
          unlockedMaps: 1,
          stars: {},
          lastPlayed: null
        },
        soccer: {
          unlockedMaps: 1,
          stars: {},
          lastPlayed: null
        }
      },
      meta: {
        totalWins: 0,
        totalGames: 0,
        currency: 0,
        lastTheme: null,
        lastMap: null
      }
    };
    
    this.data = null;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      
      if (saved) {
        this.data = JSON.parse(saved);
        
        // Migrate if necessary
        if (this.data.version < this.currentVersion) {
          this.migrate();
        }

        this.ensureSettingsDefaults();
        
        console.log('Save data loaded successfully');
      } else {
        // Create new save
        this.data = JSON.parse(JSON.stringify(this.defaultSave));
        this.save();
        console.log('New save data created');
      }
    } catch (error) {
      console.error('Failed to load save data:', error);
      this.data = JSON.parse(JSON.stringify(this.defaultSave));
    }
    
    return this.data;
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      console.log('Game saved');
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  migrate() {
    // Handle version migrations if needed
    console.log('Migrating save data from version', this.data.version, 'to', this.currentVersion);
    this.data.version = this.currentVersion;
    this.save();
  }

  ensureSettingsDefaults() {
    if (!this.data.settings) {
      this.data.settings = {};
    }
    
    const defaultSettings = this.defaultSave.settings;
    const existingGraphics = this.data.settings.graphicsOptions || {};
    
    this.data.settings = {
      ...defaultSettings,
      ...this.data.settings,
      graphicsOptions: {
        ...defaultSettings.graphicsOptions,
        ...existingGraphics
      }
    };
  }

  // Settings methods
  setSetting(key, value) {
    this.data.settings[key] = value;
    this.save();
  }

  getSetting(key) {
    return this.data.settings[key];
  }

  // Map progress methods
  unlockMap(theme, mapNumber) {
    const progress = this.data.progress[theme];
    if (mapNumber > progress.unlockedMaps) {
      progress.unlockedMaps = mapNumber;
      this.save();
    }
  }

  setStars(theme, mapId, stars) {
    const progress = this.data.progress[theme];
    const currentStars = progress.stars[mapId] || 0;
    
    if (stars > currentStars) {
      progress.stars[mapId] = stars;
      this.save();
    }
  }

  getStars(theme, mapId) {
    return this.data.progress[theme].stars[mapId] || 0;
  }

  getTotalStars(theme) {
    const stars = this.data.progress[theme].stars;
    return Object.values(stars).reduce((sum, val) => sum + val, 0);
  }

  isMapUnlocked(theme, mapNumber) {
    return mapNumber <= this.data.progress[theme].unlockedMaps;
  }

  setLastPlayed(theme, mapId) {
    this.data.progress[theme].lastPlayed = mapId;
    this.data.meta.lastTheme = theme;
    this.data.meta.lastMap = mapId;
    this.save();
  }

  getLastPlayed(theme) {
    return this.data.progress[theme].lastPlayed;
  }

  getContinueData() {
    return {
      theme: this.data.meta.lastTheme,
      map: this.data.meta.lastMap
    };
  }

  // Meta methods
  recordWin() {
    this.data.meta.totalWins++;
    this.data.meta.totalGames++;
    this.save();
  }

  recordLoss() {
    this.data.meta.totalGames++;
    this.save();
  }

  addCurrency(amount) {
    this.data.meta.currency += amount;
    this.save();
  }

  // Utility methods
  reset() {
    this.data = JSON.parse(JSON.stringify(this.defaultSave));
    this.save();
    console.log('Save data reset');
  }

  export() {
    return JSON.stringify(this.data, null, 2);
  }

  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.data = imported;
      this.save();
      console.log('Save data imported');
      return true;
    } catch (error) {
      console.error('Failed to import save data:', error);
      return false;
    }
  }
}

export default SaveManager;

/**
 * Utility functions for game logic
 */

/**
 * Generate waves for a map
 * @param {number} numWaves - Number of waves to generate
 * @param {Array} enemies - Enemy definitions
 * @returns {Array} Array of wave configurations
 */
export function generateWaves(numWaves, enemies) {
  const waves = [];
  
  for (let w = 1; w <= numWaves; w++) {
    const wave = {};
    
    // Basic enemy - always present
    wave[enemies[0].id] = 5 + Math.floor(w * 1.3);
    
    // Add more enemy types as waves progress
    if (w >= 2) wave[enemies[1].id] = Math.floor(w * 0.6);   // Fire variant
    if (w >= 3) wave[enemies[2].id] = Math.floor(w * 0.7);   // Flying variant
    if (w >= 5) wave[enemies[3].id] = Math.floor((w - 3) * 0.4); // Armored
    if (w >= 8) wave[enemies[4].id] = Math.floor((w - 6) * 0.25); // Tough
    if (w >= 10) wave[enemies[5].id] = Math.floor((w - 8) * 0.35); // Flying fire
    
    // Boss every 5 waves
    if (w % 5 === 0) {
      wave[enemies[6].id] = 1 + Math.floor(w / 12);
    }
    
    waves.push(wave);
  }
  
  return waves;
}

/**
 * Generate a random path for a map
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @returns {Array} Array of {x, y} coordinates
 */
export function generatePath(cols, rows) {
  const path = [];
  const midRow = Math.floor(rows / 2);
  let currentRow = midRow;
  
  for (let col = 0; col < cols; col++) {
    path.push({ x: col, y: currentRow });
    
    // Random variation in next row (±1 or stay same)
    if (col < cols - 1) {
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      currentRow = Math.max(0, Math.min(rows - 1, currentRow + variation));
    }
  }
  
  return path;
}

/**
 * Calculate star rating based on performance
 * @param {number} livesRemaining - Lives left at end
 * @param {number} totalLives - Total starting lives
 * @returns {number} Star rating (1, 3, or 5)
 */
export function calculateStars(livesRemaining, totalLives) {
  if (livesRemaining === totalLives) {
    return 5; // Perfect - no lives lost
  } else if (livesRemaining >= totalLives * 0.7) {
    return 3; // Strong performance - 70%+ lives
  } else {
    return 1; // Just survived
  }
}

/**
 * Calculate scaled enemy HP based on wave number
 * @param {number} baseHP - Base HP from enemy definition
 * @param {number} wave - Current wave number
 * @param {number} scalePerWave - HP scaling factor per wave (default 0.12)
 * @returns {number} Scaled HP
 */
export function getScaledEnemyHP(baseHP, wave, scalePerWave = 0.12) {
  return Math.round(baseHP * (1 + wave * scalePerWave));
}

/**
 * Calculate tower sell value
 * @param {number} baseCost - Base tower cost
 * @param {Array} upgradeCosts - Array of upgrade costs already spent
 * @param {number} sellMultiplier - Sell value multiplier (default 0.6)
 * @returns {number} Sell value
 */
export function getTowerSellValue(baseCost, upgradeCosts, sellMultiplier = 0.6) {
  const totalCost = baseCost + upgradeCosts.reduce((sum, cost) => sum + cost, 0);
  return Math.floor(totalCost * sellMultiplier);
}

/**
 * Get distance between two points
 * @param {Object} p1 - Point 1 with x, y, z
 * @param {Object} p2 - Point 2 with x, y, z
 * @returns {number} Distance
 */
export function getDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = (p2.y || 0) - (p1.y || 0);
  const dz = (p2.z || 0) - (p1.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Get grid position from world coordinates
 * @param {number} worldX - World X coordinate
 * @param {number} worldZ - World Z coordinate
 * @param {number} cellSize - Grid cell size (default 1.5)
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @returns {Object} Grid coordinates {x, y} or null if out of bounds
 */
export function worldToGrid(worldX, worldZ, cellSize = 1.5, cols, rows) {
  const gridX = Math.floor((worldX + (cols * cellSize) / 2) / cellSize);
  const gridY = Math.floor((worldZ + (rows * cellSize) / 2) / cellSize);
  
  if (gridX < 0 || gridX >= cols || gridY < 0 || gridY >= rows) {
    return null;
  }
  
  return { x: gridX, y: gridY };
}

/**
 * Get world position from grid coordinates
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @param {number} cellSize - Grid cell size (default 1.5)
 * @param {number} cols - Number of columns
 * @param {number} rows - Number of rows
 * @returns {Object} World coordinates {x, z}
 */
export function gridToWorld(gridX, gridY, cellSize = 1.5, cols, rows) {
  const x = gridX * cellSize - (cols * cellSize) / 2 + cellSize / 2;
  const z = gridY * cellSize - (rows * cellSize) / 2 + cellSize / 2;
  return { x, z };
}

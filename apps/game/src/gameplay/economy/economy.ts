export const GAME_CONSTANTS = {
  PROJECTILE_SPEED: 14,
  ENEMY_SPAWN_DELAY: 450,
  ENEMY_HP_SCALE_PER_WAVE: 0.12,
  SELL_VALUE_MULTIPLIER: 0.6,
  GAME_SPEED_OPTIONS: [1, 2, 3] as const,
} as const;

export function calculateStars(livesRemaining: number, totalLives: number): number {
  if (livesRemaining === totalLives) return 5;
  if (livesRemaining >= totalLives * 0.7) return 3;
  return 1;
}

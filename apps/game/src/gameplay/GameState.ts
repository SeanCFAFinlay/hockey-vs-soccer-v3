import type { MapDefinition } from '@hvsv3/shared';
import type { TowerType } from './towers/towerTypes.ts';
import type { EnemyType } from './enemies/enemyTypes.ts';
import { calculateStars } from './economy/economy.ts';

export type GamePhase = 'placing' | 'waveActive' | 'won' | 'lost';

export interface GameConfig {
  theme: 'hockey' | 'soccer';
  towers: TowerType[];
  enemies: EnemyType[];
  map: MapDefinition;
  totalWaves: number;
  startMoney: number;
  startLives: number;
}

export class GameState {
  phase: GamePhase = 'placing';
  wave = 0;
  money: number;
  lives: number;
  score = 0;
  gameSpeed: 1 | 2 | 3 = 1;
  config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.money = config.startMoney;
    this.lives = config.startLives;
  }

  spendMoney(amount: number): boolean {
    if (this.money < amount) return false;
    this.money -= amount;
    return true;
  }

  addMoney(amount: number): void {
    this.money += amount;
    this.score += amount;
  }

  loseLife(): boolean {
    this.lives--;
    if (this.lives <= 0) {
      this.lives = 0;
      this.phase = 'lost';
      return true;
    }
    return false;
  }

  startWave(): void {
    this.wave++;
    this.phase = 'waveActive';
  }

  waveComplete(): void {
    if (this.wave >= this.config.totalWaves) {
      this.phase = 'won';
    } else {
      this.phase = 'placing';
    }
  }

  get stars(): number {
    return calculateStars(this.lives, this.config.startLives);
  }

  get isOver(): boolean {
    return this.phase === 'won' || this.phase === 'lost';
  }
}

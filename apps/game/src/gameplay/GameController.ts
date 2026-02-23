import type { MapDefinition } from '@hvsv3/shared';
import type { GameConfig } from './GameState.ts';
import { GameState } from './GameState.ts';
import { TowerSystem } from './towers/TowerSystem.ts';
import { EnemySystem } from './enemies/EnemySystem.ts';
import { ProjectileSystem } from './projectiles/ProjectileSystem.ts';
import { LinearPathEngine } from './pathing/LinearPathEngine.ts';
import { MultiPathEngine } from './pathing/MultiPathEngine.ts';
import type { BuiltPaths } from './pathing/PathingEngine.ts';
import { Terrain } from '../three/Terrain.ts';
import { gridToWorld } from './pathing/pathUtils.ts';
import type { Engine } from '../three/Engine.ts';
import type { TowerType } from './towers/towerTypes.ts';

export interface GameCallbacks {
  onStateUpdate: (state: GameState) => void;
  onWaveComplete: () => void;
  onGameOver: (won: boolean) => void;
}

export class GameController {
  private state: GameState;
  private towers: TowerSystem;
  private enemies: EnemySystem;
  private projectiles: ProjectileSystem;
  private terrain: Terrain;
  private builtPaths: BuiltPaths;
  private callbacks: GameCallbacks;
  private engine: Engine;
  private map: MapDefinition;
  private waveCompositions: Array<Record<string, number>> = [];

  constructor(engine: Engine, config: GameConfig, callbacks: GameCallbacks) {
    this.engine = engine;
    this.map = config.map;
    this.callbacks = callbacks;

    this.state = new GameState(config);

    const themeColors = config.theme === 'hockey'
      ? { groundColor: 0xe0f0f8, pathColor: 0xc8dce8 }
      : { groundColor: 0x2d8a3a, pathColor: 0x215a28 };

    this.terrain = new Terrain(engine.scene, themeColors, config.map);

    // Build paths
    const pathingEngine = config.map.pathing.type === 'multipath'
      ? new MultiPathEngine()
      : new LinearPathEngine();
    this.builtPaths = pathingEngine.build(config.map);

    this.towers = new TowerSystem(engine.scene);
    this.enemies = new EnemySystem(engine.scene);
    this.projectiles = new ProjectileSystem(engine.scene);

    // Pre-generate wave compositions
    this.generateWaveCompositions(config.totalWaves, config.enemies);

    // Setup camera
    const maxDim = Math.max(config.map.cols, config.map.rows);
    engine.camera.position.set(0, maxDim * 0.8, maxDim * 0.8);
    engine.camera.lookAt(0, 0, 0);

    engine.setTickCallback(this.tick.bind(this));
  }

  private generateWaveCompositions(numWaves: number, enemies: typeof this.state.config.enemies): void {
    for (let w = 1; w <= numWaves; w++) {
      const comp: Record<string, number> = {};
      comp[enemies[0].id] = 5 + Math.floor(w * 1.3);
      if (w >= 2) comp[enemies[1]?.id ?? ''] = Math.floor(w * 0.6);
      if (w >= 3) comp[enemies[2]?.id ?? ''] = Math.floor(w * 0.7);
      if (w >= 5 && enemies[3]) comp[enemies[3].id] = Math.floor((w - 3) * 0.4);
      if (w % 5 === 0 && enemies[6]) comp[enemies[6].id] = 1 + Math.floor(w / 12);
      this.waveCompositions.push(comp);
    }
  }

  startWave(): void {
    if (this.state.phase !== 'placing') return;
    this.state.startWave();

    const waveComp = this.waveCompositions[this.state.wave - 1] ?? {};
    const paths = this.builtPaths.mainPaths;

    let pathIdx = 0;
    for (const [enemyId, count] of Object.entries(waveComp)) {
      if (!count || count <= 0) continue;
      const enemyType = this.state.config.enemies.find((e) => e.id === enemyId);
      if (!enemyType) continue;
      const path = paths[pathIdx % paths.length];
      this.enemies.queueWave(enemyType, count, path, this.state.wave);
      pathIdx++;
    }

    this.callbacks.onStateUpdate(this.state);
  }

  tryPlaceTower(towerType: TowerType, gridX: number, gridY: number): boolean {
    if (!this.state.spendMoney(towerType.cost)) return false;
    const worldPos = gridToWorld({ x: gridX, y: gridY }, this.map.cols, this.map.rows);
    this.towers.placeTower(towerType, gridX, gridY, worldPos);
    this.callbacks.onStateUpdate(this.state);
    return true;
  }

  setGameSpeed(speed: 1 | 2 | 3): void {
    this.state.gameSpeed = speed;
  }

  getState(): GameState {
    return this.state;
  }

  private tick(dt: number): void {
    if (this.state.isOver) return;
    if (this.state.phase !== 'waveActive') return;

    const { reached } = this.enemies.update(dt, this.state.gameSpeed);

    // Handle enemies reaching the pen
    for (let _i = 0; _i < reached.length; _i++) {
      const lost = this.state.loseLife();
      if (lost) {
        this.callbacks.onGameOver(false);
        this.callbacks.onStateUpdate(this.state);
        return;
      }
    }

    // Tower firing
    const enemyList = this.enemies.enemies.map((e) => ({ id: e.id, mesh: e.mesh, hp: e.hp }));
    const shots = this.towers.update(dt, enemyList);

    for (const shot of shots) {
      this.projectiles.fire(
        shot.tower.mesh.position.clone(),
        shot.targetId,
        this.towers.getDamage(shot.tower),
        shot.tower.type.color,
      );
    }

    // Projectile update
    const enemyMap = new Map(this.enemies.enemies.map((e) => [e.id, e.mesh]));
    const hits = this.projectiles.update(dt, enemyMap);

    for (const hit of hits) {
      const killed = this.enemies.damage(hit.targetId, hit.damage);
      if (killed) {
        this.state.addMoney(killed.type.reward);
      }
    }

    // Check wave complete
    if (!this.enemies.hasEnemiesOrQueue()) {
      this.state.waveComplete();
      if (this.state.phase === 'won') {
        this.callbacks.onGameOver(true);
      } else {
        this.callbacks.onWaveComplete();
      }
    }

    this.callbacks.onStateUpdate(this.state);
  }

  destroy(): void {
    this.towers.destroy();
    this.enemies.destroy();
    this.projectiles.destroy();
    this.terrain.destroy();
  }
}

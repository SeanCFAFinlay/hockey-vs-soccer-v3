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
    const isHockey = this.state.config.theme === 'hockey';
    
    for (let w = 1; w <= numWaves; w++) {
      const comp: Record<string, number> = {};
      
      if (isHockey) {
        // Hockey: More enemies, faster waves, aggressive rushes
        comp[enemies[0].id] = 6 + Math.floor(w * 1.5); // More basic pucks
        if (w >= 2) comp[enemies[1]?.id ?? ''] = Math.floor(w * 0.8); // Skaters
        if (w >= 3) comp[enemies[2]?.id ?? ''] = Math.floor(w * 0.9); // Speed wingers
        if (w >= 4 && enemies[3]) comp[enemies[3].id] = Math.floor((w - 2) * 0.5); // Defense
        if (w >= 5 && enemies[4]) comp[enemies[4].id] = Math.floor((w - 4) * 0.4); // Hot puck
        if (w >= 6 && enemies[5]) comp[enemies[5].id] = Math.floor((w - 5) * 0.6); // Flying
        if (w >= 8 && enemies[6]) comp[enemies[6].id] = Math.floor((w - 6) * 0.3); // Enforcer
        if (w >= 10 && enemies[8]) comp[enemies[8].id] = Math.floor((w - 9) * 0.2); // Goalie
        if (w % 5 === 0 && enemies[10]) comp[enemies[10].id] = 1 + Math.floor(w / 10); // Boss
      } else {
        // Soccer: Fewer but tougher enemies, slower build-up, tactical waves
        comp[enemies[0].id] = 4 + Math.floor(w * 1.2); // Fewer balls
        if (w >= 2) comp[enemies[1]?.id ?? ''] = Math.floor(w * 0.7); // Ball runners
        if (w >= 3) comp[enemies[2]?.id ?? ''] = Math.floor(w * 0.6); // Strikers
        if (w >= 5 && enemies[3]) comp[enemies[3].id] = Math.floor((w - 3) * 0.5); // Defenders
        if (w >= 6 && enemies[4]) comp[enemies[4].id] = Math.floor((w - 5) * 0.4); // Fire ball
        if (w >= 7 && enemies[5]) comp[enemies[5].id] = Math.floor((w - 6) * 0.5); // Flying
        if (w >= 9 && enemies[6]) comp[enemies[6].id] = Math.floor((w - 7) * 0.3); // Playmaker
        if (w >= 11 && enemies[8]) comp[enemies[8].id] = Math.floor((w - 10) * 0.2); // Heavy ball
        if (w % 5 === 0 && enemies[10]) comp[enemies[10].id] = 1 + Math.floor(w / 12); // Boss
      }
      
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
      const towerType = shot.tower.type;
      const projectileType = towerType.projectile || 'default';
      
      // Different speeds based on tower type
      let speed = 14;
      if (projectileType === 'puck' || projectileType === 'dart') speed = 18;
      if (projectileType === 'shard' || projectileType === 'tackle') speed = 12;
      if (projectileType === 'ball' || projectileType === 'curveBall') speed = 15;
      
      this.projectiles.fire(
        shot.tower.mesh.position.clone(),
        shot.targetId,
        this.towers.getDamage(shot.tower),
        towerType.color,
        projectileType,
        speed,
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

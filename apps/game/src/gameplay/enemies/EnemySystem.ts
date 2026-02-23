import * as THREE from 'three';
import type { EnemyType } from './enemyTypes.ts';
import type { BuiltPath } from '../pathing/PathingEngine.ts';
import { SceneFactory } from '../../three/SceneFactory.ts';
import { GAME_CONSTANTS } from '../economy/economy.ts';

export interface ActiveEnemy {
  id: string;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  mesh: THREE.Object3D;
  pathIndex: number;
  pathProgress: number;
  path: BuiltPath;
  done: boolean;
  slowTimer: number;
}

let enemyIdCounter = 0;

export class EnemySystem {
  private scene: THREE.Scene;
  enemies: ActiveEnemy[] = [];
  private spawnTimer = 0;
  private spawnQueue: Array<{ type: EnemyType; path: BuiltPath }> = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  queueWave(waveEnemy: EnemyType, count: number, path: BuiltPath, waveNum: number): void {
    const hpScale = 1 + waveNum * GAME_CONSTANTS.ENEMY_HP_SCALE_PER_WAVE;
    for (let i = 0; i < count; i++) {
      this.spawnQueue.push({ type: waveEnemy, path });
    }
    void hpScale;
  }

  update(dt: number, gameSpeed: number): { reached: ActiveEnemy[]; killed: ActiveEnemy[] } {
    const reached: ActiveEnemy[] = [];
    const killed: ActiveEnemy[] = [];

    // Spawn from queue
    this.spawnTimer -= dt * 1000 * gameSpeed;
    if (this.spawnTimer <= 0 && this.spawnQueue.length > 0) {
      const item = this.spawnQueue.shift()!;
      this.spawnEnemy(item.type, item.path);
      this.spawnTimer = GAME_CONSTANTS.ENEMY_SPAWN_DELAY;
    }

    const toRemove: ActiveEnemy[] = [];

    for (const enemy of this.enemies) {
      if (enemy.done) continue;

      const speedMult = enemy.slowTimer > 0 ? 0.5 : 1;
      const actualSpeed = enemy.speed * speedMult * gameSpeed;

      // Move along path
      const waypoints = enemy.path.waypoints;
      if (enemy.pathIndex >= waypoints.length - 1) {
        enemy.done = true;
        reached.push(enemy);
        toRemove.push(enemy);
        continue;
      }

      const target = waypoints[enemy.pathIndex + 1];
      const dir = target.clone().sub(enemy.mesh.position).normalize();
      const dist = enemy.mesh.position.distanceTo(target);
      const move = actualSpeed * dt;

      if (move >= dist) {
        enemy.mesh.position.copy(target);
        enemy.pathIndex++;
      } else {
        enemy.mesh.position.addScaledVector(dir, move);
      }

      if (enemy.slowTimer > 0) enemy.slowTimer -= dt;
    }

    // Remove finished
    for (const e of toRemove) {
      this.scene.remove(e.mesh);
      this.enemies = this.enemies.filter((x) => x.id !== e.id);
    }

    return { reached, killed };
  }

  damage(enemyId: string, dmg: number): ActiveEnemy | null {
    const enemy = this.enemies.find((e) => e.id === enemyId);
    if (!enemy) return null;
    enemy.hp -= dmg;
    if (enemy.hp <= 0) {
      this.scene.remove(enemy.mesh);
      this.enemies = this.enemies.filter((e) => e.id !== enemyId);
      return enemy;
    }
    return null;
  }

  hasEnemiesOrQueue(): boolean {
    return this.enemies.length > 0 || this.spawnQueue.length > 0;
  }

  private spawnEnemy(type: EnemyType, path: BuiltPath): void {
    const mesh = SceneFactory.createEnemyMesh(type.size);
    const start = path.waypoints[0].clone();
    mesh.position.copy(start);
    this.scene.add(mesh);

    const enemy: ActiveEnemy = {
      id: `enemy_${++enemyIdCounter}`,
      type,
      hp: type.hp,
      maxHp: type.hp,
      speed: type.speed,
      mesh,
      pathIndex: 0,
      pathProgress: 0,
      path,
      done: false,
      slowTimer: 0,
    };
    this.enemies.push(enemy);
  }

  destroy(): void {
    for (const e of this.enemies) {
      this.scene.remove(e.mesh);
    }
    this.enemies = [];
    this.spawnQueue = [];
  }
}

import * as THREE from 'three';
import type { TowerType } from './towerTypes.ts';
import { SceneFactory } from '../../three/SceneFactory.ts';
import { GAME_CONSTANTS } from '../economy/economy.ts';

export interface PlacedTower {
  id: string;
  type: TowerType;
  level: number;
  mesh: THREE.Object3D;
  gridX: number;
  gridY: number;
  fireTimer: number;
  totalSpent: number;
}

let towerIdCounter = 0;

export class TowerSystem {
  private scene: THREE.Scene;
  towers: PlacedTower[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  placeTower(type: TowerType, gridX: number, gridY: number, worldPos: THREE.Vector3): PlacedTower {
    const mesh = SceneFactory.createTowerMesh(type.color);
    mesh.position.set(worldPos.x, 0, worldPos.z);
    this.scene.add(mesh);

    const tower: PlacedTower = {
      id: `tower_${++towerIdCounter}`,
      type,
      level: 0,
      mesh,
      gridX,
      gridY,
      fireTimer: 0,
      totalSpent: type.cost,
    };
    this.towers.push(tower);
    return tower;
  }

  upgradeTower(tower: PlacedTower): number {
    const cost = tower.type.upgradeCosts[tower.level];
    if (cost === undefined) return 0;
    tower.level++;
    tower.totalSpent += cost;
    return cost;
  }

  sellTower(tower: PlacedTower): number {
    const value = Math.floor(tower.totalSpent * GAME_CONSTANTS.SELL_VALUE_MULTIPLIER);
    this.scene.remove(tower.mesh);
    this.towers = this.towers.filter((t) => t.id !== tower.id);
    return value;
  }

  getRange(tower: PlacedTower): number {
    return tower.type.range[tower.level];
  }

  getDamage(tower: PlacedTower): number {
    return tower.type.damage[tower.level];
  }

  getFireRate(tower: PlacedTower): number {
    return tower.type.fireRate[tower.level];
  }

  update(dt: number, enemies: { id: string; mesh: THREE.Object3D; hp: number }[]): Array<{ tower: PlacedTower; targetId: string }> {
    const shots: Array<{ tower: PlacedTower; targetId: string }> = [];

    for (const tower of this.towers) {
      tower.fireTimer -= dt;
      if (tower.fireTimer > 0) continue;

      const range = this.getRange(tower);
      let closest: { dist: number; id: string } | null = null;

      for (const enemy of enemies) {
        const dist = tower.mesh.position.distanceTo(enemy.mesh.position);
        if (dist <= range && (closest === null || dist < closest.dist)) {
          closest = { dist, id: enemy.id };
        }
      }

      if (closest) {
        tower.fireTimer = 1 / this.getFireRate(tower);
        shots.push({ tower, targetId: closest.id });
      }
    }

    return shots;
  }

  destroy(): void {
    for (const t of this.towers) {
      this.scene.remove(t.mesh);
    }
    this.towers = [];
  }
}

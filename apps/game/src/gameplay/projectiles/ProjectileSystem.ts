import * as THREE from 'three';
import { SceneFactory } from '../../three/SceneFactory.ts';

export interface ActiveProjectile {
  id: string;
  mesh: THREE.Object3D;
  targetId: string;
  damage: number;
  speed: number;
}

let projIdCounter = 0;

export class ProjectileSystem {
  private scene: THREE.Scene;
  projectiles: ActiveProjectile[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  fire(from: THREE.Vector3, targetId: string, damage: number, color = '#ffffff'): void {
    const mesh = SceneFactory.createProjectileMesh(color);
    mesh.position.copy(from).setY(0.5);
    this.scene.add(mesh);
    this.projectiles.push({
      id: `proj_${++projIdCounter}`,
      mesh,
      targetId,
      damage,
      speed: 14,
    });
  }

  update(dt: number, enemies: Map<string, THREE.Object3D>): Array<{ projectileId: string; targetId: string; damage: number }> {
    const hits: Array<{ projectileId: string; targetId: string; damage: number }> = [];
    const toRemove: string[] = [];

    for (const proj of this.projectiles) {
      const targetMesh = enemies.get(proj.targetId);
      if (!targetMesh) {
        toRemove.push(proj.id);
        continue;
      }

      const dir = targetMesh.position.clone().setY(0.5).sub(proj.mesh.position);
      const dist = dir.length();

      if (dist < 0.3) {
        hits.push({ projectileId: proj.id, targetId: proj.targetId, damage: proj.damage });
        toRemove.push(proj.id);
      } else {
        proj.mesh.position.addScaledVector(dir.normalize(), proj.speed * dt);
      }
    }

    for (const id of toRemove) {
      const p = this.projectiles.find((p) => p.id === id);
      if (p) {
        this.scene.remove(p.mesh);
        this.projectiles = this.projectiles.filter((x) => x.id !== id);
      }
    }

    return hits;
  }

  destroy(): void {
    for (const p of this.projectiles) {
      this.scene.remove(p.mesh);
    }
    this.projectiles = [];
  }
}

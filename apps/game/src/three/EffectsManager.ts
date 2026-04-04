import * as THREE from 'three';
import { SceneFactory } from './SceneFactory.ts';

interface ActiveEffect {
  mesh: THREE.Object3D;
  startTime: number;
  duration: number;
  onUpdate?: (progress: number, mesh: THREE.Object3D) => void;
}

export class EffectsManager {
  private scene: THREE.Scene;
  private effects: ActiveEffect[] = [];
  private currentTime = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  update(dt: number): void {
    this.currentTime += dt;
    const toRemove: ActiveEffect[] = [];

    for (const effect of this.effects) {
      const elapsed = this.currentTime - effect.startTime;
      const progress = Math.min(elapsed / effect.duration, 1);

      if (effect.onUpdate) {
        effect.onUpdate(progress, effect.mesh);
      }

      if (progress >= 1) {
        this.scene.remove(effect.mesh);
        toRemove.push(effect);
      }
    }

    this.effects = this.effects.filter((e) => !toRemove.includes(e));
  }

  // Impact flash effect when projectile hits
  createImpactFlash(position: THREE.Vector3, color: string): void {
    const mesh = SceneFactory.createImpactFlash(color, 0.3);
    mesh.position.copy(position);
    this.scene.add(mesh);

    this.effects.push({
      mesh,
      startTime: this.currentTime,
      duration: 0.2,
      onUpdate: (progress, m) => {
        const scale = 1 + progress * 2;
        m.scale.set(scale, scale, scale);
        const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.8 * (1 - progress);
      },
    });
  }

  // Death animation: enemy fades and shrinks
  createDeathEffect(mesh: THREE.Object3D, duration = 0.5): void {
    const originalScale = mesh.scale.clone();
    
    this.effects.push({
      mesh,
      startTime: this.currentTime,
      duration,
      onUpdate: (progress) => {
        const scale = (1 - progress) * originalScale.x;
        mesh.scale.set(scale, scale, scale);
        
        // Fade material if available
        const m = mesh as THREE.Mesh;
        if (m.material) {
          const mat = m.material as THREE.MeshStandardMaterial;
          if (mat.transparent === undefined) {
            mat.transparent = true;
            mat.opacity = 1;
          }
          mat.opacity = 1 - progress;
        }
      },
    });
  }

  // Tower firing effect: brief scale pulse
  createFirePulse(mesh: THREE.Object3D): void {
    const originalScale = mesh.scale.clone();
    
    this.effects.push({
      mesh,
      startTime: this.currentTime,
      duration: 0.15,
      onUpdate: (progress) => {
        const pulse = progress < 0.5 ? progress * 0.3 : (1 - progress) * 0.3;
        const scale = originalScale.x * (1 + pulse);
        mesh.scale.set(scale, scale, scale);
      },
    });
  }

  // Projectile trail effect
  createProjectileTrail(position: THREE.Vector3, color: string): void {
    const geo = new THREE.SphereGeometry(0.05, 6, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    this.scene.add(mesh);

    this.effects.push({
      mesh,
      startTime: this.currentTime,
      duration: 0.3,
      onUpdate: (progress, m) => {
        const scale = 1 - progress * 0.5;
        m.scale.set(scale, scale, scale);
        (m as THREE.Mesh).material.opacity = 0.5 * (1 - progress);
      },
    });
  }

  destroy(): void {
    for (const effect of this.effects) {
      this.scene.remove(effect.mesh);
    }
    this.effects = [];
  }
}

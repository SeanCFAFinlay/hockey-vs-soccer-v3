/**
 * Visual Effects Module
 * Handles particles, flashes, and other visual enhancements
 */

import * as THREE from 'three';

class Effects {
  constructor(scene, qualityManager) {
    this.scene = scene;
    this.qualityManager = qualityManager;
    this.particles = [];
    this.flashes = [];
  }

  // Muzzle flash when tower fires
  createMuzzleFlash(position, color = 0xffaa00) {
    const flash = new THREE.PointLight(color, 2, 5);
    flash.position.copy(position);
    this.scene.add(flash);
    
    this.flashes.push({
      light: flash,
      startTime: Date.now(),
      duration: 100
    });
  }

  // Impact flash on hit
  createImpactFlash(position, color = 0xff4400) {
    const flash = new THREE.PointLight(color, 1.5, 3);
    flash.position.copy(position);
    this.scene.add(flash);
    
    this.flashes.push({
      light: flash,
      startTime: Date.now(),
      duration: 150
    });
  }

  // Particle burst on enemy death
  createExplosion(position, color = 0xff6600, particleCount = 8) {
    const settings = this.qualityManager.getSettings();
    const count = Math.floor(particleCount * settings.particleCount);
    
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(0.1, 4, 4);
      const material = new THREE.MeshBasicMaterial({ color });
      const particle = new THREE.Mesh(geometry, material);
      
      particle.position.copy(position);
      
      // Random velocity
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      );
      
      this.scene.add(particle);
      
      this.particles.push({
        mesh: particle,
        velocity,
        life: 1.0,
        gravity: -5
      });
    }
  }

  // Shockwave effect
  createShockwave(position, color = 0xff6600) {
    const geometry = new THREE.RingGeometry(0.1, 0.2, 16);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const shockwave = new THREE.Mesh(geometry, material);
    shockwave.position.copy(position);
    shockwave.position.y = 0.1;
    shockwave.rotation.x = -Math.PI / 2;
    
    this.scene.add(shockwave);
    
    this.particles.push({
      mesh: shockwave,
      velocity: new THREE.Vector3(0, 0, 0),
      life: 1.0,
      isShockwave: true,
      scale: 0.1
    });
  }

  // Update all effects
  update(deltaTime) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      if (p.isShockwave) {
        // Expand shockwave
        p.scale += deltaTime * 8;
        p.mesh.scale.set(p.scale, p.scale, p.scale);
        p.life -= deltaTime * 2;
        p.mesh.material.opacity = p.life * 0.8;
      } else {
        // Standard particle physics
        p.velocity.y += p.gravity * deltaTime;
        p.mesh.position.x += p.velocity.x * deltaTime;
        p.mesh.position.y += p.velocity.y * deltaTime;
        p.mesh.position.z += p.velocity.z * deltaTime;
        p.life -= deltaTime;
        
        if (p.mesh.material.opacity !== undefined) {
          p.mesh.material.opacity = p.life;
        }
      }
      
      // Remove dead particles
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
    
    // Update flashes
    const now = Date.now();
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const flash = this.flashes[i];
      const elapsed = now - flash.startTime;
      
      if (elapsed >= flash.duration) {
        this.scene.remove(flash.light);
        flash.light.dispose();
        this.flashes.splice(i, 1);
      } else {
        // Fade out
        const progress = elapsed / flash.duration;
        flash.light.intensity = flash.light.intensity * (1 - progress * 0.1);
      }
    }
  }

  // Camera shake
  shakeCamera(camera, intensity = 0.2, duration = 200) {
    const originalPosition = camera.position.clone();
    const startTime = Date.now();
    
    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        camera.position.copy(originalPosition);
        return;
      }
      
      const progress = elapsed / duration;
      const currentIntensity = intensity * (1 - progress);
      
      camera.position.x = originalPosition.x + (Math.random() - 0.5) * currentIntensity;
      camera.position.y = originalPosition.y + (Math.random() - 0.5) * currentIntensity;
      camera.position.z = originalPosition.z + (Math.random() - 0.5) * currentIntensity;
      
      requestAnimationFrame(shake);
    };
    
    shake();
  }

  clear() {
    // Clear all particles
    this.particles.forEach(p => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    });
    this.particles = [];
    
    // Clear all flashes
    this.flashes.forEach(f => {
      this.scene.remove(f.light);
      f.light.dispose();
    });
    this.flashes = [];
  }
}

export default Effects;

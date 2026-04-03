import * as THREE from 'three';

export class SceneFactory {
  static createTowerMesh(color: string, level = 0, big = false): THREE.Mesh {
    const baseSize = big ? 0.6 : 0.45;
    // Grow tower slightly with each level
    const size = baseSize * (1 + level * 0.1);
    const height = size * 1.5;
    
    const geo = new THREE.BoxGeometry(size, height, size);
    const baseColor = new THREE.Color(color);
    const brightness = 1 + level * 0.15;
    baseColor.multiplyScalar(brightness);
    
    const mat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: 0.6,
      emissive: baseColor,
      emissiveIntensity: 0.1 + level * 0.05,
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = height / 2;
    return mesh;
  }

  static createEnemyMesh(size: number, color = '#ff6666'): THREE.Mesh {
    const r = 0.25 * size;
    // Increase sphere detail for better look
    const geo = new THREE.SphereGeometry(r, 16, 16);
    const baseColor = new THREE.Color(color);
    
    const mat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.5,
      metalness: 0.3,
      emissive: baseColor,
      emissiveIntensity: 0.4,
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.y = r;
    return mesh;
  }

  static createProjectileMesh(color: string): THREE.Mesh {
    // Increase detail for smoother look
    const geo = new THREE.SphereGeometry(0.08, 12, 12);
    const baseColor = new THREE.Color(color);
    
    const mat = new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.2,
      metalness: 0.8,
      emissive: baseColor,
      emissiveIntensity: 0.8,
    });
    
    return new THREE.Mesh(geo, mat);
  }
  
  // Create a visual effect mesh for impacts
  static createImpactFlash(color: string, radius = 0.3): THREE.Mesh {
    const geo = new THREE.SphereGeometry(radius, 8, 8);
    const baseColor = new THREE.Color(color);
    
    const mat = new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.8,
    });
    
    return new THREE.Mesh(geo, mat);
  }
}

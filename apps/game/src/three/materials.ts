import * as THREE from 'three';

export function createGroundMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.1,
  });
}

export function createPathMaterial(color: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.7,
    metalness: 0.2,
  });
}

export function createTowerMaterial(color: string, level = 0): THREE.MeshStandardMaterial {
  const baseColor = new THREE.Color(color);
  // Slightly brighten with level
  const brightness = 1 + level * 0.15;
  baseColor.multiplyScalar(brightness);
  
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.4,
    metalness: 0.6,
    emissive: baseColor,
    emissiveIntensity: 0.1 + level * 0.05,
  });
}

export function createEnemyMaterial(color: string): THREE.MeshStandardMaterial {
  const baseColor = new THREE.Color(color);
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.5,
    metalness: 0.3,
    emissive: baseColor,
    emissiveIntensity: 0.4,
  });
}

export function createProjectileMaterial(color: string): THREE.MeshStandardMaterial {
  const baseColor = new THREE.Color(color);
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: 0.2,
    metalness: 0.8,
    emissive: baseColor,
    emissiveIntensity: 0.8,
  });
}

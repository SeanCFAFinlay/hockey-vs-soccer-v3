import * as THREE from 'three';

export class SceneFactory {
  static createTowerMesh(color: string, big = false): THREE.Mesh {
    const size = big ? 0.6 : 0.45;
    const geo = new THREE.BoxGeometry(size, size * 1.5, size);
    const mat = new THREE.MeshLambertMaterial({ color: new THREE.Color(color) });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.position.y = (size * 1.5) / 2;
    return mesh;
  }

  static createEnemyMesh(size: number, color = '#ffffff'): THREE.Mesh {
    const r = 0.25 * size;
    const geo = new THREE.SphereGeometry(r, 8, 8);
    const mat = new THREE.MeshLambertMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.3,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.position.y = r;
    return mesh;
  }

  static createProjectileMesh(color: string): THREE.Mesh {
    const geo = new THREE.SphereGeometry(0.08, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
    return new THREE.Mesh(geo, mat);
  }
}

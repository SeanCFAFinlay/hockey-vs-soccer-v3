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

  static createProjectileMesh(color: string, projectileType = 'default'): THREE.Mesh {
    let geo: THREE.BufferGeometry;
    
    switch (projectileType) {
      case 'puck': // Hockey slap shot - flat disc
        geo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 8);
        break;
      case 'dart': // Sniper - sharp cone
        geo = new THREE.ConeGeometry(0.06, 0.18, 6);
        break;
      case 'hammer': // Enforcer - cube
        geo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
        break;
      case 'shard': // Ice spray - crystal
        geo = new THREE.TetrahedronGeometry(0.1);
        break;
      case 'glove': // Goalie - larger sphere
        geo = new THREE.SphereGeometry(0.12, 8, 8);
        break;
      case 'lightning': // Power play - elongated
        geo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 4);
        break;
      case 'fireball': // Hot stick - glowing sphere
        geo = new THREE.SphereGeometry(0.1, 8, 8);
        break;
      case 'star': // Captain - star shape
        geo = new THREE.OctahedronGeometry(0.12);
        break;
      case 'ball': // Soccer striker - larger sphere
        geo = new THREE.SphereGeometry(0.11, 10, 10);
        break;
      case 'curveBall': // Free kick - elongated sphere
        geo = new THREE.SphereGeometry(0.1, 10, 8);
        break;
      case 'headButt': // Header - cube
        geo = new THREE.BoxGeometry(0.13, 0.13, 0.13);
        break;
      case 'tackle': // Tackle - wedge
        geo = new THREE.ConeGeometry(0.08, 0.15, 4);
        break;
      case 'chain': // Playmaker - small ring
        geo = new THREE.TorusGeometry(0.08, 0.03, 6, 8);
        break;
      case 'flare': // Flare - bright sphere
        geo = new THREE.SphereGeometry(0.09, 8, 8);
        break;
      case 'legend': // Legend - large octahedron
        geo = new THREE.OctahedronGeometry(0.14);
        break;
      default:
        geo = new THREE.SphereGeometry(0.08, 6, 6);
    }
    
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
    const mesh = new THREE.Mesh(geo, mat);
    
    // Add rotation animation for certain types
    if (['puck', 'star', 'chain', 'legend'].includes(projectileType)) {
      mesh.userData.rotateOnFly = true;
    }
    
    return mesh;
  }
}

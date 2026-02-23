import * as THREE from 'three';
import type { MapDefinition } from '@hvsv3/shared';

interface ThemeConfig {
  groundColor: number;
  pathColor: number;
}

const CELL_SIZE = 1;

export class Terrain {
  private scene: THREE.Scene;
  private meshes: THREE.Mesh[] = [];
  private pathCells: Set<string> = new Set();
  public groundMeshes: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene, theme: ThemeConfig, map: MapDefinition) {
    this.scene = scene;
    this.build(theme, map);
  }

  private build(theme: ThemeConfig, map: MapDefinition): void {
    const { cols, rows } = map;
    const offsetX = (cols * CELL_SIZE) / 2;
    const offsetZ = (rows * CELL_SIZE) / 2;

    // Collect path nodes
    const pathNodes = map.entities
      .filter((e) => e.meta?.kind === 'pathNode')
      .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0));
    for (const n of pathNodes) {
      this.pathCells.add(`${n.x},${n.y}`);
    }

    // Build ground grid
    const groundGeo = new THREE.PlaneGeometry(CELL_SIZE, CELL_SIZE);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const isPath = this.pathCells.has(`${c},${r}`);
        const mat = new THREE.MeshLambertMaterial({
          color: isPath ? theme.pathColor : theme.groundColor,
        });
        const mesh = new THREE.Mesh(groundGeo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(
          c * CELL_SIZE - offsetX + CELL_SIZE / 2,
          0,
          r * CELL_SIZE - offsetZ + CELL_SIZE / 2,
        );
        mesh.receiveShadow = true;
        mesh.userData = { gridX: c, gridY: r, type: isPath ? 'path' : 'ground' };
        this.scene.add(mesh);
        this.meshes.push(mesh);
        if (!isPath) this.groundMeshes.push(mesh);
      }
    }

    // Grid lines overlay
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 });
    for (let c = 0; c <= cols; c++) {
      const x = c * CELL_SIZE - offsetX;
      const points = [
        new THREE.Vector3(x, 0.01, -offsetZ),
        new THREE.Vector3(x, 0.01, rows * CELL_SIZE - offsetZ),
      ];
      this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat));
    }
    for (let r = 0; r <= rows; r++) {
      const z = r * CELL_SIZE - offsetZ;
      const points = [
        new THREE.Vector3(-offsetX, 0.01, z),
        new THREE.Vector3(cols * CELL_SIZE - offsetX, 0.01, z),
      ];
      this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat));
    }
  }

  isPathCell(gridX: number, gridY: number): boolean {
    return this.pathCells.has(`${gridX},${gridY}`);
  }

  destroy(): void {
    for (const mesh of this.meshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
    this.meshes = [];
    this.groundMeshes = [];
  }
}

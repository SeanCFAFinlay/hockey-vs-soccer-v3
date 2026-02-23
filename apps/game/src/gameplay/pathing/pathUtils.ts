import * as THREE from 'three';
import type { GridPoint } from './PathingEngine.ts';

const CELL = 1;

export function gridToWorld(point: GridPoint, cols: number, rows: number): THREE.Vector3 {
  const offsetX = (cols * CELL) / 2;
  const offsetZ = (rows * CELL) / 2;
  return new THREE.Vector3(
    point.x * CELL - offsetX + CELL / 2,
    0,
    point.y * CELL - offsetZ + CELL / 2,
  );
}

export function worldToGrid(pos: THREE.Vector3, cols: number, rows: number): GridPoint {
  const offsetX = (cols * CELL) / 2;
  const offsetZ = (rows * CELL) / 2;
  return {
    x: Math.floor((pos.x + offsetX) / CELL),
    y: Math.floor((pos.z + offsetZ) / CELL),
  };
}

export function distanceTo(a: THREE.Vector3, b: THREE.Vector3): number {
  return a.distanceTo(b);
}

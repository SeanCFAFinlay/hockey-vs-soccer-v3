import type { MapDefinition } from '@hvsv3/shared';
import * as THREE from 'three';

export interface GridPoint {
  x: number;
  y: number;
}

export interface BuiltPath {
  id: string;
  waypoints: THREE.Vector3[];
}

export interface BuiltPaths {
  mainPaths: BuiltPath[];
}

export interface PathingEngine {
  build(map: MapDefinition): BuiltPaths;
}

import type { MapDefinition } from '@hvsv3/shared';
import type { PathingEngine, BuiltPaths } from './PathingEngine.ts';
import { gridToWorld } from './pathUtils.ts';

/**
 * LinearPathEngine: Single lane path.
 * Reads pathNode entities (sorted by order), or falls back to
 * a generated left→right path with mild row variation.
 */
export class LinearPathEngine implements PathingEngine {
  build(map: MapDefinition): BuiltPaths {
    const { cols, rows } = map;

    const nodes = map.entities
      .filter((e) => e.meta?.kind === 'pathNode')
      .sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0));

    if (nodes.length >= 2) {
      const waypoints = nodes.map((n) => gridToWorld({ x: n.x, y: n.y }, cols, rows));
      return { mainPaths: [{ id: 'main', waypoints }] };
    }

    // Fallback: auto-generate a mild row-varying path
    const waypoints = [];
    const midRow = Math.floor(rows / 2);
    let currentRow = midRow;

    for (let col = 0; col < cols; col++) {
      waypoints.push(gridToWorld({ x: col, y: currentRow }, cols, rows));
      if (col < cols - 1) {
        const variation = Math.floor(Math.random() * 3) - 1;
        currentRow = Math.max(0, Math.min(rows - 1, currentRow + variation));
      }
    }

    return { mainPaths: [{ id: 'main', waypoints }] };
  }
}

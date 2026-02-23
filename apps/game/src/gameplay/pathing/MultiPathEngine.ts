import type { MapDefinition } from '@hvsv3/shared';
import type { PathingEngine, BuiltPaths } from './PathingEngine.ts';
import { gridToWorld } from './pathUtils.ts';

/**
 * MultiPathEngine: Multiple named lane paths.
 * Groups pathNode entities by meta.pathId ("A", "B", etc.) and builds
 * one BuiltPath per lane, sorted by meta.order.
 */
export class MultiPathEngine implements PathingEngine {
  build(map: MapDefinition): BuiltPaths {
    const { cols, rows } = map;

    const nodes = map.entities.filter((e) => e.meta?.kind === 'pathNode');

    // Group by pathId
    const laneMap = new Map<string, typeof nodes>();
    for (const n of nodes) {
      const pathId = n.meta?.pathId ?? 'main';
      if (!laneMap.has(pathId)) laneMap.set(pathId, []);
      laneMap.get(pathId)!.push(n);
    }

    if (laneMap.size === 0) {
      // Fallback: two lanes top/bottom half
      const topRow = Math.floor(map.rows / 4);
      const botRow = Math.floor((map.rows * 3) / 4);
      return {
        mainPaths: [
          {
            id: 'A',
            waypoints: Array.from({ length: cols }, (_, c) =>
              gridToWorld({ x: c, y: topRow }, cols, rows),
            ),
          },
          {
            id: 'B',
            waypoints: Array.from({ length: cols }, (_, c) =>
              gridToWorld({ x: c, y: botRow }, cols, rows),
            ),
          },
        ],
      };
    }

    const mainPaths = Array.from(laneMap.entries()).map(([id, laneNodes]) => {
      const sorted = [...laneNodes].sort((a, b) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0));
      const waypoints = sorted.map((n) => gridToWorld({ x: n.x, y: n.y }, cols, rows));
      return { id, waypoints };
    });

    return { mainPaths };
  }
}

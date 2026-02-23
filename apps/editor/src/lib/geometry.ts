export interface GridPoint {
  x: number;
  y: number;
}

export function snapToGrid(px: number, cellSize: number): number {
  return Math.round(px / cellSize);
}

export function gridToCanvas(gridCoord: number, cellSize: number): number {
  return gridCoord * cellSize + cellSize / 2;
}

export function canvasToGrid(px: number, cellSize: number): number {
  return Math.floor(px / cellSize);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

import type { MapDefinition } from '@hvsv3/shared';
import { Engine } from '../three/Engine.ts';
import { MenuScreen } from './screens/MenuScreen.ts';
import { MapSelectScreen } from './screens/MapSelectScreen.ts';
import { GameScreen } from './screens/GameScreen.ts';
import { HOCKEY_TOWERS, SOCCER_TOWERS } from '../gameplay/towers/towerTypes.ts';
import { HOCKEY_ENEMIES, SOCCER_ENEMIES } from '../gameplay/enemies/enemyTypes.ts';
import { loadPack, loadGameState, saveGameState } from '../storage/gameStorage.ts';
import type { GameSaveState } from '../storage/gameStorage.ts';

// Default map definitions (used when no pack maps are available)
// Hockey maps: Fast-paced, tight defensive zones, quick rushes
const DEFAULT_HOCKEY_MAPS: MapDefinition[] = [
  { 
    id: 'hockey-1', 
    name: 'Warm-Up Lane', 
    theme: 'hockey', 
    slot: 1, 
    cols: 16, 
    rows: 10, 
    pathing: { type: 'linear' }, 
    entities: buildStraightPath(16, 10, 1, 5, 14, 5), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'hockey-2', 
    name: 'Breakaway Rush', 
    theme: 'hockey', 
    slot: 2, 
    cols: 20, 
    rows: 12, 
    pathing: { type: 'linear' }, 
    entities: buildZigzagPath(20, 12, 2, 3, 18, 9), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'hockey-3', 
    name: 'Defensive Zone', 
    theme: 'hockey', 
    slot: 3, 
    cols: 22, 
    rows: 13, 
    pathing: { type: 'linear' }, 
    entities: buildSpiralPath(22, 13, 1, 1, 20, 11), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'hockey-4', 
    name: 'Power Play Setup', 
    theme: 'hockey', 
    slot: 4, 
    cols: 24, 
    rows: 14, 
    pathing: { type: 'linear' }, 
    entities: buildWrapAroundPath(24, 14, 2, 2, 22, 12), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'hockey-5', 
    name: 'Stanley Finals', 
    theme: 'hockey', 
    slot: 5, 
    cols: 28, 
    rows: 16, 
    pathing: { type: 'linear' }, 
    entities: buildComplexPath(28, 16, 1, 8, 26, 8), 
    createdAt: 0, 
    updatedAt: 0 
  },
];

// Soccer maps: Wider spacing, positional play, tactical zones
const DEFAULT_SOCCER_MAPS: MapDefinition[] = [
  { 
    id: 'soccer-1', 
    name: 'Training Ground', 
    theme: 'soccer', 
    slot: 1, 
    cols: 18, 
    rows: 11, 
    pathing: { type: 'linear' }, 
    entities: buildStraightPath(18, 11, 2, 5, 16, 5), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'soccer-2', 
    name: 'Midfield Control', 
    theme: 'soccer', 
    slot: 2, 
    cols: 22, 
    rows: 13, 
    pathing: { type: 'linear' }, 
    entities: buildWidePath(22, 13, 3, 2, 19, 11), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'soccer-3', 
    name: 'Wing Attack', 
    theme: 'soccer', 
    slot: 3, 
    cols: 24, 
    rows: 14, 
    pathing: { type: 'linear' }, 
    entities: buildCurvedPath(24, 14, 1, 1, 23, 13), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'soccer-4', 
    name: 'Box Defense', 
    theme: 'soccer', 
    slot: 4, 
    cols: 26, 
    rows: 15, 
    pathing: { type: 'linear' }, 
    entities: buildBoxPath(26, 15, 2, 3, 24, 12), 
    createdAt: 0, 
    updatedAt: 0 
  },
  { 
    id: 'soccer-5', 
    name: 'World Cup Final', 
    theme: 'soccer', 
    slot: 5, 
    cols: 30, 
    rows: 18, 
    pathing: { type: 'linear' }, 
    entities: buildAdvancedPath(30, 18, 3, 3, 27, 15), 
    createdAt: 0, 
    updatedAt: 0 
  },
];

// Path building functions for unique map layouts
function buildStraightPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  const steps = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(startX + (endX - startX) * (i / steps));
    const y = Math.round(startY + (endY - startY) * (i / steps));
    nodes.push({ assetId: 'path', x, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: i } });
  }
  return nodes;
}

function buildZigzagPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  const midY1 = startY + 6;
  const midY2 = startY + 3;
  const midX = Math.floor((startX + endX) / 2);
  
  let order = 0;
  for (let x = startX; x <= midX; x++) {
    nodes.push({ assetId: 'path', x, y: startY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let y = startY + 1; y <= midY1; y++) {
    nodes.push({ assetId: 'path', x: midX, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let x = midX + 1; x <= endX; x++) {
    nodes.push({ assetId: 'path', x, y: midY1, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let y = midY1 - 1; y >= endY; y--) {
    nodes.push({ assetId: 'path', x: endX, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  return nodes;
}

function buildSpiralPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  let order = 0;
  
  // Start to center spiral
  for (let x = startX; x <= centerX; x++) {
    nodes.push({ assetId: 'path', x, y: startY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let y = startY + 1; y <= centerY; y++) {
    nodes.push({ assetId: 'path', x: centerX, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let x = centerX + 1; x <= endX; x++) {
    nodes.push({ assetId: 'path', x, y: centerY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let y = centerY + 1; y <= endY; y++) {
    nodes.push({ assetId: 'path', x: endX, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  return nodes;
}

function buildWrapAroundPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  let order = 0;
  
  // Go along top
  for (let x = startX; x <= endX - 4; x++) {
    nodes.push({ assetId: 'path', x, y: startY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  // Down right side
  for (let y = startY; y <= endY; y++) {
    nodes.push({ assetId: 'path', x: endX - 4, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  // Along bottom
  for (let x = endX - 3; x <= endX; x++) {
    nodes.push({ assetId: 'path', x, y: endY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  return nodes;
}

function buildComplexPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  let order = 0;
  
  // Multi-turn complex path
  const points = [
    [startX, startY],
    [8, startY],
    [8, 4],
    [15, 4],
    [15, 12],
    [22, 12],
    [22, endY],
    [endX, endY]
  ];
  
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let j = 0; j <= steps; j++) {
      const x = Math.round(x1 + (x2 - x1) * (j / steps));
      const y = Math.round(y1 + (y2 - y1) * (j / steps));
      if (i > 0 && j === 0) continue; // Skip duplicate points
      nodes.push({ assetId: 'path', x, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
    }
  }
  return nodes;
}

function buildWidePath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  const midX = Math.floor((startX + endX) / 2);
  let order = 0;
  
  for (let x = startX; x <= midX; x++) {
    nodes.push({ assetId: 'path', x, y: startY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let y = startY; y <= endY; y++) {
    nodes.push({ assetId: 'path', x: midX, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let x = midX; x <= endX; x++) {
    nodes.push({ assetId: 'path', x, y: endY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  return nodes;
}

function buildCurvedPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  let order = 0;
  
  // Simulate curve with stepped diagonal
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(startX + (endX - startX) * t);
    const y = Math.round(startY + (endY - startY) * t + Math.sin(t * Math.PI) * 3);
    nodes.push({ assetId: 'path', x, y: Math.max(1, Math.min(rows - 2, y)), rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  return nodes;
}

function buildBoxPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  let order = 0;
  
  // Rectangle path
  for (let x = startX; x <= endX; x++) {
    nodes.push({ assetId: 'path', x, y: startY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let y = startY + 1; y <= endY; y++) {
    nodes.push({ assetId: 'path', x: endX, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  for (let x = endX - 1; x >= startX + 5; x--) {
    nodes.push({ assetId: 'path', x, y: endY, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
  }
  return nodes;
}

function buildAdvancedPath(cols: number, rows: number, startX: number, startY: number, endX: number, endY: number): any[] {
  const nodes = [];
  let order = 0;
  
  // S-curve advanced path
  const points = [
    [startX, startY],
    [10, startY],
    [10, 8],
    [18, 8],
    [18, 14],
    [endX, 14],
    [endX, endY]
  ];
  
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    for (let j = 0; j <= steps; j++) {
      const x = Math.round(x1 + (x2 - x1) * (j / steps));
      const y = Math.round(y1 + (y2 - y1) * (j / steps));
      if (i > 0 && j === 0) continue;
      nodes.push({ assetId: 'path', x, y, rotationDeg: 0, scale: 1, meta: { kind: 'pathNode', order: order++ } });
    }
  }
  return nodes;
}

export class GameApp {
  private container: HTMLElement;
  private engine: Engine;
  private menuScreen: MenuScreen | null = null;
  private mapScreen: MapSelectScreen | null = null;
  private gameScreen: GameScreen | null = null;
  private saveState: GameSaveState;

  constructor(container: HTMLElement) {
    this.container = container;
    this.saveState = loadGameState();

    // Create a hidden canvas for the engine
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    // We'll append it later in GameScreen
    document.body.appendChild(canvas);

    this.engine = new Engine(canvas);
    this.gameScreen = new GameScreen(container, this.engine, () => this.showMenu());

    this.showMenu();
  }

  private showMenu(): void {
    this.mapScreen?.hide();
    this.mapScreen?.destroy();
    this.mapScreen = null;
    this.gameScreen?.hide();

    this.menuScreen?.destroy();
    this.menuScreen = new MenuScreen(this.container, (theme) => {
      this.menuScreen?.hide();
      this.showMapSelect(theme);
    });
    this.menuScreen.show();
  }

  private showMapSelect(theme: 'hockey' | 'soccer'): void {
    this.saveState.lastTheme = theme;
    saveGameState(this.saveState);

    const pack = loadPack();
    const packMaps = pack.maps.filter((m) => m.theme === theme);
    const maps = packMaps.length > 0
      ? packMaps.sort((a, b) => a.slot - b.slot)
      : (theme === 'hockey' ? DEFAULT_HOCKEY_MAPS : DEFAULT_SOCCER_MAPS);

    const progress: Record<string, { stars: number; locked: boolean; lastPlayed: boolean }> = {};
    maps.forEach((m, i) => {
      const stars = this.saveState.stars[m.id] ?? 0;
      const prevId = i > 0 ? maps[i - 1].id : null;
      const prevStars = prevId ? (this.saveState.stars[prevId] ?? 0) : 1;
      progress[m.id] = {
        stars,
        locked: i > 0 && prevStars === 0,
        lastPlayed: m.id === this.saveState.lastPlayedMap,
      };
    });

    this.mapScreen = new MapSelectScreen(
      this.container,
      theme,
      maps,
      progress,
      () => this.showMenu(),
      (map) => this.startGame(theme, map),
    );
    this.mapScreen.show();
  }

  private startGame(theme: 'hockey' | 'soccer', map: MapDefinition): void {
    this.mapScreen?.hide();
    this.saveState.lastPlayedMap = map.id;
    saveGameState(this.saveState);

    const config = {
      theme,
      towers: theme === 'hockey' ? HOCKEY_TOWERS : SOCCER_TOWERS,
      enemies: theme === 'hockey' ? HOCKEY_ENEMIES : SOCCER_ENEMIES,
      map,
      totalWaves: 15,
      startMoney: 650,
      startLives: 20,
    };

    this.gameScreen?.startGame(config);
    this.gameScreen?.show();
  }
}

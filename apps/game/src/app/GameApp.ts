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
const DEFAULT_HOCKEY_MAPS: MapDefinition[] = [
  { id: 'hockey-1', name: 'Practice Rink', theme: 'hockey', slot: 1, cols: 18, rows: 11, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'hockey-2', name: 'Local Arena', theme: 'hockey', slot: 2, cols: 20, rows: 12, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'hockey-3', name: 'College Ice', theme: 'hockey', slot: 3, cols: 22, rows: 13, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'hockey-4', name: 'Pro Stadium', theme: 'hockey', slot: 4, cols: 24, rows: 14, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'hockey-5', name: 'Stanley Cup', theme: 'hockey', slot: 5, cols: 26, rows: 15, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
];

const DEFAULT_SOCCER_MAPS: MapDefinition[] = [
  { id: 'soccer-1', name: 'Backyard', theme: 'soccer', slot: 1, cols: 18, rows: 11, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'soccer-2', name: 'School Field', theme: 'soccer', slot: 2, cols: 20, rows: 12, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'soccer-3', name: 'Club Ground', theme: 'soccer', slot: 3, cols: 22, rows: 13, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'soccer-4', name: 'Premier League', theme: 'soccer', slot: 4, cols: 24, rows: 14, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
  { id: 'soccer-5', name: 'World Cup', theme: 'soccer', slot: 5, cols: 26, rows: 15, pathing: { type: 'linear' }, entities: [], createdAt: 0, updatedAt: 0 },
];

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

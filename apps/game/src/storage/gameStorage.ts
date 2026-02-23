import type { PackExport } from '@hvsv3/shared';
import { TD_PACK_KEY, TD_GAME_STATE_KEY, PACK_VERSION } from '@hvsv3/shared';

export interface GameSaveState {
  lastTheme: 'hockey' | 'soccer';
  stars: Record<string, number>;
  lastPlayedMap: string | null;
}

export function loadPack(): PackExport {
  try {
    const raw = localStorage.getItem(TD_PACK_KEY);
    if (!raw) return { version: PACK_VERSION, assets: [], maps: [] };
    return JSON.parse(raw) as PackExport;
  } catch {
    return { version: PACK_VERSION, assets: [], maps: [] };
  }
}

export function loadGameState(): GameSaveState {
  try {
    const raw = localStorage.getItem(TD_GAME_STATE_KEY);
    if (!raw) return { lastTheme: 'hockey', stars: {}, lastPlayedMap: null };
    return JSON.parse(raw) as GameSaveState;
  } catch {
    return { lastTheme: 'hockey', stars: {}, lastPlayedMap: null };
  }
}

export function saveGameState(state: GameSaveState): void {
  localStorage.setItem(TD_GAME_STATE_KEY, JSON.stringify(state));
}

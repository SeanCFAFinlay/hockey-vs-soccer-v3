export const TD_PACK_KEY = 'td:pack:v1';
export const TD_EDITOR_STATE_KEY = 'td:editor:v1';
export const TD_GAME_STATE_KEY = 'td:game:v1';

export const PACK_VERSION = 1;

export const ASSET_CATEGORIES = [
  'tower',
  'enemy',
  'obstacle',
  'pen',
  'ui',
  'character',
  'fx',
  'projectile',
  'prop',
  'terrain',
] as const;

export const THEME_IDS = ['hockey', 'soccer', 'shared'] as const;

export const PATHING_TYPES = ['linear', 'multipath'] as const;

export const MAP_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

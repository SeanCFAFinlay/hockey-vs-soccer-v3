import { ASSET_CATEGORIES, THEME_IDS, PATHING_TYPES, MAP_SLOTS } from './constants.js';

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateAsset(asset: unknown): ValidationResult {
  const errors: string[] = [];

  if (!asset || typeof asset !== 'object') {
    return { ok: false, errors: ['Asset must be an object'] };
  }

  const a = asset as Record<string, unknown>;

  if (typeof a.id !== 'string' || !a.id) errors.push('Asset.id must be a non-empty string');
  if (typeof a.name !== 'string' || !a.name) errors.push('Asset.name must be a non-empty string');
  if (!ASSET_CATEGORIES.includes(a.category as never))
    errors.push(`Asset.category must be one of: ${ASSET_CATEGORIES.join(', ')}`);
  if (!THEME_IDS.includes(a.theme as never))
    errors.push(`Asset.theme must be one of: ${THEME_IDS.join(', ')}`);
  if (a.sizeHint !== 'normal' && a.sizeHint !== 'big')
    errors.push("Asset.sizeHint must be 'normal' or 'big'");

  return { ok: errors.length === 0, errors };
}

export function validateMap(map: unknown): ValidationResult {
  const errors: string[] = [];

  if (!map || typeof map !== 'object') {
    return { ok: false, errors: ['Map must be an object'] };
  }

  const m = map as Record<string, unknown>;

  if (typeof m.id !== 'string' || !m.id) errors.push('Map.id must be a non-empty string');
  if (typeof m.name !== 'string' || !m.name) errors.push('Map.name must be a non-empty string');
  if (m.theme !== 'hockey' && m.theme !== 'soccer')
    errors.push("Map.theme must be 'hockey' or 'soccer'");
  if (!MAP_SLOTS.includes(m.slot as never))
    errors.push(`Map.slot must be one of: ${MAP_SLOTS.join(', ')}`);
  if (typeof m.cols !== 'number' || m.cols < 1) errors.push('Map.cols must be a positive number');
  if (typeof m.rows !== 'number' || m.rows < 1) errors.push('Map.rows must be a positive number');

  if (!m.pathing || typeof m.pathing !== 'object') {
    errors.push('Map.pathing must be an object');
  } else {
    const p = m.pathing as Record<string, unknown>;
    if (!PATHING_TYPES.includes(p.type as never))
      errors.push(`Map.pathing.type must be one of: ${PATHING_TYPES.join(', ')}`);
  }

  if (!Array.isArray(m.entities)) errors.push('Map.entities must be an array');

  if (typeof m.createdAt !== 'number') errors.push('Map.createdAt must be a number');
  if (typeof m.updatedAt !== 'number') errors.push('Map.updatedAt must be a number');

  return { ok: errors.length === 0, errors };
}

export function validatePack(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { ok: false, errors: ['Pack must be an object'] };
  }

  const d = data as Record<string, unknown>;

  if (typeof d.version !== 'number') errors.push('Pack.version must be a number');
  if (!Array.isArray(d.assets)) errors.push('Pack.assets must be an array');
  if (!Array.isArray(d.maps)) errors.push('Pack.maps must be an array');

  if (Array.isArray(d.assets)) {
    (d.assets as unknown[]).forEach((a, i) => {
      const result = validateAsset(a);
      if (!result.ok) errors.push(...result.errors.map(e => `assets[${i}]: ${e}`));
    });
  }

  if (Array.isArray(d.maps)) {
    (d.maps as unknown[]).forEach((m, i) => {
      const result = validateMap(m);
      if (!result.ok) errors.push(...result.errors.map(e => `maps[${i}]: ${e}`));
    });
  }

  return { ok: errors.length === 0, errors };
}

import type { PackExport, Asset, MapDefinition } from './types.js';
import { PACK_VERSION } from './constants.js';
import { validatePack } from './validate.js';

export function exportPack({ assets, maps }: { assets: Asset[]; maps: MapDefinition[] }): string {
  const pack: PackExport = {
    version: PACK_VERSION,
    assets,
    maps,
  };
  return JSON.stringify(pack, null, 2);
}

export function importPack(json: string): PackExport {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }

  const result = validatePack(data);
  if (!result.ok) {
    throw new Error(`Invalid pack: ${result.errors.join('; ')}`);
  }

  return data as PackExport;
}

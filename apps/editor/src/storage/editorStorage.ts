import type { PackExport, Asset, MapDefinition } from '@hvsv3/shared';
import { TD_PACK_KEY, PACK_VERSION } from '@hvsv3/shared';

function emptyPack(): PackExport {
  return { version: PACK_VERSION, assets: [], maps: [] };
}

export function loadPack(): PackExport {
  try {
    const raw = localStorage.getItem(TD_PACK_KEY);
    if (!raw) return emptyPack();
    return JSON.parse(raw) as PackExport;
  } catch {
    return emptyPack();
  }
}

export function savePack(pack: PackExport): void {
  localStorage.setItem(TD_PACK_KEY, JSON.stringify(pack));
}

export function saveAssets(assets: Asset[]): void {
  const pack = loadPack();
  savePack({ ...pack, assets });
}

export function saveMaps(maps: MapDefinition[]): void {
  const pack = loadPack();
  savePack({ ...pack, maps });
}

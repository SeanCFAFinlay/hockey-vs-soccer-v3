import type { PackExport, Asset, MapDefinition } from './types.js';

/**
 * Safe merge strategy:
 * - assets merge by id (incoming overwrites existing)
 * - maps merge by id (incoming overwrites existing)
 * - never deletes local items
 */
export function mergePacks(local: PackExport, incoming: PackExport): PackExport {
  const assetMap = new Map<string, Asset>();

  // Start with local assets
  for (const asset of local.assets) {
    assetMap.set(asset.id, asset);
  }
  // Overwrite with incoming
  for (const asset of incoming.assets) {
    assetMap.set(asset.id, asset);
  }

  const mapMap = new Map<string, MapDefinition>();

  // Start with local maps
  for (const map of local.maps) {
    mapMap.set(map.id, map);
  }
  // Overwrite with incoming
  for (const map of incoming.maps) {
    mapMap.set(map.id, map);
  }

  return {
    version: Math.max(local.version, incoming.version),
    assets: Array.from(assetMap.values()),
    maps: Array.from(mapMap.values()),
  };
}

export type ThemeId = 'hockey' | 'soccer' | 'shared';

export type AssetCategory =
  | 'tower'
  | 'enemy'
  | 'obstacle'
  | 'pen'
  | 'ui'
  | 'character'
  | 'fx'
  | 'projectile'
  | 'prop'
  | 'terrain';

export type PathingType = 'linear' | 'multipath';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  theme: ThemeId;
  emoji?: string;
  sizeHint: 'normal' | 'big';
  desc?: string;
  imageDataUrl?: string;
}

export interface MapEntityMeta {
  kind?: 'spawn' | 'pen' | 'obstacle' | 'towerSpot' | 'pathNode';
  pathId?: string;
  order?: number;
}

export interface MapEntity {
  assetId: string;
  x: number;
  y: number;
  rotationDeg: number;
  scale: number;
  meta?: MapEntityMeta;
}

export interface PathingRules {
  pick?: 'random' | 'roundRobin' | 'weighted';
}

export interface MapPathing {
  type: PathingType;
  rules?: PathingRules;
}

export interface MapDefinition {
  id: string;
  name: string;
  theme: 'hockey' | 'soccer';
  slot: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  cols: number;
  rows: number;
  pathing: MapPathing;
  entities: MapEntity[];
  createdAt: number;
  updatedAt: number;
}

export interface PackExport {
  version: number;
  assets: Asset[];
  maps: MapDefinition[];
}

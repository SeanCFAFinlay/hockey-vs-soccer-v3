import React from 'react';
import type { Asset } from '@hvsv3/shared';
import AssetCard from './AssetCard.tsx';

interface AssetGridProps {
  assets: Asset[];
  selectedId?: string;
  onSelect: (asset: Asset) => void;
}

export default function AssetGrid({ assets, selectedId, onSelect }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
        No assets found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="grid-3">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          selected={asset.id === selectedId}
          onClick={() => onSelect(asset)}
        />
      ))}
    </div>
  );
}

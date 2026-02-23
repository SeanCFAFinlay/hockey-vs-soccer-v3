import React from 'react';
import type { Asset } from '@hvsv3/shared';

interface MapPaletteProps {
  assets: Asset[];
  selectedAssetId: string | null;
  onSelect: (assetId: string) => void;
}

export default function MapPalette({ assets, selectedAssetId, onSelect }: MapPaletteProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Palette</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {assets.map((asset) => (
          <button
            key={asset.id}
            title={asset.name}
            onClick={() => onSelect(asset.id)}
            style={{
              width: 42,
              height: 42,
              borderRadius: 8,
              border: `2px solid ${asset.id === selectedAssetId ? 'var(--accent)' : 'var(--border)'}`,
              background: asset.id === selectedAssetId ? 'var(--surface2)' : 'transparent',
              fontSize: '1.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {asset.imageDataUrl ? (
              <img src={asset.imageDataUrl} alt={asset.name} style={{ width: 28, height: 28, objectFit: 'contain' }} />
            ) : (
              asset.emoji ?? '?'
            )}
          </button>
        ))}
        {assets.length === 0 && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No assets. Add some on the Assets page.</span>
        )}
      </div>
    </div>
  );
}

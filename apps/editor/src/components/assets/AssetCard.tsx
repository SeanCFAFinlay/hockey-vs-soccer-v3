import React from 'react';
import type { Asset } from '@hvsv3/shared';

interface AssetCardProps {
  asset: Asset;
  selected: boolean;
  onClick: () => void;
}

export default function AssetCard({ asset, selected, onClick }: AssetCardProps) {
  return (
    <div className={`card${selected ? ' selected' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        {asset.imageDataUrl ? (
          <img
            src={asset.imageDataUrl}
            alt={asset.name}
            style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 6 }}
          />
        ) : (
          <span style={{ fontSize: '2rem', lineHeight: 1 }}>{asset.emoji ?? '❓'}</span>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{asset.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.category}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span className={`badge badge-${asset.theme}`}>{asset.theme}</span>
        {asset.sizeHint === 'big' && (
          <span className="badge" style={{ background: 'rgba(255,215,0,0.15)', color: 'var(--gold)', border: '1px solid rgba(255,215,0,0.3)' }}>big</span>
        )}
      </div>
      {asset.desc && (
        <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{asset.desc}</div>
      )}
    </div>
  );
}

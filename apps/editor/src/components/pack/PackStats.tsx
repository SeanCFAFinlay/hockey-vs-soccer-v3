import React from 'react';
import type { PackExport } from '@hvsv3/shared';
import { ASSET_CATEGORIES, THEME_IDS } from '@hvsv3/shared';

interface PackStatsProps {
  pack: PackExport;
}

export default function PackStats({ pack }: PackStatsProps) {
  const totalAssets = pack.assets.length;
  const totalMaps = pack.maps.length;

  const byCategory: Record<string, number> = {};
  for (const cat of ASSET_CATEGORIES) byCategory[cat] = 0;
  pack.assets.forEach((a) => { byCategory[a.category] = (byCategory[a.category] ?? 0) + 1; });

  const byTheme: Record<string, number> = {};
  for (const t of THEME_IDS) byTheme[t] = 0;
  pack.assets.forEach((a) => { byTheme[a.theme] = (byTheme[a.theme] ?? 0) + 1; });

  const mapsByTheme = { hockey: 0, soccer: 0 };
  pack.maps.forEach((m) => { mapsByTheme[m.theme] = (mapsByTheme[m.theme] ?? 0) + 1; });

  const linearMaps = pack.maps.filter((m) => m.pathing.type === 'linear').length;
  const multipathMaps = pack.maps.filter((m) => m.pathing.type === 'multipath').length;

  return (
    <div>
      <div className="stat-block">
        <div className="stat-item">
          <div className="stat-item-label">Total Assets</div>
          <div className="stat-item-value">{totalAssets}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Total Maps</div>
          <div className="stat-item-value">{totalMaps}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Hockey Maps</div>
          <div className="stat-item-value" style={{ color: 'var(--accent-hockey)' }}>{mapsByTheme.hockey}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Soccer Maps</div>
          <div className="stat-item-value" style={{ color: 'var(--accent-soccer)' }}>{mapsByTheme.soccer}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Linear Maps</div>
          <div className="stat-item-value">{linearMaps}</div>
        </div>
        <div className="stat-item">
          <div className="stat-item-label">Multipath Maps</div>
          <div className="stat-item-value">{multipathMaps}</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Assets by Category</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ASSET_CATEGORIES.filter((c) => byCategory[c] > 0).map((c) => (
            <span key={c} className="badge badge-shared" style={{ fontSize: '0.8rem' }}>{c}: {byCategory[c]}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 8 }}>Assets by Theme</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {THEME_IDS.map((t) => (
            <span key={t} className={`badge badge-${t}`}>{t}: {byTheme[t]}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

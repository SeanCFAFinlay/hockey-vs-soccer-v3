import React from 'react';
import type { MapEntity, Asset } from '@hvsv3/shared';

interface MapInspectorProps {
  entity: MapEntity | null;
  assets: Asset[];
  onChange: (entity: MapEntity) => void;
  onDelete: () => void;
}

export default function MapInspector({ entity, assets, onChange, onDelete }: MapInspectorProps) {
  if (!entity) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click an entity to inspect it.</div>;
  }

  const asset = assets.find((a) => a.id === entity.assetId);

  function setMeta<K extends keyof NonNullable<MapEntity['meta']>>(key: K, value: NonNullable<MapEntity['meta']>[K]) {
    onChange({ ...entity, meta: { ...entity.meta, [key]: value } });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontWeight: 700 }}>{asset?.name ?? entity.assetId}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Position: ({entity.x}, {entity.y})</div>

      <div className="form-row">
        <label className="form-label">Rotation (deg)</label>
        <input
          type="number"
          className="input"
          value={entity.rotationDeg}
          onChange={(e) => onChange({ ...entity, rotationDeg: Number(e.target.value) })}
          step={45}
        />
      </div>

      <div className="form-row">
        <label className="form-label">Scale</label>
        <input
          type="number"
          className="input"
          value={entity.scale}
          onChange={(e) => onChange({ ...entity, scale: Number(e.target.value) })}
          step={0.1}
          min={0.1}
          max={4}
        />
      </div>

      <div className="form-row">
        <label className="form-label">Kind</label>
        <select
          className="select"
          value={entity.meta?.kind ?? ''}
          onChange={(e) => setMeta('kind', (e.target.value || undefined) as MapEntity['meta'] extends undefined ? never : NonNullable<MapEntity['meta']>['kind'])}
        >
          <option value="">—</option>
          <option value="spawn">spawn</option>
          <option value="pen">pen</option>
          <option value="obstacle">obstacle</option>
          <option value="towerSpot">towerSpot</option>
          <option value="pathNode">pathNode</option>
        </select>
      </div>

      {entity.meta?.kind === 'pathNode' && (
        <>
          <div className="form-row">
            <label className="form-label">Path ID (e.g. A, B)</label>
            <input className="input" value={entity.meta?.pathId ?? ''} onChange={(e) => setMeta('pathId', e.target.value || undefined)} />
          </div>
          <div className="form-row">
            <label className="form-label">Order</label>
            <input type="number" className="input" value={entity.meta?.order ?? 0} onChange={(e) => setMeta('order', Number(e.target.value))} />
          </div>
        </>
      )}

      <button className="btn btn-danger btn-sm" onClick={onDelete} style={{ marginTop: 4 }}>🗑 Delete Entity</button>
    </div>
  );
}

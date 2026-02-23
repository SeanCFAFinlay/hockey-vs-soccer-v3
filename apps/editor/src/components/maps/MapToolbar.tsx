import React from 'react';
import type { PathingType } from '@hvsv3/shared';

interface MapToolbarProps {
  pathingType: PathingType;
  onPathingTypeChange: (t: PathingType) => void;
  onSave: () => void;
  onDelete: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  canDelete: boolean;
}

export default function MapToolbar({
  pathingType,
  onPathingTypeChange,
  onSave,
  onDelete,
  onClear,
  onExportJSON,
  canDelete,
}: MapToolbarProps) {
  return (
    <div className="row" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
      <select className="select" value={pathingType} onChange={(e) => onPathingTypeChange(e.target.value as PathingType)}>
        <option value="linear">Linear Path</option>
        <option value="multipath">Multipath</option>
      </select>
      <button className="btn btn-primary btn-sm" onClick={onSave}>💾 Save</button>
      {canDelete && <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑 Delete</button>}
      <button className="btn btn-sm" onClick={onClear}>🔲 Clear Canvas</button>
      <button className="btn btn-sm" onClick={onExportJSON}>📤 Export Map JSON</button>
    </div>
  );
}

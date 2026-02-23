import React from 'react';
import type { MapDefinition } from '@hvsv3/shared';

interface MapListProps {
  maps: MapDefinition[];
  selectedId: string | null;
  onSelect: (map: MapDefinition) => void;
}

export default function MapList({ maps, selectedId, onSelect }: MapListProps) {
  if (maps.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No saved maps yet.</span>;
  }

  return (
    <select
      className="select"
      value={selectedId ?? ''}
      onChange={(e) => {
        const m = maps.find((m) => m.id === e.target.value);
        if (m) onSelect(m);
      }}
    >
      <option value="">— Select saved map —</option>
      {maps.map((m) => (
        <option key={m.id} value={m.id}>
          Slot {m.slot}: {m.name} ({m.theme})
        </option>
      ))}
    </select>
  );
}

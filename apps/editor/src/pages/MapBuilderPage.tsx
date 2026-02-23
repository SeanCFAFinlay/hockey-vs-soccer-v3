import React, { useState, useCallback } from 'react';
import type { Asset, MapDefinition, MapEntity, PathingType } from '@hvsv3/shared';
import PageShell from '../components/layout/PageShell.tsx';
import MapCanvas from '../components/maps/MapCanvas.tsx';
import MapPalette from '../components/maps/MapPalette.tsx';
import MapInspector from '../components/maps/MapInspector.tsx';
import MapToolbar from '../components/maps/MapToolbar.tsx';
import MapList from '../components/maps/MapList.tsx';
import { generateId } from '../lib/ids.ts';
import { downloadJSON } from '../lib/fileIO.ts';

interface MapBuilderPageProps {
  assets: Asset[];
  maps: MapDefinition[];
  onMapsChange: (maps: MapDefinition[]) => void;
}

function newMap(theme: 'hockey' | 'soccer', slot: number): MapDefinition {
  return {
    id: generateId('map'),
    name: `Map ${slot}`,
    theme,
    slot: slot as MapDefinition['slot'],
    cols: 20,
    rows: 12,
    pathing: { type: 'linear' },
    entities: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default function MapBuilderPage({ assets, maps, onMapsChange }: MapBuilderPageProps) {
  const [theme, setTheme] = useState<'hockey' | 'soccer'>('hockey');
  const [slot, setSlot] = useState(1);
  const [activeMap, setActiveMap] = useState<MapDefinition>(newMap('hockey', 1));
  const [selectedEntityIdx, setSelectedEntityIdx] = useState<number | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const paletteAssets = assets.filter(
    (a) => a.theme === theme || a.theme === 'shared',
  );

  function handlePlaceEntity(x: number, y: number) {
    if (!selectedAssetId) return;
    const entity: MapEntity = {
      assetId: selectedAssetId,
      x,
      y,
      rotationDeg: rotation,
      scale,
    };
    setActiveMap((m) => ({ ...m, entities: [...m.entities, entity] }));
    setSelectedEntityIdx(activeMap.entities.length);
  }

  function handleMoveEntity(idx: number, x: number, y: number) {
    setActiveMap((m) => {
      const entities = [...m.entities];
      entities[idx] = { ...entities[idx], x, y };
      return { ...m, entities };
    });
  }

  function handleEntityChange(entity: MapEntity) {
    if (selectedEntityIdx === null) return;
    setActiveMap((m) => {
      const entities = [...m.entities];
      entities[selectedEntityIdx] = entity;
      return { ...m, entities };
    });
  }

  function handleDeleteEntity() {
    if (selectedEntityIdx === null) return;
    setActiveMap((m) => {
      const entities = m.entities.filter((_, i) => i !== selectedEntityIdx);
      return { ...m, entities };
    });
    setSelectedEntityIdx(null);
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEntityIdx !== null) {
      setActiveMap((m) => {
        const entities = m.entities.filter((_, i) => i !== selectedEntityIdx);
        return { ...m, entities };
      });
      setSelectedEntityIdx(null);
    }
  }, [selectedEntityIdx]);

  function handleSave() {
    const toSave = { ...activeMap, theme, slot: slot as MapDefinition['slot'], updatedAt: Date.now() };
    const exists = maps.some((m) => m.id === toSave.id);
    if (exists) {
      onMapsChange(maps.map((m) => (m.id === toSave.id ? toSave : m)));
    } else {
      onMapsChange([...maps, toSave]);
    }
    setActiveMap(toSave);
  }

  function handleDelete() {
    onMapsChange(maps.filter((m) => m.id !== activeMap.id));
    setActiveMap(newMap(theme, slot));
  }

  function handleClear() {
    setActiveMap((m) => ({ ...m, entities: [] }));
    setSelectedEntityIdx(null);
  }

  function handleLoadMap(m: MapDefinition) {
    setActiveMap(m);
    setTheme(m.theme);
    setSlot(m.slot);
    setSelectedEntityIdx(null);
  }

  function handleExport() {
    downloadJSON(`map-${activeMap.name}.json`, activeMap);
  }

  const savedMapsForTheme = maps.filter((m) => m.theme === theme);
  const selectedEntity = selectedEntityIdx !== null ? activeMap.entities[selectedEntityIdx] ?? null : null;

  return (
    <PageShell title="Map Builder">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <div className="row">
          <label className="form-label" style={{ margin: 0 }}>Theme:</label>
          <select className="select" value={theme} onChange={(e) => setTheme(e.target.value as 'hockey' | 'soccer')}>
            <option value="hockey">🏒 Hockey</option>
            <option value="soccer">⚽ Soccer</option>
          </select>
        </div>
        <div className="row">
          <label className="form-label" style={{ margin: 0 }}>Slot:</label>
          <select className="select" value={slot} onChange={(e) => setSlot(Number(e.target.value))}>
            {[1,2,3,4,5,6,7,8,9,10].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="row">
          <label className="form-label" style={{ margin: 0 }}>Saved Maps:</label>
          <MapList maps={savedMapsForTheme} selectedId={activeMap.id} onSelect={handleLoadMap} />
        </div>
        <button className="btn btn-sm" onClick={() => setActiveMap(newMap(theme, slot))}>+ New Map</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="row">
          <label className="form-label" style={{ margin: 0 }}>Name:</label>
          <input className="input" style={{ width: 160 }} value={activeMap.name} onChange={(e) => setActiveMap((m) => ({ ...m, name: e.target.value }))} />
        </div>
        <div className="row">
          <label className="form-label" style={{ margin: 0 }}>Cols:</label>
          <input type="number" className="input" style={{ width: 60 }} value={activeMap.cols} min={5} max={50}
            onChange={(e) => setActiveMap((m) => ({ ...m, cols: Number(e.target.value) }))} />
        </div>
        <div className="row">
          <label className="form-label" style={{ margin: 0 }}>Rows:</label>
          <input type="number" className="input" style={{ width: 60 }} value={activeMap.rows} min={5} max={30}
            onChange={(e) => setActiveMap((m) => ({ ...m, rows: Number(e.target.value) }))} />
        </div>
      </div>

      <MapToolbar
        pathingType={activeMap.pathing.type}
        onPathingTypeChange={(t: PathingType) => setActiveMap((m) => ({ ...m, pathing: { ...m.pathing, type: t } }))}
        onSave={handleSave}
        onDelete={handleDelete}
        onClear={handleClear}
        onExportJSON={handleExport}
        canDelete={maps.some((m) => m.id === activeMap.id)}
      />

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }} onKeyDown={handleKeyDown} tabIndex={0}>
          <div style={{ marginBottom: 10 }}>
            <div className="row" style={{ marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Rotation:</label>
              <input type="number" className="input" style={{ width: 70 }} value={rotation} step={45} onChange={(e) => setRotation(Number(e.target.value))} />
              <label className="form-label" style={{ margin: 0 }}>Scale:</label>
              <input type="number" className="input" style={{ width: 70 }} value={scale} step={0.1} min={0.1} max={4} onChange={(e) => setScale(Number(e.target.value))} />
            </div>
            <MapPalette assets={paletteAssets} selectedAssetId={selectedAssetId} onSelect={setSelectedAssetId} />
          </div>
          <MapCanvas
            cols={activeMap.cols}
            rows={activeMap.rows}
            entities={activeMap.entities}
            assets={assets}
            selectedEntityIdx={selectedEntityIdx}
            onPlaceEntity={handlePlaceEntity}
            onSelectEntity={setSelectedEntityIdx}
            onMoveEntity={handleMoveEntity}
          />
        </div>

        <div className="card" style={{ width: 240, flexShrink: 0, alignSelf: 'flex-start' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Inspector</div>
          <MapInspector
            entity={selectedEntity}
            assets={assets}
            onChange={handleEntityChange}
            onDelete={handleDeleteEntity}
          />
        </div>
      </div>
    </PageShell>
  );
}

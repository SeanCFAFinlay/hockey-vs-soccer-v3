import React, { useState } from 'react';
import type { Asset, AssetCategory, ThemeId } from '@hvsv3/shared';
import PageShell from '../components/layout/PageShell.tsx';
import AssetGrid from '../components/assets/AssetGrid.tsx';
import AssetFilters from '../components/assets/AssetFilters.tsx';
import AssetForm from '../components/assets/AssetForm.tsx';
import { generateId } from '../lib/ids.ts';

interface AssetsPageProps {
  assets: Asset[];
  onAssetsChange: (assets: Asset[]) => void;
}

export default function AssetsPage({ assets, onAssetsChange }: AssetsPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<AssetCategory | 'all'>('all');
  const [theme, setTheme] = useState<ThemeId | 'all'>('all');

  const filtered = assets.filter((a) => {
    if (category !== 'all' && a.category !== category) return false;
    if (theme !== 'all' && a.theme !== theme) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = assets.find((a) => a.id === selectedId) ?? null;

  function handleSave(asset: Asset) {
    const exists = assets.some((a) => a.id === asset.id);
    if (exists) {
      onAssetsChange(assets.map((a) => (a.id === asset.id ? asset : a)));
    } else {
      onAssetsChange([...assets, { ...asset, id: generateId('asset') }]);
    }
    setShowForm(false);
    setSelectedId(asset.id);
  }

  function handleDelete() {
    if (!selectedId) return;
    onAssetsChange(assets.filter((a) => a.id !== selectedId));
    setSelectedId(null);
    setShowForm(false);
  }

  return (
    <PageShell title="Assets">
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ marginBottom: 12 }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setSelectedId(null); setShowForm(true); }}
            >
              + New Asset
            </button>
            {selectedId && !showForm && (
              <>
                <button className="btn btn-sm" onClick={() => setShowForm(true)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>🗑 Delete</button>
              </>
            )}
          </div>
          <AssetFilters
            search={search}
            category={category}
            theme={theme}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onThemeChange={setTheme}
          />
          <AssetGrid
            assets={filtered}
            selectedId={selectedId ?? undefined}
            onSelect={(a) => { setSelectedId(a.id); setShowForm(false); }}
          />
        </div>

        {/* Right: form */}
        {showForm && (
          <div className="card" style={{ width: 320, flexShrink: 0, alignSelf: 'flex-start' }}>
            <div style={{ fontWeight: 700, marginBottom: 14 }}>
              {selected ? `Edit: ${selected.name}` : 'New Asset'}
            </div>
            <AssetForm
              initial={selected}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}

import React, { useState, useEffect } from 'react';
import type { PackExport, Asset, MapDefinition } from '@hvsv3/shared';
import type { PageId } from './routes.tsx';
import Topbar from '../components/layout/Topbar.tsx';
import Sidebar from '../components/layout/Sidebar.tsx';
import AssetsPage from '../pages/AssetsPage.tsx';
import MapBuilderPage from '../pages/MapBuilderPage.tsx';
import PackPage from '../pages/PackPage.tsx';
import HowItWorksPage from '../pages/HowItWorksPage.tsx';
import { loadPack, savePack, saveAssets, saveMaps } from '../storage/editorStorage.ts';

export default function App() {
  const [page, setPage] = useState<PageId>('assets');
  const [pack, setPack] = useState<PackExport>(() => loadPack());

  useEffect(() => {
    savePack(pack);
  }, [pack]);

  function handleAssetsChange(assets: Asset[]) {
    setPack((p) => ({ ...p, assets }));
    saveAssets(assets);
  }

  function handleMapsChange(maps: MapDefinition[]) {
    setPack((p) => ({ ...p, maps }));
    saveMaps(maps);
  }

  function handlePackChange(newPack: PackExport) {
    setPack(newPack);
    savePack(newPack);
  }

  return (
    <div className="layout">
      <Topbar />
      <div className="layout-body">
        <Sidebar activePage={page} onNavigate={(p) => setPage(p as PageId)} />
        {page === 'assets' && (
          <AssetsPage assets={pack.assets} onAssetsChange={handleAssetsChange} />
        )}
        {page === 'map-builder' && (
          <MapBuilderPage assets={pack.assets} maps={pack.maps} onMapsChange={handleMapsChange} />
        )}
        {page === 'pack' && (
          <PackPage pack={pack} onPackChange={handlePackChange} />
        )}
        {page === 'how-it-works' && <HowItWorksPage />}
      </div>
    </div>
  );
}

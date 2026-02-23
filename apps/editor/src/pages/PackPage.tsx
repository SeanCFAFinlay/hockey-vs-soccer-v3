import React, { useState } from 'react';
import type { PackExport } from '@hvsv3/shared';
import { exportPack, importPack, mergePacks } from '@hvsv3/shared';
import PageShell from '../components/layout/PageShell.tsx';
import PackStats from '../components/pack/PackStats.tsx';
import PackTextArea from '../components/pack/PackTextArea.tsx';
import { copyToClipboard } from '../lib/clipboard.ts';
import { downloadJSON, readFileAsText } from '../lib/fileIO.ts';

interface PackPageProps {
  pack: PackExport;
  onPackChange: (pack: PackExport) => void;
}

export default function PackPage({ pack, onPackChange }: PackPageProps) {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const exportText = exportPack({ assets: pack.assets, maps: pack.maps });

  async function handleCopy() {
    await copyToClipboard(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportFile() {
    downloadJSON('td-pack.json', JSON.parse(exportText));
  }

  function handleImport() {
    try {
      const incoming = importPack(importText);
      const merged = mergePacks(pack, incoming);
      onPackChange(merged);
      setImportText('');
      setError(null);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const incoming = importPack(text);
      const merged = mergePacks(pack, incoming);
      onPackChange(merged);
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  }

  return (
    <PageShell title="Export / Import">
      <PackStats pack={pack} />

      <div style={{ display: 'flex', gap: 24, marginTop: 24, flexWrap: 'wrap' }}>
        {/* Export */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Export Pack</div>
          <PackTextArea value={exportText} onChange={() => {}} readOnly rows={14} />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handleExportFile}>📥 Download JSON</button>
            <button className="btn btn-sm" onClick={handleCopy}>{copied ? '✅ Copied!' : '📋 Copy'}</button>
          </div>
        </div>

        {/* Import */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Import Pack</div>
          <PackTextArea value={importText} onChange={setImportText} rows={14} />
          {error && (
            <div style={{ color: 'var(--red)', fontSize: '0.82rem', marginTop: 6 }}>{error}</div>
          )}
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handleImport} disabled={!importText.trim()}>
              📤 Import & Merge
            </button>
            <label className="btn btn-sm" style={{ cursor: 'pointer' }}>
              📁 From File
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportFile} />
            </label>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

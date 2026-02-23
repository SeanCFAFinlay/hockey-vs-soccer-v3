import React from 'react';
import PageShell from '../components/layout/PageShell.tsx';

export default function HowItWorksPage() {
  return (
    <PageShell title="How It Works">
      <div style={{ maxWidth: 680, lineHeight: 1.7 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>📐 1. Create Assets</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Go to the <strong style={{ color: 'var(--text)' }}>Assets</strong> page and define your towers, enemies, obstacles, and other game elements.
            Each asset has a category, theme (hockey / soccer / shared), an optional emoji or uploaded image, and metadata.
            Assets are saved in the shared pack in LocalStorage under <code>td:pack:v1</code>.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>🗺️ 2. Build Maps</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Use the <strong style={{ color: 'var(--text)' }}>Map Builder</strong> to create maps for each theme.
            Place entities from your asset palette onto a grid, then mark special entities:
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <li><strong style={{ color: 'var(--accent-soccer)' }}>spawn</strong> – where enemies enter</li>
            <li><strong style={{ color: 'var(--red)' }}>pen</strong> – the goal enemies must reach</li>
            <li><strong style={{ color: 'var(--accent-hockey)' }}>pathNode</strong> – waypoints for multipath routing</li>
            <li><strong style={{ color: 'var(--text)' }}>towerSpot</strong> – designated tower placement tiles</li>
          </ul>
          <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Choose <em>Linear Path</em> for single-lane or <em>Multipath</em> for branching enemy routes.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>📦 3. Export Pack</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            On the <strong style={{ color: 'var(--text)' }}>Export / Import</strong> page, download the full Pack JSON (assets + maps).
            The pack is versioned and can be safely merged – incoming data overwrites by ID, but nothing is deleted.
          </p>
        </div>

        <div className="card">
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>🎮 4. Import in Game</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            The game app reads the same <code>td:pack:v1</code> LocalStorage key.
            Custom maps and assets you define here will appear in the game&apos;s map selection screen.
            Both apps share the same schema defined in <code>packages/shared</code>.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

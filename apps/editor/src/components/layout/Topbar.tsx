import React from 'react';

export default function Topbar() {
  return (
    <header className="topbar">
      <span className="topbar-logo">⚙️ Asset Forge</span>
      <span className="topbar-spacer" />
      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        Hockey vs Soccer TD
      </span>
    </header>
  );
}

import React from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: 'assets', icon: '🎨', label: 'Assets' },
  { id: 'map-builder', icon: '🗺️', label: 'Map Builder' },
  { id: 'pack', icon: '📦', label: 'Export / Import' },
  { id: 'how-it-works', icon: '❓', label: 'How It Works' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`sidebar-nav-item${activePage === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

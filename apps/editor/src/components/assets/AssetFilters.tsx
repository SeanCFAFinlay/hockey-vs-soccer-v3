import React from 'react';
import type { AssetCategory, ThemeId } from '@hvsv3/shared';
import { ASSET_CATEGORIES, THEME_IDS } from '@hvsv3/shared';

interface AssetFiltersProps {
  search: string;
  category: AssetCategory | 'all';
  theme: ThemeId | 'all';
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: AssetCategory | 'all') => void;
  onThemeChange: (v: ThemeId | 'all') => void;
}

export default function AssetFilters({
  search,
  category,
  theme,
  onSearchChange,
  onCategoryChange,
  onThemeChange,
}: AssetFiltersProps) {
  return (
    <div className="row" style={{ marginBottom: 16 }}>
      <input
        className="input"
        style={{ maxWidth: 240 }}
        placeholder="Search assets..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select className="select" value={category} onChange={(e) => onCategoryChange(e.target.value as AssetCategory | 'all')}>
        <option value="all">All categories</option>
        {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="select" value={theme} onChange={(e) => onThemeChange(e.target.value as ThemeId | 'all')}>
        <option value="all">All themes</option>
        {THEME_IDS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
}

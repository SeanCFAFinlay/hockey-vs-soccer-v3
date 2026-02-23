import React, { useState, useEffect } from 'react';
import type { Asset, AssetCategory, ThemeId } from '@hvsv3/shared';
import { ASSET_CATEGORIES, THEME_IDS } from '@hvsv3/shared';
import { generateId } from '../../lib/ids.ts';

interface AssetFormProps {
  initial?: Asset | null;
  onSave: (asset: Asset) => void;
  onCancel: () => void;
}

const defaultAsset = (): Asset => ({
  id: generateId('asset'),
  name: '',
  category: 'tower',
  theme: 'hockey',
  emoji: '',
  sizeHint: 'normal',
  desc: '',
});

export default function AssetForm({ initial, onSave, onCancel }: AssetFormProps) {
  const [form, setForm] = useState<Asset>(initial ?? defaultAsset());

  useEffect(() => {
    setForm(initial ?? defaultAsset());
  }, [initial]);

  function set<K extends keyof Asset>(key: K, value: Asset[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('imageDataUrl', reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, id: initial?.id ?? form.id });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div className="form-row">
        <label className="form-label">Name *</label>
        <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
      </div>

      <div className="form-row">
        <label className="form-label">Category</label>
        <select className="select" value={form.category} onChange={(e) => set('category', e.target.value as AssetCategory)}>
          {ASSET_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Theme</label>
        <select className="select" value={form.theme} onChange={(e) => set('theme', e.target.value as ThemeId)}>
          {THEME_IDS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Emoji</label>
        <input className="input" value={form.emoji ?? ''} onChange={(e) => set('emoji', e.target.value)} placeholder="e.g. 🏒" />
      </div>

      <div className="form-row">
        <label className="form-label">Size Hint</label>
        <select className="select" value={form.sizeHint} onChange={(e) => set('sizeHint', e.target.value as 'normal' | 'big')}>
          <option value="normal">normal</option>
          <option value="big">big</option>
        </select>
      </div>

      <div className="form-row">
        <label className="form-label">Description</label>
        <input className="input" value={form.desc ?? ''} onChange={(e) => set('desc', e.target.value)} />
      </div>

      <div className="form-row">
        <label className="form-label">Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: 'var(--text)' }} />
        {form.imageDataUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <img src={form.imageDataUrl} alt="preview" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--border)' }} />
            <button type="button" className="btn btn-sm" onClick={() => set('imageDataUrl', undefined)}>Remove</button>
          </div>
        )}
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <button type="submit" className="btn btn-primary">{initial ? 'Save Changes' : 'Create Asset'}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export type PageId = 'assets' | 'map-builder' | 'pack' | 'how-it-works';

export const PAGES: { id: PageId; label: string }[] = [
  { id: 'assets', label: 'Assets' },
  { id: 'map-builder', label: 'Map Builder' },
  { id: 'pack', label: 'Export / Import' },
  { id: 'how-it-works', label: 'How It Works' },
];

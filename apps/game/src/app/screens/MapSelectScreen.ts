import type { MapDefinition } from '@hvsv3/shared';

interface MapProgress {
  stars: number;
  locked: boolean;
  lastPlayed: boolean;
}

export class MapSelectScreen {
  private el: HTMLElement;

  constructor(
    container: HTMLElement,
    theme: 'hockey' | 'soccer',
    maps: MapDefinition[],
    progress: Record<string, MapProgress>,
    onBack: () => void,
    onSelectMap: (map: MapDefinition) => void,
  ) {
    this.el = document.createElement('div');
    this.el.id = 'mapScreen';
    this.el.className = 'screen';

    const themeColor = theme === 'hockey' ? 'var(--ice)' : 'var(--grass)';
    const themeIcon = theme === 'hockey' ? '🏒' : '⚽';

    const cardHTML = maps.map((map, i) => {
      const prog = progress[map.id] ?? { stars: 0, locked: i > 0, lastPlayed: false };
      const stars = [1, 2, 3].map((s) => `<span class="${s * 1.67 <= prog.stars ? 'on' : ''}">⭐</span>`).join('');
      return `
        <div class="map-card${prog.locked ? ' locked' : ''}${prog.lastPlayed ? ' last-played' : ''}"
          data-map-id="${map.id}" style="--c:${themeColor}">
          <div class="map-card-icon">${themeIcon}</div>
          <div class="map-card-name">${map.name}</div>
          <div class="map-card-info">${map.cols}×${map.rows} · Slot ${map.slot}</div>
          <div class="map-stars">${stars}</div>
          ${prog.stars > 0 ? `<div class="map-best">Best: ${prog.stars}⭐</div>` : ''}
          ${prog.locked ? '<div class="map-lock">🔒 Locked</div>' : ''}
        </div>
      `;
    }).join('');

    this.el.innerHTML = `
      <div class="map-header">
        <button class="back-btn">‹</button>
        <div class="map-title">${themeIcon} Select Map</div>
      </div>
      <div class="map-grid">${cardHTML}</div>
    `;

    this.el.querySelector('.back-btn')!.addEventListener('click', onBack);
    this.el.querySelectorAll<HTMLElement>('.map-card:not(.locked)').forEach((card) => {
      card.addEventListener('click', () => {
        const mapId = card.dataset.mapId;
        const map = maps.find((m) => m.id === mapId);
        if (map) onSelectMap(map);
      });
    });

    container.appendChild(this.el);
  }

  show(): void { this.el.classList.add('active'); }
  hide(): void { this.el.classList.remove('active'); }
  destroy(): void { this.el.remove(); }
}

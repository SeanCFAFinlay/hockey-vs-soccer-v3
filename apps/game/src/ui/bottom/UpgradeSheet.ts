export interface TowerStats {
  name: string;
  icon: string;
  level: number;
  maxLevel: number;
  damage: number;
  range: number;
  fireRate: number;
  color: string;
  upgradeCost: number | null;
  sellValue: number;
}

export class UpgradeSheet {
  private el: HTMLElement;
  private open = false;
  private onUpgrade: () => void;
  private onSell: () => void;

  constructor(container: HTMLElement, onUpgrade: () => void, onSell: () => void) {
    this.onUpgrade = onUpgrade;
    this.onSell = onSell;
    this.el = document.createElement('div');
    this.el.className = 'upgrade-sheet';
    this.el.innerHTML = `
      <div class="upgrade-sheet-handle"></div>
      <div class="upgrade-tower-name"></div>
      <div class="upgrade-stats"></div>
      <div class="upgrade-btns">
        <button class="upgrade-btn upgrade-action">⬆ Upgrade</button>
        <button class="upgrade-btn sell-btn">💰 Sell</button>
      </div>
    `;
    this.el.querySelector('.upgrade-action')!.addEventListener('click', onUpgrade);
    this.el.querySelector('.sell-btn')!.addEventListener('click', onSell);
    container.appendChild(this.el);
  }

  show(stats: TowerStats): void {
    const nameEl = this.el.querySelector('.upgrade-tower-name')!;
    nameEl.textContent = `${stats.icon} ${stats.name} (Lv ${stats.level}/${stats.maxLevel})`;

    const statsEl = this.el.querySelector('.upgrade-stats')!;
    statsEl.innerHTML = `
      <div class="upgrade-stat"><div class="upgrade-stat-label">DMG</div>${stats.damage}</div>
      <div class="upgrade-stat"><div class="upgrade-stat-label">RANGE</div>${stats.range.toFixed(1)}</div>
      <div class="upgrade-stat"><div class="upgrade-stat-label">RATE</div>${stats.fireRate.toFixed(1)}/s</div>
    `;

    const upgradeBtn = this.el.querySelector<HTMLButtonElement>('.upgrade-action')!;
    if (stats.upgradeCost !== null) {
      upgradeBtn.textContent = `⬆ Upgrade $${stats.upgradeCost}`;
      upgradeBtn.disabled = false;
    } else {
      upgradeBtn.textContent = 'MAX';
      upgradeBtn.disabled = true;
    }

    const sellBtn = this.el.querySelector<HTMLButtonElement>('.sell-btn')!;
    sellBtn.textContent = `💰 Sell $${stats.sellValue}`;

    this.el.classList.add('open');
    this.open = true;
  }

  hide(): void {
    this.el.classList.remove('open');
    this.open = false;
  }

  isOpen(): boolean {
    return this.open;
  }

  destroy(): void {
    this.el.remove();
  }
}

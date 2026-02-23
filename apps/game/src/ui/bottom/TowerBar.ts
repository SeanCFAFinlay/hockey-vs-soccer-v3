export interface TowerDef {
  id: string;
  name: string;
  icon: string;
  cost: number;
  color: string;
}

export class TowerBar {
  private el: HTMLElement;
  private selectedIdx: number | null = null;
  private onSelect: (idx: number) => void;

  constructor(container: HTMLElement, towers: TowerDef[], onSelect: (idx: number) => void) {
    this.onSelect = onSelect;
    this.el = document.createElement('div');
    this.el.className = 'tower-bar';
    towers.forEach((t, i) => {
      const btn = document.createElement('button');
      btn.className = 'tower-btn';
      btn.style.setProperty('--c', t.color);
      btn.innerHTML = `
        <div class="tower-btn-icon">${t.icon}</div>
        <div class="tower-btn-name">${t.name}</div>
        <div class="tower-btn-cost">$${t.cost}</div>
      `;
      btn.addEventListener('click', () => this.selectTower(i));
      this.el.appendChild(btn);
    });
    container.appendChild(this.el);
  }

  selectTower(idx: number): void {
    this.selectedIdx = idx;
    this.onSelect(idx);
    this.refreshStyles();
  }

  clearSelection(): void {
    this.selectedIdx = null;
    this.refreshStyles();
  }

  updateAffordability(money: number, towers: TowerDef[]): void {
    const buttons = this.el.querySelectorAll<HTMLButtonElement>('.tower-btn');
    buttons.forEach((btn, i) => {
      btn.classList.toggle('disabled', towers[i].cost > money);
    });
  }

  private refreshStyles(): void {
    const buttons = this.el.querySelectorAll<HTMLButtonElement>('.tower-btn');
    buttons.forEach((btn, i) => {
      btn.classList.toggle('selected', i === this.selectedIdx);
    });
  }

  destroy(): void {
    this.el.remove();
  }
}

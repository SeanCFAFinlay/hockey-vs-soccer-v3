export class HUD {
  private el: HTMLElement;
  private waveEl: HTMLElement;
  private moneyEl: HTMLElement;
  private livesEl: HTMLElement;
  private scoreEl: HTMLElement;
  private menuBtn: HTMLButtonElement;

  constructor(container: HTMLElement, onMenu: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud-left">
        <button class="hud-menu">☰</button>
        <div class="hud-wave">Wave <span class="wave-num">0</span></div>
      </div>
      <div class="hud-right">
        <div class="hud-stat money">💰 <span class="money-val">0</span></div>
        <div class="hud-stat lives">❤️ <span class="lives-val">20</span></div>
        <div class="hud-stat score">🏆 <span class="score-val">0</span></div>
      </div>
    `;
    this.waveEl = this.el.querySelector('.wave-num')!;
    this.moneyEl = this.el.querySelector('.money-val')!;
    this.livesEl = this.el.querySelector('.lives-val')!;
    this.scoreEl = this.el.querySelector('.score-val')!;
    this.menuBtn = this.el.querySelector('.hud-menu')!;
    this.menuBtn.addEventListener('click', onMenu);
    container.appendChild(this.el);
  }

  update(wave: number, money: number, lives: number, score: number): void {
    this.waveEl.textContent = String(wave);
    this.moneyEl.textContent = String(money);
    this.livesEl.textContent = String(lives);
    this.scoreEl.textContent = String(score);
  }

  destroy(): void {
    this.el.remove();
  }
}

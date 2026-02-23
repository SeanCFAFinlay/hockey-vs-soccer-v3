export interface WinLoseStats {
  won: boolean;
  stars: number;
  wave: number;
  score: number;
  livesRemaining: number;
}

export class WinLoseModal {
  private el: HTMLElement;

  constructor(
    container: HTMLElement,
    onRestart: () => void,
    onBack: () => void,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'modal-overlay';
    this.el.style.display = 'none';
    this.el.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon win-icon"></div>
        <div class="modal-title win-title"></div>
        <div class="modal-sub win-sub"></div>
        <div class="modal-stars"></div>
        <div class="modal-stats">
          <div class="modal-stat"><div class="modal-stat-label">Wave</div><div class="modal-stat-value wave-val">0</div></div>
          <div class="modal-stat"><div class="modal-stat-label">Score</div><div class="modal-stat-value score-val">0</div></div>
          <div class="modal-stat"><div class="modal-stat-label">Lives Left</div><div class="modal-stat-value lives-val">0</div></div>
          <div class="modal-stat"><div class="modal-stat-label">Rating</div><div class="modal-stat-value stars-text">★★★</div></div>
        </div>
        <div class="modal-btns">
          <button class="modal-btn primary restart-btn">🔄 Play Again</button>
          <button class="modal-btn back-btn">← Back to Maps</button>
        </div>
      </div>
    `;
    this.el.querySelector('.restart-btn')!.addEventListener('click', onRestart);
    this.el.querySelector('.back-btn')!.addEventListener('click', onBack);
    container.appendChild(this.el);
  }

  show(stats: WinLoseStats): void {
    const won = stats.won;
    this.el.querySelector('.win-icon')!.textContent = won ? '🏆' : '💀';
    this.el.querySelector<HTMLElement>('.win-title')!.textContent = won ? 'Victory!' : 'Defeated';
    this.el.querySelector<HTMLElement>('.win-title')!.style.color = won ? '#22c55e' : '#ef4444';
    this.el.querySelector('.win-sub')!.textContent = won ? 'You defended the goal!' : 'The enemies broke through...';
    this.el.querySelector('.wave-val')!.textContent = String(stats.wave);
    this.el.querySelector('.score-val')!.textContent = String(stats.score);
    this.el.querySelector('.lives-val')!.textContent = String(stats.livesRemaining);

    const starsEl = this.el.querySelector('.modal-stars')!;
    starsEl.textContent = '';
    for (let i = 1; i <= 5; i += 2) {
      const span = document.createElement('span');
      span.textContent = i <= stats.stars ? '⭐' : '☆';
      starsEl.appendChild(span);
    }
    this.el.querySelector('.stars-text')!.textContent = `${stats.stars}/5`;

    this.el.style.display = 'flex';
  }

  hide(): void {
    this.el.style.display = 'none';
  }

  destroy(): void {
    this.el.remove();
  }
}

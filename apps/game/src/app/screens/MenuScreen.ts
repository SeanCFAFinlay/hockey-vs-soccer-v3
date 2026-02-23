export class MenuScreen {
  private el: HTMLElement;

  constructor(container: HTMLElement, onSelectTheme: (theme: 'hockey' | 'soccer') => void) {
    this.el = document.createElement('div');
    this.el.id = 'menuScreen';
    this.el.className = 'screen';
    this.el.innerHTML = `
      <div class="logo">
        <div class="logo-icons">🏒⚽</div>
        <h1><span class="ice">Hockey</span> vs <span class="grass">Soccer</span></h1>
        <p>TOWER DEFENSE</p>
      </div>
      <div class="menu-cards">
        <button class="menu-card hockey" data-theme="hockey">
          <span class="menu-card-icon">🏒</span>
          <div>
            <h3>Hockey</h3>
            <p>Defend the ice rink</p>
          </div>
          <span class="menu-card-arrow">›</span>
        </button>
        <button class="menu-card soccer" data-theme="soccer">
          <span class="menu-card-icon">⚽</span>
          <div>
            <h3>Soccer</h3>
            <p>Defend the pitch</p>
          </div>
          <span class="menu-card-arrow">›</span>
        </button>
      </div>
    `;

    this.el.querySelectorAll<HTMLButtonElement>('.menu-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme as 'hockey' | 'soccer';
        onSelectTheme(theme);
      });
    });

    container.appendChild(this.el);
  }

  show(): void { this.el.classList.add('active'); }
  hide(): void { this.el.classList.remove('active'); }
  destroy(): void { this.el.remove(); }
}

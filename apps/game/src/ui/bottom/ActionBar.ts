export class ActionBar {
  private el: HTMLElement;
  private startBtn: HTMLButtonElement;
  private speed1Btn: HTMLButtonElement;
  private speed2Btn: HTMLButtonElement;
  private speed3Btn: HTMLButtonElement;
  private sellBtn: HTMLButtonElement;
  private currentSpeed: 1 | 2 | 3 = 1;
  private sellMode = false;

  constructor(
    container: HTMLElement,
    onStartWave: () => void,
    onSpeedChange: (speed: 1 | 2 | 3) => void,
    onSellToggle: (active: boolean) => void,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'action-bar';
    this.el.innerHTML = `
      <button class="action-btn start">▶ Start Wave</button>
      <button class="speed-btn speed1 active">1×</button>
      <button class="speed-btn speed2">2×</button>
      <button class="speed-btn speed3">3×</button>
      <button class="action-btn sell-toggle">💰 Sell</button>
    `;
    this.startBtn = this.el.querySelector('.start')!;
    this.speed1Btn = this.el.querySelector('.speed1')!;
    this.speed2Btn = this.el.querySelector('.speed2')!;
    this.speed3Btn = this.el.querySelector('.speed3')!;
    this.sellBtn = this.el.querySelector('.sell-toggle')!;

    this.startBtn.addEventListener('click', onStartWave);

    const setSpeed = (speed: 1 | 2 | 3) => {
      this.currentSpeed = speed;
      onSpeedChange(speed);
      this.updateSpeedUI();
    };
    this.speed1Btn.addEventListener('click', () => setSpeed(1));
    this.speed2Btn.addEventListener('click', () => setSpeed(2));
    this.speed3Btn.addEventListener('click', () => setSpeed(3));

    this.sellBtn.addEventListener('click', () => {
      this.sellMode = !this.sellMode;
      onSellToggle(this.sellMode);
      this.sellBtn.classList.toggle('active', this.sellMode);
    });

    container.appendChild(this.el);
  }

  setWaveInProgress(inProgress: boolean): void {
    this.startBtn.disabled = inProgress;
    this.startBtn.textContent = inProgress ? '⚡ Wave Active' : '▶ Start Wave';
  }

  private updateSpeedUI(): void {
    this.speed1Btn.classList.toggle('active', this.currentSpeed === 1);
    this.speed2Btn.classList.toggle('active', this.currentSpeed === 2);
    this.speed3Btn.classList.toggle('active', this.currentSpeed === 3);
  }

  destroy(): void {
    this.el.remove();
  }
}

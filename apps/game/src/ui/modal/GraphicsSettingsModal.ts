export interface GraphicsPreset {
  label: string;
  pixelRatio: number;
  shadows: boolean;
  postProcessing: boolean;
  particles: boolean;
}

export const PRESETS: GraphicsPreset[] = [
  { label: 'Low', pixelRatio: 1, shadows: false, postProcessing: false, particles: false },
  { label: 'Medium', pixelRatio: 1.5, shadows: true, postProcessing: false, particles: true },
  { label: 'High', pixelRatio: 2, shadows: true, postProcessing: true, particles: true },
];

export class GraphicsSettingsModal {
  private el: HTMLElement;
  private onApply: (preset: GraphicsPreset) => void;
  private currentPreset = 1;

  constructor(container: HTMLElement, onApply: (preset: GraphicsPreset) => void) {
    this.onApply = onApply;
    this.el = document.createElement('div');
    this.el.className = 'modal-overlay';
    this.el.style.display = 'none';
    this.el.innerHTML = `
      <div class="modal-box">
        <div class="modal-icon">⚙️</div>
        <div class="modal-title">Graphics Settings</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin:16px 0;text-align:left">
          ${PRESETS.map((p, i) => `
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;background:rgba(255,255,255,0.06);border-radius:12px;padding:12px">
              <input type="radio" name="preset" value="${i}" ${i === 1 ? 'checked' : ''} style="cursor:pointer"/>
              <div>
                <div style="font-weight:700">${p.label}</div>
                <div style="font-size:0.78rem;color:rgba(255,255,255,0.5)">
                  ${p.shadows ? 'Shadows ✓' : 'No shadows'} · 
                  ${p.postProcessing ? 'Post FX ✓' : 'No post FX'} · 
                  ${p.particles ? 'Particles ✓' : 'No particles'}
                </div>
              </div>
            </label>
          `).join('')}
        </div>
        <div class="modal-btns">
          <button class="modal-btn primary apply-btn">Apply</button>
          <button class="modal-btn close-btn">Close</button>
        </div>
      </div>
    `;
    this.el.querySelector('.apply-btn')!.addEventListener('click', () => {
      const checked = this.el.querySelector<HTMLInputElement>('input[name=preset]:checked');
      if (checked) {
        this.currentPreset = Number(checked.value);
        this.onApply(PRESETS[this.currentPreset]);
      }
      this.hide();
    });
    this.el.querySelector('.close-btn')!.addEventListener('click', () => this.hide());
    container.appendChild(this.el);
  }

  show(): void {
    this.el.style.display = 'flex';
  }

  hide(): void {
    this.el.style.display = 'none';
  }

  destroy(): void {
    this.el.remove();
  }
}

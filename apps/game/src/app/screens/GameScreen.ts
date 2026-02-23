import { Plane, Vector2, Vector3 } from 'three';
import type { GameConfig } from '../../gameplay/GameState.ts';
import { GameController } from '../../gameplay/GameController.ts';
import { HUD } from '../../ui/hud/HUD.ts';
import { TowerBar } from '../../ui/bottom/TowerBar.ts';
import { ActionBar } from '../../ui/bottom/ActionBar.ts';
import { UpgradeSheet } from '../../ui/bottom/UpgradeSheet.ts';
import { WinLoseModal } from '../../ui/modal/WinLoseModal.ts';
import type { Engine } from '../../three/Engine.ts';
import type { TowerType } from '../../gameplay/towers/towerTypes.ts';

export class GameScreen {
  private el: HTMLElement;
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private controller: GameController | null = null;
  private hud: HUD | null = null;
  private towerBar: TowerBar | null = null;
  private actionBar: ActionBar | null = null;
  private upgradeSheet: UpgradeSheet | null = null;
  private winLoseModal: WinLoseModal | null = null;
  private selectedTowerIdx: number | null = null;
  private towers: TowerType[] = [];
  private onBack: () => void;
  private clickHandler: ((e: MouseEvent) => void) | null = null;

  constructor(container: HTMLElement, engine: Engine, onBack: () => void) {
    this.engine = engine;
    this.onBack = onBack;

    this.el = document.createElement('div');
    this.el.id = 'gameScreen';
    this.el.className = 'screen';

    // Canvas wrap
    const wrap = document.createElement('div');
    wrap.className = 'canvas-wrap';
    this.canvas = engine.renderer.domElement;
    wrap.appendChild(this.canvas);
    this.el.appendChild(wrap);

    container.appendChild(this.el);
  }

  startGame(config: GameConfig): void {
    this.towers = config.towers;

    // Remove previous click handler
    if (this.clickHandler) {
      this.canvas.removeEventListener('click', this.clickHandler);
    }

    // Create UI
    this.hud = new HUD(this.el, () => {
      this.controller?.destroy();
      this.hide();
      this.onBack();
    });

    const bottomUI = document.createElement('div');
    bottomUI.className = 'bottom-ui';
    this.el.appendChild(bottomUI);

    this.towerBar = new TowerBar(
      bottomUI,
      config.towers.map((t) => ({ id: t.id, name: t.name, icon: t.icon, cost: t.cost, color: t.color })),
      (idx) => { this.selectedTowerIdx = idx; },
    );

    this.actionBar = new ActionBar(
      bottomUI,
      () => this.controller?.startWave(),
      (speed) => this.controller?.setGameSpeed(speed),
      () => {},
    );

    this.upgradeSheet = new UpgradeSheet(
      this.el,
      () => {},
      () => {},
    );

    this.winLoseModal = new WinLoseModal(
      this.el,
      () => { this.hide(); this.startGame(config); this.show(); },
      () => { this.hide(); this.onBack(); },
    );

    this.controller = new GameController(this.engine, config, {
      onStateUpdate: (state) => {
        this.hud?.update(state.wave, state.money, state.lives, state.score);
        this.towerBar?.updateAffordability(state.money, config.towers.map((t) => ({ id: t.id, name: t.name, icon: t.icon, cost: t.cost, color: t.color })));
        this.actionBar?.setWaveInProgress(state.phase === 'waveActive');
      },
      onWaveComplete: () => {},
      onGameOver: (won) => {
        const state = this.controller!.getState();
        this.winLoseModal?.show({
          won,
          stars: state.stars,
          wave: state.wave,
          score: state.score,
          livesRemaining: state.lives,
        });
      },
    });

    // Tap to place tower
    const groundPlane = new Plane(new Vector3(0, 1, 0), 0);
    const clickPoint = new Vector3();
    const mouseVec = new Vector2();

    this.clickHandler = (e: MouseEvent) => {
      if (this.selectedTowerIdx === null) return;
      const state = this.controller?.getState();
      if (!state || state.phase === 'waveActive') return;
      const towerType = this.towers[this.selectedTowerIdx];
      if (!towerType) return;

      const rect = this.canvas.getBoundingClientRect();
      const map = config.map;

      mouseVec.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
      this.engine.raycaster.setFromCamera(mouseVec, this.engine.camera);
      this.engine.raycaster.ray.intersectPlane(groundPlane, clickPoint);

      const offsetX = map.cols / 2;
      const offsetZ = map.rows / 2;
      const gx = Math.floor(clickPoint.x + offsetX);
      const gy = Math.floor(clickPoint.z + offsetZ);

      if (gx >= 0 && gx < map.cols && gy >= 0 && gy < map.rows) {
        this.controller?.tryPlaceTower(towerType, gx, gy);
      }
    };

    this.canvas.addEventListener('click', this.clickHandler);
  }

  show(): void { this.el.classList.add('active'); this.engine.start(); }

  hide(): void {
    this.el.classList.remove('active');
    this.engine.stop();
    if (this.clickHandler) {
      this.canvas.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
    this.hud?.destroy();
    this.towerBar?.destroy();
    this.actionBar?.destroy();
    this.upgradeSheet?.destroy();
    this.winLoseModal?.destroy();
    this.controller?.destroy();
    this.controller = null;
    // Remove the bottomUI element
    this.el.querySelectorAll('.bottom-ui').forEach((el) => el.remove());
  }

  destroy(): void { this.hide(); this.el.remove(); }
}

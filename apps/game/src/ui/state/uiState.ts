export interface UIState {
  wave: number;
  money: number;
  lives: number;
  score: number;
  waveInProgress: boolean;
  gameSpeed: 1 | 2 | 3;
  sellMode: boolean;
  selectedTowerIdx: number | null;
  selectedPlacedTowerId: string | null;
}

export function defaultUIState(): UIState {
  return {
    wave: 0,
    money: 650,
    lives: 20,
    score: 0,
    waveInProgress: false,
    gameSpeed: 1,
    sellMode: false,
    selectedTowerIdx: null,
    selectedPlacedTowerId: null,
  };
}

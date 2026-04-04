export type SoundEffect =
  | 'tower-fire'
  | 'projectile-hit'
  | 'enemy-death'
  | 'tower-place'
  | 'tower-upgrade'
  | 'tower-sell'
  | 'wave-start'
  | 'wave-complete'
  | 'game-over-win'
  | 'game-over-lose'
  | 'button-click'
  | 'money-earn'
  | 'error';

export type MusicTrack = 'menu' | 'gameplay' | 'victory' | 'defeat';

export class AudioManager {
  private sfxVolume = 0.7;
  private musicVolume = 0.5;
  private sfxEnabled = true;
  private musicEnabled = true;
  
  private audioContext: AudioContext | null = null;
  private musicAudio: HTMLAudioElement | null = null;
  private currentTrack: MusicTrack | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playSFX(effect: SoundEffect): void {
    if (!this.sfxEnabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (effect) {
      case 'tower-fire':
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'projectile-hit':
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

      case 'enemy-death':
        oscillator.frequency.setValueAtTime(500, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'tower-place':
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.setValueAtTime(600, now + 0.05);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'tower-upgrade':
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.setValueAtTime(800, now + 0.05);
        oscillator.frequency.setValueAtTime(1000, now + 0.1);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        oscillator.start(now);
        oscillator.stop(now + 0.25);
        break;

      case 'tower-sell':
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'wave-start':
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.setValueAtTime(400, now + 0.1);
        oscillator.frequency.setValueAtTime(500, now + 0.2);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case 'wave-complete':
        oscillator.frequency.setValueAtTime(500, now);
        oscillator.frequency.setValueAtTime(700, now + 0.1);
        oscillator.frequency.setValueAtTime(900, now + 0.2);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;

      case 'game-over-win':
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.setValueAtTime(500, now + 0.15);
        oscillator.frequency.setValueAtTime(600, now + 0.3);
        oscillator.frequency.setValueAtTime(800, now + 0.45);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.7, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        oscillator.start(now);
        oscillator.stop(now + 0.8);
        break;

      case 'game-over-lose':
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.6);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        oscillator.start(now);
        oscillator.stop(now + 0.6);
        break;

      case 'button-click':
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        oscillator.start(now);
        oscillator.stop(now + 0.08);
        break;

      case 'money-earn':
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.setValueAtTime(1000, now + 0.05);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

      case 'error':
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.setValueAtTime(150, now + 0.1);
        gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
    }
  }

  playMusic(_track: MusicTrack): void {
    // Placeholder for future music implementation
  }

  stopMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.musicAudio = null;
    }
    this.currentTrack = null;
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicAudio) {
      this.musicAudio.volume = this.musicVolume;
    }
  }

  setSFXEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  destroy(): void {
    this.stopMusic();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

let audioManager: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!audioManager) {
    audioManager = new AudioManager();
  }
  return audioManager;
}

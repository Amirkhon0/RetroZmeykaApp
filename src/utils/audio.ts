/**
 * Web Audio API synthesizer for authentic Nokia 8-bit retro sound effects
 * Zero external audio files required. Instant, zero-latency response.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private vibrationEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public toggleVibration(): boolean {
    this.vibrationEnabled = !this.vibrationEnabled;
    return this.vibrationEnabled;
  }

  public isVibrationEnabled(): boolean {
    return this.vibrationEnabled;
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  // Trigger tactile haptics if supported
  public vibrate(pattern: number | number[]) {
    if (!this.vibrationEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Ignore vibration errors on unsupported platforms
    }
  }

  // Play a simple frequency beep using square/pulse wave
  private playTone(freq: number, duration: number, type: OscillatorType = 'square', gainLevel: number = 0.1, delay: number = 0) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainLevel, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Audio playback fails gracefully if unpermitted
    }
  }

  // Keypad click: brief 10ms click
  public playKeyClick() {
    this.vibrate(15);
    this.playTone(950, 0.03, 'triangle', 0.08);
  }

  // Eating regular food: iconic classic Nokia beep
  public playEatFood() {
    this.vibrate(35);
    this.playTone(523.25, 0.05, 'square', 0.15, 0);       // C5
    this.playTone(659.25, 0.08, 'square', 0.15, 0.04);    // E5
  }

  // Eating bonus bug: satisfying chime
  public playEatBonus() {
    this.vibrate([30, 40, 50]);
    this.playTone(523.25, 0.06, 'square', 0.18, 0);       // C5
    this.playTone(659.25, 0.06, 'square', 0.18, 0.05);    // E5
    this.playTone(783.99, 0.06, 'square', 0.18, 0.10);    // G5
    this.playTone(1046.50, 0.12, 'square', 0.2, 0.15);    // C6
  }

  // Bonus insect appeared
  public playBonusSpawn() {
    this.playTone(880, 0.04, 'sine', 0.08, 0);
    this.playTone(1174, 0.05, 'sine', 0.08, 0.05);
  }

  // Game over / crash: descending low buzz
  public playCrash() {
    this.vibrate([100, 50, 150]);
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const startTime = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, startTime);
      osc.frequency.exponentialRampToValueAtTime(55, startTime + 0.4);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    } catch {
      // Audio playback fails gracefully
    }
  }

  // New High Score fanfare
  public playHighScore() {
    this.vibrate([50, 50, 50, 50, 100]);
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.1, 'square', 0.15, idx * 0.08);
    });
  }
}

export const sound = new SoundSystem();

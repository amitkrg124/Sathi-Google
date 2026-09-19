/**
 * Native Web Audio Siren Generator for Senior Citizens Emergency SOS
 * Oscillates between 700Hz and 1150Hz to create an authentic emergency siren
 */
export class SirenService {
  private static audioCtx: AudioContext | null = null;
  private static oscillator: OscillatorNode | null = null;
  private static gainNode: GainNode | null = null;
  private static intervalId: any = null;
  private static isPlaying = false;

  public static start(): boolean {
    if (this.isPlaying) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;

      this.audioCtx = new AudioContextClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);

      // Volume envelope
      this.gainNode.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      // Modulate frequency to create warble siren
      let toggle = false;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.oscillator) return;
        const targetFreq = toggle ? 750 : 1150;
        this.oscillator.frequency.exponentialRampToValueAtTime(
          targetFreq,
          this.audioCtx.currentTime + 0.35
        );
        toggle = !toggle;
      }, 400);

      return true;
    } catch (err) {
      console.warn('Failed to start SOS siren:', err);
      return false;
    }
  }

  public static stop(): void {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.oscillator) {
        try {
          this.oscillator.stop();
          this.oscillator.disconnect();
        } catch {}
        this.oscillator = null;
      }
      if (this.gainNode) {
        try {
          this.gainNode.disconnect();
        } catch {}
        this.gainNode = null;
      }
      if (this.audioCtx) {
        try {
          this.audioCtx.close();
        } catch {}
        this.audioCtx = null;
      }
    } catch (err) {
      console.warn('Error stopping siren:', err);
    } finally {
      this.isPlaying = false;
    }
  }

  public static getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

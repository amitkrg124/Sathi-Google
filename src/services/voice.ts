import { VoiceSpeed } from '../types';

export class VoiceService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isSpeakingNow = false;

  public static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  public static speak(
    text: string,
    speed: VoiceSpeed = 'normal',
    onEnd?: () => void,
    onStart?: () => void,
    language: 'en' | 'hi' = 'en'
  ): boolean {
    if (!this.synth) {
      if (onEnd) onEnd();
      return false;
    }

    try {
      this.stop();

      // Clean text of markdown marks like ** or # for smoother speech
      const cleaned = text
        .replace(/[*_#`~]/g, '')
        .replace(/https?:\/\/\S+/g, 'link')
        .replace(/\n+/g, '. ');

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      // Pick matching voice if available
      try {
        const voices = this.synth.getVoices();
        if (voices && voices.length > 0) {
          if (language === 'hi') {
            const hiVoice = voices.find(
              (v) => v.lang === 'hi-IN' || v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
            );
            if (hiVoice) utterance.voice = hiVoice;
          } else {
            const inVoice = voices.find(
              (v) => v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.lang.startsWith('en')
            );
            if (inVoice) utterance.voice = inVoice;
          }
        }
      } catch {}

      // Speed rates
      switch (speed) {
        case 'slow':
          utterance.rate = 0.78;
          utterance.pitch = 0.95;
          break;
        case 'gentle':
          utterance.rate = 0.88;
          utterance.pitch = 1.0;
          break;
        case 'normal':
        default:
          utterance.rate = 0.96;
          utterance.pitch = 1.0;
          break;
      }

      utterance.onstart = () => {
        this.isSpeakingNow = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isSpeakingNow = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        this.isSpeakingNow = false;
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.warn('Failed to invoke speech synthesis:', err);
      if (onEnd) onEnd();
      return false;
    }
  }

  public static stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
      this.isSpeakingNow = false;
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return this.isSpeakingNow || (this.synth?.speaking ?? false);
  }

  public static createSpeechRecognizer(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onStateChange?: (isListening: boolean) => void,
    language: 'en' | 'hi' = 'en'
  ): { start: () => void; stop: () => void } | null {
    if (!this.isSpeechRecognitionSupported()) {
      return null;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognizer: any = null;

    try {
      recognizer = new SpeechRec();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognizer.onstart = () => {
        if (onStateChange) onStateChange(true);
      };

      recognizer.onend = () => {
        if (onStateChange) onStateChange(false);
      };

      recognizer.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          onResult(final.trim(), true);
        } else if (interim) {
          onResult(interim.trim(), false);
        }
      };

      recognizer.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (onStateChange) onStateChange(false);
        if (onError) onError(event.error || 'Microphone error');
      };

      return {
        start: () => {
          try {
            recognizer.start();
          } catch (e) {
            console.warn('SpeechRec start error:', e);
          }
        },
        stop: () => {
          try {
            recognizer.stop();
          } catch (e) {
            console.warn('SpeechRec stop error:', e);
          }
        },
      };
    } catch (e) {
      console.warn('Could not initialize speech recognizer:', e);
      return null;
    }
  }
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Square,
  RotateCcw,
  Sparkles,
  X,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Languages,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceService } from '../services/voice';
import { askSaathiApi } from '../services/api';
import { TRANSLATIONS } from '../data/translations';

export const VoiceAssistantModal: React.FC = () => {
  const {
    voiceModalOpen,
    setVoiceModalOpen,
    setCurrentScreen,
    preferences,
    updatePreferences,
    addChatMessage,
    speak,
    stopSpeaking,
    isSpeaking,
    setActiveTaskId,
    showNotification,
  } = useApp();

  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const defaultSuggestions =
    lang === 'hi'
      ? ['आज मुझे क्या करना है?', 'बिजली का बिल भरने में मदद करें', 'संदेश में धोखाधड़ी की जांच करें']
      : ['What do I need to do today?', 'Help me pay my electricity bill', 'Explain a bank SMS I got'];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [lastTakeaway, setLastTakeaway] = useState<string | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<string[]>(defaultSuggestions);
  const [recognizedSuccess, setRecognizedSuccess] = useState(false);

  const recognizerRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  // Re-sync suggested actions on language change
  useEffect(() => {
    setSuggestedActions(
      lang === 'hi'
        ? ['आज मुझे क्या करना है?', 'बिजली का बिल भरने में मदद करें', 'संदेश में धोखाधड़ी की जांच करें']
        : ['What do I need to do today?', 'Help me pay my electricity bill', 'Explain a bank SMS I got']
    );
  }, [lang]);

  // Initialize Speech Recognizer when modal opens or language changes
  useEffect(() => {
    if (voiceModalOpen) {
      const recognizer = VoiceService.createSpeechRecognizer(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            handleProcessQuery(text);
          }
        },
        (error) => {
          console.warn('Speech recognizer error:', error);
          setIsListening(false);
        },
        (listening) => {
          setIsListening(listening);
        },
        lang
      );

      recognizerRef.current = recognizer;
      if (recognizer) {
        recognizer.start();
      } else {
        setTranscript(
          lang === 'hi'
            ? 'माइक तैयार है। आप नीचे दिए गए किसी भी प्रश्न पर टैप भी कर सकते हैं।'
            : 'Microphone ready. You can also tap any question below.'
        );
      }
    } else {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      stopSpeaking();
      setIsListening(false);
      setIsThinking(false);
      setTranscript('');
      setLastResponse(null);
    }
  }, [voiceModalOpen, lang]);

  if (!voiceModalOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      setTranscript('');
      setRecognizedSuccess(false);
      recognizerRef.current?.start();
      setIsListening(true);
    }
  };

  const handleProcessQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    recognizerRef.current?.stop();
    setIsListening(false);
    setIsThinking(true);
    setTranscript(queryText);

    try {
      const result = await askSaathiApi(queryText, [], lang);
      setIsThinking(false);
      setLastResponse(result.replyText);
      setLastTakeaway(result.simplifiedKeyTakeaway || null);
      if (result.followUpSuggestions && result.followUpSuggestions.length > 0) {
        setSuggestedActions(result.followUpSuggestions);
      }
      setRecognizedSuccess(true);

      // Record to chat context as well
      addChatMessage({
        sender: 'user',
        text: queryText,
      });
      addChatMessage({
        sender: 'saathi',
        text: result.replyText,
        simplifiedKeyTakeaway: result.simplifiedKeyTakeaway,
        followUpSuggestions: result.followUpSuggestions,
        suggestedWorkflow: result.suggestedWorkflow,
      });

      // Speak response aloud in chosen language
      speak(result.replyText);
    } catch (err) {
      setIsThinking(false);
      const fallback =
        lang === 'hi'
          ? 'मैं यहीं आपके साथ हूँ। आइए आराम से एक-एक करके समझें।'
          : "I'm right here with you. Let's take it one step at a time.";
      setLastResponse(fallback);
      speak(fallback);
    }
  };

  const handleRepeat = () => {
    if (lastResponse) {
      speak(lastResponse);
    }
  };

  const handleSlowDown = () => {
    updatePreferences({ voiceSpeed: 'slow' });
    if (lastResponse) {
      VoiceService.speak(lastResponse, 'slow', undefined, undefined, lang);
    }
  };

  const handleSwitchToText = () => {
    setVoiceModalOpen(false);
    setCurrentScreen('ask');
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'hi' ? 'en' : 'hi';
    updatePreferences({ language: nextLang });
    const announcement =
      nextLang === 'hi' ? 'भाषा हिन्दी में बदल दी गई है।' : 'Language switched to English.';
    showNotification(announcement);
    speak(announcement);
  };

  return (
    <div
      id="voice-assistant-modal"
      className="fixed inset-0 z-50 bg-[#0C1D2E]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-[#E7E2D8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top bar with clear exit and language switcher */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E7E2D8] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 id="voice-modal-title" className="text-xl font-bold text-[#0C1D2E]">
                {t.voiceAssistantTitle}
              </h3>
              <p className="text-xs text-slate-500">{t.voiceAssistantSub}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLang}
              className="px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-100 text-amber-950 font-bold text-xs flex items-center gap-1 border border-amber-300 transition-all"
            >
              <Languages className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}</span>
            </button>
            <button
              id="close-voice-modal-btn"
              onClick={() => setVoiceModalOpen(false)}
              className="w-10 h-10 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              aria-label="Close Voice Assistant"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Central Visual Voice Stage */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1 overflow-y-auto">
          {/* Pulsing Interactive Microphone Ring */}
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            )}
            {isThinking && (
              <div className="absolute -inset-4 rounded-full bg-amber-500/20 animate-spin pointer-events-none" />
            )}
            {isSpeaking && (
              <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-pulse pointer-events-none" />
            )}

            <button
              id="voice-modal-mic-toggle"
              onClick={toggleListening}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-xl transition-all transform active:scale-95 ${
                isListening
                  ? 'bg-red-600 text-white shadow-red-500/30'
                  : isSpeaking
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : isThinking
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : 'bg-[#0F766E] text-white hover:bg-[#0D655E] shadow-[#0F766E]/20'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            >
              {isListening ? (
                <>
                  <Mic className="w-10 h-10 animate-bounce" />
                  <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">{t.listening}</span>
                </>
              ) : isThinking ? (
                <>
                  <Sparkles className="w-10 h-10 animate-spin" />
                  <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">{t.thinking}</span>
                </>
              ) : isSpeaking ? (
                <>
                  <Volume2 className="w-10 h-10 animate-pulse" />
                  <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">{t.speaking}</span>
                </>
              ) : (
                <>
                  <Mic className="w-10 h-10" />
                  <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">{t.tapToSpeak}</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time speech transcript or status */}
          <div className="max-w-lg w-full min-h-[5rem] flex items-center justify-center">
            {transcript ? (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] w-full">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {lang === 'hi' ? 'आपकी आवाज़:' : 'You said:'}
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#0C1D2E] leading-snug">
                  "{transcript}"
                </p>
              </div>
            ) : isListening ? (
              <p className="text-base font-semibold text-[#0F766E] animate-pulse">
                {lang === 'hi' ? 'साथी सुन रहा है... आप आराम से बोलें' : 'Saathi is listening... speak at your own pace'}
              </p>
            ) : (
              <p className="text-sm font-medium text-slate-500">
                {lang === 'hi'
                  ? 'माइक बटन दबाकर बोलें या नीचे दिए गए किसी सवाल पर टैप करें'
                  : 'Tap the microphone or choose an everyday question below'}
              </p>
            )}
          </div>

          {/* AI Response Card if available */}
          {lastResponse && (
            <div className="w-full text-left bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-5 sm:p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {lang === 'hi' ? 'साथी का सरल उत्तर' : 'Saathi Explained Simply'}
                </span>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold hover:bg-emerald-100"
                  >
                    {lang === 'hi' ? 'रोकें' : 'Pause'}
                  </button>
                )}
              </div>

              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium">
                {lastResponse}
              </p>

              {lastTakeaway && (
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {lang === 'hi' ? 'मुख्य बात (Key Takeaway):' : 'Key Takeaway:'}
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{lastTakeaway}</p>
                </div>
              )}

              {/* Voice Controls: Repeat & Slow Down */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  id="voice-repeat-btn"
                  onClick={handleRepeat}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-slate-700 hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.repeatAloud}</span>
                </button>
                <button
                  id="voice-slow-down-btn"
                  onClick={handleSlowDown}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-slate-700 hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.slowVoice}</span>
                </button>
              </div>
            </div>
          )}

          {/* Helpful One-Tap Prompts */}
          <div className="w-full space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-left">
              {lang === 'hi' ? 'या इन सवालों में से चुनें:' : 'Or tap any common request:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleProcessQuery(action)}
                  className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] hover:border-[#0F766E] hover:bg-white text-left text-xs sm:text-sm font-bold text-[#0C1D2E] transition-all flex items-center justify-between group shadow-2xs"
                >
                  <span className="truncate">{action}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] transform group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer switch to typing mode */}
        <div className="p-4 border-t border-[#E7E2D8] bg-[#FAF8F5] flex items-center justify-between">
          <button
            onClick={handleSwitchToText}
            className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0C1D2E] flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-[#0F766E]" />
            <span>{t.switchToText}</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            {lang === 'hi' ? 'आराम से बोलें, कोई जल्दबाज़ी नहीं' : 'Calm, patient guidance'}
          </span>
        </div>
      </div>
    </div>
  );
};

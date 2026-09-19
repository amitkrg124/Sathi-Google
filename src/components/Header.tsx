import React from 'react';
import {
  Mic,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  Languages,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const Header: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    setVoiceModalOpen,
    setEmergencyModalOpen,
    isSpeaking,
    stopSpeaking,
    speak,
    showNotification,
  } = useApp();

  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const formattedDate = new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (lang === 'hi') {
      if (hour < 12) return 'शुभ प्रभात';
      if (hour < 17) return 'शुभ दोपहर';
      return 'शुभ संध्या';
    } else {
      if (hour < 12) return 'Good morning';
      if (hour < 17) return 'Good afternoon';
      return 'Good evening';
    }
  };

  const handleLanguageToggle = () => {
    const newLang = lang === 'hi' ? 'en' : 'hi';
    updatePreferences({ language: newLang });
    const msg =
      newLang === 'hi'
        ? 'नमस्ते! भाषा हिन्दी में बदल दी गई है।'
        : 'Language switched to English.';
    showNotification(msg);
    speak(msg);
  };

  return (
    <header
      id="saathi-header"
      className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 select-none shadow-xs"
    >
      {/* Greeting & Date */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-amber-200 flex items-center justify-center font-bold text-lg shadow-sm">
          {preferences.userName.charAt(0)}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-tight">
            {getGreeting()}, {preferences.userName}
            {lang === 'hi' ? ' जी' : ''}
          </h2>
          <p className="text-xs text-stone-500 font-medium flex items-center gap-2 mt-0.5">
            <span>{formattedDate}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-stone-300" />
            <span className="text-emerald-700 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {lang === 'hi' ? 'सुरक्षित मोड' : 'Safe Mode'}
            </span>
          </p>
        </div>
      </div>

      {/* Controls: Language, Text Size, Voice & SOS */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          id="btn-language-switcher"
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border border-stone-200"
          title={lang === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}
          aria-label="Toggle language"
        >
          <Languages className="w-4 h-4 text-stone-600" />
          <span>{lang === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English'}</span>
        </button>

        {/* Text Size Switcher */}
        <div
          className="hidden sm:flex items-center bg-stone-100 border border-stone-200 rounded-xl p-0.5"
          title="Adjust Text Size"
        >
          <button
            id="text-size-normal"
            onClick={() => updatePreferences({ textSize: 'normal' })}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              preferences.textSize === 'normal'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-label="Normal Text Size"
          >
            A
          </button>
          <button
            id="text-size-large"
            onClick={() => updatePreferences({ textSize: 'large' })}
            className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              preferences.textSize === 'large'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-label="Large Text Size"
          >
            A+
          </button>
          <button
            id="text-size-xlarge"
            onClick={() => updatePreferences({ textSize: 'extra-large' })}
            className={`px-2.5 py-1 rounded-lg text-base font-bold transition-all cursor-pointer ${
              preferences.textSize === 'extra-large'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-label="Extra Large Text Size"
          >
            A++
          </button>
        </div>

        {/* Stop Voice Speech Button if speaking */}
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold animate-pulse cursor-pointer"
            title="Stop Speaking"
          >
            <VolumeX className="w-4 h-4" />
            <span>{t.stopVoice}</span>
          </button>
        )}

        {/* Voice Assistant CTA */}
        <button
          id="btn-voice-saathi-header"
          onClick={() => setVoiceModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
          aria-label="Talk to Saathi using Voice"
        >
          <Mic className="w-4 h-4 text-teal-200" />
          <span className="hidden sm:inline">{lang === 'hi' ? 'बोलकर पूछें' : 'Voice Assistant'}</span>
          <span className="sm:hidden">{lang === 'hi' ? 'बोलें' : 'Voice'}</span>
        </button>

        {/* Emergency SOS Header Button */}
        <button
          id="btn-header-sos"
          onClick={() => setEmergencyModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="w-4 h-4 text-amber-200" />
          <span>{lang === 'hi' ? 'SOS' : 'SOS'}</span>
        </button>
      </div>
    </header>
  );
};

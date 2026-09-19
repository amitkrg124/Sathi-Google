import React from 'react';
import {
  Mic,
  VolumeX,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Languages,
  Sparkles,
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
    weekday: 'long',
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
      className="bg-white/95 backdrop-blur-md border-b border-[#E7E2D8] sticky top-0 z-30 px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 select-none shadow-xs"
    >
      {/* Greeting & Date with Elder Honorific */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0C1D2E] to-[#1E3A5F] text-[#F3E5AB] flex items-center justify-center font-black text-xl shadow-md border border-[#F3E5AB]/20">
          {preferences.userName.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-[#0C1D2E] leading-tight flex items-center gap-2">
            <span>
              {getGreeting()}, {preferences.userName}
              {lang === 'hi' ? ' जी' : ''}
            </span>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
            <span>{formattedDate}</span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-emerald-700 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {t.safeModeActive}
            </span>
          </p>
        </div>
      </div>

      {/* Accessibility, Language Switcher, Emergency SOS & Voice */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        {/* Language Switcher Pill */}
        <button
          id="btn-language-switcher"
          onClick={handleLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-300 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
          title={lang === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}
          aria-label="Toggle language"
        >
          <Languages className="w-4 h-4 text-amber-700" />
          <span>{lang === 'hi' ? '🇮🇳 हिन्दी (बदलें)' : '🇬🇧 English (Change)'}</span>
        </button>

        {/* Text Scaling Controls */}
        <div
          className="hidden md:flex items-center bg-[#F7F5F0] border border-[#E7E2D8] rounded-xl p-0.5 gap-0.5"
          title="Adjust Text Size"
        >
          <button
            id="text-size-normal"
            onClick={() => updatePreferences({ textSize: 'normal' })}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              preferences.textSize === 'normal'
                ? 'bg-white text-[#0C1D2E] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Normal Text Size"
          >
            A
          </button>
          <button
            id="text-size-large"
            onClick={() => updatePreferences({ textSize: 'large' })}
            className={`px-2.5 py-1 rounded-lg text-sm font-bold transition-all ${
              preferences.textSize === 'large'
                ? 'bg-white text-[#0C1D2E] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            aria-label="Large Text Size"
          >
            A+
          </button>
          <button
            id="text-size-xlarge"
            onClick={() => updatePreferences({ textSize: 'extra-large' })}
            className={`px-2.5 py-1 rounded-lg text-base font-bold transition-all ${
              preferences.textSize === 'extra-large'
                ? 'bg-white text-[#0C1D2E] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold animate-pulse"
            title="Stop Speaking"
          >
            <VolumeX className="w-4 h-4" />
            <span>{t.stopVoice}</span>
          </button>
        )}

        {/* Emergency SOS Header Button */}
        <button
          id="btn-header-sos"
          onClick={() => setEmergencyModalOpen(true)}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs sm:text-sm font-black shadow-md border border-red-800 transition-all transform active:scale-95"
          aria-label="Emergency SOS"
        >
          <AlertTriangle className="w-4 h-4 text-amber-300 animate-bounce" />
          <span className="tracking-wide">{t.emergencySosButton}</span>
        </button>

        {/* Voice Assistant CTA */}
        <button
          id="btn-voice-saathi-header"
          onClick={() => setVoiceModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white text-xs sm:text-sm font-bold shadow-md transition-all transform active:scale-95"
          aria-label="Talk to Saathi using Voice"
        >
          <Mic className="w-4 h-4 text-emerald-200" />
          <span className="hidden sm:inline">{t.talkToSaathi}</span>
          <span className="sm:hidden">{lang === 'hi' ? 'बोलें' : 'Voice'}</span>
        </button>
      </div>
    </header>
  );
};

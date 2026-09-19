import React from 'react';
import {
  Home,
  MessageCircleQuestion,
  ShieldAlert,
  CheckCircle2,
  CalendarDays,
  Bell,
  Users,
  Settings,
  AlertTriangle,
  Volume2,
  RotateCcw,
  Languages,
} from 'lucide-react';
import { useApp, ScreenId } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    preferences,
    updatePreferences,
    setEmergencyModalOpen,
    isSpeaking,
    stopSpeaking,
    resetDemoData,
    speak,
    showNotification,
  } = useApp();

  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const navItems: {
    id: ScreenId;
    label: string;
    subLabel: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
    isDanger?: boolean;
  }[] = [
    { id: 'home', label: t.home, subLabel: t.dailyOverview, icon: Home },
    { id: 'ask', label: t.askSaathi, subLabel: t.voiceQuestions, icon: MessageCircleQuestion },
    { id: 'explain', label: t.explainAnything, subLabel: t.scamShieldSms, icon: ShieldAlert },
    { id: 'tasks', label: t.helpMeDoIt, subLabel: t.guidedTaskCoach, icon: CheckCircle2 },
    { id: 'daily_brief', label: t.dailyBrief, subLabel: t.morningDigest, icon: CalendarDays },
    { id: 'reminders', label: t.reminders, subLabel: t.medicinesBills, icon: Bell },
    { id: 'trusted_circle', label: t.trustedCircle, subLabel: t.familySupport, icon: Users },
    {
      id: 'emergency',
      label: t.emergencySos,
      subLabel: t.emergencySub,
      icon: AlertTriangle,
      badge: '24x7',
      isDanger: true,
    },
    { id: 'settings', label: t.settings, subLabel: t.accessibilityVoice, icon: Settings },
  ];

  const handleLanguageToggle = () => {
    const nextLang = lang === 'hi' ? 'en' : 'hi';
    updatePreferences({ language: nextLang });
    const msg =
      nextLang === 'hi'
        ? 'नमस्ते! भाषा हिन्दी में बदल दी गई है।'
        : 'Language switched to English.';
    showNotification(msg);
    speak(msg);
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        id="saathi-sidebar"
        className="hidden md:flex flex-col w-72 lg:w-80 bg-white border-r border-[#E7E2D8] h-screen sticky top-0 z-40 select-none shadow-xs"
        aria-label="Main Navigation"
      >
        {/* Classy Brand Header with Devanagari Typography */}
        <div className="p-6 border-b border-[#E7E2D8] bg-gradient-to-b from-[#FAF8F5] to-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0C1D2E] to-[#1E3A5F] flex items-center justify-center text-[#F3E5AB] shadow-md border border-[#F3E5AB]/30">
              <span className="font-bold text-2xl tracking-wide font-serif">साथी</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#0C1D2E] tracking-tight">Saathi AI</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/30 uppercase tracking-wider">
                  Senior Co-pilot
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'पूछें • समझें • स्वयं करें' : 'Ask. Understand. Do it yourself.'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5 focus:outline-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  setCurrentScreen(item.id);
                  if (isSpeaking) stopSpeaking();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition-all duration-150 group ${
                  isActive
                    ? item.isDanger
                      ? 'bg-red-700 text-white shadow-md font-bold'
                      : 'bg-[#0C1D2E] text-white shadow-md font-bold'
                    : item.isDanger
                    ? 'text-red-700 hover:bg-red-50 font-bold border border-red-200'
                    : 'text-slate-800 hover:bg-[#FAF8F5] font-semibold hover:text-[#0C1D2E]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.isDanger
                      ? 'bg-red-100 text-red-700 group-hover:bg-red-200'
                      : 'bg-[#F4EFEA] text-[#0C1D2E] group-hover:bg-[#EAE4DC]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-base leading-tight truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                          isActive ? 'bg-white text-red-700' : 'bg-red-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-xs truncate ${
                      isActive ? 'text-white/80' : item.isDanger ? 'text-red-600/80' : 'text-slate-500'
                    }`}
                  >
                    {item.subLabel}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Voice Speaking status indicator if talking */}
        {isSpeaking && (
          <div className="mx-4 mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>{lang === 'hi' ? 'साथी बोल रहा है...' : 'Saathi is speaking...'}</span>
            </div>
            <button
              onClick={stopSpeaking}
              className="text-xs px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 font-bold"
              title="Stop voice"
            >
              {lang === 'hi' ? 'रोकें' : 'Stop'}
            </button>
          </div>
        )}

        {/* Language switch & reset footer */}
        <div className="p-4 border-t border-[#E7E2D8] bg-[#FAF8F5] space-y-2">
          <button
            id="sidebar-lang-switch"
            onClick={handleLanguageToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E7E2D8] text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-xs"
          >
            <Languages className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}</span>
          </button>

          <button
            id="sidebar-reset-demo"
            onClick={resetDemoData}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            title="Reset to default seeded demo scenarios"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{lang === 'hi' ? 'डेमो रीसेट करें' : 'Reset Demo Workflows'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar with SOS */}
      <div
        id="saathi-mobile-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E7E2D8] px-2 py-2 flex items-center justify-around z-40 shadow-lg"
      >
        <button
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-bold ${
            currentScreen === 'home' ? 'text-[#0C1D2E]' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t.home}</span>
        </button>
        <button
          onClick={() => setCurrentScreen('ask')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-bold ${
            currentScreen === 'ask' ? 'text-[#0C1D2E]' : 'text-slate-500'
          }`}
        >
          <MessageCircleQuestion className="w-5 h-5" />
          <span>{t.askSaathi}</span>
        </button>
        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-2xl text-xs font-black bg-red-600 text-white shadow-md active:scale-95"
        >
          <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
          <span>SOS</span>
        </button>
        <button
          onClick={() => setCurrentScreen('tasks')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-bold ${
            currentScreen === 'tasks' ? 'text-[#0C1D2E]' : 'text-slate-500'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{t.helpMeDoIt}</span>
        </button>
        <button
          onClick={() => setCurrentScreen('explain')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-xs font-bold ${
            currentScreen === 'explain' ? 'text-[#0C1D2E]' : 'text-slate-500'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span>{t.explainAnything}</span>
        </button>
      </div>
    </>
  );
};

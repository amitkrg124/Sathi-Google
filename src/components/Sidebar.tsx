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
} from 'lucide-react';
import { useApp, ScreenId } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    preferences,
    setEmergencyModalOpen,
  } = useApp();

  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.FC<{ className?: string }>;
    isDanger?: boolean;
  }[] = [
    { id: 'home', label: lang === 'hi' ? 'होम (Home)' : 'Home', icon: Home },
    { id: 'ask', label: lang === 'hi' ? 'साथी से पूछें' : 'Ask Saathi', icon: MessageCircleQuestion },
    { id: 'explain', label: lang === 'hi' ? 'मैसेज व बिल समझें' : 'Explain & Scam Shield', icon: ShieldAlert },
    { id: 'tasks', label: lang === 'hi' ? 'कदम-दर-कदम गाइड' : 'Help Me Do It', icon: CheckCircle2 },
    { id: 'daily_brief', label: lang === 'hi' ? 'दैनिक सारांश' : 'Daily Brief', icon: CalendarDays },
    { id: 'reminders', label: lang === 'hi' ? 'रिमाइंडर व दवाएं' : 'Reminders', icon: Bell },
    { id: 'trusted_circle', label: lang === 'hi' ? 'विश्वसनीय परिवार' : 'Trusted Circle', icon: Users },
    { id: 'settings', label: lang === 'hi' ? 'सेटिंग्स' : 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="saathi-sidebar"
        className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/80 h-screen sticky top-0 z-40 select-none shadow-xs"
        aria-label="Main Navigation"
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-amber-300 shadow-sm font-serif font-bold text-xl">
              साथी
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0F172A] tracking-tight leading-none">Saathi AI</h1>
              <p className="text-xs text-stone-500 font-medium mt-1">
                {lang === 'hi' ? 'वरिष्ठ नागरिक सहायक' : 'Senior Digital Companion'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setCurrentScreen(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-bold text-sm text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-900 shadow-2xs border border-teal-200/80'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-transparent'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-teal-700 text-white' : 'text-stone-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Emergency SOS Quick Button at Bottom of Sidebar */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-50/50">
          <button
            id="nav-sos"
            onClick={() => setEmergencyModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <AlertTriangle className="w-5 h-5 text-amber-200" />
            <span>{lang === 'hi' ? 'आपातकालीन SOS (112)' : 'Emergency SOS (112)'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="saathi-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentScreen === 'home' ? 'text-teal-800 font-bold' : 'text-stone-500 font-medium'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{lang === 'hi' ? 'होम' : 'Home'}</span>
        </button>

        <button
          onClick={() => setCurrentScreen('ask')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentScreen === 'ask' ? 'text-teal-800 font-bold' : 'text-stone-500 font-medium'
          }`}
        >
          <MessageCircleQuestion className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{lang === 'hi' ? 'पूछें' : 'Ask'}</span>
        </button>

        <button
          onClick={() => setCurrentScreen('explain')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentScreen === 'explain' ? 'text-teal-800 font-bold' : 'text-stone-500 font-medium'
          }`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{lang === 'hi' ? 'जांचें' : 'Check'}</span>
        </button>

        <button
          onClick={() => setCurrentScreen('tasks')}
          className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentScreen === 'tasks' ? 'text-teal-800 font-bold' : 'text-stone-500 font-medium'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">{lang === 'hi' ? 'गाइड' : 'Guide'}</span>
        </button>

        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="flex flex-col items-center py-1 px-2.5 rounded-lg text-rose-600 font-bold cursor-pointer"
        >
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <span className="text-[11px] mt-0.5">SOS</span>
        </button>
      </nav>
    </>
  );
};

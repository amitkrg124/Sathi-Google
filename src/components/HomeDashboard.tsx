import React from 'react';
import {
  Mic,
  FileSearch,
  CheckCircle2,
  Calendar,
  Bell,
  Users,
  Volume2,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronRight,
  Check,
  AlertTriangle,
  Phone,
  MapPin,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';

export const HomeDashboard: React.FC = () => {
  const {
    preferences,
    setCurrentScreen,
    setVoiceModalOpen,
    setEmergencyModalOpen,
    reminders,
    toggleReminder,
    getActiveTask,
    tasks,
    setActiveTaskId,
    contacts,
    medicalProfile,
    speak,
  } = useApp();

  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const activeTask = getActiveTask();
  const todayReminders = reminders.filter((r) => r.date === 'Today');
  const pendingReminders = todayReminders.filter((r) => !r.completed);
  const primaryContact = contacts[0] || {
    name: 'Rahul Gupta',
    relationship: 'Son',
    phone: '+91 98201 45890',
  };

  const handleListenBrief = () => {
    if (lang === 'hi') {
      const speech = `नमस्ते ${preferences.userName} जी। आज आपके ${
        pendingReminders.length > 0 ? `${pendingReminders.length} जरूरी काम बाकी हैं` : 'कोई आवश्यक रिमाइंडर नहीं हैं'
      }। ${
        activeTask && activeTask.status === 'in_progress'
          ? `आपका एक कार्य चल रहा है: ${activeTask.title}।`
          : ''
      } यदि कोई अनजान मैसेज आया हो, तो 'मैसेज समझें' पर टैप करके जांच लें।`;
      speak(speech);
    } else {
      const speech = `Good day ${preferences.userName}. Today you have ${
        pendingReminders.length > 0 ? `${pendingReminders.length} pending reminders` : 'no urgent reminders'
      }. ${
        activeTask && activeTask.status === 'in_progress'
          ? `You have an active task: ${activeTask.title}, currently at step ${activeTask.currentStepIndex + 1}.`
          : ''
      } If you received any unfamiliar message or SMS, tap Explain Anything to verify it safely.`;
      speak(speech);
    }
  };

  return (
    <div id="home-dashboard" className="space-y-8 max-w-6xl mx-auto">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-[#0C1D2E] via-[#152E48] to-[#0C1D2E] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-[#E7E2D8]">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm font-semibold text-[#F3E5AB] backdrop-blur-xs border border-[#F3E5AB]/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {lang === 'hi'
                ? 'वरिष्ठ नागरिकों का विश्वसनीय डिजिटल साथी'
                : 'Senior-First Calm Digital Companion'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {lang === 'hi'
              ? `नमस्ते ${preferences.userName} जी, आज मैं आपकी क्या मदद करूँ?`
              : `Good day, ${preferences.userName}. How can I assist you?`}
          </h2>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            {lang === 'hi'
              ? 'संदेश व बिल समझें, सुरक्षित रूप से ऑनलाइन काम पूरे करें, और धोखाधड़ी से बचें।'
              : 'Understand confusing messages, complete digital tasks safely at your own pace, and stay protected from scams.'}
          </p>

          {/* Quick audio greeting trigger & SOS trigger */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              id="home-listen-brief-btn"
              onClick={handleListenBrief}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm transition-all border border-white/20 shadow-xs active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>{t.listenAudioBrief}</span>
            </button>

            <button
              id="home-open-sos-btn"
              onClick={() => setEmergencyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm transition-all border border-red-400 shadow-xs active:scale-95"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{t.emergencySosButton}</span>
            </button>

            <button
              onClick={() => setCurrentScreen('daily_brief')}
              className="text-xs sm:text-sm text-slate-300 hover:text-white font-semibold underline underline-offset-4"
            >
              {lang === 'hi' ? 'दैनिक सारांश देखें' : 'View Daily Brief'}
            </button>
          </div>
        </div>

        {/* Elegant Devanagari Background Watermark */}
        <div className="absolute right-4 -bottom-6 text-white/5 pointer-events-none hidden md:block">
          <span className="text-[190px] font-black select-none font-serif">साथी</span>
        </div>
      </div>

      {/* Emergency Quick Access Banner (Specially designed for Indian elders) */}
      <div className="bg-gradient-to-r from-red-50 via-amber-50 to-red-50 rounded-3xl p-5 sm:p-6 border-2 border-red-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-black text-slate-900">{t.emergencySosTitle}</h4>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-950 uppercase">
                {lang === 'hi' ? '24/7 सक्रिय' : 'Instant 24x7'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'hi'
                ? 'तुरंत 112, 108 या परिवार को कॉल करें। लाउड सायरन और लाइव GPS शेयरिंग उपलब्ध।'
                : 'One-tap dial for 112, 108 Ambulance, Elderline (14567), and family with live GPS.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <a
            href="tel:112"
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>112</span>
          </a>
          <a
            href="tel:108"
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>108</span>
          </a>
          <a
            href={`tel:${primaryContact.phone.replace(/[^0-9+]/g, '')}`}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs"
          >
            <Phone className="w-4 h-4" />
            <span>{primaryContact.name}</span>
          </a>
          <button
            onClick={() => setEmergencyModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border-2 border-red-400 text-red-700 hover:bg-red-50 font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            {lang === 'hi' ? 'पूरा SOS पैनल खोलें' : 'Open Full SOS'}
          </button>
        </div>
      </div>

      {/* The 3 Signature Primary Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-[#0C1D2E]">{t.whatToDo}</h3>
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            {t.tapCardToStart}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Talk to Saathi */}
          <button
            id="card-talk-to-saathi"
            onClick={() => setVoiceModalOpen(true)}
            className="text-left bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#E7E2D8] hover:border-[#0F766E] shadow-xs hover:shadow-lg transition-all group relative flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Mic className="w-8 h-8 animate-pulse text-[#0F766E]" />
              </div>
              <h4 className="text-xl font-bold text-[#0C1D2E] group-hover:text-[#0F766E] transition-colors mb-2">
                {t.cardTalkTitle}
              </h4>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.cardTalkDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#0F766E]">
              <span>{t.cardTalkAction}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Explain Something & Scam Shield */}
          <button
            id="card-explain-something"
            onClick={() => setCurrentScreen('explain')}
            className="text-left bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#E7E2D8] hover:border-[#1E3A5F] shadow-xs hover:shadow-lg transition-all group relative flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F]/10 text-[#1E3A5F] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <FileSearch className="w-8 h-8 text-[#1E3A5F]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-[#0C1D2E] group-hover:text-[#1E3A5F] transition-colors">
                  {t.cardExplainTitle}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                  {lang === 'hi' ? 'धोखाधड़ी जांच' : 'Scam Shield'}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.cardExplainDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#1E3A5F]">
              <span>{t.cardExplainAction}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Help Me Do It */}
          <button
            id="card-help-me-do-it"
            onClick={() => {
              if (activeTask) {
                setActiveTaskId(activeTask.id);
              }
              setCurrentScreen('tasks');
            }}
            className="text-left bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#E7E2D8] hover:border-[#0F766E] shadow-xs hover:shadow-lg transition-all group relative flex flex-col justify-between"
          >
            <div>
              <div className="w-16 h-16 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-8 h-8 text-[#0F766E]" />
              </div>
              <h4 className="text-xl font-bold text-[#0C1D2E] group-hover:text-[#0F766E] transition-colors mb-2">
                {t.cardTaskTitle}
              </h4>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t.cardTaskDesc}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#0F766E]">
              <span>{t.cardTaskAction}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Two Columns: Active Task & Today's Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Task Progress Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E7E2D8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 bg-emerald-100/80 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'सक्रिय कार्य' : 'Active Guided Task'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {lang === 'hi' ? 'चरण' : 'Step'} {activeTask ? activeTask.currentStepIndex + 1 : 1}{' '}
                {lang === 'hi' ? 'कुल' : 'of'} {activeTask ? activeTask.steps.length : 4}
              </span>
            </div>

            {activeTask ? (
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-[#0C1D2E]">{activeTask.title}</h4>
                <p className="text-sm text-slate-600">{activeTask.goal}</p>

                {/* Progress bar */}
                <div className="w-full bg-[#F4EFEA] h-3 rounded-full overflow-hidden border border-[#E7E2D8] my-3">
                  <div
                    className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((activeTask.currentStepIndex + 1) / activeTask.steps.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8]">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {lang === 'hi' ? 'वर्तमान चरण:' : 'Current Step:'}
                  </p>
                  <p className="text-base font-semibold text-[#0C1D2E] mt-1">
                    {activeTask.steps[activeTask.currentStepIndex]?.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                    {activeTask.steps[activeTask.currentStepIndex]?.instruction}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">
                {lang === 'hi' ? 'कोई सक्रिय कार्य नहीं है।' : 'No active task. Start a new task anytime!'}
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
            <button
              onClick={() => {
                if (activeTask) setActiveTaskId(activeTask.id);
                setCurrentScreen('tasks');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>{lang === 'hi' ? 'कार्य जारी रखें' : 'Continue Task'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentScreen('tasks')}
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900"
            >
              {lang === 'hi' ? 'सभी कार्य गाइड' : 'All Task Workflows'}
            </button>
          </div>
        </div>

        {/* Today's Reminders Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E7E2D8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0C1D2E] flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full">
                <Bell className="w-3.5 h-3.5 text-amber-800" />
                {t.todayReminders}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {todayReminders.filter((r) => r.completed).length}/{todayReminders.length}{' '}
                {lang === 'hi' ? 'पूर्ण' : 'Done'}
              </span>
            </div>

            <div className="space-y-2.5">
              {todayReminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  onClick={() => toggleReminder(reminder.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    reminder.completed
                      ? 'bg-[#FAF8F5] border-[#E7E2D8] opacity-60'
                      : 'bg-white border-[#E7E2D8] hover:border-amber-500 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 ${
                        reminder.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-400 bg-white'
                      }`}
                    >
                      {reminder.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="truncate">
                      <p
                        className={`text-base font-semibold leading-snug truncate ${
                          reminder.completed ? 'line-through text-slate-400' : 'text-[#0C1D2E]'
                        }`}
                      >
                        {reminder.title}
                      </p>
                      <p className="text-xs text-slate-500">{reminder.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-slate-600 border border-[#E7E2D8] shrink-0 ml-2">
                    {reminder.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E7E2D8] flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('reminders')}
              className="text-sm font-bold text-amber-900 hover:underline flex items-center gap-1"
            >
              <span>{lang === 'hi' ? 'सभी रिमाइंडर देखें' : 'Open All Reminders'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentScreen('reminders')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] text-slate-800 hover:bg-white"
            >
              + {lang === 'hi' ? 'नया जोड़ें' : 'Add Reminder'}
            </button>
          </div>
        </div>
      </div>

      {/* Trusted Circle Quick Reassurance Strip */}
      <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E7E2D8] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#E7E2D8] flex items-center justify-center text-[#0C1D2E] shadow-xs">
            <Users className="w-5 h-5 text-[#0C1D2E]" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-[#0C1D2E]">
              {lang === 'hi' ? 'परिवार व विश्वसनीय लोग' : 'Need someone you trust involved?'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              {primaryContact.name} ({primaryContact.relationship}){' '}
              {lang === 'hi'
                ? 'आपात स्थिति या सुरक्षा सलाह के लिए पंजीकृत हैं।'
                : 'is registered to receive safety alerts if you need a second opinion.'}
            </p>
          </div>
        </div>
        <button
          id="btn-open-trusted-circle-home"
          onClick={() => setCurrentScreen('trusted_circle')}
          className="px-4 py-2 rounded-xl bg-white border border-[#E7E2D8] text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
        >
          {lang === 'hi' ? 'संपर्क सूची देखें' : 'Manage Trusted Circle'}
        </button>
      </div>
    </div>
  );
};

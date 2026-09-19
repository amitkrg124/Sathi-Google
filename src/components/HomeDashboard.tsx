import React from 'react';
import {
  Mic,
  FileSearch,
  CheckCircle2,
  Bell,
  Volume2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Check,
  AlertTriangle,
  Phone,
  ChevronRight,
  Lock,
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
    setActiveTaskId,
    contacts,
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
      }। यदि कोई अनजान मैसेज आया हो, तो 'मैसेज समझें' पर टैप करके जांच लें।`;
      speak(speech);
    } else {
      const speech = `Good day ${preferences.userName}. Today you have ${
        pendingReminders.length > 0 ? `${pendingReminders.length} pending reminders` : 'no urgent reminders'
      }. If you received any unfamiliar message or SMS, tap Explain Anything to verify it safely.`;
      speak(speech);
    }
  };

  return (
    <div id="home-dashboard" className="space-y-6 max-w-5xl mx-auto">
      {/* Calm, Welcoming Hero Section */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-amber-300">
            <span>✨ {lang === 'hi' ? 'आपका विश्वसनीय डिजिटल सहायक' : 'Your Digital Companion'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            {lang === 'hi'
              ? `नमस्ते ${preferences.userName} जी, आज मैं आपकी क्या मदद करूँ?`
              : `Hello ${preferences.userName}, how can I help you today?`}
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            {lang === 'hi'
              ? 'संदेश व बिल समझें, सुरक्षित रूप से ऑनलाइन काम पूरे करें, और धोखाधड़ी से बचें।'
              : 'Understand confusing messages, complete digital tasks safely at your own pace, and stay protected from scams.'}
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              id="home-open-voice-btn"
              onClick={() => setVoiceModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-teal-200" />
              <span>{lang === 'hi' ? 'बोलकर पूछें' : 'Tap to Speak'}</span>
            </button>

            <button
              id="home-listen-brief-btn"
              onClick={handleListenBrief}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors cursor-pointer border border-white/20"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>{lang === 'hi' ? 'सारांश सुनें' : 'Listen Brief'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Big, Clear Main Action Cards */}
      <div>
        <h3 className="text-lg font-bold text-stone-900 mb-3.5">
          {lang === 'hi' ? 'मुख्य सुविधाएं (Choose an Option)' : 'Main Features'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Ask Saathi */}
          <button
            id="card-talk-to-saathi"
            onClick={() => setCurrentScreen('ask')}
            className="text-left bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 hover:border-teal-600 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 group-hover:text-teal-700 transition-colors mb-1.5">
                {lang === 'hi' ? 'साथी से पूछें' : 'Ask Saathi'}
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'आवाज या लिखकर कोई भी सवाल पूछें। सरल हिंदी में जवाब पाएं।'
                  : 'Ask any question via voice or text. Get clear, patient answers.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-teal-700">
              <span>{lang === 'hi' ? 'बातचीत शुरू करें' : 'Start Chat'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Explain SMS & Bills */}
          <button
            id="card-explain-something"
            onClick={() => setCurrentScreen('explain')}
            className="text-left bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 hover:border-blue-600 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileSearch className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 group-hover:text-blue-700 transition-colors mb-1.5">
                {lang === 'hi' ? 'मैसेज व बिल समझें (Scam Check)' : 'Explain SMS & Bills'}
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'संदिग्ध SMS, WhatsApp मैसेज या बिल की फोटो अपलोड करके जांचें।'
                  : 'Check suspicious messages, verify bills, and detect scams.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-700">
              <span>{lang === 'hi' ? 'मैसेज जांचें' : 'Check Message'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Help Me Do It */}
          <button
            id="card-help-me-do-it"
            onClick={() => {
              if (activeTask) setActiveTaskId(activeTask.id);
              setCurrentScreen('tasks');
            }}
            className="text-left bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors mb-1.5">
                {lang === 'hi' ? 'कदम-दर-कदम काम पूरा करें' : 'Step-by-Step Task Guide'}
              </h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                {lang === 'hi'
                  ? 'बिजली बिल भुगतान, रेल टिकट व UPI गाइड बिना किसी गलती के पूरा करें।'
                  : 'Pay electricity bills, book tickets, and learn digital tasks step by step.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-emerald-700">
              <span>{lang === 'hi' ? 'गाइड शुरू करें' : 'Start Task'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: Emergency SOS */}
          <button
            id="card-emergency-sos"
            onClick={() => setEmergencyModalOpen(true)}
            className="text-left bg-rose-50/70 rounded-2xl p-5 sm:p-6 border border-rose-200 hover:border-rose-600 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-rose-950 group-hover:text-rose-700 transition-colors mb-1.5">
                {lang === 'hi' ? 'आपातकालीन सहायता (Emergency SOS)' : 'Emergency Help & SOS'}
              </h4>
              <p className="text-sm text-rose-900/80 leading-relaxed">
                {lang === 'hi'
                  ? '112 पुलिस, 108 एम्बुलेंस या परिवार को तुरंत कॉल व GPS लोकेशन भेजें।'
                  : 'Call 112, 108 Ambulance, or alert your family instantly with GPS.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-rose-700">
              <span>{lang === 'hi' ? 'SOS सहायता खोलें' : 'Open SOS'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Two Clean Overview Cards: Reminders & Active Task / Safety Tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Today's Reminders */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 bg-amber-100/80 px-2.5 py-1 rounded-full">
                <Bell className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'आज के रिमाइंडर' : "Today's Reminders"}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                {todayReminders.filter((r) => r.completed).length}/{todayReminders.length}{' '}
                {lang === 'hi' ? 'पूर्ण' : 'Done'}
              </span>
            </div>

            <div className="space-y-2">
              {todayReminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  onClick={() => toggleReminder(reminder.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    reminder.completed
                      ? 'bg-stone-50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
                        reminder.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-400 bg-white'
                      }`}
                    >
                      {reminder.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="truncate">
                      <p
                        className={`text-sm font-semibold truncate ${
                          reminder.completed ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {reminder.title}
                      </p>
                      <p className="text-xs text-stone-500">{reminder.time}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 shrink-0 ml-2">
                    {reminder.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentScreen('reminders')}
              className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'hi' ? 'सभी रिमाइंडर देखें' : 'View All Reminders'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentScreen('reminders')}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 cursor-pointer"
            >
              + {lang === 'hi' ? 'नया जोड़ें' : 'Add'}
            </button>
          </div>
        </div>

        {/* Right Card: Active Task or Senior Safety Tip */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs flex flex-col justify-between">
          {activeTask ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'सक्रिय कार्य' : 'Active Task'}
                </span>
                <span className="text-xs text-stone-500 font-semibold">
                  {lang === 'hi' ? 'चरण' : 'Step'} {activeTask.currentStepIndex + 1}/{activeTask.steps.length}
                </span>
              </div>

              <h4 className="text-base font-bold text-stone-900">{activeTask.title}</h4>
              <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                {activeTask.steps[activeTask.currentStepIndex]?.instruction}
              </p>

              {/* Simple progress */}
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden my-3 border border-stone-200">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{
                    width: `${((activeTask.currentStepIndex + 1) / activeTask.steps.length) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveTaskId(activeTask.id);
                    setCurrentScreen('tasks');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>{lang === 'hi' ? 'कार्य जारी रखें' : 'Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5 bg-teal-100 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lang === 'hi' ? 'सुरक्षा नियम' : 'Safety Tip'}
                </span>
              </div>

              <h4 className="text-base font-bold text-stone-900">
                {lang === 'hi' ? 'कभी भी किसी को अपना OTP न बताएं' : 'Never share your OTP or UPI PIN'}
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                {lang === 'hi'
                  ? 'बैंक या बिजली विभाग कभी भी फोन पर OTP, पासवर्ड या स्क्रीन शेयरिंग ऐप डाउनलोड करने को नहीं कहते।'
                  : 'Official banks and electricity boards never ask for your OTP, PIN, or remote screen apps over phone calls.'}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentScreen('explain')}
                  className="text-xs font-bold text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'संदेह होने पर तुरंत जांचें' : 'Check a suspicious message'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

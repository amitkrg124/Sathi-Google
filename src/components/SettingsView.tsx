import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Type,
  Eye,
  Volume2,
  Shield,
  RotateCcw,
  Sparkles,
  Check,
  User,
  HeartPulse,
  Languages,
  Phone,
  AlertTriangle,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SirenService } from '../services/siren';
import { TRANSLATIONS } from '../data/translations';

export const SettingsView: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    medicalProfile,
    updateMedicalProfile,
    resetDemoData,
    showNotification,
    speak,
  } = useApp();

  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const [testingSiren, setTestingSiren] = useState(false);

  const handleToggleSirenTest = () => {
    if (testingSiren) {
      SirenService.stop();
      setTestingSiren(false);
      showNotification(lang === 'hi' ? 'सायरन टेस्ट बंद किया गया।' : 'Siren test stopped.');
    } else {
      const ok = SirenService.start();
      if (ok) {
        setTestingSiren(true);
        showNotification(lang === 'hi' ? 'लाउड सायरन टेस्ट चालू है!' : 'Loud siren test sounding!');
      }
    }
  };

  const handleLanguageChange = (newLang: 'en' | 'hi') => {
    updatePreferences({ language: newLang });
    const msg =
      newLang === 'hi'
        ? 'नमस्ते! भाषा हिन्दी में बदल दी गई है।'
        : 'Language switched to English.';
    showNotification(msg);
    speak(msg);
  };

  return (
    <div id="settings-screen" className="max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <div className="pb-4 border-b border-[#E7E2D8]">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0C1D2E]">{t.settingsTitle}</h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1">{t.settingsSub}</p>
      </div>

      {/* Card 0: Primary Language Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#E7E2D8] shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-[#0C1D2E] flex items-center gap-2.5">
          <Languages className="w-5 h-5 text-amber-700" />
          <span>{t.languageChoice}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
              lang === 'hi'
                ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                : 'border-[#E7E2D8] bg-[#FAF8F5] hover:bg-white'
            }`}
          >
            <div>
              <p className="text-lg font-bold text-[#0C1D2E]">🇮🇳 हिन्दी (Hindi)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                आवाज़, टेक्स्ट और सभी मेनू हिन्दी में
              </p>
            </div>
            {lang === 'hi' && <Check className="w-5 h-5 text-amber-700 stroke-[3]" />}
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
              lang === 'en'
                ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                : 'border-[#E7E2D8] bg-[#FAF8F5] hover:bg-white'
            }`}
          >
            <div>
              <p className="text-lg font-bold text-[#0C1D2E]">🇬🇧 English</p>
              <p className="text-xs text-slate-500 mt-0.5">Voice, prompts, and interface in English</p>
            </div>
            {lang === 'en' && <Check className="w-5 h-5 text-amber-700 stroke-[3]" />}
          </button>
        </div>
      </div>

      {/* Card 1: Emergency Medical ID Configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-100 pb-4">
          <div className="flex items-center gap-2.5">
            <HeartPulse className="w-6 h-6 text-red-700" />
            <h3 className="text-xl font-black text-[#0C1D2E]">{t.medicalCardTitle}</h3>
          </div>
          <button
            onClick={handleToggleSirenTest}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              testingSiren
                ? 'bg-slate-900 text-white'
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            }`}
          >
            {testingSiren ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>
              {testingSiren
                ? lang === 'hi'
                  ? 'सायरन बंद करें'
                  : 'Stop Siren'
                : lang === 'hi'
                ? 'सायरन टेस्ट करें'
                : 'Test Emergency Siren'}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {t.bloodGroup}:
            </label>
            <input
              type="text"
              value={medicalProfile.bloodGroup}
              onChange={(e) => updateMedicalProfile({ bloodGroup: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-bold text-red-700 bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {lang === 'hi' ? 'एलर्जी (Known Allergies):' : 'Known Allergies:'}
            </label>
            <input
              type="text"
              value={medicalProfile.allergies.join(', ')}
              onChange={(e) =>
                updateMedicalProfile({
                  allergies: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-medium text-[#0C1D2E] bg-[#FAF8F5]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {t.chronicConditions}:
            </label>
            <input
              type="text"
              value={medicalProfile.chronicConditions.join(', ')}
              onChange={(e) =>
                updateMedicalProfile({
                  chronicConditions: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-medium text-[#0C1D2E] bg-[#FAF8F5]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {lang === 'hi' ? 'महत्वपूर्ण नियमित दवाइयाँ:' : 'Critical Medications:'}
            </label>
            <input
              type="text"
              value={medicalProfile.criticalMedications.join(', ')}
              onChange={(e) =>
                updateMedicalProfile({
                  criticalMedications: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-medium text-[#0C1D2E] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {t.emergencyDoctor}:
            </label>
            <input
              type="text"
              value={medicalProfile.primaryDoctorName}
              onChange={(e) => updateMedicalProfile({ primaryDoctorName: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-medium text-[#0C1D2E] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {lang === 'hi' ? 'डॉक्टर का फोन नंबर:' : 'Doctor Phone:'}
            </label>
            <input
              type="text"
              value={medicalProfile.primaryDoctorPhone}
              onChange={(e) => updateMedicalProfile({ primaryDoctorPhone: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-medium text-[#0C1D2E] bg-[#FAF8F5]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {t.preferredHospital}:
            </label>
            <input
              type="text"
              value={medicalProfile.preferredHospital}
              onChange={(e) => updateMedicalProfile({ preferredHospital: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#E7E2D8] text-base font-medium text-[#0C1D2E] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      {/* Card 2: Senior Accessibility & Visuals */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-6">
        <h3 className="text-xl font-bold text-[#0C1D2E] flex items-center gap-2">
          <Type className="w-5 h-5 text-[#0F766E]" />
          <span>{lang === 'hi' ? 'पढ़ने और देखने की सुगमता' : 'Reading & Visual Accessibility'}</span>
        </h3>

        {/* Text Scaling Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {lang === 'hi' ? 'फॉन्ट आकार (Text Size):' : 'Text Size Preference:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'normal',
                label: lang === 'hi' ? 'सामान्य (18px)' : 'Standard (18px)',
                sample: lang === 'hi' ? 'नमस्ते साथी' : 'Sample text',
              },
              {
                id: 'large',
                label: lang === 'hi' ? 'बड़ा (20px)' : 'Large (20px)',
                sample: lang === 'hi' ? 'नमस्ते साथी' : 'Sample text',
              },
              {
                id: 'extra-large',
                label: lang === 'hi' ? 'अतिरिक्त बड़ा (24px)' : 'Extra Large (24px)',
                sample: lang === 'hi' ? 'नमस्ते साथी' : 'Sample text',
              },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => updatePreferences({ textSize: s.id as any })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  preferences.textSize === s.id
                    ? 'border-[#0C1D2E] bg-[#FAF8F5] shadow-xs'
                    : 'border-[#E7E2D8] bg-white hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-[#0C1D2E]">{s.label}</span>
                  {preferences.textSize === s.id && (
                    <Check className="w-4 h-4 text-[#0C1D2E] stroke-[3]" />
                  )}
                </div>
                <p
                  className={`text-slate-600 font-medium ${
                    s.id === 'normal' ? 'text-sm' : s.id === 'large' ? 'text-base' : 'text-lg'
                  }`}
                >
                  {s.sample}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8]">
          <div className="space-y-0.5">
            <p className="text-base font-bold text-[#0C1D2E] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#0C1D2E]" />
              <span>{lang === 'hi' ? 'हाई कंट्रास्ट मोड' : 'High Contrast Mode'}</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              {lang === 'hi'
                ? 'स्पष्ट और गहरा टेक्स्ट ताकि पढ़ने में कोई परेशानी न हो।'
                : 'Deep navy text against ultra-crisp borders for maximum legibility.'}
            </p>
          </div>
          <button
            id="toggle-high-contrast-settings"
            onClick={() => updatePreferences({ highContrast: !preferences.highContrast })}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
              preferences.highContrast ? 'bg-[#0C1D2E]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform ${
                preferences.highContrast ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Card 3: Voice & Speech Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-6">
        <h3 className="text-xl font-bold text-[#0C1D2E] flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#0F766E]" />
          <span>{lang === 'hi' ? 'आवाज़ व बोलने की गति' : 'Voice & Speech Assistant'}</span>
        </h3>

        {/* Voice Speed */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            {lang === 'hi' ? 'बोलने की गति (Speech Speed):' : 'Speech Rate:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'slow',
                label: lang === 'hi' ? 'धीमी व स्पष्ट (0.8x)' : 'Slow & Clear (0.8x)',
                desc: lang === 'hi' ? 'समझने में सबसे आसान' : 'Easiest to follow',
              },
              {
                id: 'gentle',
                label: lang === 'hi' ? 'सहज व शांत (0.9x)' : 'Gentle (0.9x)',
                desc: lang === 'hi' ? 'सुकून भरी गति' : 'Soft and measured',
              },
              {
                id: 'normal',
                label: lang === 'hi' ? 'मानक (1.0x)' : 'Standard (1.0x)',
                desc: lang === 'hi' ? 'सामान्य बातचीत' : 'Natural conversation',
              },
            ].map((sp) => (
              <button
                key={sp.id}
                onClick={() => updatePreferences({ voiceSpeed: sp.id as any })}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  preferences.voiceSpeed === sp.id
                    ? 'border-[#0F766E] bg-emerald-50/50 shadow-xs'
                    : 'border-[#E7E2D8] bg-[#FAF8F5] hover:bg-white'
                }`}
              >
                <span className="text-sm font-bold text-[#0C1D2E] block">{sp.label}</span>
                <span className="text-xs text-slate-500 mt-0.5 block">{sp.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card 4: User Name */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D8] shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-[#0C1D2E] flex items-center gap-2">
          <User className="w-5 h-5 text-[#0F766E]" />
          <span>{lang === 'hi' ? 'उपयोगकर्ता का नाम' : 'User Profile'}</span>
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {lang === 'hi' ? 'आपका नाम (अभिवादन में प्रयुक्त):' : 'Your Name (used in greetings):'}
          </label>
          <input
            type="text"
            value={preferences.userName}
            onChange={(e) => updatePreferences({ userName: e.target.value })}
            className="w-full max-w-sm p-3 rounded-xl border border-[#E7E2D8] text-base font-bold text-[#0C1D2E] bg-[#FAF8F5]"
          />
        </div>
      </div>

      {/* Card 5: Demo State Reset */}
      <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-950 font-bold text-lg">
          <RotateCcw className="w-5 h-5 text-amber-700" />
          <span>{lang === 'hi' ? 'डेमो रीसेट (मूल स्थिति में लाएं)' : 'Hackathon Evaluation & Demo Reset'}</span>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">
          {lang === 'hi'
            ? 'यदि आप सभी कार्य, रिमाइंडर व डेटा को पुनः शुरुआती स्थिति में देखना चाहते हैं, तो इस बटन को दबाएं।'
            : 'Resets all tasks, reminders, and scenarios back to their initial seeded showcase state.'}
        </p>
        <button
          id="btn-reset-demo-settings"
          onClick={resetDemoData}
          className="px-6 py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm shadow-xs transition-colors"
        >
          {lang === 'hi' ? 'सभी डेटा रीसेट करें' : 'Reset All Workflows to Demo State'}
        </button>
      </div>
    </div>
  );
};

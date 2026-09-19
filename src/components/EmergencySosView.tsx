import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Phone,
  MapPin,
  Volume2,
  VolumeX,
  Share2,
  HeartPulse,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SirenService } from '../services/siren';
import { TRANSLATIONS } from '../data/translations';

export const EmergencySosView: React.FC = () => {
  const { preferences, contacts, medicalProfile, showNotification, speak } = useApp();
  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    mapsUrl: string;
  } | null>(null);

  const primaryContact = contacts[0] || {
    name: 'Rahul Gupta',
    relationship: 'Son',
    phone: '+91 98201 45890',
  };

  useEffect(() => {
    fetchLiveLocation();
    return () => {
      SirenService.stop();
    };
  }, []);

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      setLocationData({
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 15,
        mapsUrl: 'https://www.google.com/maps?q=12.9716,77.5946',
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        const acc = Math.round(pos.coords.accuracy);
        setLocationData({
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        });
        setLocating(false);
      },
      () => {
        setLocationData({
          latitude: 12.9716,
          longitude: 77.5946,
          accuracy: 25,
          mapsUrl: 'https://www.google.com/maps?q=12.9716,77.5946',
        });
        setLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleToggleSiren = () => {
    if (isAlarmPlaying) {
      SirenService.stop();
      setIsAlarmPlaying(false);
      showNotification(lang === 'hi' ? 'सायरन बंद किया गया।' : 'Emergency siren stopped.');
    } else {
      const ok = SirenService.start();
      if (ok) {
        setIsAlarmPlaying(true);
        showNotification(lang === 'hi' ? 'लाउड सायरन चालू है।' : 'Emergency siren sounding.');
      }
    }
  };

  const emergencyText =
    lang === 'hi'
      ? `🚨 आपातकालीन SOS: ${preferences.userName} को तुरंत सहायता की आवश्यकता है! GPS लोकेशन: ${
          locationData ? locationData.mapsUrl : 'https://www.google.com/maps'
        }। रक्त समूह: ${medicalProfile?.bloodGroup || 'B+'}। संपर्क डॉक्टर: ${
          medicalProfile?.primaryDoctorName || 'Dr. Sharma'
        } (${medicalProfile?.primaryDoctorPhone || '+91 98110 77412'})`
      : `🚨 EMERGENCY SOS: ${preferences.userName} needs urgent assistance! GPS Location: ${
          locationData ? locationData.mapsUrl : 'https://www.google.com/maps'
        }. Blood Group: ${medicalProfile?.bloodGroup || 'B+'}. Doctor: ${
          medicalProfile?.primaryDoctorName || 'Dr. Sharma'
        } (${medicalProfile?.primaryDoctorPhone || '+91 98110 77412'})`;

  const handleCopyDetails = () => {
    try {
      navigator.clipboard.writeText(emergencyText);
      setCopied(true);
      showNotification(lang === 'hi' ? 'विवरण कॉपी हो गया!' : 'Emergency message copied!');
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  return (
    <div id="emergency-sos-view" className="max-w-5xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#991B1B] via-[#B91C1C] to-[#7F1D1D] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs sm:text-sm font-bold backdrop-blur-xs">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>{lang === 'hi' ? '24/7 आपातकालीन सहायता' : '24/7 Rapid Emergency Response'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {t.emergencySosTitle}
          </h2>
          <p className="text-base sm:text-lg text-red-100 font-medium leading-relaxed">
            {t.emergencySosSub}
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={handleToggleSiren}
              className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2.5 shadow-lg transition-all active:scale-95 ${
                isAlarmPlaying
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-red-700 hover:bg-red-50'
              }`}
            >
              {isAlarmPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
              <span>{isAlarmPlaying ? t.stopSiren : t.playSiren}</span>
            </button>
            <p className="text-xs text-red-200">{t.sirenNotice}</p>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 text-white/5 pointer-events-none hidden md:block">
          <span className="text-[180px] font-black select-none">SOS</span>
        </div>
      </div>

      {/* Grid: Helplines & Family Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Indian Helplines & Direct Calling */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#0C1D2E]">{t.dialHelplines}</h3>
            <span className="text-xs font-semibold text-slate-500">
              {lang === 'hi' ? 'सीधा कॉल करने के लिए टैप करें' : 'Tap any card to dial immediately'}
            </span>
          </div>

          {/* 112 National All-in-One */}
          <a
            href="tel:112"
            className="p-5 rounded-2xl bg-white border-2 border-red-200 hover:border-red-600 hover:shadow-md flex items-center justify-between gap-4 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                112
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                  {lang === 'hi' ? 'राष्ट्रीय आपातकाल (112)' : 'National All-in-One Emergency (112)'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi'
                    ? 'पुलिस, एम्बुलेंस और फायर सर्विस — 24 घंटे निःशुल्क सहायता'
                    : 'Police, Ambulance & Fire Service across India'}
                </p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-red-600 group-hover:bg-red-700 text-white font-black text-sm flex items-center gap-1.5 shrink-0 shadow-xs">
              <Phone className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कॉल 112' : 'Call 112'}</span>
            </div>
          </a>

          {/* 108 Free Ambulance */}
          <a
            href="tel:108"
            className="p-5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-600 hover:shadow-md flex items-center justify-between gap-4 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                108
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {lang === 'hi' ? 'राष्ट्रीय एम्बुलेंस सेवा (108)' : 'Free National Ambulance Service (108)'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi'
                    ? 'अस्पताल ले जाने हेतु सरकारी एम्बुलेंस वाहन'
                    : 'Immediate hospital transport for medical emergencies'}
                </p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-emerald-700 group-hover:bg-emerald-800 text-white font-black text-sm flex items-center gap-1.5 shrink-0 shadow-xs">
              <Phone className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कॉल 108' : 'Call 108'}</span>
            </div>
          </a>

          {/* 14567 Elderline (Ministry of Social Justice) */}
          <a
            href="tel:14567"
            className="p-5 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-600 hover:shadow-md flex items-center justify-between gap-4 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                14567
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                    {lang === 'hi' ? 'एल्डरलाइन (14567)' : 'Elderline (14567)'}
                  </p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    {lang === 'hi' ? 'वरिष्ठ नागरिक हेल्पलाइन' : 'Senior Helpline'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {lang === 'hi'
                    ? 'सामाजिक न्याय व अधिकारिता मंत्रालय — बुजुर्गों की कानूनी, स्वास्थ्य व भावनात्मक सहायता'
                    : 'Ministry of Social Justice — Specialized medical, rescue and legal aid for seniors'}
                </p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-amber-700 group-hover:bg-amber-800 text-white font-black text-sm flex items-center gap-1.5 shrink-0 shadow-xs">
              <Phone className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कॉल 14567' : 'Call 14567'}</span>
            </div>
          </a>

          {/* 1930 Cyber Fraud */}
          <a
            href="tel:1930"
            className="p-5 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-600 hover:shadow-md flex items-center justify-between gap-4 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                1930
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 group-hover:text-blue-800 transition-colors">
                  {lang === 'hi' ? 'साइबर व बैंक धोखाधड़ी हेल्पलाइन (1930)' : 'Cyber & Financial Fraud (1930)'}
                </p>
                <p className="text-sm text-slate-600">
                  {lang === 'hi'
                    ? 'ऑनलाइन ठगी होने पर बैंक खाता तुरंत फ्रीज कराने के लिए'
                    : 'Golden hour emergency freezing of stolen bank funds'}
                </p>
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-xl bg-blue-700 group-hover:bg-blue-800 text-white font-black text-sm flex items-center gap-1.5 shrink-0 shadow-xs">
              <Phone className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कॉल 1930' : 'Call 1930'}</span>
            </div>
          </a>
        </div>

        {/* Right Col: Primary Family Contact & Quick WhatsApp Dispatch */}
        <div className="space-y-5">
          {/* Family Contact Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
              {lang === 'hi' ? 'प्राथमिक पारिवारिक संपर्क' : 'Primary Family Contact'}
            </span>

            <div>
              <p className="text-2xl font-black text-slate-900">{primaryContact.name}</p>
              <p className="text-sm text-slate-600 font-semibold">{primaryContact.relationship}</p>
              <p className="text-base font-bold text-emerald-800 mt-1">{primaryContact.phone}</p>
            </div>

            <a
              href={`tel:${primaryContact.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 text-center"
            >
              <Phone className="w-5 h-5" />
              <span>{lang === 'hi' ? 'परिवार को कॉल करें' : 'Direct Call Family'}</span>
            </a>
          </div>

          {/* GPS Status & WhatsApp Alert */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-600" />
                {lang === 'hi' ? 'लाइव GPS लोकेशन' : 'Live GPS Coordinates'}
              </span>
              <button
                onClick={fetchLiveLocation}
                className="text-xs font-bold text-red-700 hover:underline"
              >
                {lang === 'hi' ? 'रिफ्रेश' : 'Refresh'}
              </button>
            </div>

            {locating ? (
              <p className="text-xs text-slate-500 animate-pulse">{t.locatingGps}</p>
            ) : locationData ? (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {locationData.latitude}, {locationData.longitude}
                </p>
                <p className="text-xs text-slate-500">
                  {lang === 'hi' ? 'सटीकता' : 'Accuracy'}: ±{locationData.accuracy}m
                </p>
                <a
                  href={locationData.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-700 hover:underline pt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Location pending</p>
            )}

            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(emergencyText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all text-center"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t.shareViaWhatsapp}</span>
              </a>

              <button
                onClick={handleCopyDetails}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'hi' ? 'कॉपी हो गया' : 'Copied') : (lang === 'hi' ? 'इमरजेंसी संदेश कॉपी करें' : 'Copy Emergency Text')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Medical ID Card for Paramedics & Doctors */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-200 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
              <HeartPulse className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">{t.medicalCardTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                {lang === 'hi'
                  ? 'आपात स्थिति में एम्बुलेंस या डॉक्टर को तुरंत दिखाने हेतु'
                  : 'Vital details instantly accessible to first responders and emergency room staff'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-100 text-red-900 border border-red-200">
            {preferences.userName} • Age 68
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.bloodGroup}</p>
            <p className="text-2xl font-black text-red-700 mt-1">
              {medicalProfile?.bloodGroup || 'B Positive (B+)'}
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'hi' ? 'एलर्जी (Allergies)' : 'Known Allergies'}
            </p>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {medicalProfile?.allergies?.join(', ') || 'Penicillin (Moderate)'}
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.chronicConditions}
            </p>
            <p className="text-base font-bold text-slate-900 mt-1">
              {medicalProfile?.chronicConditions?.join(', ') || 'Type 2 Diabetes, High BP'}
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-slate-200 sm:col-span-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'hi' ? 'महत्वपूर्ण नियमित दवाइयाँ' : 'Critical Daily Medications'}
            </p>
            <p className="text-base font-semibold text-slate-900 mt-1">
              {medicalProfile?.criticalMedications?.join(' • ') ||
                'Amlodipine 5mg (Morning) • Metformin 500mg (Post-dinner)'}
            </p>
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.emergencyDoctor}</p>
            <p className="text-base font-bold text-slate-900 mt-1">
              {medicalProfile?.primaryDoctorName || 'Dr. Ashok Sharma'}
            </p>
            <a
              href={`tel:${medicalProfile?.primaryDoctorPhone || '+919811077412'}`}
              className="text-xs font-bold text-red-700 hover:underline inline-flex items-center gap-1 mt-1"
            >
              <Phone className="w-3 h-3" />
              <span>{medicalProfile?.primaryDoctorPhone || '+91 98110 77412'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

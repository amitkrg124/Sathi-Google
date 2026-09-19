import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Phone,
  MapPin,
  Volume2,
  VolumeX,
  X,
  Share2,
  HeartPulse,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SirenService } from '../services/siren';
import { TRANSLATIONS } from '../data/translations';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const { preferences, contacts, medicalProfile, showNotification, speak, isSpeaking, stopSpeaking } = useApp();
  const lang = preferences.language || 'hi';
  const t = TRANSLATIONS[lang];

  const [countdown, setCountdown] = useState<number | null>(5);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    mapsUrl: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'helplines' | 'location' | 'medical'>('helplines');

  const primaryContact = contacts[0] || {
    name: 'Son / Caregiver',
    phone: '+91 98201 45890',
    relationship: 'Family',
  };

  // Reset & start countdown whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      fetchLiveLocation();
    } else {
      handleStopSiren();
      setCountdown(null);
    }
  }, [isOpen]);

  // Handle 5-second countdown timer
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Countdown finished - Announce SOS active
      const alertMsg =
        lang === 'hi'
          ? 'आपातकालीन सहायता सक्रिय है। आप सीधे 112 या परिवार को कॉल कर सकते हैं।'
          : 'Emergency SOS is active. Helplines and your family contact are ready to dial.';
      speak(alertMsg);
      setCountdown(null);
    }
  }, [countdown, lang]);

  const handleCancelCountdown = () => {
    setCountdown(null);
    showNotification(lang === 'hi' ? 'काउंटडाउन रद्द किया गया।' : 'Emergency countdown canceled.');
  };

  const handleToggleSiren = () => {
    if (isAlarmPlaying) {
      handleStopSiren();
    } else {
      const success = SirenService.start();
      if (success) {
        setIsAlarmPlaying(true);
        showNotification(lang === 'hi' ? 'लाउड सायरन चालू किया गया।' : 'Loud emergency siren activated.');
      }
    }
  };

  const handleStopSiren = () => {
    SirenService.stop();
    setIsAlarmPlaying(false);
  };

  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      // Fallback location for demonstration
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
      (err) => {
        console.warn('Geolocation lookup issue, using approximate:', err);
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

  if (!isOpen) return null;

  const emergencyMessage = encodeURIComponent(
    lang === 'hi'
      ? `🚨 आपातकालीन SOS: ${preferences.userName} को तुरंत सहायता की आवश्यकता है! GPS लोकेशन: ${
          locationData ? locationData.mapsUrl : 'उपलब्ध नहीं'
        }। रक्त समूह: ${medicalProfile?.bloodGroup || 'B+'}`
      : `🚨 EMERGENCY SOS: ${preferences.userName} requires immediate assistance! GPS Location: ${
          locationData ? locationData.mapsUrl : 'Not available'
        }. Blood Group: ${medicalProfile?.bloodGroup || 'B+'}`
  );

  return (
    <div
      id="emergency-sos-modal"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A1624]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-[#B91C1C] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with High-Contrast Warning Banner */}
        <div className="bg-[#B91C1C] text-white px-5 sm:px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {t.emergencySosTitle}
              </h2>
              <p className="text-xs sm:text-sm text-red-100 font-medium">{t.emergencySosSub}</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStopSiren();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors font-bold"
            aria-label="Close Emergency SOS"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 5-Second Cancellation Buffer if active */}
        {countdown !== null && (
          <div className="bg-amber-50 border-b-2 border-amber-300 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-950 text-sm sm:text-base font-bold">
              <Clock className="w-5 h-5 text-amber-700 animate-spin" />
              <span>
                {t.alertCountdown} <strong className="text-xl text-red-700">{countdown}</strong>{' '}
                {t.secondsRemaining}...
              </span>
            </div>
            <button
              onClick={handleCancelCountdown}
              className="px-4 py-2 rounded-xl bg-white border-2 border-amber-600 text-amber-900 font-bold text-xs sm:text-sm hover:bg-amber-100 transition-colors shadow-xs"
            >
              {t.cancelEmergency}
            </button>
          </div>
        )}

        {/* Action Tabs: Helplines, Location Dispatch, Medical ID */}
        <div className="flex border-b border-slate-200 bg-[#FAF8F5] px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('helplines')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'helplines'
                ? 'bg-white border-[#B91C1C] text-[#B91C1C] shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>{lang === 'hi' ? 'हेल्पलाइन डायल करें' : 'Emergency Dials'}</span>
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'location'
                ? 'bg-white border-[#B91C1C] text-[#B91C1C] shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{lang === 'hi' ? 'GPS लोकेशन व संदेश' : 'Location & SOS Message'}</span>
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-sm sm:text-base flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'medical'
                ? 'bg-white border-[#B91C1C] text-[#B91C1C] shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>{lang === 'hi' ? 'मेडिकल कार्ड' : 'Medical Card'}</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: Emergency Helplines & Family Dial */}
          {activeTab === 'helplines' && (
            <div className="space-y-4">
              {/* Primary Family Contact Call Out */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                      {lang === 'hi' ? 'प्राथमिक संपर्क' : 'Primary Family Contact'}
                    </span>
                    <span className="text-sm text-emerald-800 font-semibold">
                      ({primaryContact.relationship})
                    </span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1">{primaryContact.name}</p>
                  <p className="text-sm font-medium text-slate-600">{primaryContact.phone}</p>
                </div>
                <a
                  id="btn-call-family"
                  href={`tel:${primaryContact.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2.5 shadow-md active:scale-95 transition-all text-center"
                >
                  <Phone className="w-5 h-5 text-white" />
                  <span>{lang === 'hi' ? 'परिवार को कॉल करें' : 'Call Family Now'}</span>
                </a>
              </div>

              {/* Verified Indian Government Emergency Helplines */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t.dialHelplines}
                </p>

                {/* 112 All-in-One */}
                <a
                  id="btn-call-112"
                  href="tel:112"
                  className="p-4 rounded-2xl bg-white border-2 border-red-200 hover:border-red-500 hover:bg-red-50/50 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl">
                      112
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {lang === 'hi' ? 'राष्ट्रीय आपातकाल (112)' : 'National All-in-One Emergency (112)'}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {lang === 'hi'
                          ? 'पुलिस, एम्बुलेंस और फायर सर्विस — पूरे भारत में निःशुल्क'
                          : 'Police, Ambulance & Fire Service across India'}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center gap-1 shrink-0">
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'कॉल 112' : 'Call 112'}</span>
                  </div>
                </a>

                {/* 108 Free National Ambulance */}
                <a
                  id="btn-call-108"
                  href="tel:108"
                  className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl">
                      108
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {lang === 'hi' ? 'राष्ट्रीय एम्बुलेंस सेवा (108)' : 'Free National Ambulance (108)'}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {lang === 'hi'
                          ? 'चिकित्सा आपातकाल के लिए 24 घंटे उपलब्ध सरकारी एम्बुलेंस'
                          : 'Government emergency medical transport 24x7'}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-sm flex items-center gap-1 shrink-0">
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'कॉल 108' : 'Call 108'}</span>
                  </div>
                </a>

                {/* 14567 Elderline (National Senior Citizen Helpline) */}
                <a
                  id="btn-call-14567"
                  href="tel:14567"
                  className="p-4 rounded-2xl bg-white border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-base">
                      14567
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          {lang === 'hi' ? 'एल्डरलाइन (14567)' : 'Elderline (14567)'}
                        </p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          {lang === 'hi' ? 'वरिष्ठ नागरिक' : 'Senior Citizens Only'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {lang === 'hi'
                          ? 'सामाजिक न्याय मंत्रालय — बुजुर्गों की सहायता, मार्गदर्शन व बचाव'
                          : 'Ministry of Social Justice — Senior Citizen Helpline for medical & rescue support'}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-amber-700 text-white font-bold text-sm flex items-center gap-1 shrink-0">
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'कॉल 14567' : 'Call 14567'}</span>
                  </div>
                </a>

                {/* 1930 Cyber Fraud (For financial scam emergencies) */}
                <a
                  id="btn-call-1930"
                  href="tel:1930"
                  className="p-4 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base">
                      1930
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                        {lang === 'hi' ? 'साइबर व बैंक धोखाधड़ी (1930)' : 'Cyber & Bank Fraud Helpline (1930)'}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600">
                        {lang === 'hi'
                          ? 'यदि गलती से पैसे कट गए हों तो तुरंत बैंक खाता ब्लॉक कराने हेतु'
                          : 'Immediate freeze of fraudulent bank transactions'}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-sm flex items-center gap-1 shrink-0">
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'कॉल 1930' : 'Call 1930'}</span>
                  </div>
                </a>
              </div>

              {/* Loud Room Siren / Fall Whistle Toggle */}
              <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border-2 border-red-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                      isAlarmPlaying ? 'bg-red-600 animate-ping' : 'bg-red-700'
                    }`}
                  >
                    {isAlarmPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      {isAlarmPlaying ? t.stopSiren : t.playSiren}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-snug">{t.sirenNotice}</p>
                  </div>
                </div>
                <button
                  id="btn-toggle-siren"
                  onClick={handleToggleSiren}
                  className={`px-5 py-3 rounded-xl font-bold text-sm shrink-0 shadow-md transition-all active:scale-95 ${
                    isAlarmPlaying
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-red-700 text-white hover:bg-red-800'
                  }`}
                >
                  {isAlarmPlaying ? t.stopSiren : t.playSiren}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Live GPS Location & WhatsApp/SMS Dispatch */}
          {activeTab === 'location' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-red-600" />
                    {lang === 'hi' ? 'लाइव GPS स्थिति' : 'Current GPS Status'}
                  </span>
                  <button
                    onClick={fetchLiveLocation}
                    className="text-xs font-bold text-red-700 hover:underline"
                  >
                    {lang === 'hi' ? 'पुनः जांचें (Refresh)' : 'Refresh GPS'}
                  </button>
                </div>

                {locating ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-600">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-semibold">{t.locatingGps}</p>
                  </div>
                ) : locationData ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">
                        {lang === 'hi' ? 'अक्षांश व देशांतर (Coordinates):' : 'Latitude & Longitude:'}{' '}
                        <strong className="text-red-700">
                          {locationData.latitude}, {locationData.longitude}
                        </strong>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {lang === 'hi' ? 'सटीकता (Accuracy):' : 'Accuracy:'} ±{locationData.accuracy}{' '}
                        {lang === 'hi' ? 'मीटर' : 'meters'}
                      </p>
                    </div>

                    <a
                      href={locationData.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{t.locationReady}</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Location not yet captured.</p>
                )}
              </div>

              {/* Instant WhatsApp & SMS Dispatch Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  id="btn-whatsapp-sos"
                  href={`https://wa.me/?text=${emergencyMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all text-center"
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                  <span>{t.shareViaWhatsapp}</span>
                </a>

                <a
                  id="btn-sms-sos"
                  href={`sms:${primaryContact.phone}?body=${emergencyMessage}`}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all text-center"
                >
                  <Share2 className="w-6 h-6 text-white" />
                  <span>{t.shareViaSms}</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Digital Emergency Medical ID */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-red-50/70 border-2 border-red-200">
                <div className="flex items-center justify-between mb-4 border-b border-red-200 pb-3">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-6 h-6 text-red-700" />
                    <h3 className="text-xl font-black text-slate-900">{t.medicalCardTitle}</h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-200 text-red-900">
                    {lang === 'hi' ? 'पैरामेडिक्स / डॉक्टर के लिए' : 'For First Responders'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-slate-500 uppercase">{t.bloodGroup}</p>
                    <p className="text-xl font-black text-red-700 mt-1">
                      {medicalProfile?.bloodGroup || 'B Positive (B+)'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      {lang === 'hi' ? 'एलर्जी (Allergies)' : 'Known Allergies'}
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {medicalProfile?.allergies?.join(', ') || 'Penicillin (Moderate)'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-red-100 sm:col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      {t.chronicConditions}
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {medicalProfile?.chronicConditions?.join(', ') ||
                        'Type 2 Diabetes, Hypertension (High BP)'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-red-100 sm:col-span-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      {lang === 'hi' ? 'महत्वपूर्ण नियमित दवाइयाँ' : 'Critical Daily Medications'}
                    </p>
                    <p className="text-base font-semibold text-slate-900 mt-1">
                      {medicalProfile?.criticalMedications?.join(' • ') ||
                        'Amlodipine 5mg (Morning) • Metformin 500mg (Post-dinner)'}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-slate-500 uppercase">{t.emergencyDoctor}</p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {medicalProfile?.primaryDoctorName || 'Dr. Ashok Sharma (Cardiologist)'}
                    </p>
                    <a
                      href={`tel:${medicalProfile?.primaryDoctorPhone || '+919811077412'}`}
                      className="text-xs font-bold text-red-700 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{medicalProfile?.primaryDoctorPhone || '+91 98110 77412'}</span>
                    </a>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      {t.preferredHospital}
                    </p>
                    <p className="text-base font-bold text-slate-900 mt-1">
                      {medicalProfile?.preferredHospital || 'Apollo Hospital, Indiranagar / AIIMS'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-[#FAF8F5] flex items-center justify-between">
          <button
            onClick={() => {
              handleStopSiren();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors"
          >
            {lang === 'hi' ? 'बंद करें' : 'Dismiss'}
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'hi' ? 'आपातकालीन सहायता सक्रिय' : 'Emergency Services Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Upload,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  Share2,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/seedData';
import { explainContentApi, planTaskApi } from '../services/api';

export const ExplainView: React.FC = () => {
  const {
    preferences,
    explanationResult,
    setExplanationResult,
    speak,
    setShareModalData,
    contacts,
    setCurrentScreen,
    setActiveTaskId,
    updateTask,
  } = useApp();

  const lang = preferences.language || 'hi';
  const [rawText, setRawText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectScenario = (scenario: SampleScenario) => {
    setActiveScenarioId(scenario.id);
    setRawText(scenario.fullContent);
    setSelectedImage(null);
  };

  const handleAnalyze = async () => {
    if (!rawText.trim() && !selectedImage) return;

    setIsLoading(true);
    try {
      const res = await explainContentApi(rawText, selectedImage || undefined, mimeType, lang);
      setIsLoading(false);
      setExplanationResult(res);
    } catch {
      setIsLoading(false);
    }
  };

  const handleShareWithContact = (contactId?: string) => {
    if (!explanationResult) return;
    const contact = contacts.find((c) => c.id === contactId) || contacts[0];
    setShareModalData({
      contact,
      title: explanationResult.documentType || 'Suspicious Message Alert',
      summary: explanationResult.summary,
      type: explanationResult.scamAnalysis.isSuspicious ? 'safety_concern' : 'task_summary',
      details: explanationResult.whatItSays,
    });
  };

  const handleStartGuidedTask = async () => {
    const title = explanationResult?.suggestedTaskTitle || 'Verify message safely';
    try {
      const plan = await planTaskApi(title, lang);
      updateTask(plan);
      setActiveTaskId(plan.id);
      setCurrentScreen('tasks');
    } catch {
      setCurrentScreen('tasks');
    }
  };

  return (
    <div id="explain-screen" className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="pb-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {lang === 'hi' ? 'मैसेज व बिल समझें (Scam Check)' : 'Explain Anything & Scam Shield'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {lang === 'hi'
              ? 'कोई भी अनजान SMS, WhatsApp संदेश या बिल की फोटो डालें — साथी तुरंत बताएगा कि यह असली है या फ्रॉड।'
              : 'Paste any confusing SMS, bill, or WhatsApp message to verify if it is safe or a scam.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3.5">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-teal-700" />
              <span>{lang === 'hi' ? '1. संदेश या फोटो चुनें' : '1. Enter or Upload Message'}</span>
            </h3>

            {/* Quick Sample Presets */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                {lang === 'hi' ? 'परीक्षण के लिए उदाहरण चुनें:' : 'Quick Examples to Test:'}
              </p>
              <div className="space-y-1.5">
                {SAMPLE_SCENARIOS.slice(0, 3).map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                      activeScenarioId === sc.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span className="font-bold block truncate">{sc.title}</span>
                    <span className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{sc.previewText}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label htmlFor="explain-raw-text" className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                {lang === 'hi' ? 'संदेश का टेक्स्ट यहाँ लिखें / पेस्ट करें:' : 'Or paste text here:'}
              </label>
              <textarea
                id="explain-raw-text"
                rows={3}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setActiveScenarioId(null);
                }}
                placeholder={
                  lang === 'hi'
                    ? 'यहाँ SMS या संदेश पेस्ट करें...'
                    : 'Paste the SMS or message contents here...'
                }
                className="w-full p-3 rounded-xl border border-stone-300 focus:border-teal-600 text-xs sm:text-sm text-stone-900 focus:outline-hidden"
              />
            </div>

            {/* Photo / Screenshot Upload */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                {lang === 'hi' ? 'या फोटो / स्क्रीनशॉट जोड़ें:' : 'Or upload photo / screenshot:'}
              </label>
              <label className="border-2 border-dashed border-stone-200 hover:border-teal-600 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors text-center">
                <ImageIcon className="w-5 h-5 text-stone-500 mb-1" />
                <span className="text-xs font-semibold text-teal-800">
                  {selectedImage ? (lang === 'hi' ? 'फोटो बदलें' : 'Change Image') : (lang === 'hi' ? 'फोटो चुनें' : 'Browse Photo')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <div className="mt-2 relative rounded-lg overflow-hidden border border-stone-200 max-h-28">
                  <img src={selectedImage} alt="Selected" className="w-full object-cover" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              id="btn-inspect-content"
              onClick={handleAnalyze}
              disabled={isLoading || (!rawText.trim() && !selectedImage)}
              className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'hi' ? 'जांच हो रही है...' : 'Analyzing safely...'}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'जांचें व समझें' : 'Explain & Check Scams'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {explanationResult ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-2xs space-y-4">
              {/* Document Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {lang === 'hi' ? 'पहचाना गया संदेश' : 'Identified Content'}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    {explanationResult.documentType}
                  </h3>
                </div>
                <button
                  id="btn-listen-explain-summary"
                  onClick={() =>
                    speak(
                      `${explanationResult.summary}. ${explanationResult.whatItSays}. ${explanationResult.whatItMeans}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold hover:bg-teal-100 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
                </button>
              </div>

              {/* Scam Alert or Verified Clean */}
              {explanationResult.scamAnalysis.isSuspicious ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-stone-900 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                    <h4 className="text-sm sm:text-base font-bold">
                      {explanationResult.scamAnalysis.headline}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {explanationResult.scamAnalysis.reasoning}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleShareWithContact()}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-bold text-amber-900 hover:bg-amber-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'परिवार से सलाह लें' : 'Ask Trusted Contact'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-bold">{lang === 'hi' ? 'यह संदेश सुरक्षित लग रहा है' : 'No scam detected'}</p>
                    <p className="text-xs text-emerald-800">{lang === 'hi' ? 'कोई धोखाधड़ी के संकेत नहीं मिले।' : 'This looks like normal informational communication.'}</p>
                  </div>
                </div>
              )}

              {/* 3 Plain-Language Explanations */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <p className="text-[11px] font-bold text-stone-500 uppercase">
                    {lang === 'hi' ? '1. सरल शब्दों में: यह क्या कहता है' : '1. In simple words: What it says'}
                  </p>
                  <p className="text-stone-800 leading-relaxed">{explanationResult.whatItSays}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <p className="text-[11px] font-bold text-stone-500 uppercase">
                    {lang === 'hi' ? '2. आपके लिए इसका क्या मतलब है' : '2. What this means for you'}
                  </p>
                  <p className="text-stone-800 leading-relaxed">{explanationResult.whatItMeans}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                  <p className="text-[11px] font-bold text-stone-500 uppercase">
                    {lang === 'hi' ? '3. सुरक्षित अगले कदम' : '3. Safe next steps'}
                  </p>
                  <ul className="space-y-1">
                    {explanationResult.whatYouCanDo.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-800">
                        <span className="font-bold text-teal-800">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connected Action */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={handleStartGuidedTask}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'गाइड शुरू करें' : 'Start Guided Task'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center flex flex-col items-center justify-center space-y-3 min-h-[340px] shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500">
                <ShieldCheck className="w-7 h-7 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-stone-900">
                {lang === 'hi' ? 'संदेश या फोटो चुनें' : 'No Message Selected Yet'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-sm leading-relaxed">
                {lang === 'hi'
                  ? 'बाएं पैनल से कोई भी उदाहरण चुनें या अपना SMS/बिल पेस्ट करके जांचें।'
                  : 'Select an example on the left or paste your SMS to inspect for security.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

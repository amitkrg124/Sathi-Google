import React, { useState } from 'react';
import {
  Upload,
  FileText,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Volume2,
  Share2,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  HelpCircle,
  PhoneCall,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_SCENARIOS, SampleScenario } from '../data/seedData';
import { explainContentApi, planTaskApi } from '../services/api';
import { ExplanationResult } from '../types';

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
    } catch (err) {
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
    <div id="explain-screen" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#DDE4EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              Explain Anything & Scam Shield
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
              Safety First
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#5D6B78] mt-0.5">
            Received an unfamiliar SMS, bank alert, bill, or WhatsApp link? Let Saathi inspect it safely.
          </p>
        </div>
      </div>

      {/* Upload Zone & Scenario Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input / Upload / Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#DDE4EA] shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#12304A] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2F6FED]" />
              <span>1. Choose or Paste Content</span>
            </h3>

            {/* Presets for Judges & Instant Evaluation */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-2">
                Quick Real-World Test Scenarios:
              </p>
              <div className="space-y-2">
                {SAMPLE_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      activeScenarioId === sc.id
                        ? 'border-[#2F6FED] bg-[#2F6FED]/5 shadow-xs'
                        : 'border-[#DDE4EA] bg-[#F7F9FC] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-[#12304A]">{sc.title}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${sc.badgeColor}`}>
                        {sc.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#5D6B78] line-clamp-2">{sc.previewText}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Textarea */}
            <div>
              <label htmlFor="explain-raw-text" className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                Or paste text / SMS here:
              </label>
              <textarea
                id="explain-raw-text"
                rows={4}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setActiveScenarioId(null);
                }}
                placeholder="Paste the SMS, message, email, or bill contents here..."
                className="w-full p-3 rounded-2xl border-2 border-[#DDE4EA] focus:border-[#2F6FED] text-sm text-[#12304A] focus:outline-hidden"
              />
            </div>

            {/* Image / Screenshot Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                Or upload a photo / screenshot:
              </label>
              <label className="border-2 border-dashed border-[#DDE4EA] hover:border-[#2F6FED] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-[#F7F9FC] hover:bg-white transition-all text-center">
                <ImageIcon className="w-8 h-8 text-[#5D6B78] mb-1" />
                <span className="text-xs font-bold text-[#2F6FED]">
                  {selectedImage ? 'Change Selected Image' : 'Browse Photo or Screenshot'}
                </span>
                <span className="text-[11px] text-[#5D6B78] mt-0.5">PNG, JPG, or screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-[#DDE4EA] max-h-36">
                  <img src={selectedImage} alt="Selected screenshot" className="w-full object-cover" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action */}
            <button
              id="btn-inspect-content"
              onClick={handleAnalyze}
              disabled={isLoading || (!rawText.trim() && !selectedImage)}
              className="w-full py-3.5 rounded-2xl bg-[#2F6FED] hover:bg-[#2358bf] disabled:opacity-50 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Reading & Analyzing for Safety...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  <span>Explain & Check for Scams</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Result & Scam Shield */}
        <div className="lg:col-span-7">
          {explanationResult ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE4EA] shadow-xs space-y-6">
              {/* Document Type Badge & Listen Aloud Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DDE4EA]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                    Identified Content
                  </span>
                  <h3 className="text-xl font-bold text-[#12304A]">
                    {explanationResult.documentType}
                  </h3>
                </div>
                <button
                  id="btn-listen-explain-summary"
                  onClick={() =>
                    speak(
                      `${explanationResult.summary}. ${explanationResult.whatItSays}. What it means: ${explanationResult.whatItMeans}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F6FED]/10 text-[#2F6FED] hover:bg-[#2F6FED]/20 text-xs sm:text-sm font-bold transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Read Aloud</span>
                </button>
              </div>

              {/* Scam Shield Warning Banner (Distinct & Calm) */}
              {explanationResult.scamAnalysis.isSuspicious ? (
                <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-[#12304A] space-y-3">
                  <div className="flex items-center gap-2.5 text-amber-900">
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                    <h4 className="text-lg font-bold">
                      {explanationResult.scamAnalysis.headline}
                    </h4>
                  </div>

                  <p className="text-sm font-medium text-amber-900">
                    {explanationResult.scamAnalysis.reasoning}
                  </p>

                  {/* Checkable Risk Indicators */}
                  {explanationResult.scamAnalysis.warningSigns.length > 0 && (
                    <div className="bg-white/80 p-3.5 rounded-2xl border border-amber-200 space-y-1.5">
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Specific Warning Signs Detected:
                      </p>
                      {explanationResult.scamAnalysis.warningSigns.map((sign, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-red-900">
                          <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span>{sign}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recommended Action */}
                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs sm:text-sm font-semibold text-amber-950">
                    <span className="font-bold text-amber-900">Recommended Action: </span>
                    {explanationResult.scamAnalysis.recommendedAction}
                  </div>

                  {/* Actions: Don't act yet / Ask someone I trust */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleShareWithContact()}
                      className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-xs sm:text-sm font-bold text-amber-900 hover:bg-amber-100 flex items-center gap-2 shadow-2xs"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Ask {contacts[0]?.name.split(' ')[0]} to Check This</span>
                    </button>
                    <button
                      onClick={() =>
                        speak(
                          `Safe advice: Do not click any links in this message. Real banks will never deactivate your card via an SMS link.`
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs sm:text-sm font-bold hover:bg-amber-700"
                    >
                      Hear Safety Advice
                    </button>
                  </div>
                </div>
              ) : (
                /* Verified Safe State */
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">No scam indicators detected.</p>
                      <p className="text-xs text-emerald-800">
                        This looks like standard informational communication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* The 3 Plain-Language Sections */}
              <div className="space-y-4">
                {/* 1. What it says */}
                <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                      1. In simple words: What it says
                    </span>
                    <button
                      onClick={() => speak(explanationResult.whatItSays)}
                      className="text-[#2F6FED] hover:underline text-xs flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>
                  </div>
                  <p className="text-base text-[#12304A] font-normal leading-relaxed">
                    {explanationResult.whatItSays}
                  </p>
                </div>

                {/* 2. What it means */}
                <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                      2. What this really means for you
                    </span>
                    <button
                      onClick={() => speak(explanationResult.whatItMeans)}
                      className="text-[#2F6FED] hover:underline text-xs flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>
                  </div>
                  <p className="text-base text-[#12304A] font-normal leading-relaxed">
                    {explanationResult.whatItMeans}
                  </p>
                </div>

                {/* 3. What you can do next */}
                <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                      3. Safe next steps:
                    </span>
                    <button
                      onClick={() =>
                        speak(explanationResult.whatYouCanDo.join('. '))
                      }
                      className="text-[#2F6FED] hover:underline text-xs flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Listen
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {explanationResult.whatYouCanDo.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#12304A]">
                        <span className="w-5 h-5 rounded-full bg-[#2F6FED]/10 text-[#2F6FED] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Connected Action: Turn into Guided Task or Share */}
              <div className="pt-2 border-t border-[#DDE4EA] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleShareWithContact()}
                  className="px-4 py-2.5 rounded-xl border border-[#DDE4EA] bg-white text-xs sm:text-sm font-bold text-[#12304A] hover:bg-slate-50 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-[#2F6FED]" />
                  <span>Share Summary with Trusted Contact</span>
                </button>

                <button
                  onClick={handleStartGuidedTask}
                  className="px-5 py-2.5 rounded-xl bg-[#278A57] hover:bg-[#207046] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start Guided Safe Action</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DDE4EA] text-center flex flex-col items-center justify-center space-y-4 shadow-xs min-h-[420px]">
              <div className="w-20 h-20 rounded-full bg-[#F7F9FC] border border-[#DDE4EA] flex items-center justify-center text-[#5D6B78]">
                <ShieldCheck className="w-10 h-10 text-[#2F6FED]" />
              </div>
              <h3 className="text-xl font-bold text-[#12304A]">
                No Message or Document Selected Yet
              </h3>
              <p className="text-sm sm:text-base text-[#5D6B78] max-w-md leading-relaxed">
                Choose one of the quick test scenarios on the left (like the Suspicious Bank SMS or Electricity Bill), or paste your own message to inspect it.
              </p>
              <button
                onClick={() => handleSelectScenario(SAMPLE_SCENARIOS[0])}
                className="px-5 py-2.5 rounded-xl bg-[#F7F9FC] hover:bg-[#2F6FED]/10 border border-[#DDE4EA] hover:border-[#2F6FED] text-sm font-bold text-[#2F6FED] transition-all"
              >
                Try "Urgent Bank Block Alert" Test Scenario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

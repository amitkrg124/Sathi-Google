import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Volume2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askSaathiApi, planTaskApi } from '../services/api';

export const AskSaathiView: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    preferences,
    speak,
    setCurrentScreen,
    setActiveTaskId,
    updateTask,
    clearChat,
  } = useApp();

  const lang = preferences.language || 'hi';
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputVal.trim();
    if (!query || isLoading) return;

    setInputVal('');
    addChatMessage({
      sender: 'user',
      text: query,
    });

    setIsLoading(true);

    try {
      const history = chatMessages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const res = await askSaathiApi(query, history, preferences.language);
      setIsLoading(false);

      addChatMessage({
        sender: 'saathi',
        text: res.replyText,
        simplifiedKeyTakeaway: res.simplifiedKeyTakeaway,
        followUpSuggestions: res.followUpSuggestions,
        suggestedWorkflow: res.suggestedWorkflow,
      });

      if (preferences.autoPlayVoice) {
        speak(res.replyText);
      }
    } catch {
      setIsLoading(false);
      addChatMessage({
        sender: 'saathi',
        text:
          lang === 'hi'
            ? 'मैं आपके साथ हूँ। कृपया दोबारा पूछें, मैं सरल शब्दों में समझाऊंगा।'
            : "I am right here with you. Let's take it one calm step at a time. What would you like to know?",
      });
    }
  };

  const handleStartWorkflow = async (workflowTitle: string) => {
    try {
      const plan = await planTaskApi(workflowTitle, lang);
      updateTask(plan);
      setActiveTaskId(plan.id);
      setCurrentScreen('tasks');
    } catch {
      setCurrentScreen('tasks');
    }
  };

  const sampleQuestions =
    lang === 'hi'
      ? [
          'बिजली का बिल सुरक्षित तरीके से कैसे भरें?',
          'OTP क्या होता है और इसे क्यों नहीं बांटना चाहिए?',
          'WhatsApp पर अनजान कॉल से कैसे बचें?',
          'सीनियर सिटीजन रेल टिकट कैसे बुक करें?',
        ]
      : [
          'How do I pay my electricity bill safely?',
          'What is an OTP and why shouldn’t I share it?',
          'How to tell if a WhatsApp call or message is fake?',
          'How to book a senior citizen train ticket?',
        ];

  return (
    <div id="ask-saathi-screen" className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            {lang === 'hi' ? 'साथी से पूछें' : 'Ask Saathi'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            {lang === 'hi'
              ? 'आवाज या लिखकर कोई भी शंका पूछें, शांत व सरल भाषा में जवाब पाएं।'
              : 'Patient, plain-language answers for your digital and everyday questions.'}
          </p>
        </div>
        <button
          onClick={clearChat}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 cursor-pointer"
          title="Clear Conversation"
        >
          {lang === 'hi' ? 'नई बातचीत' : 'Clear Chat'}
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden min-h-0">
        {/* Messages Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 flex flex-col overflow-hidden shadow-2xs">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {msg.sender === 'user' ? preferences.userName : 'Saathi AI'}
                  </span>
                  <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-stone-50 text-stone-900 border border-stone-200 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* Key Takeaway Box */}
                  {msg.simplifiedKeyTakeaway && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs">
                      <span className="font-bold text-teal-800">
                        {lang === 'hi' ? 'मुख्य बात: ' : 'Bottom line: '}
                      </span>
                      <span className="text-teal-950 font-medium">{msg.simplifiedKeyTakeaway}</span>
                    </div>
                  )}

                  {/* Audio Listen */}
                  {msg.sender === 'saathi' && (
                    <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center gap-2 text-xs font-semibold">
                      <button
                        onClick={() => speak(msg.text)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-teal-800 hover:bg-stone-50 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'सुनें' : 'Listen'}</span>
                      </button>
                    </div>
                  )}

                  {/* Suggested Task Workflow */}
                  {msg.suggestedWorkflow && (
                    <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-bold text-emerald-800 uppercase">
                          {lang === 'hi' ? 'मार्गदर्शन उपलब्ध है' : 'Step-by-step Guide'}
                        </p>
                        <p className="text-xs font-bold text-stone-900">
                          "{msg.suggestedWorkflow}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleStartWorkflow(msg.suggestedWorkflow!)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>{lang === 'hi' ? 'गाइड करें' : 'Guide Me'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow-up suggestions */}
                {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                    {msg.followUpSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sug)}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 cursor-pointer transition-colors"
                      >
                        "{sug}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 max-w-xs text-xs font-medium text-stone-700">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping" />
                <span>
                  {lang === 'hi' ? 'साथी विचार कर रहा है...' : 'Saathi is thinking...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <div className="p-3 border-t border-stone-200 bg-stone-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="ask-saathi-text-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'यहाँ अपना सवाल लिखें, जैसे "बिजली का बिल कैसे भरें?"'
                    : 'Ask anything, e.g. "How do I pay my electricity bill?"'
                }
                className="flex-1 bg-white border border-stone-300 focus:border-teal-600 rounded-xl px-4 py-2.5 text-sm sm:text-base text-stone-900 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <span>{lang === 'hi' ? 'भेजें' : 'Send'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Common Questions & Safety Tip */}
        <div className="hidden lg:flex flex-col space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
            <h4 className="text-sm font-bold text-stone-900 mb-2.5 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <span>{lang === 'hi' ? 'सुझाए गए प्रश्न' : 'Questions to Try'}</span>
            </h4>
            <div className="space-y-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-stone-50 hover:bg-teal-50 border border-stone-200 hover:border-teal-200 text-xs font-medium text-stone-800 transition-colors cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-stone-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'hi' ? 'सुरक्षा नियम' : 'Safety Tip'}</span>
            </div>
            <p className="leading-relaxed">
              {lang === 'hi'
                ? 'कभी भी किसी अनजान व्यक्ति को अपना 4 या 6 अंकों का UPI PIN या OTP न बताएं।'
                : 'Never share your 4 or 6-digit UPI PIN, password, or OTP with anyone.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Send,
  Volume2,
  Square,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askSaathiApi, planTaskApi } from '../services/api';

export const AskSaathiView: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    preferences,
    speak,
    stopSpeaking,
    isSpeaking,
    setCurrentScreen,
    setActiveTaskId,
    updateTask,
    clearChat,
  } = useApp();

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
    } catch (err) {
      setIsLoading(false);
      addChatMessage({
        sender: 'saathi',
        text: "I am right here with you. Let's take it one calm step at a time. What would you like to know?",
      });
    }
  };

  const handleStartWorkflow = async (workflowTitle: string) => {
    try {
      const plan = await planTaskApi(workflowTitle);
      updateTask(plan);
      setActiveTaskId(plan.id);
      setCurrentScreen('tasks');
    } catch {
      setCurrentScreen('tasks');
    }
  };

  const handleSimplifyMore = (text: string) => {
    handleSend(`Please explain this even more simply, in 2 short bullet points: "${text}"`);
  };

  const handleTellMeMore = (text: string) => {
    handleSend(`Tell me more details step-by-step about: "${text}"`);
  };

  return (
    <div id="ask-saathi-screen" className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Top Title & Safety Guarantee */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EA] mb-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
            Ask Saathi
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6B78]">
            Patient, plain-language answers for all your digital and everyday questions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#DDE4EA] bg-white text-[#5D6B78] hover:text-[#12304A]"
            title="Start a fresh conversation"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Main Two-Column or Flexible Chat Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
        {/* Left 2 Cols: Message Stream */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#DDE4EA] flex flex-col overflow-hidden shadow-xs">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Avatar / Label */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                    {msg.sender === 'user' ? preferences.userName : 'Saathi AI'}
                  </span>
                  <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#12304A] text-white rounded-tr-none'
                      : 'bg-[#F7F9FC] text-[#12304A] border border-[#DDE4EA] rounded-tl-none'
                  }`}
                >
                  <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                    {msg.text}
                  </p>

                  {/* Key Takeaway Box for Saathi responses */}
                  {msg.simplifiedKeyTakeaway && (
                    <div className="mt-3 p-3 rounded-2xl bg-white border border-[#2F6FED]/20 text-xs sm:text-sm">
                      <span className="font-bold text-[#2F6FED]">Bottom line: </span>
                      <span className="font-semibold text-[#12304A]">{msg.simplifiedKeyTakeaway}</span>
                    </div>
                  )}

                  {/* Audio Listen & Quick Simplification Actions for Saathi */}
                  {msg.sender === 'saathi' && (
                    <div className="mt-3 pt-2.5 border-t border-[#DDE4EA]/60 flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <button
                        onClick={() => speak(msg.text)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDE4EA] text-[#2F6FED] hover:bg-slate-50 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen Aloud</span>
                      </button>
                      <button
                        onClick={() => handleSimplifyMore(msg.text)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDE4EA] text-[#5D6B78] hover:text-[#12304A] transition-colors"
                      >
                        <span>Simplify More</span>
                      </button>
                      <button
                        onClick={() => handleTellMeMore(msg.text)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DDE4EA] text-[#5D6B78] hover:text-[#12304A] transition-colors"
                      >
                        <span>Tell Me More</span>
                      </button>
                    </div>
                  )}

                  {/* Suggested Step-by-Step Task Workflow Link */}
                  {msg.suggestedWorkflow && (
                    <div className="mt-3 p-3.5 rounded-2xl bg-[#278A57]/10 border border-[#278A57]/30 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-[#278A57] uppercase tracking-wider">
                          Ready to do this?
                        </p>
                        <p className="text-sm font-bold text-[#12304A]">
                          "{msg.suggestedWorkflow}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleStartWorkflow(msg.suggestedWorkflow!)}
                        className="px-3 py-1.5 rounded-xl bg-[#278A57] text-white text-xs font-bold hover:bg-[#217047] flex items-center gap-1"
                      >
                        <span>Guide Me</span>
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
                        className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[#2F6FED]/30 text-[#2F6FED] hover:bg-[#2F6FED]/10 transition-colors"
                      >
                        "{sug}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] max-w-sm">
                <span className="w-3 h-3 rounded-full bg-[#2F6FED] animate-ping" />
                <span className="text-sm font-semibold text-[#12304A]">
                  Saathi is thinking in simple words...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <div className="p-3 sm:p-4 border-t border-[#DDE4EA] bg-[#F7F9FC]">
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
                placeholder="Ask anything, e.g. 'How do I pay my electricity bill?'"
                className="flex-1 bg-white border-2 border-[#DDE4EA] focus:border-[#2F6FED] rounded-2xl px-4 py-3 text-base sm:text-lg text-[#12304A] focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isLoading || !inputVal.trim()}
                className="px-5 py-3 rounded-2xl bg-[#2F6FED] hover:bg-[#255bc4] disabled:opacity-50 text-white font-bold text-base flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-[#5D6B78]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#278A57]" />
                Saathi is AI-powered. Always verify money or medicine details before acting.
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Suggested Topics & Safety Guidance */}
        <div className="hidden lg:flex flex-col space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#DDE4EA] shadow-xs">
            <h4 className="text-base font-bold text-[#12304A] mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#2F6FED]" />
              <span>Common Questions to Try</span>
            </h4>
            <div className="space-y-2">
              {[
                'How do I pay my electricity bill safely?',
                'What is an OTP and should I share it?',
                'How do I make text larger on my phone?',
                'How to tell if a WhatsApp call is fake?',
                'How to book a senior train ticket?',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-3 rounded-xl bg-[#F7F9FC] hover:bg-[#2F6FED]/10 border border-[#DDE4EA] hover:border-[#2F6FED]/30 text-xs sm:text-sm font-semibold text-[#12304A] transition-all"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#278A57]/10 rounded-3xl p-5 border border-[#278A57]/30">
            <h4 className="text-base font-bold text-[#278A57] mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Saathi Golden Rule</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#12304A] leading-relaxed">
              Never share your 4 or 6-digit bank PIN, password, or OTP with anyone on the phone or in a message. Real banks will never ask for them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

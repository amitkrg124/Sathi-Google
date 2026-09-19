import React from 'react';
import {
  Volume2,
  Calendar,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Heart,
  FileCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyBriefView: React.FC = () => {
  const {
    preferences,
    reminders,
    toggleReminder,
    tasks,
    getActiveTask,
    setActiveTaskId,
    setCurrentScreen,
    speak,
  } = useApp();

  const activeTask = getActiveTask();
  const todayReminders = reminders.filter((r) => r.date === 'Today');
  const upcomingReminders = reminders.filter((r) => r.date !== 'Today');

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const handleListenBrief = () => {
    const reminderSummary =
      todayReminders.length > 0
        ? `You have ${todayReminders.length} items scheduled for today. First, ${todayReminders[0].title} at ${todayReminders[0].time}.`
        : 'You have no scheduled reminders for today.';

    const taskSummary =
      activeTask && activeTask.status === 'in_progress'
        ? `You also have an active task: ${activeTask.title}.`
        : 'All your digital tasks are up to date.';

    const fullText = `Good day ${preferences.userName}. Today is ${formattedDate}. ${reminderSummary} ${taskSummary} Remember to drink a glass of water and stay calm. Saathi is always right here with you.`;
    speak(fullText);
  };

  return (
    <div id="daily-brief-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Morning Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#DDE4EA] shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#159A9C]/10 text-[#159A9C] text-xs font-bold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              Daily Briefing for {preferences.userName}
            </h2>
            <p className="text-sm sm:text-base text-[#5D6B78] mt-1">
              Here is your calm summary for today. Take everything at your own comfortable pace.
            </p>
          </div>

          <button
            id="btn-listen-daily-brief"
            onClick={handleListenBrief}
            className="px-6 py-3.5 rounded-2xl bg-[#159A9C] hover:bg-[#117c7e] text-white font-bold text-base flex items-center gap-2 shadow-md transition-all"
          >
            <Volume2 className="w-5 h-5 animate-pulse" />
            <span>Listen to Brief Aloud</span>
          </button>
        </div>
      </div>

      {/* 3 Core Sections: Today, Active Task, Remember */}
      <div className="space-y-5">
        {/* Section 1: Today's Priorities */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DDE4EA] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-[#12304A] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2F6FED]" />
              <span>1. Today's Schedule & Medicines</span>
            </h3>
            <span className="text-xs font-bold text-[#5D6B78]">
              {todayReminders.filter((r) => r.completed).length}/{todayReminders.length} Completed
            </span>
          </div>

          {todayReminders.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#F7F9FC] text-center text-[#5D6B78] text-sm font-medium">
              Nothing urgent today. You have a relaxed morning!
            </div>
          ) : (
            <div className="space-y-3">
              {todayReminders.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleReminder(item.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    item.completed
                      ? 'bg-[#F7F9FC] border-[#DDE4EA] opacity-60'
                      : 'bg-white border-[#DDE4EA] hover:border-[#2F6FED]/40 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? 'bg-[#278A57] border-[#278A57] text-white'
                          : 'border-[#5D6B78] bg-white'
                      }`}
                    >
                      {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <p
                        className={`text-base font-bold ${
                          item.completed ? 'line-through text-[#5D6B78]' : 'text-[#12304A]'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-[#5D6B78] flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Scheduled: {item.time}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F7F9FC] text-[#5D6B78] border border-[#DDE4EA]">
                    {item.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Active Task */}
        {activeTask && activeTask.status === 'in_progress' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DDE4EA] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-[#12304A] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#278A57]" />
                <span>2. Unfinished Digital Task</span>
              </h3>
              <span className="text-xs font-bold text-[#278A57] bg-[#278A57]/10 px-3 py-1 rounded-full">
                Step {activeTask.currentStepIndex + 1} of {activeTask.steps.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#278A57]/5 border border-[#278A57]/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-base font-bold text-[#12304A]">{activeTask.title}</p>
                <p className="text-xs text-[#5D6B78] mt-0.5">
                  Current Step: {activeTask.steps[activeTask.currentStepIndex]?.title}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTaskId(activeTask.id);
                  setCurrentScreen('tasks');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#278A57] hover:bg-[#207248] text-white font-bold text-sm flex items-center gap-2 shadow-xs"
              >
                <span>Continue Task</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Friendly Advice & Health Check */}
        <div className="bg-[#159A9C]/10 rounded-3xl p-6 sm:p-7 border border-[#159A9C]/30 flex items-start gap-4">
          <Heart className="w-8 h-8 text-[#159A9C] shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#12304A]">
              Daily Wellness & Peace of Mind
            </h4>
            <p className="text-sm text-[#12304A] leading-relaxed">
              Take your time with any messages or calls you receive today. If anyone rushes you for bank details or asks you to click a link, tap <strong>Explain Something</strong> or ask your trusted contact. You never have to rush.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

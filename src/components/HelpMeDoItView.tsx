import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  HelpCircle,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Bell,
  Share2,
  Sparkles,
  Zap,
  Train,
  MessageSquare,
  Pill,
  Check,
  Clock,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRESET_TASK_TEMPLATES } from '../data/seedData';
import { planTaskApi } from '../services/api';
import { TaskPlan } from '../types';

export const HelpMeDoItView: React.FC = () => {
  const {
    tasks,
    activeTaskId,
    setActiveTaskId,
    getActiveTask,
    updateTask,
    completeTaskStep,
    previousTaskStep,
    markTaskComplete,
    addReminder,
    setShareModalData,
    contacts,
    speak,
    stopSpeaking,
    setCurrentScreen,
  } = useApp();

  const [customGoal, setCustomGoal] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [showConfirmationGate, setShowConfirmationGate] = useState(false);

  const currentTask = getActiveTask();
  const currentStep = currentTask?.steps[currentTask?.currentStepIndex || 0];

  const handleCreateCustomTask = async (goal: string) => {
    if (!goal.trim() || isPlanning) return;
    setIsPlanning(true);
    try {
      const plan = await planTaskApi(goal.trim());
      updateTask(plan);
      setActiveTaskId(plan.id);
      setIsPlanning(false);
      setCustomGoal('');
      speak(`I have planned ${plan.title} in ${plan.steps.length} safe steps. Let's start with step 1.`);
    } catch {
      setIsPlanning(false);
    }
  };

  const handleStepAdvance = () => {
    if (!currentTask || !currentStep) return;

    // If step is sensitive and confirmation hasn't been shown yet, trigger confirmation gate
    if (currentStep.isSensitive && !showConfirmationGate) {
      setShowConfirmationGate(true);
      return;
    }

    setShowConfirmationGate(false);
    setShowTroubleshooting(false);

    if (currentTask.currentStepIndex + 1 >= currentTask.steps.length) {
      markTaskComplete(currentTask.id);
      speak(`Congratulations! You have completed ${currentTask.title}. Everything is done safely.`);
    } else {
      completeTaskStep(currentTask.id);
      const nextStep = currentTask.steps[currentTask.currentStepIndex + 1];
      speak(`Step ${nextStep.stepNumber}: ${nextStep.title}. ${nextStep.instruction}`);
    }
  };

  const handleExplainAgain = () => {
    if (!currentStep) return;
    speak(`${currentStep.title}. ${currentStep.instruction}. ${currentStep.detailedExplanation}`);
  };

  const handleAddFollowUpReminder = () => {
    if (currentTask) {
      addReminder(
        currentTask.followUpReminderSuggestion || `Review ${currentTask.title}`,
        'Next Month',
        '10:00 AM',
        'bill',
        currentTask.id
      );
    }
  };

  const handleShareTaskSummary = () => {
    if (!currentTask) return;
    const contact = contacts[0];
    setShareModalData({
      contact,
      title: `Completed: ${currentTask.title}`,
      summary: `I completed "${currentTask.title}" using Saathi AI. All ${currentTask.steps.length} steps were verified.`,
      type: 'task_summary',
      details: currentTask.goal,
    });
  };

  return (
    <div id="help-me-do-it-screen" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#DDE4EA]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
              Help Me Do It — Task Coach
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#278A57]/10 text-[#278A57] border border-[#278A57]/30 text-xs font-bold">
              Signature Experience
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#5D6B78] mt-0.5">
            Break any everyday digital task into safe, calm steps with zero pressure.
          </p>
        </div>

        {/* Switch Tasks dropdown / button if multiple tasks */}
        {tasks.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5D6B78] font-bold">Your Tasks:</span>
            <select
              value={activeTaskId || ''}
              onChange={(e) => setActiveTaskId(e.target.value)}
              className="bg-white border border-[#DDE4EA] rounded-xl px-3 py-1.5 text-xs font-bold text-[#12304A]"
            >
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.status === 'completed' ? 'Done' : `Step ${t.currentStepIndex + 1}`})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* If task is completed */}
      {currentTask && currentTask.status === 'completed' ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#278A57]/40 shadow-md text-center max-w-2xl mx-auto space-y-6">
          <div className="w-24 h-24 rounded-full bg-[#278A57]/10 text-[#278A57] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-14 h-14" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#278A57]">
              Task Finished
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#12304A] mt-1">
              You're done. Great job!
            </h3>
            <p className="text-base sm:text-lg text-[#5D6B78] mt-2">
              You successfully completed <strong>"{currentTask.title}"</strong>. All {currentTask.steps.length} steps were carried out safely.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] text-left text-sm text-[#12304A] space-y-1">
            <p className="font-bold text-xs uppercase tracking-wider text-[#5D6B78]">
              Summary of Completion:
            </p>
            <p className="font-medium text-[#12304A]">{currentTask.goal}</p>
            <p className="text-xs text-[#278A57] font-semibold flex items-center gap-1 pt-1">
              <ShieldCheck className="w-4 h-4" />
              Verified with no suspicious actions.
            </p>
          </div>

          {/* Follow-up Actions: Add Reminder / Share */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {currentTask.followUpReminderSuggestion && (
              <button
                id="btn-task-set-reminder"
                onClick={handleAddFollowUpReminder}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#2F6FED] hover:bg-[#255bc4] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <Bell className="w-4 h-4" />
                <span>Set Follow-up Reminder</span>
              </button>
            )}

            <button
              onClick={handleShareTaskSummary}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-[#DDE4EA] bg-white hover:bg-[#F7F9FC] text-[#12304A] font-bold text-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-[#2F6FED]" />
              <span>Share with {contacts[0]?.name.split(' ')[0]}</span>
            </button>

            <button
              onClick={() => {
                // Reset this task so user can practice again if desired
                updateTask({ ...currentTask, currentStepIndex: 0, status: 'in_progress' });
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-[#DDE4EA] bg-white text-[#5D6B78] hover:text-[#12304A] font-semibold text-xs"
            >
              Practice Again
            </button>
          </div>
        </div>
      ) : currentTask && currentStep ? (
        /* Active Single Step-by-Step Experience */
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="bg-white rounded-3xl p-6 border border-[#DDE4EA] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#278A57]">
                  Active Goal
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#12304A]">
                  {currentTask.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-[#278A57] bg-[#278A57]/10 px-3 py-1 rounded-full">
                  Step {currentTask.currentStepIndex + 1} of {currentTask.steps.length}
                </span>
                <p className="text-[11px] text-[#5D6B78] mt-1">{currentTask.estimatedTime}</p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {currentTask.steps.map((st, idx) => (
                <div
                  key={st.stepNumber}
                  className={`h-2.5 rounded-full transition-all ${
                    idx < currentTask.currentStepIndex
                      ? 'bg-[#278A57]'
                      : idx === currentTask.currentStepIndex
                      ? 'bg-[#2F6FED] ring-2 ring-[#2F6FED]/30'
                      : 'bg-[#DDE4EA]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Focus on Exactly ONE Step at a Time */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#DDE4EA] shadow-lg relative overflow-hidden">
            {/* Step Number & Title */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-2xl bg-[#12304A] text-white flex items-center justify-center font-bold text-xl shrink-0">
                {currentStep.stepNumber}
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                  Step {currentStep.stepNumber} Action
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-[#12304A]">
                  {currentStep.title}
                </h4>
              </div>
            </div>

            {/* Instruction Card */}
            <div className="p-6 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] mb-6">
              <p className="text-lg sm:text-xl text-[#12304A] leading-relaxed font-medium">
                {currentStep.instruction}
              </p>

              <div className="mt-4 pt-3 border-t border-[#DDE4EA] flex flex-wrap items-center justify-between gap-2">
                <button
                  id="btn-step-explain-again"
                  onClick={handleExplainAgain}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#2F6FED] hover:underline"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Explain Aloud</span>
                </button>

                <p className="text-xs text-[#5D6B78]">
                  {currentStep.detailedExplanation}
                </p>
              </div>
            </div>

            {/* Sensitive Action Confirmation Gate (if applicable) */}
            {currentStep.isSensitive && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950">
                <div className="flex items-center gap-2 mb-1 text-amber-900 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>Important Confirmation Gate</span>
                </div>
                <p className="text-sm font-medium">
                  {currentStep.confirmationPrompt ||
                    'Please verify names and amounts before taking this step.'}
                </p>
              </div>
            )}

            {/* Troubleshooting Drawer if "I'm stuck" is clicked */}
            {showTroubleshooting && currentStep.troubleshootingTips && (
              <div className="mb-6 p-5 rounded-2xl bg-[#2F6FED]/10 border border-[#2F6FED]/30 text-[#12304A] space-y-2">
                <h5 className="font-bold text-sm text-[#2F6FED] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>Troubleshooting Help:</span>
                </h5>
                <ul className="space-y-1.5 text-sm">
                  {currentStep.troubleshootingTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#2F6FED] font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Large Primary Navigation Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#DDE4EA]">
              <div className="flex items-center gap-3">
                {currentTask.currentStepIndex > 0 && (
                  <button
                    id="btn-step-back"
                    onClick={() => previousTaskStep(currentTask.id)}
                    className="px-5 py-3 rounded-2xl border-2 border-[#DDE4EA] bg-white text-[#12304A] hover:bg-[#F7F9FC] font-bold text-base flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                )}

                <button
                  id="btn-step-im-stuck"
                  onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                  className="px-4 py-3 rounded-2xl border border-[#DDE4EA] bg-white text-[#5D6B78] hover:text-[#12304A] font-semibold text-sm flex items-center gap-1.5"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>I'm Stuck</span>
                </button>
              </div>

              {/* Primary Next Action (Min 54px high) */}
              <button
                id="btn-step-advance"
                onClick={handleStepAdvance}
                className="px-8 py-3.5 rounded-2xl bg-[#278A57] hover:bg-[#207248] text-white font-bold text-lg shadow-md flex items-center gap-3 transform active:scale-95 transition-all"
              >
                <span>{currentStep.actionLabel || "I've Done This"}</span>
                <Check className="w-6 h-6 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Preset Tasks Gallery & Custom Task Planner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE4EA] shadow-xs space-y-5">
        <div>
          <h3 className="text-xl font-bold text-[#12304A]">
            Choose a Goal or Ask Saathi to Plan One
          </h3>
          <p className="text-sm text-[#5D6B78]">
            Pick a common task below or type any digital errand you want help with.
          </p>
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateCustomTask(customGoal);
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-custom-task"
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            placeholder="Type any task, e.g. 'Order medicines online' or 'Check railway PNR'..."
            className="flex-1 bg-[#F7F9FC] border-2 border-[#DDE4EA] focus:border-[#2F6FED] rounded-2xl px-4 py-3 text-sm sm:text-base text-[#12304A] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={isPlanning || !customGoal.trim()}
            className="px-6 py-3 rounded-2xl bg-[#2F6FED] hover:bg-[#2358bf] disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-xs"
          >
            {isPlanning ? (
              <span>Planning...</span>
            ) : (
              <>
                <span>Create Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Preset Task Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {PRESET_TASK_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleCreateCustomTask(tmpl.title)}
              className="text-left p-4 rounded-2xl bg-[#F7F9FC] hover:bg-white border border-[#DDE4EA] hover:border-[#278A57] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#278A57]/10 text-[#278A57] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#12304A] group-hover:text-[#278A57] transition-colors">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-[#5D6B78] mt-1 line-clamp-2">
                  {tmpl.subtitle}
                </p>
              </div>
              <div className="mt-4 pt-2 border-t border-[#DDE4EA]/60 flex items-center justify-between text-xs font-bold text-[#278A57]">
                <span>{tmpl.time}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

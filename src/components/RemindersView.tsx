import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Check,
  Trash2,
  Calendar,
  Clock,
  Mic,
  Volume2,
  Heart,
  Zap,
  Users,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reminder } from '../types';

export const RemindersView: React.FC = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder, speak, setCurrentScreen } = useApp();

  const [naturalText, setNaturalText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Today');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newCategory, setNewCategory] = useState<Reminder['category']>('task');

  const todayList = reminders.filter((r) => r.date === 'Today');
  const upcomingList = reminders.filter((r) => r.date !== 'Today');

  const handleNaturalAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalText.trim()) return;

    let category: Reminder['category'] = 'task';
    const lower = naturalText.toLowerCase();
    if (lower.includes('medicine') || lower.includes('doctor') || lower.includes('bp') || lower.includes('pill')) {
      category = 'health';
    } else if (lower.includes('bill') || lower.includes('pay') || lower.includes('electricity')) {
      category = 'bill';
    } else if (lower.includes('call') || lower.includes('daughter') || lower.includes('son') || lower.includes('family')) {
      category = 'family';
    }

    addReminder(naturalText.trim(), 'Today', '11:00 AM', category);
    setNaturalText('');
    speak(`Reminder added: ${naturalText.trim()}`);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReminder(newTitle.trim(), newDate, newTime, newCategory);
    setNewTitle('');
    setShowAddForm(false);
    speak(`Reminder added: ${newTitle.trim()} for ${newDate} at ${newTime}`);
  };

  const getCategoryIcon = (category: Reminder['category']) => {
    switch (category) {
      case 'health':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'bill':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'family':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckSquare className="w-4 h-4 text-[#278A57]" />;
    }
  };

  return (
    <div id="reminders-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#DDE4EA]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
            Smart Reminders
          </h2>
          <p className="text-sm sm:text-base text-[#5D6B78] mt-0.5">
            Never miss medicines, appointments, bill dates, or calls to family.
          </p>
        </div>

        <button
          id="btn-toggle-add-reminder"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#255bc4] text-white font-bold text-sm flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'New Reminder'}</span>
        </button>
      </div>

      {/* Natural Language Quick Input */}
      <div className="bg-white rounded-3xl p-5 border border-[#DDE4EA] shadow-xs">
        <form onSubmit={handleNaturalAdd} className="flex items-center gap-2">
          <input
            id="input-natural-reminder"
            type="text"
            value={naturalText}
            onChange={(e) => setNaturalText(e.target.value)}
            placeholder="Type in plain words: e.g. 'Take afternoon vitamin D at 2 PM' or 'Call son at 6 PM'..."
            className="flex-1 bg-[#F7F9FC] border-2 border-[#DDE4EA] focus:border-[#2F6FED] rounded-2xl px-4 py-3 text-sm sm:text-base text-[#12304A] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!naturalText.trim()}
            className="px-6 py-3 rounded-2xl bg-[#12304A] hover:bg-[#2F6FED] disabled:opacity-40 text-white font-bold text-sm shadow-xs transition-colors"
          >
            Add
          </button>
        </form>
      </div>

      {/* Manual Detailed Form (Expandable) */}
      {showAddForm && (
        <form
          onSubmit={handleCustomAdd}
          className="bg-white rounded-3xl p-6 border-2 border-[#2F6FED]/30 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="text-lg font-bold text-[#12304A]">Create Detailed Reminder</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                Reminder Title:
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Doctor routine checkup"
                className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                Date:
              </label>
              <select
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="Next Week">Next Week</option>
                <option value="Every Month">Every Month</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                Time:
              </label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
              >
                <option value="08:00 AM">Morning (08:00 AM)</option>
                <option value="10:00 AM">Mid-Morning (10:00 AM)</option>
                <option value="01:00 PM">Afternoon (01:00 PM)</option>
                <option value="05:30 PM">Evening (05:30 PM)</option>
                <option value="09:00 PM">Night (09:00 PM)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                Category:
              </label>
              <div className="flex gap-3">
                {(['health', 'bill', 'family', 'task'] as Reminder['category'][]).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                      newCategory === cat
                        ? 'bg-[#2F6FED] text-white border-[#2F6FED]'
                        : 'bg-[#F7F9FC] text-[#5D6B78] border-[#DDE4EA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl border border-[#DDE4EA] text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#2F6FED] text-white text-sm font-bold shadow-xs"
            >
              Save Reminder
            </button>
          </div>
        </form>
      )}

      {/* Section 1: Today's Reminders */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DDE4EA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#12304A] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2F6FED]" />
            <span>Today's Reminders</span>
          </h3>
          <span className="text-xs font-bold text-[#5D6B78]">
            {todayList.filter((r) => r.completed).length}/{todayList.length} Done
          </span>
        </div>

        <div className="space-y-3">
          {todayList.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                rem.completed
                  ? 'bg-[#F7F9FC] border-[#DDE4EA] opacity-60'
                  : 'bg-white border-[#DDE4EA] hover:border-[#2F6FED]/50 shadow-2xs'
              }`}
            >
              <div
                onClick={() => toggleReminder(rem.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shrink-0 ${
                    rem.completed
                      ? 'bg-[#278A57] border-[#278A57] text-white'
                      : 'border-[#5D6B78] bg-white'
                  }`}
                >
                  {rem.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-base font-bold truncate ${
                        rem.completed ? 'line-through text-[#5D6B78]' : 'text-[#12304A]'
                      }`}
                    >
                      {rem.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5D6B78] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {rem.time}
                    </span>
                    {rem.recurring && rem.recurring !== 'none' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold">
                        Repeats {rem.recurring}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F7F9FC] border border-[#DDE4EA] text-[#5D6B78]">
                  {getCategoryIcon(rem.category)}
                  <span className="capitalize hidden sm:inline">{rem.category}</span>
                </span>
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Upcoming & Recurring Reminders */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DDE4EA] shadow-xs space-y-4">
        <h3 className="text-xl font-bold text-[#12304A] flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#159A9C]" />
          <span>Upcoming & Recurring</span>
        </h3>

        <div className="space-y-3">
          {upcomingList.map((rem) => (
            <div
              key={rem.id}
              className="p-4 rounded-2xl border border-[#DDE4EA] bg-white flex items-center justify-between gap-3 shadow-2xs"
            >
              <div
                onClick={() => toggleReminder(rem.id)}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div
                  className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors shrink-0 ${
                    rem.completed
                      ? 'bg-[#278A57] border-[#278A57] text-white'
                      : 'border-[#5D6B78] bg-white'
                  }`}
                >
                  {rem.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div>
                  <p
                    className={`text-base font-bold ${
                      rem.completed ? 'line-through text-[#5D6B78]' : 'text-[#12304A]'
                    }`}
                  >
                    {rem.title}
                  </p>
                  <p className="text-xs text-[#5D6B78] mt-0.5">
                    {rem.date} • {rem.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F7F9FC] border border-[#DDE4EA] text-[#5D6B78]">
                  {getCategoryIcon(rem.category)}
                  <span className="capitalize hidden sm:inline">{rem.category}</span>
                </span>
                <button
                  onClick={() => deleteReminder(rem.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

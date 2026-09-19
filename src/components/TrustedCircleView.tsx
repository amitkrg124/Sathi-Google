import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Share2,
  Lock,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TrustedContact } from '../types';

export const TrustedCircleView: React.FC = () => {
  const { contacts, addContact, setShareModalData, getActiveTask, explanationResult } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<TrustedContact['permissions']>('safety_alerts');

  const activeTask = getActiveTask();

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addContact({
      name: name.trim(),
      relationship,
      phone: phone.trim() || '+91 98000 00000',
      email: email.trim() || 'family@example.com',
      permissions,
    });

    setName('');
    setPhone('');
    setEmail('');
    setShowAddModal(false);
  };

  const handleShareSafetyConcern = (contact: TrustedContact) => {
    setShareModalData({
      contact,
      title: 'Suspicious Bank SMS Verification',
      summary: 'Saathi detected urgent language and an unknown link threatening account deactivation. Saathi recommends checking with family before clicking.',
      type: 'safety_concern',
      details: 'SMS from VM-SBIBNK-ALERT: Account blocked today. Click link to verify.',
    });
  };

  const handleShareTask = (contact: TrustedContact) => {
    setShareModalData({
      contact,
      title: activeTask ? `Task Update: ${activeTask.title}` : 'Digital Task Progress',
      summary: activeTask
        ? `Currently on Step ${activeTask.currentStepIndex + 1} of ${activeTask.steps.length}: ${activeTask.steps[activeTask.currentStepIndex]?.title}`
        : 'All digital errands and tasks are proceeding smoothly.',
      type: 'task_summary',
      details: activeTask ? activeTask.goal : '',
    });
  };

  return (
    <div id="trusted-circle-screen" className="max-w-4xl mx-auto space-y-6">
      {/* Header & Privacy Explanation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE4EA] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A]">
                Trusted Circle
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#278A57]/10 text-[#278A57] border border-[#278A57]/30 text-xs font-bold">
                Private & Controlled
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#5D6B78] mt-1 max-w-xl">
              Choose trusted family members or friends who can help when you want another human's opinion.
            </p>
          </div>

          <button
            id="btn-add-trusted-contact"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#2358bf] text-white font-bold text-sm flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trusted Person</span>
          </button>
        </div>

        {/* Privacy Rule Guarantee Banner */}
        <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#DDE4EA] flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#278A57] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#12304A] space-y-0.5">
            <p className="font-bold text-[#12304A]">
              Strict Privacy Principle: No automatic sharing.
            </p>
            <p className="text-[#5D6B78]">
              Saathi NEVER shares your conversations, bank details, or passwords automatically. You decide explicitly what to share, when, and with whom.
            </p>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#12304A]">
          Your Designated Contacts ({contacts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-[#DDE4EA] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2F6FED]/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F6FED]/10 text-[#2F6FED] font-bold text-lg flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#12304A] leading-snug">
                        {c.name}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F7F9FC] border border-[#DDE4EA] text-[#5D6B78]">
                        {c.relationship}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.permissions === 'safety_alerts'
                      ? 'Safety Alerts'
                      : c.permissions === 'full_sharing'
                      ? 'Full Support'
                      : 'Tasks Only'}
                  </span>
                </div>

                <div className="text-xs text-[#5D6B78] space-y-1 pt-2 border-t border-[#DDE4EA]/60">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Share Safety Alert / Share Task */}
              <div className="pt-3 border-t border-[#DDE4EA] flex flex-wrap gap-2">
                <button
                  onClick={() => handleShareSafetyConcern(c)}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Send Safety Alert</span>
                </button>

                <button
                  onClick={() => handleShareTask(c)}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#F7F9FC] hover:bg-[#2F6FED]/10 border border-[#DDE4EA] text-[#12304A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#2F6FED]" />
                  <span>Share Task</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-[#12304A]/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#DDE4EA] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE4EA]">
              <h3 className="text-xl font-bold text-[#12304A]">Add Trusted Person</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#5D6B78] hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Gupta"
                  className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                  Relationship:
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Doctor / Clinic">Doctor / Clinic</option>
                  <option value="Neighbor / Friend">Neighbor / Friend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98201 45890"
                  className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D6B78] mb-1">
                  Sharing Permissions:
                </label>
                <select
                  value={permissions}
                  onChange={(e) => setPermissions(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-[#DDE4EA] text-base"
                >
                  <option value="safety_alerts">Safety Concerns Only (Recommended)</option>
                  <option value="tasks_only">Completed Tasks Only</option>
                  <option value="full_sharing">Full Sharing (Safety + Tasks)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#DDE4EA] text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2F6FED] text-white font-bold text-sm shadow-xs"
                >
                  Add Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

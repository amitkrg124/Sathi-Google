import React, { useState } from 'react';
import { ShieldCheck, X, Check, Lock, AlertTriangle, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShareConfirmationModal: React.FC = () => {
  const { shareModalData, setShareModalData, showNotification } = useApp();
  const [isSending, setIsSending] = useState(false);

  if (!shareModalData) return null;

  const { contact, title, summary, type, details } = shareModalData;

  const handleConfirmShare = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShareModalData(null);
      showNotification(`Securely sent "${title}" to ${contact.name} (${contact.relationship}).`);
    }, 900);
  };

  return (
    <div
      id="share-confirmation-modal"
      className="fixed inset-0 z-50 bg-[#12304A]/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DDE4EA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DDE4EA] bg-[#F7F9FC] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#12304A]">
            <UserCheck className="w-5 h-5 text-[#2F6FED]" />
            <h3 id="share-modal-title" className="text-xl font-bold">
              Trusted Circle Confirmation
            </h3>
          </div>
          <button
            onClick={() => setShareModalData(null)}
            className="p-1.5 rounded-full hover:bg-slate-200 text-[#5D6B78]"
            aria-label="Cancel sharing"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details: Who, What, Why */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#2F6FED]/5 border border-[#2F6FED]/20 space-y-3">
            {/* WHO */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                1. Who will receive this:
              </p>
              <p className="text-base font-bold text-[#12304A] mt-0.5">
                {contact.name} <span className="font-normal text-[#5D6B78]">({contact.relationship})</span>
              </p>
              <p className="text-xs text-[#5D6B78]">{contact.phone} • {contact.email}</p>
            </div>

            <div className="h-px bg-[#DDE4EA]" />

            {/* WHAT */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                2. What they will receive:
              </p>
              <p className="text-sm font-semibold text-[#12304A] mt-0.5">
                "{title}"
              </p>
              <p className="text-xs text-[#5D6B78] mt-1 bg-white p-2.5 rounded-xl border border-[#DDE4EA]">
                {summary}
              </p>
            </div>

            <div className="h-px bg-[#DDE4EA]" />

            {/* WHY */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5D6B78]">
                3. Purpose:
              </p>
              <p className="text-xs font-medium text-[#12304A] mt-0.5">
                {type === 'safety_concern'
                  ? 'Asking your trusted family member to review a suspicious message before you take any action.'
                  : 'Keeping your family informed of completed digital task progress.'}
              </p>
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#278A57]/10 border border-[#278A57]/30 text-xs text-[#12304A]">
            <Lock className="w-4 h-4 text-[#278A57] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#278A57]">Privacy Protected</p>
              <p className="text-[#5D6B78]">
                Saathi never shares passwords, banking PINs, or raw chat history. You can revoke access at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Cancel / Confirm */}
        <div className="px-6 py-4 bg-[#F7F9FC] border-t border-[#DDE4EA] flex items-center justify-end gap-3">
          <button
            onClick={() => setShareModalData(null)}
            className="px-5 py-2.5 rounded-xl border border-[#DDE4EA] bg-white text-[#12304A] font-bold text-sm hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmShare}
            disabled={isSending}
            className="px-6 py-2.5 rounded-xl bg-[#2F6FED] hover:bg-[#255bc4] text-white font-bold text-sm shadow-md flex items-center gap-2"
          >
            {isSending ? (
              <span>Sending...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Share with {contact.name.split(' ')[0]}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

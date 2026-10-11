import React, { useState } from 'react';
import {
  MessageSquare,
  Save,
  CheckCircle2,
  ExternalLink,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useSiteSettings } from '../../../context/ThemeContext';

export const AdminWhatsAppModule: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+18005553888');
  const [defaultMessage, setDefaultMessage] = useState(
    settings.whatsappDefaultMessage ||
      'Hello Futurent Technology! I would like to inquire about starting a project with your agency.'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const testUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        whatsappNumber: whatsappNumber.trim(),
        whatsappDefaultMessage: defaultMessage.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving WhatsApp settings:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase">
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Integration Settings</span>
        </div>
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
          Direct Customer WhatsApp Channel
        </h3>
        <p className="text-xs text-[#A7B2C8]">
          Configure the business mobile telephone number used across all public service cards, hero CTAs, and footer channels. Changes persist to Firestore and update all buttons globally without source-code edits.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>WhatsApp settings saved to database! All buttons refreshed.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Business WhatsApp Number (With Country Code) *
          </label>
          <div className="relative">
            <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              placeholder="e.g. +18005553888 or +8801700000000"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>
          <span className="text-[11px] text-[#A7B2C8] mt-1 block">
            International format recommended (e.g. +1 800 555 3888). Digits are automatically sanitized for the WhatsApp API.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Default Inbound Inquiry Template
          </label>
          <textarea
            rows={3}
            value={defaultMessage}
            onChange={e => setDefaultMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
          />
          <span className="text-[11px] text-[#A7B2C8] mt-1 block">
            Note: On individual service cards, the specific service name is dynamically inserted for context.
          </span>
        </div>

        {/* Live URL Test Box */}
        <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-2">
          <span className="text-xs font-mono font-semibold text-slate-400 block uppercase">
            Generated API Endpoint:
          </span>
          <div className="font-mono text-xs text-cyan-300 break-all bg-[#101626] p-2.5 rounded-lg border border-[#263249]">
            {testUrl}
          </div>
          <div className="pt-2">
            <a
              href={testUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <span>Test Direct WhatsApp Link in New Window</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Persisting...' : 'Save WhatsApp Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

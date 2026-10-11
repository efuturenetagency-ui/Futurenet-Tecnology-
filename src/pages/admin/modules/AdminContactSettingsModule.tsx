import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Save, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../../../context/ThemeContext';

export const AdminContactSettingsModule: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || '');
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone || '');
  const [officeAddress, setOfficeAddress] = useState(settings.officeAddress || '');
  const [workingHours, setWorkingHours] = useState(settings.workingHours || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        supportEmail: supportEmail.trim(),
        supportPhone: supportPhone.trim(),
        officeAddress: officeAddress.trim(),
        workingHours: workingHours.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-1">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Agency Contact & Coordinates</h3>
        <p className="text-xs text-[#A7B2C8]">Official addresses, telephone hotlines, email routing, and operational schedules.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Contact details saved to Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Official Support Email *</label>
            <input
              type="email"
              required
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Direct Hotline / Phone *</label>
            <input
              type="text"
              required
              value={supportPhone}
              onChange={e => setSupportPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Physical Office Address *</label>
          <input
            type="text"
            required
            value={officeAddress}
            onChange={e => setOfficeAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Operational Working Hours</label>
          <input
            type="text"
            required
            value={workingHours}
            onChange={e => setWorkingHours(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold"
          >
            {isSaving ? 'Saving...' : 'Save Coordinates'}
          </button>
        </div>
      </form>
    </div>
  );
};

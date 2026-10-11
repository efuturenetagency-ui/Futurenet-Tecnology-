import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { useSiteSettings } from '../context/ThemeContext';
import { submitContactMessage } from '../lib/dataService';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const ContactPage: React.FC = () => {
  const { settings } = useSiteSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('Please specify the subject of your inquiry.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setErrorMsg('Please write a message with at least 10 characters.');
      return;
    }
    if (!privacyConsent) {
      setErrorMsg('You must agree to the privacy policy to submit.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
        privacyConsent,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setErrorMsg('Failed to send message. Please try again or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          DIRECT COMMUNICATIONS
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
          Contact Futurent Technology
        </h1>
        <p className="text-sm sm:text-base text-[#A7B2C8]">
          Have questions regarding project timelines, tech stacks, or corporate retainers? We respond rapidly across all channels.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
              Instant Messaging Channel
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              For rapid project coordination and direct discussions with our lead technical consultant:
            </p>
            <WhatsAppButton
              serviceName="General Technical Inquiry"
              variant="button"
              className="w-full"
              showExplanation={true}
            />
          </div>

          <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-5 text-xs text-[#A7B2C8]">
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white border-b border-[#263249] pb-3">
              Official Coordinates
            </h3>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px]">Email Inquiries</span>
                <a href={`mailto:${settings.supportEmail}`} className="text-white hover:text-cyan-300 font-medium">
                  {settings.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px]">Direct Line</span>
                <a href={`tel:${settings.supportPhone}`} className="text-white hover:text-cyan-300 font-medium">
                  {settings.supportPhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px]">Physical Headquarters</span>
                <span className="text-white">{settings.officeAddress}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px]">Operational Hours</span>
                <span className="text-white">{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-[#101626] border border-[#263249] p-6 sm:p-10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  Message Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-[#A7B2C8] max-w-md mx-auto">
                  Your inquiry has been stored in our communications database. Our team will review and reply within 1 business day.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl border border-[#263249] text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Send An Official Project Inquiry
                  </h3>
                  <p className="text-xs text-[#A7B2C8] mt-1">
                    All form submissions are securely recorded and routed to authorized project managers.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="elena@company.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Project *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="e.g. Enterprise ERP Scoping"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, project scope, questions, or timeline constraints..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={e => setPrivacyConsent(e.target.checked)}
                      className="mt-1 rounded border-[#263249] bg-[#080B14] text-blue-500 focus:ring-0"
                    />
                    <span className="text-xs text-[#A7B2C8]">
                      I agree to the privacy policy and authorize Futurent Technology to process my message.
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Protected Server Transmission</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

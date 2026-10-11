import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { useSiteSettings } from '../../context/ThemeContext';

interface WhatsAppButtonProps {
  serviceName?: string;
  customMessage?: string;
  variant?: 'button' | 'outline' | 'floating' | 'compact';
  className?: string;
  showExplanation?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  serviceName,
  customMessage,
  variant = 'button',
  className = '',
  showExplanation = false,
}) => {
  const { settings } = useSiteSettings();

  const cleanNumber = (settings.whatsappNumber || '+18005553888').replace(/[^0-9]/g, '');

  let messageText = settings.whatsappDefaultMessage;
  if (customMessage) {
    messageText = customMessage;
  } else if (serviceName) {
    messageText = `Hello Futurent Technology, I am interested in your "${serviceName}" service. Could you please share more details regarding pricing, process, and timeline for my project?`;
  }

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp consultation"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold rounded-full shadow-[0_0_25px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105 active:scale-95 group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="text-sm font-medium tracking-wide pr-1 hidden sm:inline">Chat on WhatsApp</span>
      </a>
    );
  }

  if (variant === 'outline') {
    return (
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 font-medium text-sm transition-all ${className}`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Message on WhatsApp</span>
        </a>
        {showExplanation && (
          <span className="text-[11px] text-slate-400 text-center">
            Direct chat inquiry (formal tracking occurs upon order confirmation)
          </span>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 text-xs font-medium transition-all ${className}`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] ${className}`}
      >
        <MessageSquare className="w-4 h-4 fill-white" />
        <span>Message on WhatsApp</span>
      </a>
      {showExplanation && (
        <span className="text-[11px] text-slate-400 text-center">
          Inquiries are direct conversations and do not automatically count as database orders.
        </span>
      )}
    </div>
  );
};

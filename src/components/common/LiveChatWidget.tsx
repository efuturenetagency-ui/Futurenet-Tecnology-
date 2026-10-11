import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, User, Clock, Check, Loader2 } from 'lucide-react';
import {
  createConversation,
  sendChatMessage,
  getConversationMessages,
} from '../../lib/dataService';
import { ChatMessage, ConversationItem } from '../../types';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeConv, setActiveConv] = useState<ConversationItem | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !inputText.trim()) return;

    setIsSending(true);
    try {
      // 1. Create live conversation thread in Firestore
      const newConv = await createConversation({
        channel: 'website_chat',
        customerName: name.trim(),
        customerEmail: email.trim() || undefined,
        status: 'open',
        isReadByAdmin: false,
        lastMessageText: inputText.trim(),
      });

      // 2. Add first message
      const firstMsg = await sendChatMessage(newConv.id, {
        conversationId: newConv.id,
        senderType: 'customer',
        senderName: name.trim(),
        senderEmail: email.trim() || undefined,
        text: inputText.trim(),
        channel: 'website_chat',
      });

      setActiveConv(newConv);
      setMessages([firstMsg]);
      setInputText('');
      setHasStarted(true);

      // Automated polite instant welcome response
      setTimeout(async () => {
        const welcomeMsg = await sendChatMessage(newConv.id, {
          conversationId: newConv.id,
          senderType: 'agent',
          senderName: 'Futurent Technical Desk',
          text: `Hello ${name}! Thank you for reaching out. A senior digital consultant has received your inquiry and will reply shortly.`,
          channel: 'website_chat',
        });
        setMessages(prev => [...prev, welcomeMsg]);
      }, 1000);
    } catch (e) {
      console.error('Chat error:', e);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !inputText.trim()) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      const msg = await sendChatMessage(activeConv.id, {
        conversationId: activeConv.id,
        senderType: 'customer',
        senderName: name || 'Visitor',
        senderEmail: email || undefined,
        text: textToSend,
        channel: 'website_chat',
      });
      setMessages(prev => [...prev, msg]);
    } catch (e) {
      console.error('Error sending message:', e);
    }
  };

  return (
    <>
      {/* Floating Trigger Button on Bottom-Right */}
      <div className="fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#101626] border border-cyan-500/40 hover:border-cyan-400 text-white shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <span className="text-xs font-semibold font-['Space_Grotesk'] hidden sm:inline">
            Live Chat
          </span>
        </button>
      </div>

      {/* Chat Pop-out Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[360px] sm:w-[400px] h-[520px] bg-[#101626] border border-[#263249] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#141C2E] border-b border-[#263249] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#22D3EE] p-[1px]">
                <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                  FT
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xs font-['Space_Grotesk'] text-white">
                  Futurent Live Support
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online • Avg response &lt; 5m
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#080B14] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Area */}
          {!hasStarted ? (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="p-4 rounded-2xl bg-[#080B14] border border-[#263249] space-y-2">
                <span className="text-xs font-bold text-white block">
                  Speak with a Solutions Consultant
                </span>
                <p className="text-[11px] text-[#A7B2C8] leading-relaxed">
                  Have a question about our engineering retainers, Facebook ad campaigns, or custom
                  technology solutions? We're right here.
                </p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Vance"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Email Address (For follow-up)
                  </label>
                  <input
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    How can we help you? *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about your project or inquiry..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Start Conversation
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080B14]/50">
                {messages.map((m, idx) => {
                  const isUser = m.senderType === 'customer';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none'
                            : 'bg-[#141C2E] border border-[#263249] text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-0.5 px-1">
                        {new Date(m.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Follow-up input form */}
              <form
                onSubmit={handleSendFollowUp}
                className="p-3 bg-[#101626] border-t border-[#263249] flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs cursor-pointer shadow-md shadow-cyan-500/10"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

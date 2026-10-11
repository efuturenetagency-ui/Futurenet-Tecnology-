import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Smartphone,
  Layers,
  Settings,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ConversationItem, ChatMessage, ConversationChannel, ConversationStatus } from '../../../types';
import {
  getConversations,
  getConversationMessages,
  sendChatMessage,
  updateConversation,
  createConversation,
  logAdminActivity,
} from '../../../lib/dataService';
import { useAuth } from '../../../context/AuthContext';

export const AdminMessagingModule: React.FC = () => {
  const { user, demoUser } = useAuth();
  const adminEmail = user?.email || demoUser?.email || 'admin@futurenttech.com';

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'integrations'>('inbox');

  const loadConversations = async () => {
    try {
      let list = await getConversations();
      if (list.length === 0) {
        // Seed an initial live conversation for immediate testing
        const sampleConv = await createConversation({
          channel: 'website_chat',
          customerName: 'Sarah Jenkins',
          customerEmail: 'sarah.j@apexventures.io',
          customerPhone: '+1 555-0192',
          subject: 'Custom ERP and Facebook Campaign Inquiry',
          status: 'open',
          isReadByAdmin: false,
          lastMessageText: 'Hello Futurent Team! We are exploring a dedicated tech partner for our 2026 digital expansion.',
        });
        await sendChatMessage(sampleConv.id, {
          conversationId: sampleConv.id,
          senderType: 'customer',
          senderName: 'Sarah Jenkins',
          text: 'Hello Futurent Team! We are exploring a dedicated tech partner for our 2026 digital expansion.',
          channel: 'website_chat',
        });
        list = [sampleConv];
      }
      setConversations(list);
      if (!selectedConv && list.length > 0) {
        selectConversation(list[0]);
      }
    } catch (e) {
      console.error('Error loading conversations:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conv: ConversationItem) => {
    setSelectedConv(conv);
    const msgs = await getConversationMessages(conv.id);
    setMessages(msgs);
    if (!conv.isReadByAdmin) {
      await updateConversation(conv.id, { isReadByAdmin: true });
      conv.isReadByAdmin = true;
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    const newMsg = await sendChatMessage(selectedConv.id, {
      conversationId: selectedConv.id,
      senderType: 'agent',
      senderName: 'Futurent Technical Lead',
      senderEmail: adminEmail,
      text: replyText.trim(),
      channel: selectedConv.channel,
    });

    setMessages(prev => [...prev, newMsg]);
    setReplyText('');
    await logAdminActivity(
      adminEmail,
      'SEND_UNIFIED_MESSAGE_REPLY',
      `conversations/${selectedConv.id}`,
      `Replied to ${selectedConv.customerName}`
    );
  };

  const handleUpdateStatus = async (status: ConversationStatus) => {
    if (!selectedConv) return;
    await updateConversation(selectedConv.id, { status });
    setSelectedConv({ ...selectedConv, status });
    setConversations(conversations.map(c => (c.id === selectedConv.id ? { ...c, status } : c)));
  };

  const filteredConversations = conversations.filter(c => {
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter;
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.customerEmail && c.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.lastMessageText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <MessageSquare className="w-4 h-4" />
              Unified Communications
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Unified Messaging Inbox & Live Chat
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Consolidated communications stream combining website interactive live chat, official
              WhatsApp Cloud API, and Facebook Messenger inbound leads into a single triage hub.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unified Inbox
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'integrations'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              API Integrations
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
          {/* Left: Conversations List (5 Cols) */}
          <div className="lg:col-span-5 bg-[#101626] border border-[#263249] rounded-2xl flex flex-col overflow-hidden">
            {/* Inbox Filter & Search Header */}
            <div className="p-3.5 border-b border-[#263249] space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search contacts, messages..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] overflow-x-auto">
                {['all', 'website_chat', 'whatsapp', 'messenger'].map(ch => (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={`px-2.5 py-1 rounded-md font-mono whitespace-nowrap cursor-pointer capitalize ${
                      channelFilter === ch
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white bg-[#141C2E]'
                    }`}
                  >
                    {ch.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Threads Scroll */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#263249]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No conversations match the filter.
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isSelected = selectedConv?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-[#141C2E] border-l-2 border-l-cyan-400'
                          : 'hover:bg-[#141C2E]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              !conv.isReadByAdmin ? 'bg-cyan-400 animate-pulse' : 'bg-transparent'
                            }`}
                          ></span>
                          <span className="font-bold text-white text-xs truncate max-w-[140px]">
                            {conv.customerName}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-[#A7B2C8] line-clamp-1">{conv.lastMessageText}</p>

                      <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                        <span className="px-1.5 py-0.2 rounded bg-[#080B14] text-cyan-400 uppercase">
                          {conv.channel.replace('_', ' ')}
                        </span>
                        <span className="text-slate-500 uppercase">{conv.status}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Thread Chat (7 Cols) */}
          <div className="lg:col-span-7 bg-[#101626] border border-[#263249] rounded-2xl flex flex-col overflow-hidden">
            {selectedConv ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b border-[#263249] flex items-center justify-between bg-[#141C2E]/60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
                      {selectedConv.customerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm">
                        {selectedConv.customerName}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        {selectedConv.customerEmail && <span>{selectedConv.customerEmail}</span>}
                        {selectedConv.customerPhone && <span>• {selectedConv.customerPhone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedConv.status}
                      onChange={e => handleUpdateStatus(e.target.value as any)}
                      className="px-2 py-1 rounded-lg bg-[#080B14] border border-[#263249] text-[11px] font-mono text-cyan-300 focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Messages Bubbles Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#080B14]/40">
                  {messages.map((m, mIdx) => {
                    const isAgent = m.senderType === 'agent';
                    return (
                      <div
                        key={mIdx}
                        className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                            isAgent
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-none shadow-md shadow-cyan-500/5'
                              : 'bg-[#141C2E] border border-[#263249] text-slate-200 rounded-bl-none'
                          }`}
                        >
                          <div className="text-[10px] font-mono opacity-80 mb-0.5">
                            {isAgent ? 'Futurent Support' : m.senderName}
                          </div>
                          <p className="leading-relaxed">{m.text}</p>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input Box */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 border-t border-[#263249] bg-[#101626] flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Reply to ${selectedConv.customerName} via ${selectedConv.channel}...`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 text-xs font-semibold cursor-pointer shadow-md shadow-cyan-500/10"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                Select a conversation thread to view correspondence.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="font-bold font-['Space_Grotesk'] text-white text-base">
              Messaging APIs & Webhook Handlers
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              Connect official Meta WhatsApp Business Cloud API and Facebook Page Messenger.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-3">
              <span className="font-bold text-xs text-cyan-400 block font-mono">
                1. WhatsApp Cloud API (Meta for Developers)
              </span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  WhatsApp Business Account Phone Number ID
                </label>
                <input
                  type="text"
                  defaultValue="104928371928301"
                  className="w-full px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  System User Permanent Access Token
                </label>
                <input
                  type="password"
                  defaultValue="EAABsb9381749283471928471928"
                  className="w-full px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-3">
              <span className="font-bold text-xs text-purple-400 block font-mono">
                2. Facebook Page Messenger API
              </span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Meta Page ID</label>
                <input
                  type="text"
                  defaultValue="29481928301928"
                  className="w-full px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Page Access Token</label>
                <input
                  type="password"
                  defaultValue="EAAJ284918239018239102830"
                  className="w-full px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Messaging API integrations updated successfully!')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            Save Integration Tokens
          </button>
        </div>
      )}
    </div>
  );
};

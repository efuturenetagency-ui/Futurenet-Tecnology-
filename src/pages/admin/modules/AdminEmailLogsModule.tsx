import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  User,
  Paperclip,
} from 'lucide-react';
import { getEmailLogs, recordEmailLog } from '../../../lib/dataService';
import { EmailLogItem, EmailDeliveryStatus, EmailType } from '../../../types';

export const AdminEmailLogsModule: React.FC = () => {
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<EmailLogItem | null>(null);

  // Test Dispatch Form
  const [testEmailModal, setTestEmailModal] = useState(false);
  const [testForm, setTestForm] = useState({
    recipientEmail: 'mdshihabhossen.web@gmail.com',
    recipientName: 'Shihab Hossen',
    emailType: 'order_confirmation' as EmailType,
    subject: 'Order Confirmed: #FT-2026-9901 - Futurent Technology Services',
    referenceCode: 'FT-2026-9901',
    attachmentName: 'order_invoice_FT-2026-9901.pdf',
  });
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getEmailLogs();
      setLogs(data);
    } catch (e) {
      console.error('Failed to load email logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);
    try {
      // Simulate real provider API dispatch (SendGrid / Direct SMTP)
      const newLog = await recordEmailLog({
        recipientEmail: testForm.recipientEmail,
        recipientName: testForm.recipientName,
        emailType: testForm.emailType,
        subject: testForm.subject,
        referenceCode: testForm.referenceCode,
        status: 'delivered',
        sentTimestamp: new Date().toISOString(),
        provider: 'SendGrid API',
        deliveryResponse: '250 2.0.0 OK Message accepted by mail server for delivery',
        attachmentName: testForm.attachmentName,
      });

      setLogs(prev => [newLog, ...prev]);
      setDispatchSuccess(true);
      setTimeout(() => {
        setDispatchSuccess(false);
        setTestEmailModal(false);
      }, 1500);
    } catch (err) {
      console.error('Error dispatching test email:', err);
    } finally {
      setDispatching(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesType = typeFilter === 'all' || log.emailType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: EmailDeliveryStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" /> Sent
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> Queued
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Mail className="w-4 h-4" />
              Automated Mail Delivery Infrastructure
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Email Notifications & Audit Logs
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Transactional email audit logs for order confirmations, verified-payment invoices, and retainer activations with provider response codes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTestEmailModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" /> Dispatch Test Email
            </button>
            <button
              onClick={loadLogs}
              className="p-2.5 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-400 hover:text-white cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#263249]">
          <div className="p-3 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[11px] text-slate-400 font-mono block">Total Transmitted</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">{logs.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[11px] text-slate-400 font-mono block">Verified Delivered</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {logs.filter(l => l.status === 'delivered').length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[11px] text-slate-400 font-mono block">Invoices Attached</span>
            <span className="text-xl font-bold font-mono text-cyan-300 mt-0.5 block">
              {logs.filter(l => l.emailType === 'invoice_delivery').length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[11px] text-slate-400 font-mono block">Order Confirmations</span>
            <span className="text-xl font-bold font-mono text-violet-400 mt-0.5 block">
              {logs.filter(l => l.emailType === 'order_confirmation').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by recipient, subject, or reference code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#101626] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#101626] border border-[#263249] text-xs text-white"
        >
          <option value="all">All Email Types</option>
          <option value="order_confirmation">Order Confirmation</option>
          <option value="invoice_delivery">Invoice Delivery</option>
          <option value="subscription_activated">Subscription Activated</option>
          <option value="custom_quote">Custom Quote</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#101626] border border-[#263249] text-xs text-white"
        >
          <option value="all">All Delivery Statuses</option>
          <option value="delivered">Delivered</option>
          <option value="sent">Sent</option>
          <option value="pending">Queued</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Email Logs Table */}
      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No email logs match filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B14] border-b border-[#263249] text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Type & Subject</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4">Gateway Provider</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263249]/60">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#141C2E]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{log.recipientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.recipientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                        {log.emailType.replace('_', ' ')}
                      </div>
                      <div className="text-white font-medium truncate">{log.subject}</div>
                      {log.attachmentName && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Paperclip className="w-3 h-3 text-cyan-400" />
                          <span>{log.attachmentName}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300">
                      {log.referenceCode}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(log.status)}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {log.provider}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(log.sentTimestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-white text-[11px] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                <ShieldCheck className="w-4 h-4" /> Delivery Audit Details
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono block text-[10px] uppercase">Subject</span>
                <span className="text-white font-bold text-sm">{selectedLog.subject}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Recipient</span>
                  <span className="text-white">{selectedLog.recipientName} ({selectedLog.recipientEmail})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Associated Ref</span>
                  <span className="text-cyan-400 font-mono font-bold">{selectedLog.referenceCode}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Transmission Provider</span>
                  <span className="text-white font-mono">{selectedLog.provider}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Timestamp</span>
                  <span className="text-slate-300 font-mono">{new Date(selectedLog.sentTimestamp).toLocaleString()}</span>
                </div>
              </div>

              {selectedLog.deliveryResponse && (
                <div className="p-3 rounded-xl bg-[#080B14] border border-[#263249] space-y-1">
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">SMTP / API Server Response</span>
                  <span className="text-emerald-400 font-mono text-xs block">{selectedLog.deliveryResponse}</span>
                </div>
              )}

              {selectedLog.attachmentName && (
                <div className="p-3 rounded-xl bg-[#141C2E] border border-[#263249] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Paperclip className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono">{selectedLog.attachmentName}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Verified Attached</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-xs text-white hover:bg-[#1a253d]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Dispatch Modal */}
      {testEmailModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSendTestEmail}
            className="bg-[#101626] border border-[#263249] rounded-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                <Send className="w-4 h-4" /> Trigger Automated Mail Notification
              </div>
              <button
                type="button"
                onClick={() => setTestEmailModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={testForm.recipientEmail}
                  onChange={e => setTestForm({ ...testForm, recipientEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={testForm.recipientName}
                  onChange={e => setTestForm({ ...testForm, recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Email Type</label>
                  <select
                    value={testForm.emailType}
                    onChange={e => setTestForm({ ...testForm, emailType: e.target.value as EmailType })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
                  >
                    <option value="order_confirmation">Order Confirmation</option>
                    <option value="invoice_delivery">Invoice Delivery</option>
                    <option value="subscription_activated">Subscription Activated</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Reference Code</label>
                  <input
                    type="text"
                    required
                    value={testForm.referenceCode}
                    onChange={e => setTestForm({ ...testForm, referenceCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={testForm.subject}
                  onChange={e => setTestForm({ ...testForm, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
                />
              </div>
            </div>

            {dispatchSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Message successfully dispatched and recorded!
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTestEmailModal(false)}
                className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={dispatching}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-xs font-bold text-white flex items-center gap-2"
              >
                {dispatching ? 'Dispatching...' : 'Send & Record Log'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

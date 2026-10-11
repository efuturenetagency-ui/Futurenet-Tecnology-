import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  RotateCcw,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  X,
  CreditCard,
} from 'lucide-react';
import { TransactionItem, TransactionStatus, TransactionType, PaymentGatewayId } from '../../../types';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  logAdminActivity,
} from '../../../lib/dataService';
import { useAuth } from '../../../context/AuthContext';

export const AdminTransactionsModule: React.FC = () => {
  const { user, demoUser, role } = useAuth();
  const adminEmail = user?.email || demoUser?.email || 'admin@futurenttech.com';

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');

  // Modal States
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<TransactionItem | null>(null);
  const [selectedTxnForRefund, setSelectedTxnForRefund] = useState<TransactionItem | null>(null);

  // Manual payment form
  const [manualForm, setManualForm] = useState({
    customerName: '',
    customerEmail: '',
    amount: '',
    currency: 'USD',
    paymentMethod: 'Bank Wire / Cheque Clearance',
    relatedOrderId: '',
    notes: '',
  });

  // Refund Form
  const [refundForm, setRefundForm] = useState({
    amount: '',
    reason: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getTransactions();
      setTransactions(list);
    } catch (e) {
      console.error('Failed to load transactions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.customerName || !manualForm.amount) return;

    try {
      const token = await user?.getIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/payments/manual-record', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: Number(manualForm.amount),
          currency: manualForm.currency,
          paymentMethod: manualForm.paymentMethod,
          customerName: manualForm.customerName,
          customerEmail: manualForm.customerEmail,
          relatedOrderId: manualForm.relatedOrderId || undefined,
          authorizedNotes: manualForm.notes,
          recordedByAdmin: adminEmail,
        }),
      });

      const data = await res.json();
      if (data.transaction) {
        await createTransaction(data.transaction);
        await logAdminActivity(
          adminEmail,
          'RECORD_MANUAL_TRANSACTION',
          `transactions/${data.transaction.transactionReference}`,
          `Recorded $${manualForm.amount} for ${manualForm.customerName}`
        );
      }

      setIsManualModalOpen(false);
      setManualForm({
        customerName: '',
        customerEmail: '',
        amount: '',
        currency: 'USD',
        paymentMethod: 'Bank Wire / Cheque Clearance',
        relatedOrderId: '',
        notes: '',
      });
      loadData();
    } catch (e) {
      console.error('Error creating manual payment:', e);
    }
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxnForRefund || !refundForm.amount) return;

    try {
      const token = await user?.getIdToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          transactionReference: selectedTxnForRefund.transactionReference,
          refundAmount: Number(refundForm.amount),
          reason: refundForm.reason,
          authorizedBy: adminEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await updateTransaction(selectedTxnForRefund.id, {
          status: 'refunded',
          refundReference: data.refundReference,
        });

        await logAdminActivity(
          adminEmail,
          'PROCESS_REFUND',
          `transactions/${selectedTxnForRefund.transactionReference}`,
          `Refunded $${refundForm.amount}: ${refundForm.reason}`
        );
      }

      setSelectedTxnForRefund(null);
      setRefundForm({ amount: '', reason: '' });
      loadData();
    } catch (e) {
      console.error('Refund processing error:', e);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.customerName && t.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.customerEmail && t.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.relatedOrderId && t.relatedOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesGateway = gatewayFilter === 'all' || t.paymentGateway === gatewayFilter;

    return matchesSearch && matchesStatus && matchesGateway;
  });

  const totalVolume = transactions
    .filter(t => t.status === 'successful')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" />
              Financial Ledger & Audit
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Transactions & Payment Reconciliation
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Immutable ledger of all client credit card, mobile wallet (bKash/Nagad), and manual
              wire transactions with receipt printing and refund handling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Record Manual Payment
            </button>
          </div>
        </div>

        {/* Quick summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#263249]">
          <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Settled Volume
            </span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              ${totalVolume.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">
              Total Transactions
            </span>
            <span className="text-lg font-bold font-mono text-white">
              {transactions.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Successful</span>
            <span className="text-lg font-bold font-mono text-cyan-300">
              {transactions.filter(t => t.status === 'successful').length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Refunded</span>
            <span className="text-lg font-bold font-mono text-rose-400">
              {transactions.filter(t => t.status === 'refunded').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101626] border border-[#263249] p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref, customer, email, order..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={gatewayFilter}
            onChange={e => setGatewayFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Gateways</option>
            <option value="sslcommerz">SSLCommerz</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="stripe">Stripe</option>
            <option value="manual_bank">Bank Wire</option>
            <option value="manual_authorized">Authorized Manual</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141C2E] border-b border-[#263249] text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Gateway & Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263249]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                    No transactions match the criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-[#141C2E]/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-cyan-300 block">
                        {txn.transactionReference}
                      </span>
                      {txn.relatedOrderId && (
                        <span className="text-slate-400 text-[10px] font-mono">
                          Order: {txn.relatedOrderId}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-white font-medium block">
                        {txn.customerName || 'Anonymous / Guest'}
                      </span>
                      <span className="text-slate-400 text-[11px] block">{txn.customerEmail}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#080B14] border border-[#263249] text-slate-300 font-mono text-[10px] uppercase">
                        {txn.paymentGateway}
                      </span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        {txn.paymentMethod || txn.transactionType}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono">
                      <span
                        className={`font-bold text-sm ${
                          txn.status === 'refunded' ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {txn.status === 'refunded' ? '-' : '+'}${txn.amount} {txn.currency}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                      {new Date(txn.createdTimestamp).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          txn.status === 'successful'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : txn.status === 'refunded'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : txn.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-700/30 text-slate-400'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTxnForReceipt(txn)}
                          title="View / Print Receipt"
                          className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {txn.status === 'successful' && (
                          <button
                            onClick={() => {
                              setSelectedTxnForRefund(txn);
                              setRefundForm({ amount: String(txn.amount), reason: '' });
                            }}
                            title="Process Refund"
                            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD MANUAL PAYMENT MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Record Authorized Manual Payment
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordManualPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={manualForm.customerName}
                  onChange={e => setManualForm({ ...manualForm, customerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={manualForm.customerEmail}
                  onChange={e => setManualForm({ ...manualForm, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Amount *</label>
                  <input
                    type="number"
                    required
                    value={manualForm.amount}
                    onChange={e => setManualForm({ ...manualForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
                  <select
                    value={manualForm.currency}
                    onChange={e => setManualForm({ ...manualForm, currency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="BDT">BDT</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={manualForm.paymentMethod}
                  onChange={e => setManualForm({ ...manualForm, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                >
                  <option value="Bank Wire / BFTN / EFT">Bank Wire / BFTN / EFT</option>
                  <option value="Physical Cheque Clearance">Physical Cheque Clearance</option>
                  <option value="bKash / Nagad Direct Agent">bKash / Nagad Direct Agent</option>
                  <option value="Authorized Cash Receipt">Authorized Cash Receipt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Related Order Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. FT-2026-9812"
                  value={manualForm.relatedOrderId}
                  onChange={e => setManualForm({ ...manualForm, relatedOrderId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Administrative Clearance Notes
                </label>
                <textarea
                  rows={2}
                  value={manualForm.notes}
                  onChange={e => setManualForm({ ...manualForm, notes: e.target.value })}
                  placeholder="Bank deposit slip # or receipt clearance details..."
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#263249] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROCESS REFUND MODAL */}
      {selectedTxnForRefund && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white text-rose-400">
                Authorize Transaction Refund
              </h3>
              <button
                onClick={() => setSelectedTxnForRefund(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefund} className="space-y-3">
              <p className="text-xs text-slate-300">
                Authorizing refund for transaction ref:{' '}
                <span className="font-mono text-cyan-300 font-bold">
                  {selectedTxnForRefund.transactionReference}
                </span>
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Refund Amount ({selectedTxnForRefund.currency}) *
                </label>
                <input
                  type="number"
                  required
                  max={selectedTxnForRefund.amount}
                  value={refundForm.amount}
                  onChange={e => setRefundForm({ ...refundForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Authorized Reason *
                </label>
                <textarea
                  rows={2}
                  required
                  value={refundForm.reason}
                  onChange={e => setRefundForm({ ...refundForm, reason: e.target.value })}
                  placeholder="e.g. Scope adjustment or project cancellation agreement"
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#263249] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTxnForRefund(null)}
                  className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-rose-500/10"
                >
                  Confirm Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE TRANSACTION RECEIPT MODAL */}
      {selectedTxnForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#263249] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                  FT
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Payment Receipt</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Futurent Technology</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setSelectedTxnForReceipt(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="bg-[#080B14] border border-[#263249] rounded-xl p-5 space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-[#263249] pb-3">
                <span className="text-slate-400">Transaction Ref:</span>
                <span className="text-cyan-300 font-bold">
                  {selectedTxnForReceipt.transactionReference}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time:</span>
                <span className="text-white">
                  {new Date(selectedTxnForReceipt.createdTimestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white">{selectedTxnForReceipt.customerName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Payment Gateway:</span>
                <span className="text-white uppercase">{selectedTxnForReceipt.paymentGateway}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 uppercase font-bold">
                  {selectedTxnForReceipt.status}
                </span>
              </div>

              <div className="pt-3 border-t border-[#263249] flex justify-between text-sm">
                <span className="font-bold text-white">Total Settled:</span>
                <span className="font-bold text-emerald-400">
                  ${selectedTxnForReceipt.amount} {selectedTxnForReceipt.currency}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-center text-slate-500 font-mono">
              Authenticated electronic transaction proof generated by Cloud Firestore.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

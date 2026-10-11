import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  User,
  DollarSign,
  FileText,
  X,
  Save,
  MessageSquare,
  ShieldAlert,
  Printer,
} from 'lucide-react';
import { OrderItem, OrderStatus } from '../../../types';
import { updateOrder } from '../../../lib/dataService';

const STATUS_OPTIONS: { id: OrderStatus; label: string; color: string }[] = [
  { id: 'new', label: 'New Order', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { id: 'under_review', label: 'Under Review', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'awaiting_client_info', label: 'Awaiting Info', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { id: 'quotation_sent', label: 'Quotation Sent', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'approved', label: 'Approved', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
];

interface OrdersModuleProps {
  orders: OrderItem[];
  onOrderUpdated: (updated: OrderItem) => void;
}

export const AdminOrdersModule: React.FC<OrdersModuleProps> = ({ orders, onOrderUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Edit fields within detail modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('new');
  const [editAssignedManager, setEditAssignedManager] = useState('');
  const [editInternalNotes, setEditInternalNotes] = useState('');
  const [editQuotationAmount, setEditQuotationAmount] = useState<string>('');
  const [editAgreedBudget, setEditAgreedBudget] = useState<string>('');
  const [editPaymentStatus, setEditPaymentStatus] = useState<string>('pending');
  const [isSaving, setIsSaving] = useState(false);

  const openOrderDetail = (order: OrderItem) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditAssignedManager(order.assignedManager || '');
    setEditInternalNotes(order.internalNotes || '');
    setEditQuotationAmount(order.quotationAmount ? String(order.quotationAmount) : '');
    setEditAgreedBudget(order.agreedBudget ? String(order.agreedBudget) : '');
    setEditPaymentStatus(order.paymentStatus || 'pending');
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      const updated = await updateOrder(selectedOrder.id, {
        status: editStatus,
        assignedManager: editAssignedManager.trim() || undefined,
        internalNotes: editInternalNotes.trim() || undefined,
        quotationAmount: editQuotationAmount ? Number(editQuotationAmount) : undefined,
        agreedBudget: editAgreedBudget ? Number(editAgreedBudget) : undefined,
        paymentStatus: editPaymentStatus as any,
      });
      setSelectedOrder(updated);
      onOrderUpdated(updated);
    } catch (e) {
      console.error('Failed to save order updates:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['OrderReference', 'ServiceName', 'FullName', 'Email', 'Phone', 'Status', 'Budget', 'CreatedAt'];
    const rows = orders.map(o => [
      o.orderReference,
      `"${o.serviceName}"`,
      `"${o.fullName}"`,
      o.email,
      o.phone,
      o.status,
      `"${o.budgetRange || ''}"`,
      o.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `futurent_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = o.orderReference.toLowerCase().includes(q);
      const matchName = o.fullName.toLowerCase().includes(q);
      const matchEmail = o.email.toLowerCase().includes(q);
      const matchSvc = o.serviceName.toLowerCase().includes(q);
      return matchRef || matchName || matchEmail || matchSvc;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#101626] border border-[#263249]">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by reference, client name, email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Budget Range</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263249]/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#A7B2C8]">
                    No orders matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const statusObj = STATUS_OPTIONS.find(s => s.id === order.status);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#141C2E]/60 transition-colors cursor-pointer"
                      onClick={() => openOrderDetail(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                        {order.orderReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{order.fullName}</div>
                        <div className="text-[11px] text-[#A7B2C8]">{order.email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-white">
                        <div>{order.serviceName}</div>
                        {order.packageName && (
                          <div className="text-[10px] text-violet-400 font-mono">
                            {order.packageName}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-mono">
                        {order.budgetRange || 'Standard'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                            statusObj?.color || 'bg-slate-500/20 text-slate-300'
                          }`}
                        >
                          {statusObj?.label || order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A7B2C8]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            openOrderDetail(order);
                          }}
                          className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Workflow Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 space-y-6 text-[#F8FAFC] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263249] pb-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Order Management Console
                </span>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  Reference: {selectedOrder.orderReference}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-cyan-500/30 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> Print A4 Slip
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#141C2E]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="printable-document-root p-6 sm:p-8 rounded-2xl bg-[#080B14] border border-[#263249] space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-3 border-b border-[#263249]/60">
                <div>
                  <span className="text-slate-400 block">Service:</span>
                  <strong className="text-white text-sm">{selectedOrder.serviceName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Client:</span>
                  <strong className="text-white text-sm">{selectedOrder.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Company:</span>
                  <strong className="text-white text-sm">{selectedOrder.businessName || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Email:</span>
                  <strong className="text-cyan-400">{selectedOrder.email}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone:</span>
                  <strong className="text-white">{selectedOrder.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">WhatsApp:</span>
                  <strong className="text-emerald-400">{selectedOrder.whatsappNumber || 'None'}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Client Specifications & Requirements:</span>
                <p className="p-3 rounded-lg bg-[#141C2E] text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedOrder.requirements}
                </p>
              </div>

              {selectedOrder.referenceUrls && (
                <div>
                  <span className="text-slate-400 block">Reference URLs:</span>
                  <a
                    href={selectedOrder.referenceUrls}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline break-all"
                  >
                    {selectedOrder.referenceUrls}
                  </a>
                </div>
              )}
            </div>

            {/* Admin Workflow Controls (Status, Notes, Quotation, Manager) */}
            <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                Administrative State Controls
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Workflow Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assigned Technical Manager
                  </label>
                  <input
                    type="text"
                    value={editAssignedManager}
                    onChange={e => setEditAssignedManager(e.target.value)}
                    placeholder="e.g. Lead Architect Vance"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quotation Amount ($)
                  </label>
                  <input
                    type="number"
                    value={editQuotationAmount}
                    onChange={e => setEditQuotationAmount(e.target.value)}
                    placeholder="e.g. 2400"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Agreed Budget ($)
                  </label>
                  <input
                    type="number"
                    value={editAgreedBudget}
                    onChange={e => setEditAgreedBudget(e.target.value)}
                    placeholder="e.g. 2200"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={e => setEditPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="partially_paid">Partially Paid (50% Deposit)</option>
                    <option value="paid">Fully Paid</option>
                    <option value="waived">Waived / Retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Private Internal Notes (Protected from public visitors)
                </label>
                <textarea
                  rows={3}
                  value={editInternalNotes}
                  onChange={e => setEditInternalNotes(e.target.value)}
                  placeholder="Record sprint milestones, quotation notes, client preferences, or internal assignments..."
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#A7B2C8]">
                Changes persist synchronously to Firestore.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveOrder}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

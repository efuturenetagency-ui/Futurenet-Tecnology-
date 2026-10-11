import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  X,
  Save,
  ArrowUpRight,
  Shield,
  Loader2,
} from 'lucide-react';
import { CustomRequestItem, OrderItem } from '../../../types';
import { updateCustomRequest, convertCustomRequestToOrder } from '../../../lib/dataService';

interface CustomRequestsModuleProps {
  customRequests: CustomRequestItem[];
  onRequestUpdated: (updated: CustomRequestItem) => void;
  onOrderCreatedFromRequest: (newOrder: OrderItem) => void;
}

export const AdminCustomRequestsModule: React.FC<CustomRequestsModuleProps> = ({
  customRequests,
  onRequestUpdated,
  onOrderCreatedFromRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReq, setSelectedReq] = useState<CustomRequestItem | null>(null);

  // Edit controls
  const [editStatus, setEditStatus] = useState<any>('pending');
  const [editManager, setEditManager] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openReq = (req: CustomRequestItem) => {
    setSelectedReq(req);
    setEditStatus(req.status);
    setEditManager(req.assignedManager || '');
    setEditNotes(req.internalNotes || '');
  };

  const handleSave = async () => {
    if (!selectedReq) return;
    setIsSaving(true);
    try {
      const updated = await updateCustomRequest(selectedReq.id, {
        status: editStatus,
        assignedManager: editManager.trim() || undefined,
        internalNotes: editNotes.trim() || undefined,
      });
      setSelectedReq(updated);
      onRequestUpdated(updated);
    } catch (e) {
      console.error('Error updating request:', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Convert custom request into a formal order with traceability!
  const handleConvert = async () => {
    if (!selectedReq) return;
    setIsConverting(true);
    try {
      const order = await convertCustomRequestToOrder(selectedReq.id, editManager || undefined);
      if (order) {
        onOrderCreatedFromRequest(order);
        const updatedReq: CustomRequestItem = {
          ...selectedReq,
          status: 'converted_to_order',
          convertedOrderId: order.id,
        };
        setSelectedReq(updatedReq);
        onRequestUpdated(updatedReq);
      }
    } catch (e) {
      console.error('Error converting request:', e);
    } finally {
      setIsConverting(false);
    }
  };

  const filtered = customRequests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.projectTitle.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.projectType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#101626] border border-[#263249]">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search custom requests..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Requests ({customRequests.length})</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="converted_to_order">Converted to Order</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Project Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Budget Range</th>
                <th className="py-3.5 px-4">Timeline</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263249]/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#A7B2C8]">
                    No custom requests submitted yet.
                  </td>
                </tr>
              ) : (
                filtered.map(req => (
                  <tr
                    key={req.id}
                    className="hover:bg-[#141C2E]/60 transition-colors cursor-pointer"
                    onClick={() => openReq(req)}
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{req.projectTitle}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{req.description}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                        {req.projectType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{req.fullName}</div>
                      <div className="text-[11px] text-[#A7B2C8]">{req.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-mono">
                      {req.budgetRange}
                    </td>
                    <td className="py-3.5 px-4 text-violet-300">
                      {req.expectedTimeline}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          req.status === 'converted_to_order'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : req.status === 'reviewed'
                            ? 'bg-blue-500/20 text-blue-300'
                            : req.status === 'declined'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          openReq(req);
                        }}
                        className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Conversion Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 space-y-6 text-[#F8FAFC] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#263249] pb-4">
              <div>
                <span className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                  Custom Request Review
                </span>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                  {selectedReq.projectTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#141C2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Request Details */}
            <div className="p-5 rounded-2xl bg-[#080B14] border border-[#263249] space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-[#263249]/60">
                <div>
                  <span className="text-slate-400 block">Domain:</span>
                  <strong className="text-cyan-400">{selectedReq.projectType}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Budget:</span>
                  <strong className="text-emerald-400 font-mono">{selectedReq.budgetRange}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Timeline:</span>
                  <strong className="text-violet-300">{selectedReq.expectedTimeline}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Submitted:</span>
                  <span className="text-white">{new Date(selectedReq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Specifications:</span>
                <p className="p-3 rounded-lg bg-[#141C2E] text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedReq.description}
                </p>
              </div>

              {selectedReq.features && selectedReq.features.length > 0 && (
                <div>
                  <span className="text-slate-400 block mb-1">Requested Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedReq.features.map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#263249]/60 text-slate-300 flex justify-between items-center">
                <span>Client: {selectedReq.fullName} ({selectedReq.email})</span>
                <span>Phone: {selectedReq.phone}</span>
              </div>
            </div>

            {/* Traceability: Converted Order ID if converted */}
            {selectedReq.convertedOrderId && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
                <span>
                  Converted to Formal Order with ID: <strong className="font-mono">{selectedReq.convertedOrderId}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 uppercase font-mono font-bold">
                  Order Trace Preserved
                </span>
              </div>
            )}

            {/* Management & Status Controls */}
            <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                Workflow Actions
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="converted_to_order">Converted to Order</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Assigned Manager
                  </label>
                  <input
                    type="text"
                    value={editManager}
                    onChange={e => setEditManager(e.target.value)}
                    placeholder="e.g. Lead Architect Vance"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Private Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Record architectural considerations or quote details..."
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              {/* CONVERT BUTTON: Required by Section 7 */}
              {selectedReq.status !== 'converted_to_order' ? (
                <button
                  type="button"
                  disabled={isConverting}
                  onClick={handleConvert}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Converting to Order...</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Convert to Formal Order</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Converted to Formal Order
                </span>
              )}

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 rounded-xl border border-[#263249] text-slate-300 text-xs font-medium"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

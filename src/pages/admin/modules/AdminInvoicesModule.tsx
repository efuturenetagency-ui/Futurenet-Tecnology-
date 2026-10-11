import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Printer,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  Share2,
  Settings,
  Search,
  Download,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { InvoiceItem, InvoiceLineItem, InvoiceSettings, InvoiceStatus } from '../../../types';
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceSettings,
  updateInvoiceSettings,
  logAdminActivity,
} from '../../../lib/dataService';
import { useAuth } from '../../../context/AuthContext';

export const AdminInvoicesModule: React.FC = () => {
  const { user, demoUser } = useAuth();
  const adminEmail = user?.email || demoUser?.email || 'admin@futurenttech.com';

  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'invoices' | 'settings'>('invoices');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

  // New Invoice Form
  const [newInvoiceForm, setNewInvoiceForm] = useState<{
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCompany: string;
    title: string;
    dueDate: string;
    currency: string;
    taxPercentage: number;
    items: Array<{ name: string; description: string; quantity: number; unitPrice: number }>;
    notes: string;
  }>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCompany: '',
    title: 'Technology Consultancy & Engineering Services',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    taxPercentage: 5,
    items: [{ name: 'Custom Web Application Development', description: 'Sprint 1 & 2', quantity: 1, unitPrice: 1200 }],
    notes: 'Payment due within 14 calendar days.',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [invs, sets] = await Promise.all([getInvoices(), getInvoiceSettings()]);
      setInvoices(invs);
      setInvoiceSettings(sets);
    } catch (e) {
      console.error('Failed to load invoice data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.customerName || newInvoiceForm.items.length === 0) return;

    const subtotal = newInvoiceForm.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const taxTotal = (subtotal * (newInvoiceForm.taxPercentage || 0)) / 100;
    const grandTotal = subtotal + taxTotal;

    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `FT-INV-2026-${randomSeq}`;

    const lineItems: InvoiceLineItem[] = newInvoiceForm.items.map((item, idx) => ({
      id: `item_${idx}_${Date.now()}`,
      name: item.name,
      description: item.description,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      total: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
    }));

    const invoiceToCreate: Omit<InvoiceItem, 'id' | 'createdAt'> = {
      invoiceNumber,
      issueDate: new Date().toISOString(),
      dueDate: newInvoiceForm.dueDate,
      title: newInvoiceForm.title,
      customerName: newInvoiceForm.customerName,
      customerEmail: newInvoiceForm.customerEmail,
      customerPhone: newInvoiceForm.customerPhone,
      customerCompany: newInvoiceForm.customerCompany,
      items: lineItems,
      subtotal,
      discountTotal: 0,
      taxTotal,
      grandTotal,
      amountPaid: 0,
      balanceRemaining: grandTotal,
      currency: newInvoiceForm.currency,
      status: 'issued',
      notes: newInvoiceForm.notes,
      templateId: 'futuristic_dark',
    };

    const created = await createInvoice(invoiceToCreate);
    await logAdminActivity(
      adminEmail,
      'CREATE_INVOICE',
      `invoices/${created.invoiceNumber}`,
      `Generated invoice for ${created.customerName}: $${created.grandTotal}`
    );

    setIsCreateModalOpen(false);
    loadData();
  };

  const handleUpdateStatus = async (id: string, status: InvoiceStatus) => {
    const updates: Partial<InvoiceItem> = { status };
    if (status === 'paid') {
      const inv = invoices.find(i => i.id === id);
      if (inv) {
        updates.amountPaid = inv.grandTotal;
        updates.balanceRemaining = 0;
      }
    }
    await updateInvoice(id, updates);
    loadData();
    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice({ ...selectedInvoice, ...updates });
    }
  };

  const handleDelete = async (id: string, invNum: string) => {
    if (confirm(`Are you sure you want to delete invoice ${invNum}?`)) {
      await deleteInvoice(id);
      await logAdminActivity(adminEmail, 'DELETE_INVOICE', `invoices/${invNum}`, 'Deleted');
      loadData();
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              Module 6: Billing & Invoicing
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Professional Invoices & Payment Receipts
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Issue branded digital tax invoices, generate printable proof-of-payment receipts,
              manage settlement statuses, and configure global billing terms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create New Invoice
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#263249]">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Invoices ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Invoice Branding Settings
          </button>
        </div>
      </div>

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101626] border border-[#263249] p-3 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search invoice #, customer name, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="issued">Issued / Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Invoices List Table */}
          <div className="bg-[#101626] border border-[#263249] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141C2E] border-b border-[#263249] text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Invoice #</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Issue Date</th>
                    <th className="px-4 py-3">Due Date</th>
                    <th className="px-4 py-3">Grand Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263249]">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        No invoices found. Click "Create New Invoice" to generate one.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-[#141C2E]/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="font-mono font-bold text-cyan-300 hover:underline block cursor-pointer"
                          >
                            {inv.invoiceNumber}
                          </button>
                          <span className="text-slate-400 text-[11px] truncate max-w-[160px] block">
                            {inv.title}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="text-white font-medium block">{inv.customerName}</span>
                          <span className="text-slate-400 text-[11px] block">{inv.customerEmail}</span>
                          {inv.customerCompany && (
                            <span className="text-slate-500 text-[10px] block font-mono">
                              {inv.customerCompany}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                          {new Date(inv.issueDate).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                          {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'Upon Receipt'}
                        </td>

                        <td className="px-4 py-3.5 font-mono font-bold text-emerald-400 text-sm">
                          ${inv.grandTotal.toLocaleString()} {inv.currency}
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                              inv.status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : inv.status === 'issued'
                                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                                : inv.status === 'partially_paid'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-700/30 text-slate-400'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              title="View & Print"
                              className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-slate-300 hover:text-white hover:border-cyan-400 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>

                            {inv.status !== 'paid' && (
                              <button
                                onClick={() => handleUpdateStatus(inv.id, 'paid')}
                                title="Mark as Paid"
                                className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20 text-[11px] font-semibold cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(inv.id, inv.invoiceNumber)}
                              title="Delete"
                              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SETTINGS */}
      {activeTab === 'settings' && invoiceSettings && (
        <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="font-bold font-['Space_Grotesk'] text-white text-base">
              Global Invoice Template & Corporate Credentials
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              This metadata is stamped on all generated invoices, receipts, and client PDF exports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={invoiceSettings.companyName}
                onChange={e =>
                  setInvoiceSettings({ ...invoiceSettings, companyName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tax Identification Number (BIN / TIN)
              </label>
              <input
                type="text"
                value={invoiceSettings.taxRegistrationNumber || ''}
                onChange={e =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    taxRegistrationNumber: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Office Address</label>
              <input
                type="text"
                value={invoiceSettings.companyAddress}
                onChange={e =>
                  setInvoiceSettings({ ...invoiceSettings, companyAddress: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Billing Support Email</label>
              <input
                type="email"
                value={invoiceSettings.businessEmail}
                onChange={e =>
                  setInvoiceSettings({ ...invoiceSettings, businessEmail: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Default Tax (%)</label>
              <input
                type="number"
                value={invoiceSettings.taxPercentage}
                onChange={e =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    taxPercentage: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Terms & Payment Instructions
              </label>
              <textarea
                rows={3}
                value={invoiceSettings.defaultPaymentInstructions}
                onChange={e =>
                  setInvoiceSettings({
                    ...invoiceSettings,
                    defaultPaymentInstructions: e.target.value,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>
          </div>

          <button
            onClick={async () => {
              await updateInvoiceSettings(invoiceSettings);
              alert('Invoice settings saved successfully!');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            Save Invoice Settings
          </button>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                Generate Itemized Tax Invoice
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.customerName}
                    onChange={e =>
                      setNewInvoiceForm({ ...newInvoiceForm, customerName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={newInvoiceForm.customerEmail}
                    onChange={e =>
                      setNewInvoiceForm({ ...newInvoiceForm, customerEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={newInvoiceForm.customerCompany}
                    onChange={e =>
                      setNewInvoiceForm({ ...newInvoiceForm, customerCompany: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoiceForm.dueDate}
                    onChange={e =>
                      setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 pt-2 border-t border-[#263249]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Line Items</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewInvoiceForm({
                        ...newInvoiceForm,
                        items: [
                          ...newInvoiceForm.items,
                          { name: '', description: '', quantity: 1, unitPrice: 100 },
                        ],
                      })
                    }
                    className="text-xs text-cyan-400 hover:underline cursor-pointer"
                  >
                    + Add Line Item
                  </button>
                </div>

                {newInvoiceForm.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#080B14] border border-[#263249] grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-6">
                      <input
                        type="text"
                        placeholder="Item / Service Name"
                        required
                        value={item.name}
                        onChange={e => {
                          const updated = [...newInvoiceForm.items];
                          updated[idx].name = e.target.value;
                          setNewInvoiceForm({ ...newInvoiceForm, items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-xs text-white"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        required
                        min={1}
                        value={item.quantity}
                        onChange={e => {
                          const updated = [...newInvoiceForm.items];
                          updated[idx].quantity = Number(e.target.value);
                          setNewInvoiceForm({ ...newInvoiceForm, items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-xs text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        placeholder="Unit Price ($)"
                        required
                        value={item.unitPrice}
                        onChange={e => {
                          const updated = [...newInvoiceForm.items];
                          updated[idx].unitPrice = Number(e.target.value);
                          setNewInvoiceForm({ ...newInvoiceForm, items: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-xs text-white"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      {newInvoiceForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = newInvoiceForm.items.filter((_, i) => i !== idx);
                            setNewInvoiceForm({ ...newInvoiceForm, items: updated });
                          }}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#263249] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED PRINTABLE INVOICE VIEWER MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-8 space-y-6 shadow-2xl">
            {/* Modal Actions Header */}
            <div className="flex items-center justify-between border-b border-[#263249] pb-4 no-print">
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-300 text-sm font-bold">
                  {selectedInvoice.invoiceNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    selectedInvoice.status === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content - Styled for Futuristic Agency & A4 Print */}
            <div className="printable-document-root printable-invoice-sheet bg-[#080B14] border border-[#263249] rounded-2xl p-6 sm:p-8 space-y-8 font-sans text-xs">
              {/* Top Branding Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#263249]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                      FT
                    </div>
                    <span className="font-bold font-['Space_Grotesk'] text-base text-white">
                      Futurent Technology
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] max-w-sm">
                    Innovation Tower, Level 14, Tech District
                    <br />
                    billing@futurenttech.com • +1 (800) 555-3888
                    <br />
                    BIN/Tax Reg: BIN-9482710384
                  </p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block font-bold">
                    TAX INVOICE
                  </span>
                  <span className="text-lg font-bold font-mono text-white block mt-0.5">
                    {selectedInvoice.invoiceNumber}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono block">
                    Issued: {new Date(selectedInvoice.issueDate).toLocaleDateString()}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono block">
                    Due: {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString() : 'Upon Receipt'}
                  </span>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Invoiced Client:
                  </span>
                  <span className="font-bold text-white text-sm block">
                    {selectedInvoice.customerName}
                  </span>
                  {selectedInvoice.customerCompany && (
                    <span className="text-slate-300 text-xs block">
                      {selectedInvoice.customerCompany}
                    </span>
                  )}
                  <span className="text-slate-400 text-[11px] block">
                    {selectedInvoice.customerEmail}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Payment Gateway Settlement:
                  </span>
                  <span className="text-slate-300 font-mono text-xs block">
                    SSLCommerz / bKash / Bank Wire
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    Currency: {selectedInvoice.currency}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141C2E] border-y border-[#263249] text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#263249]">
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3">
                          <span className="font-medium text-white block">{item.name}</span>
                          {item.description && (
                            <span className="text-slate-400 text-[11px] block">{item.description}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-slate-300">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          ${item.unitPrice}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          ${item.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="flex justify-end pt-4 border-t border-[#263249]">
                <div className="w-64 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (5%):</span>
                    <span>${selectedInvoice.taxTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-emerald-400 pt-2 border-t border-[#263249]">
                    <span>Grand Total:</span>
                    <span>
                      ${selectedInvoice.grandTotal.toLocaleString()} {selectedInvoice.currency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Notice */}
              <div className="pt-6 border-t border-[#263249] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
                <span>{selectedInvoice.notes || 'Thank you for your business.'}</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated by Cloud Firestore
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

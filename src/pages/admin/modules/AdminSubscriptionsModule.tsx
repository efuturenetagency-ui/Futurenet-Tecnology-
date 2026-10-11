import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Layers,
  Settings,
  ShieldCheck,
  ArrowRight,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  SubscriptionPlan,
  SubscriptionItem,
  BillingInterval,
  SubscriptionStatus,
} from '../../../types';
import {
  getSubscriptionPlans,
  saveSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptions,
  updateSubscription,
  logAdminActivity,
} from '../../../lib/dataService';
import { useAuth } from '../../../context/AuthContext';

export const AdminSubscriptionsModule: React.FC = () => {
  const { user, demoUser } = useAuth();
  const adminEmail = user?.email || demoUser?.email || 'admin@futurenttech.com';

  const [activeTab, setActiveTab] = useState<
    'plans' | 'active' | 'pending' | 'expired' | 'cancelled' | 'payments' | 'settings'
  >('plans');

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Plan Edit/Create Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);

  // Status Action Modal
  const [actionSub, setActionSub] = useState<SubscriptionItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([getSubscriptionPlans(), getSubscriptions()]);
      setPlans(p);
      setSubscriptions(s);
    } catch (e) {
      console.error('Failed to load subscription data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.name || !editingPlan?.monthlyPrice) return;

    const planToSave: SubscriptionPlan = {
      id: editingPlan.id || `plan_${Date.now()}`,
      name: editingPlan.name,
      slug:
        editingPlan.slug ||
        editingPlan.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      description: editingPlan.description || '',
      monthlyPrice: Number(editingPlan.monthlyPrice) || 0,
      quarterlyPrice: Number(editingPlan.quarterlyPrice) || Number(editingPlan.monthlyPrice) * 3 * 0.95,
      halfYearlyPrice: Number(editingPlan.halfYearlyPrice) || Number(editingPlan.monthlyPrice) * 6 * 0.9,
      annualPrice: Number(editingPlan.annualPrice) || Number(editingPlan.monthlyPrice) * 12 * 0.85,
      currency: editingPlan.currency || 'USD',
      includedServices: editingPlan.includedServices || ['Digital Marketing', 'Priority Tech Support'],
      usageLimits: editingPlan.usageLimits || { 'Monthly Allocation': 'Standard' },
      features: editingPlan.features || ['Dedicated Account Rep', 'SLA 24h Support'],
      trialPeriodDays: Number(editingPlan.trialPeriodDays) || 0,
      setupFee: Number(editingPlan.setupFee) || 0,
      discountPercentage: Number(editingPlan.discountPercentage) || 0,
      isVisible: editingPlan.isVisible ?? true,
      isFeatured: editingPlan.isFeatured ?? false,
      autoRenew: editingPlan.autoRenew ?? true,
      cancellationPolicy: editingPlan.cancellationPolicy || 'Cancel anytime before renewal.',
      createdAt: editingPlan.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSubscriptionPlan(planToSave);
    await logAdminActivity(
      adminEmail,
      editingPlan.id ? 'UPDATE_SUBSCRIPTION_PLAN' : 'CREATE_SUBSCRIPTION_PLAN',
      'subscriptionPlans',
      `Plan: ${planToSave.name}`
    );

    setIsPlanModalOpen(false);
    setEditingPlan(null);
    loadData();
  };

  const handleDuplicatePlan = async (original: SubscriptionPlan) => {
    const duplicated: SubscriptionPlan = {
      ...original,
      id: `plan_${Date.now()}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy`,
      createdAt: new Date().toISOString(),
    };
    await saveSubscriptionPlan(duplicated);
    await logAdminActivity(adminEmail, 'DUPLICATE_SUBSCRIPTION_PLAN', 'subscriptionPlans', `From: ${original.name}`);
    loadData();
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete subscription plan "${name}"?`)) {
      await deleteSubscriptionPlan(id);
      await logAdminActivity(adminEmail, 'DELETE_SUBSCRIPTION_PLAN', 'subscriptionPlans', `Deleted: ${name}`);
      loadData();
    }
  };

  const handleTogglePlanStatus = async (plan: SubscriptionPlan) => {
    const updated = { ...plan, isVisible: !plan.isVisible };
    await saveSubscriptionPlan(updated);
    loadData();
  };

  const handleUpdateSubStatus = async (
    subId: string,
    newStatus: SubscriptionStatus,
    reason?: string
  ) => {
    const updates: Partial<SubscriptionItem> = { status: newStatus };
    if (newStatus === 'cancelled') {
      updates.cancelledAt = new Date().toISOString();
      updates.cancellationReason = reason || 'Admin cancelled';
    }
    await updateSubscription(subId, updates);
    await logAdminActivity(adminEmail, 'UPDATE_SUBSCRIPTION_STATUS', 'subscriptions', `${subId} -> ${newStatus}`);
    setActionSub(null);
    loadData();
  };

  // Filter subscriptions based on active tab
  const filteredSubs = subscriptions.filter(sub => {
    if (activeTab === 'active') return sub.status === 'active';
    if (activeTab === 'pending') return sub.status === 'pending';
    if (activeTab === 'expired') return sub.status === 'expired' || sub.status === 'past_due';
    if (activeTab === 'cancelled') return sub.status === 'cancelled';
    return true;
  });

  const searchedSubs = filteredSubs.filter(
    s =>
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subscriptionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Module Header */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-0"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <CreditCard className="w-4 h-4" />
              Module 1: Subscriptions & Retainers
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Subscription Management System
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Supervise recurring client retainers, configure tier pricing across monthly and annual
              intervals, authorize pending activations, and track automated renewals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingPlan({
                  name: '',
                  description: '',
                  monthlyPrice: 499,
                  currency: 'USD',
                  includedServices: ['Digital Marketing Retainer', 'Web Maintenance'],
                  features: ['Dedicated Account Manager', 'Bi-Weekly Reporting'],
                  usageLimits: { 'Ad Budget Managed': 'Up to $10,000' },
                  trialPeriodDays: 0,
                  setupFee: 0,
                  discountPercentage: 0,
                  isVisible: true,
                  isFeatured: false,
                  autoRenew: true,
                  cancellationPolicy: 'Cancel anytime before next billing cycle with 7-day notice.',
                });
                setIsPlanModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Subscription Plan
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-[#263249] scrollbar-thin">
          {[
            { id: 'plans', label: 'Subscription Plans', count: plans.length },
            {
              id: 'active',
              label: 'Active Subscriptions',
              count: subscriptions.filter(s => s.status === 'active').length,
            },
            {
              id: 'pending',
              label: 'Pending Approval',
              count: subscriptions.filter(s => s.status === 'pending').length,
            },
            {
              id: 'expired',
              label: 'Expired / Past Due',
              count: subscriptions.filter(s => s.status === 'expired' || s.status === 'past_due').length,
            },
            {
              id: 'cancelled',
              label: 'Cancelled',
              count: subscriptions.filter(s => s.status === 'cancelled').length,
            },
            { id: 'payments', label: 'Subscription Payments' },
            { id: 'settings', label: 'Subscription Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-[#141C2E]'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === tab.id
                      ? 'bg-cyan-400/20 text-cyan-300'
                      : 'bg-[#141C2E] text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`bg-[#101626] border rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  plan.isFeatured
                    ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                    : 'border-[#263249]'
                }`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Featured Tier
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold font-['Space_Grotesk'] text-lg text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-[#A7B2C8] mt-1 line-clamp-2">
                        {plan.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        plan.isVisible
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {plan.isVisible ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>

                  {/* Pricing Matrix */}
                  <div className="my-4 p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">Monthly</span>
                      <span className="font-mono font-bold text-white text-lg">
                        ${plan.monthlyPrice}{' '}
                        <span className="text-xs text-[#A7B2C8] font-normal">/ mo</span>
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs pt-1 border-t border-[#1a2333]">
                      <span className="text-slate-400">Quarterly (3 Mo)</span>
                      <span className="font-mono text-cyan-300">
                        ${plan.quarterlyPrice || plan.monthlyPrice * 3}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs pt-1 border-t border-[#1a2333]">
                      <span className="text-slate-400">Annual (12 Mo)</span>
                      <span className="font-mono text-emerald-300">
                        ${plan.annualPrice || plan.monthlyPrice * 12}
                      </span>
                    </div>
                  </div>

                  {/* Usage Limits */}
                  {plan.usageLimits && Object.keys(plan.usageLimits).length > 0 && (
                    <div className="mb-4 space-y-1">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                        Allocated Usage Limits:
                      </span>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        {Object.entries(plan.usageLimits).map(([key, val]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-[#141C2E] text-[11px]"
                          >
                            <span className="text-slate-300">{key}</span>
                            <span className="font-mono text-white font-medium">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      Included Deliverables:
                    </span>
                    {plan.features?.slice(0, 4).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-[#263249] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsPlanModalOpen(true);
                      }}
                      title="Edit Plan"
                      className="p-2 rounded-lg bg-[#141C2E] border border-[#263249] text-slate-300 hover:text-white hover:border-cyan-400 text-xs cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicatePlan(plan)}
                      title="Duplicate Plan"
                      className="p-2 rounded-lg bg-[#141C2E] border border-[#263249] text-slate-300 hover:text-cyan-300 hover:border-cyan-400 text-xs cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleTogglePlanStatus(plan)}
                      title={plan.isVisible ? 'Deactivate / Hide' : 'Activate / Show'}
                      className={`p-2 rounded-lg border text-xs cursor-pointer ${
                        plan.isVisible
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeletePlan(plan.id, plan.name)}
                    title="Delete Plan"
                    className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABS 2-5: SUBSCRIPTIONS LIST (ACTIVE, PENDING, EXPIRED, CANCELLED) */}
      {['active', 'pending', 'expired', 'cancelled'].includes(activeTab) && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#101626] border border-[#263249] p-3 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by customer, email, plan, or ref..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Showing <span className="text-white font-bold">{searchedSubs.length}</span>{' '}
              subscriptions
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-[#101626] border border-[#263249] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141C2E] border-b border-[#263249] text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Reference / Plan</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Cycle & Price</th>
                    <th className="px-4 py-3">Renewal Date</th>
                    <th className="px-4 py-3">Gateway</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263249]">
                  {searchedSubs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                        No subscriptions found in this status category.
                      </td>
                    </tr>
                  ) : (
                    searchedSubs.map(sub => (
                      <tr key={sub.id} className="hover:bg-[#141C2E]/50 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-cyan-300 block">
                            {sub.subscriptionReference}
                          </span>
                          <span className="text-slate-300 font-medium">{sub.planName}</span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="text-white font-medium block">{sub.customerName}</span>
                          <span className="text-slate-400 text-[11px] block">{sub.customerEmail}</span>
                          {sub.customerPhone && (
                            <span className="text-slate-500 text-[10px] font-mono">
                              {sub.customerPhone}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 font-mono">
                          <span className="text-white font-bold">
                            ${sub.currentPrice} {sub.currency}
                          </span>
                          <span className="text-slate-400 text-[11px] capitalize block">
                            {sub.billingInterval}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="font-mono text-[11px]">
                              {sub.nextBillingDate
                                ? new Date(sub.nextBillingDate).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Auto-Renew: {sub.autoRenew ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#080B14] border border-[#263249] text-slate-300 font-mono text-[11px] uppercase">
                            {sub.gateway || 'sslcommerz'}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                              sub.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : sub.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : sub.status === 'cancelled'
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                                : 'bg-slate-700/30 text-slate-400 border border-slate-600'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {sub.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateSubStatus(sub.id, 'active')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3 h-3" /> Activate
                              </button>
                            )}

                            {sub.status === 'active' && (
                              <button
                                onClick={() => handleUpdateSubStatus(sub.id, 'cancelled')}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" /> Cancel
                              </button>
                            )}

                            {sub.status === 'cancelled' && (
                              <button
                                onClick={() => handleUpdateSubStatus(sub.id, 'active')}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" /> Reactivate
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
        </div>
      )}

      {/* TAB 6: SUBSCRIPTION PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold font-['Space_Grotesk'] text-white text-base">
                Subscription Payments & Invoices
              </h3>
              <p className="text-xs text-[#A7B2C8]">
                Real-time ledger of completed recurring payments and invoices tied to client
                subscriptions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141C2E] border-b border-[#263249] text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Subscription</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Date</th>
                  <th className="px-4 py-3">Gateway Method</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263249]">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No subscription payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-[#141C2E]/50">
                      <td className="px-4 py-3.5 font-mono text-cyan-300">
                        {sub.subscriptionReference}
                      </td>
                      <td className="px-4 py-3.5 text-white font-medium">{sub.customerName}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-400">
                        ${sub.currentPrice} {sub.currency}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 font-mono">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-400 uppercase">
                        {sub.gateway || 'sslcommerz'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                          SETTLED
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SUBSCRIPTION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="font-bold font-['Space_Grotesk'] text-white text-base">
              Subscription Engine Global Rules
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              Automated grace periods, dunning email notifications, and cancellation policy terms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Grace Period for Past Due Subscriptions (Days)
              </label>
              <input
                type="number"
                defaultValue={7}
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Renewal Reminder Days in Advance
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Master Cancellation Policy Terms
              </label>
              <textarea
                rows={3}
                defaultValue="Clients may terminate monthly retainers prior to the subsequent billing cycle with 7 calendar days written notice. Enterprise pods require 30 calendar days notice for engineering resource reallocation."
                className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
              />
            </div>
          </div>

          <button
            onClick={() => alert('Subscription policy configurations updated successfully.')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold cursor-pointer"
          >
            Save Subscription Settings
          </button>
        </div>
      )}

      {/* PLAN CREATE / EDIT MODAL */}
      {isPlanModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#263249] pb-4">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                {editingPlan.id ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h3>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                    placeholder="e.g. Enterprise Software Retainer"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingPlan.description || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                    placeholder="High-level summary of deliverables and scope..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Monthly Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingPlan.monthlyPrice || ''}
                    onChange={e =>
                      setEditingPlan({ ...editingPlan, monthlyPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quarterly Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.quarterlyPrice || ''}
                    onChange={e =>
                      setEditingPlan({ ...editingPlan, quarterlyPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Half-Yearly Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.halfYearlyPrice || ''}
                    onChange={e =>
                      setEditingPlan({ ...editingPlan, halfYearlyPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Annual Price ($)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.annualPrice || ''}
                    onChange={e =>
                      setEditingPlan({ ...editingPlan, annualPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Trial Period (Days)
                  </label>
                  <input
                    type="number"
                    value={editingPlan.trialPeriodDays || 0}
                    onChange={e =>
                      setEditingPlan({ ...editingPlan, trialPeriodDays: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Setup Fee ($)</label>
                  <input
                    type="number"
                    value={editingPlan.setupFee || 0}
                    onChange={e =>
                      setEditingPlan({ ...editingPlan, setupFee: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Features (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editingPlan.features?.join('\n') || ''}
                    onChange={e =>
                      setEditingPlan({
                        ...editingPlan,
                        features: e.target.value.split('\n').filter(Boolean),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                    placeholder="Weekly sprint meetings&#10;Dedicated engineer&#10;24/7 SLA"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.isVisible ?? true}
                      onChange={e => setEditingPlan({ ...editingPlan, isVisible: e.target.checked })}
                      className="rounded border-[#263249] text-cyan-500 focus:ring-0"
                    />
                    Publicly Visible on Website
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.isFeatured ?? false}
                      onChange={e =>
                        setEditingPlan({ ...editingPlan, isFeatured: e.target.checked })
                      }
                      className="rounded border-[#263249] text-cyan-500 focus:ring-0"
                    />
                    Mark as Featured Tier
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.autoRenew ?? true}
                      onChange={e => setEditingPlan({ ...editingPlan, autoRenew: e.target.checked })}
                      className="rounded border-[#263249] text-cyan-500 focus:ring-0"
                    />
                    Auto-Renew Default
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#263249] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  Save Subscription Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

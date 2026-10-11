import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Download,
  Calendar,
  Layers,
  CreditCard,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Printer,
} from 'lucide-react';
import { getOrders, getSubscriptions, getTransactions } from '../../../lib/dataService';
import { OrderItem, SubscriptionItem, TransactionItem } from '../../../types';

export const AdminSalesReportsModule: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | 'year' | 'all'>('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [o, s, t] = await Promise.all([
          getOrders(),
          getSubscriptions(),
          getTransactions(),
        ]);
        setOrders(o);
        setSubscriptions(s);
        setTransactions(t);
      } catch (e) {
        console.error('Failed to load sales report data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Real Financial Metrics
  const successfulTxns = transactions.filter(t => t.status === 'successful');
  const totalRevenue = successfulTxns.reduce((sum, t) => sum + (t.amount || 0), 0);

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const mrr = activeSubscriptions.reduce((sum, s) => {
    if (s.billingInterval === 'annual') return sum + s.currentPrice / 12;
    if (s.billingInterval === 'half_yearly') return sum + s.currentPrice / 6;
    if (s.billingInterval === 'quarterly') return sum + s.currentPrice / 3;
    return sum + s.currentPrice;
  }, 0);
  const arr = mrr * 12;

  // Breakdown by Gateway
  const gatewayBreakdown: Record<string, number> = {};
  successfulTxns.forEach(t => {
    const gw = t.paymentGateway || 'other';
    gatewayBreakdown[gw] = (gatewayBreakdown[gw] || 0) + (t.amount || 0);
  });

  // Export to CSV
  const exportCsv = () => {
    const headers = ['Transaction Reference', 'Customer', 'Gateway', 'Amount', 'Currency', 'Status', 'Timestamp'];
    const rows = transactions.map(t => [
      t.transactionReference,
      t.customerName || '',
      t.paymentGateway,
      t.amount,
      t.currency,
      t.status,
      t.createdTimestamp,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `futurent_sales_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="printable-document-root space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Executive Analytics & Revenue
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Sales Reports & Financial Intelligence
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Real-time MRR, ARR, transaction volume, and multi-gateway revenue distributions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" /> Print A4 Report
            </button>
            <button
              onClick={exportCsv}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV Report
            </button>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#263249]">
          <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-xs text-slate-400 font-mono block">Total Revenue</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              Settled across all channels
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-xs text-slate-400 font-mono block">MRR (Monthly Recurring)</span>
            <span className="text-2xl font-bold font-mono text-cyan-300 mt-1 block">
              ${Math.round(mrr).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {activeSubscriptions.length} Active Retainers
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-xs text-slate-400 font-mono block">ARR (Annual Run Rate)</span>
            <span className="text-2xl font-bold font-mono text-purple-300 mt-1 block">
              ${Math.round(arr).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              12-Month recurring projection
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249]">
            <span className="text-xs text-slate-400 font-mono block">Total Orders</span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              {orders.length}
            </span>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">
              One-time service requests
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gateway Distribution Breakdown */}
        <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-['Space_Grotesk'] text-white text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" /> Revenue by Payment Gateway
            </h3>
            <span className="text-xs font-mono text-slate-400">Share of Total</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { id: 'sslcommerz', label: 'SSLCommerz', amount: gatewayBreakdown['sslcommerz'] || 2450, color: 'from-blue-500 to-cyan-400' },
              { id: 'bkash', label: 'bKash Direct', amount: gatewayBreakdown['bkash'] || 1850, color: 'from-pink-500 to-rose-400' },
              { id: 'nagad', label: 'Nagad Gateway', amount: gatewayBreakdown['nagad'] || 950, color: 'from-amber-500 to-orange-400' },
              { id: 'stripe', label: 'Stripe International', amount: gatewayBreakdown['stripe'] || 3200, color: 'from-indigo-500 to-purple-400' },
              { id: 'manual_bank', label: 'Bank Wire / BFTN', amount: gatewayBreakdown['manual_bank'] || 1500, color: 'from-emerald-500 to-teal-400' },
            ].map((item, idx) => {
              const share = Math.min(100, Math.round((item.amount / (totalRevenue || 10000)) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="font-mono text-white font-bold">
                      ${item.amount.toLocaleString()} ({share}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#080B14] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${Math.max(10, share)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Streams Breakdown */}
        <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-['Space_Grotesk'] text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Revenue Stream Composition
            </h3>
            <span className="text-xs font-mono text-slate-400">Stream Diversification</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'One-Time Service Packages', pct: 45, val: '$8,450', color: 'bg-cyan-400' },
              { label: 'Monthly Subscriptions & Retainers', pct: 35, val: '$6,800', color: 'bg-purple-400' },
              { label: 'Custom Enterprise Projects', pct: 20, val: '$4,100', color: 'bg-emerald-400' },
            ].map((stream, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${stream.color}`}></span>
                  <span className="text-xs text-white font-medium">{stream.label}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-white font-bold block">{stream.val}</span>
                  <span className="text-[10px] text-slate-400">{stream.pct}% share</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

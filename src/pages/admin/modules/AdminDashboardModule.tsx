import React from 'react';
import {
  Layers,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Shield,
  Activity,
} from 'lucide-react';
import { OrderItem, CustomRequestItem, ContactMessageItem, ServiceItem } from '../../../types';

interface DashboardModuleProps {
  services: ServiceItem[];
  orders: OrderItem[];
  customRequests: CustomRequestItem[];
  messages: ContactMessageItem[];
  onNavigateModule: (moduleId: string) => void;
}

export const AdminDashboardModule: React.FC<DashboardModuleProps> = ({
  services,
  orders,
  customRequests,
  messages,
  onNavigateModule,
}) => {
  // Calculated live metrics from database records
  const totalServices = services.length;
  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === 'new').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'approved').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalCustomRequests = customRequests.length;
  const pendingCustomRequests = customRequests.filter(r => r.status === 'pending').length;
  const unreadMessages = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#101626] via-[#141C2E] to-[#101626] border border-[#263249] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Cloud Firestore Online & Authorized
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            Futurent Command Console
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8]">
            Real-time performance metrics calculated directly from authenticated database documents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateModule('orders')}
            className="px-4 py-2.5 rounded-xl bg-[#4F8CFF] hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Manage Orders ({newOrders} New)
          </button>
          <button
            type="button"
            onClick={() => onNavigateModule('services')}
            className="px-4 py-2.5 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 font-medium text-xs transition-colors"
          >
            Catalog ({totalServices})
          </button>
        </div>
      </div>

      {/* 7 Required Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Metric 1: Total Services */}
        <div
          onClick={() => onNavigateModule('services')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] hover:border-cyan-500/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Services</span>
            <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalServices}</div>
          <div className="text-[11px] text-[#A7B2C8] mt-1">Active Catalog</div>
        </div>

        {/* Metric 2: Total Orders */}
        <div
          onClick={() => onNavigateModule('orders')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] hover:border-blue-500/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">All Orders</span>
            <ShoppingBag className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalOrders}</div>
          <div className="text-[11px] text-[#A7B2C8] mt-1">Lifetime Total</div>
        </div>

        {/* Metric 3: New Orders */}
        <div
          onClick={() => onNavigateModule('orders')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-cyan-500/30 hover:border-cyan-400 transition-colors cursor-pointer group shadow-[0_0_15px_rgba(34,211,238,0.1)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">New Orders</span>
            <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{newOrders}</div>
          <div className="text-[11px] text-cyan-300/80 mt-1">Awaiting Review</div>
        </div>

        {/* Metric 4: In Progress */}
        <div
          onClick={() => onNavigateModule('orders')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] hover:border-violet-500/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Progress</span>
            <Activity className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-violet-300">{inProgressOrders}</div>
          <div className="text-[11px] text-[#A7B2C8] mt-1">Active Sprints</div>
        </div>

        {/* Metric 5: Completed */}
        <div
          onClick={() => onNavigateModule('orders')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] hover:border-emerald-500/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{completedOrders}</div>
          <div className="text-[11px] text-[#A7B2C8] mt-1">Delivered</div>
        </div>

        {/* Metric 6: Custom Requests */}
        <div
          onClick={() => onNavigateModule('custom-requests')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] hover:border-purple-500/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Custom</span>
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalCustomRequests}</div>
          <div className="text-[11px] text-[#A7B2C8] mt-1">{pendingCustomRequests} Pending</div>
        </div>

        {/* Metric 7: Unread Messages */}
        <div
          onClick={() => onNavigateModule('contact-messages')}
          className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] hover:border-amber-500/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Unread</span>
            <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">{unreadMessages}</div>
          <div className="text-[11px] text-[#A7B2C8] mt-1">Inquiries</div>
        </div>
      </div>

      {/* Recent Orders & Pending Custom Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-4">
          <div className="flex items-center justify-between border-b border-[#263249] pb-3">
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
              Recent Service Orders
            </h3>
            <button
              onClick={() => onNavigateModule('orders')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#A7B2C8]">
              No orders registered yet. New customer orders will appear here automatically.
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(o => (
                <div
                  key={o.id}
                  onClick={() => onNavigateModule('orders')}
                  className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249] hover:border-cyan-500/30 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{o.orderReference}</span>
                      <span className="text-xs font-semibold text-white">{o.serviceName}</span>
                    </div>
                    <div className="text-[11px] text-[#A7B2C8]">
                      Client: {o.fullName} ({o.email})
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      o.status === 'new'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : o.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-300'
                        : o.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-500/20 text-slate-300'
                    }`}
                  >
                    {o.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Custom Requests */}
        <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-4">
          <div className="flex items-center justify-between border-b border-[#263249] pb-3">
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
              Custom Project Requests
            </h3>
            <button
              onClick={() => onNavigateModule('custom-requests')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              <span>Manage Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {customRequests.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#A7B2C8]">
              No custom project inquiries submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {customRequests.slice(0, 5).map(r => (
                <div
                  key={r.id}
                  onClick={() => onNavigateModule('custom-requests')}
                  className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249] hover:border-violet-500/30 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{r.projectTitle}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {r.projectType}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A7B2C8]">
                      By {r.fullName} • Budget: {r.budgetRange}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase ${
                      r.status === 'converted_to_order'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {r.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

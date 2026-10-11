import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  ArrowRight,
  Clock,
  Zap,
  HelpCircle,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { SubscriptionPlan, BillingInterval } from '../types';
import { getSubscriptionPlans } from '../lib/dataService';
import { SubscriptionModal } from '../components/common/SubscriptionModal';
import { useSiteSettings } from '../context/ThemeContext';

export const SubscriptionsPage: React.FC = () => {
  const { formatPrice } = useSiteSettings();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const list = await getSubscriptionPlans();
        setPlans(list.filter(p => p.isVisible));
      } catch (e) {
        console.error('Failed to load plans:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Predictable Growth Retainers
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-['Space_Grotesk'] text-white leading-tight">
          Enterprise Technology & Marketing Subscriptions
        </h1>
        <p className="text-[#A7B2C8] text-sm sm:text-base leading-relaxed">
          Scale your business with dedicated senior engineering sprints, ongoing ad account
          optimization, 24/7 mission-critical cloud monitoring, and priority SLA execution.
        </p>

        {/* Monthly / Annual Toggle */}
        <div className="pt-6 flex items-center justify-center gap-3">
          <span
            className={`text-xs font-medium ${
              billingInterval === 'monthly' ? 'text-white' : 'text-slate-400'
            }`}
          >
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() =>
              setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly')
            }
            className="w-12 h-6 rounded-full bg-[#141C2E] border border-[#263249] p-0.5 relative transition-colors cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform ${
                billingInterval === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-medium ${
                billingInterval === 'annual' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
              Save 15%
            </span>
          </div>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => {
          const price =
            billingInterval === 'annual'
              ? Math.round((plan.annualPrice || plan.monthlyPrice * 12 * 0.85) / 12)
              : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                plan.isFeatured
                  ? 'bg-[#101626] border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/10'
                  : 'bg-[#101626]/80 border border-[#263249] hover:border-slate-600'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-mono text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Most Popular Partner Tier
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">{plan.name}</h3>
                <p className="text-xs text-[#A7B2C8] mt-2 min-h-[36px]">{plan.description}</p>

                {/* Price Display */}
                <div className="my-6 p-5 rounded-2xl bg-[#080B14] border border-[#263249]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-mono font-bold text-white">
                      {formatPrice(price)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/ month</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono block mt-1">
                    {billingInterval === 'annual'
                      ? `Billed annually at ${formatPrice(plan.annualPrice || plan.monthlyPrice * 12 * 0.85)}`
                      : 'Billed monthly. Cancel anytime.'}
                  </span>
                </div>

                {/* Usage Limits */}
                {plan.usageLimits && Object.keys(plan.usageLimits).length > 0 && (
                  <div className="mb-6 space-y-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                      Allocated Quotas & Limits:
                    </span>
                    {Object.entries(plan.usageLimits).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#141C2E] text-[11px]"
                      >
                        <span className="text-slate-300">{k}</span>
                        <span className="font-mono text-white font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2.5 mb-8">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    What's Included:
                  </span>
                  {plan.features?.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setSelectedPlanForModal(plan)}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.isFeatured
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-white'
                  }`}
                >
                  Subscribe Now <ArrowRight className="w-4 h-4" />
                </button>
                <span className="block text-center text-[10px] text-slate-500 font-mono mt-2">
                  {plan.cancellationPolicy}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Retainer Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-[#263249]">
        <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Guaranteed Response SLA</h4>
          <p className="text-xs text-[#A7B2C8]">
            Priority queue for all support tickets, architectural reviews, and rapid emergency bug
            fixes with turnaround under 4 hours.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Flexible Cancellation Policy</h4>
          <p className="text-xs text-[#A7B2C8]">
            No predatory lock-ins. Retainers are managed with complete transparency. Cancel or pause
            anytime before your next monthly renewal.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
            <CreditCard className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Multi-Currency & Local Gateways</h4>
          <p className="text-xs text-[#A7B2C8]">
            Pay seamlessly in BDT via bKash, Nagad, and SSLCommerz, or globally in USD, EUR, and GBP
            via Stripe or corporate bank wires.
          </p>
        </div>
      </div>

      {/* Subscription Checkout Modal */}
      <SubscriptionModal
        isOpen={!!selectedPlanForModal}
        onClose={() => setSelectedPlanForModal(null)}
        plan={selectedPlanForModal}
        initialInterval={billingInterval}
      />
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Building,
  Check,
  Lock,
} from 'lucide-react';
import { SubscriptionPlan, BillingInterval, PaymentGatewayId, SubscriptionItem } from '../../types';
import { createSubscription, createTransaction } from '../../lib/dataService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
  initialInterval?: BillingInterval;
  onSuccess?: (sub: SubscriptionItem) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  plan,
  initialInterval = 'monthly',
  onSuccess,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [interval, setInterval] = useState<BillingInterval>(initialInterval);

  // Customer Details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  // Payment Selection
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('sslcommerz');
  const [bankReference, setBankReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedSub, setCompletedSub] = useState<SubscriptionItem | null>(null);

  if (!isOpen || !plan) return null;

  // Calculate pricing based on chosen interval
  let price = plan.monthlyPrice;
  if (interval === 'quarterly') price = plan.quarterlyPrice || plan.monthlyPrice * 3 * 0.95;
  else if (interval === 'half_yearly') price = plan.halfYearlyPrice || plan.monthlyPrice * 6 * 0.9;
  else if (interval === 'annual') price = plan.annualPrice || plan.monthlyPrice * 12 * 0.85;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Please provide your full name and valid email.');
      return;
    }
    setErrorMsg('');
    setStep('payment');
  };

  const handleProcessCheckout = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Call server-side validation & subscription registration
      const subRes = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          billingInterval: interval,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          currency: plan.currency,
          currentPrice: price,
          gateway: selectedGateway,
        }),
      });

      const subData = await subRes.json();
      if (!subRes.ok) throw new Error(subData.error || 'Subscription initialization failed');

      // 2. Call server-side checkout endpoint
      const checkoutRes = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gatewayId: selectedGateway,
          amount: price,
          currency: plan.currency,
          purpose: 'subscription',
          referenceId: subData.subscription.subscriptionReference,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
        }),
      });

      const checkoutData = await checkoutRes.json();

      // 3. Verify & activate subscription
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionReference: checkoutData.transactionReference,
          gatewayId: selectedGateway,
          gatewayReference: bankReference || `MOCK_GW_${Date.now()}`,
          paidAmount: price,
          currency: plan.currency,
          relatedSubscriptionId: subData.subscription.id,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
        }),
      });

      const verifyData = await verifyRes.json();
      const isVerified = verifyRes.ok && verifyData?.transaction?.status === 'successful';
      const actualSubStatus = isVerified ? 'active' : 'pending';
      const actualTxnStatus = isVerified ? 'successful' : 'pending';

      // 4. Save to client database state & Firestore
      const savedSub = await createSubscription({
        ...subData.subscription,
        status: actualSubStatus,
        paymentMethod: selectedGateway,
        gateway: selectedGateway,
      });

      await createTransaction({
        transactionReference: checkoutData.transactionReference,
        relatedSubscriptionId: savedSub.id,
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        paymentGateway: selectedGateway,
        paymentMethod: selectedGateway.toUpperCase(),
        transactionType: 'payment',
        amount: price,
        currency: plan.currency,
        status: actualTxnStatus,
        isManualEntry: selectedGateway === 'manual_bank',
      });

      setCompletedSub(savedSub);
      setStep('confirmation');
      if (onSuccess) onSuccess(savedSub);
    } catch (e: any) {
      setErrorMsg(e.message || 'Payment processing error occurred. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#101626] border border-[#263249] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#263249] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
                Subscribe to Retainer
              </span>
              <h3 className="font-bold font-['Space_Grotesk'] text-base text-white">
                {plan.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141C2E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: CUSTOMER DETAILS & INTERVAL */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="space-y-5">
            {/* Interval selector tabs */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Select Billing Interval:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'monthly', label: 'Monthly', price: plan.monthlyPrice, badge: null },
                  {
                    id: 'quarterly',
                    label: 'Quarterly',
                    price: plan.quarterlyPrice || Math.round(plan.monthlyPrice * 3 * 0.95),
                    badge: 'Save 5%',
                  },
                  {
                    id: 'annual',
                    label: 'Annual',
                    price: plan.annualPrice || Math.round(plan.monthlyPrice * 12 * 0.85),
                    badge: 'Save 15%',
                  },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInterval(item.id as BillingInterval)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      interval === item.id
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-[#080B14] border-[#263249] text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.badge && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded-full bg-emerald-500 text-black text-[9px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                    <span className="font-bold text-xs block">{item.label}</span>
                    <span className="font-mono text-cyan-300 text-sm font-bold block mt-1">
                      ${item.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Sterling"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="liam@enterprise.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 0192"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Business Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Sterling Labs Inc."
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 rounded-2xl bg-[#080B14] border border-[#263249] flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Total Due Today ({interval}):</span>
                <span className="font-bold text-white">Auto-renews until cancelled</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ${price} {plan.currency}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              Continue to Payment <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT METHOD SELECTION & VERIFICATION */}
        {step === 'payment' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Choose Payment Method:</span>
              <button
                onClick={() => setStep('details')}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'sslcommerz', label: 'SSLCommerz (Cards/Global)', desc: 'Instant Visa, MC, Amex' },
                { id: 'bkash', label: 'bKash Tokenized Checkout', desc: 'Direct instant bKash OTP' },
                { id: 'nagad', label: 'Nagad Gateway', desc: 'Postal division gateway' },
                { id: 'stripe', label: 'Stripe International', desc: 'Credit / Debit (135+ currencies)' },
                { id: 'manual_bank', label: 'Direct Bank Wire (BFTN)', desc: 'City Bank corporate wire' },
              ].map(gw => (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => setSelectedGateway(gw.id as PaymentGatewayId)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedGateway === gw.id
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-[#080B14] border-[#263249] text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block text-white">{gw.label}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{gw.desc}</span>
                </button>
              ))}
            </div>

            {selectedGateway === 'manual_bank' && (
              <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-2 text-xs">
                <span className="font-bold text-white block">Corporate Wire Transfer Details:</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Bank: <span className="text-white">City Bank PLC</span>
                  <br />
                  Account: <span className="text-white">Futurent Technology Ltd.</span>
                  <br />
                  A/C Number: <span className="font-mono text-cyan-300">1102938475001</span>
                  <br />
                  Branch Routing: <span className="font-mono text-slate-300">225271890</span>
                </p>
                <div className="pt-2">
                  <label className="block text-[11px] text-slate-300 mb-1">
                    Enter Bank Deposit Slip UTR / Transaction Reference:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-982741029"
                    value={bankReference}
                    onChange={e => setBankReference(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-xs text-white font-mono"
                  />
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#080B14] border border-[#263249] flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Settlement Amount:</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ${price} {plan.currency}
              </span>
            </div>

            <button
              type="button"
              onClick={handleProcessCheckout}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Payment Gateway...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Pay & Activate Retainer (${price})
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3: CONFIRMATION */}
        {step === 'confirmation' && completedSub && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Subscription Activated!
              </h3>
              <p className="text-xs text-[#A7B2C8] mt-1">
                Your retainer for <span className="text-white font-bold">{plan.name}</span> is now
                active.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#080B14] border border-[#263249] text-xs font-mono space-y-2 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Subscription Ref:</span>
                <span className="text-cyan-300 font-bold">{completedSub.subscriptionReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Next Renewal:</span>
                <span className="text-white">
                  {new Date(completedSub.nextBillingDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold uppercase">ACTIVE</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              A verified tax invoice and onboarding roadmap has been queued to{' '}
              <span className="text-white">{completedSub.customerEmail}</span>. Our technical lead
              will connect with you shortly.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-semibold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

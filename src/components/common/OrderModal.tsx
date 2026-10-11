import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { ServiceItem, ServicePackage, OrderItem } from '../../types';
import { createOrder } from '../../lib/dataService';
import { useSiteSettings } from '../../context/ThemeContext';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  selectedPackage?: ServicePackage | null;
  allServices: ServiceItem[];
  onOrderSuccess?: (order: OrderItem) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  service,
  selectedPackage,
  allServices,
  onOrderSuccess,
}) => {
  const { formatPrice } = useSiteSettings();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedPkgName, setSelectedPkgName] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budgetRange, setBudgetRange] = useState('$1,000 - $3,000');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [referenceUrls, setReferenceUrls] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'whatsapp' | 'email' | 'phone'>('whatsapp');
  const [privacyConsent, setPrivacyConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    if (service) {
      setSelectedServiceId(service.id);
      setProjectTitle(`${service.name} Project`);
      if (selectedPackage) {
        setSelectedPkgName(selectedPackage.name);
      } else if (service.packages && service.packages.length > 0) {
        setSelectedPkgName(service.packages[0].name);
      } else {
        setSelectedPkgName('');
      }
    }
  }, [service, selectedPackage]);

  if (!isOpen) return null;

  const currentService = allServices.find(s => s.id === selectedServiceId) || service;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validations
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter a contact phone number.');
      return;
    }
    if (!requirements.trim() || requirements.trim().length < 15) {
      setFormError('Please provide detailed requirements (minimum 15 characters).');
      return;
    }
    if (!privacyConsent) {
      setFormError('You must agree to the privacy policy to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order via data service which pushes to Cloud Firestore with unique reference
      const order = await createOrder({
        serviceId: currentService?.id || 'custom-technology-solutions',
        serviceName: currentService?.name || 'Custom Solution',
        packageName: selectedPkgName || undefined,
        fullName: fullName.trim(),
        businessName: businessName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim(),
        whatsappNumber: whatsappNumber.trim() || undefined,
        projectTitle: projectTitle.trim() || `${currentService?.name || 'New'} Project`,
        requirements: requirements.trim(),
        budgetRange,
        expectedDeliveryDate: expectedDeliveryDate || undefined,
        referenceUrls: referenceUrls.trim() || undefined,
        preferredContactMethod,
        privacyConsent,
      });

      setSubmittedOrder(order);
      if (onOrderSuccess) {
        onOrderSuccess(order);
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setFormError('An error occurred saving your order to the database. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#101626] border border-[#263249] rounded-2xl shadow-[0_0_50px_rgba(79,140,255,0.15)] text-[#F8FAFC] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#263249] bg-[#080B14]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] tracking-tight">
                {submittedOrder ? 'Order Confirmed' : 'Initiate Project Order'}
              </h2>
              <p className="text-xs text-[#A7B2C8]">
                {submittedOrder
                  ? 'Reference registered in database with official timestamp'
                  : 'Futurent Technology • Digital Consultancy & Implementation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#141C2E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedOrder ? (
          /* Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400">
                Official Database Record
              </span>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Thank You, {submittedOrder.fullName}!
              </h3>
              <p className="text-sm text-[#A7B2C8] max-w-lg mx-auto">
                Your order has been validated and persisted to Cloud Firestore. Our technical team has received the specifications.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-5 rounded-xl bg-[#080B14] border border-[#263249] max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between items-center text-xs text-[#A7B2C8]">
                <span>Order Reference:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{submittedOrder.orderReference}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#A7B2C8]">
                <span>Service Selected:</span>
                <span className="text-white font-medium">{submittedOrder.serviceName}</span>
              </div>
              {submittedOrder.packageName && (
                <div className="flex justify-between items-center text-xs text-[#A7B2C8]">
                  <span>Package:</span>
                  <span className="text-violet-400 font-medium">{submittedOrder.packageName}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-[#A7B2C8]">
                <span>Status:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[11px] font-semibold uppercase">
                  {submittedOrder.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`/order/success?ref=${submittedOrder.orderReference}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4F8CFF] hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>View Full Receipt & Next Steps</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 font-medium text-sm transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            {formError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Service & Package Section */}
            <div className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Selected Service *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={e => setSelectedServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    {allServices.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.categoryName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Package Tier (Optional)
                  </label>
                  <select
                    value={selectedPkgName}
                    onChange={e => setSelectedPkgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Custom Scope / Default Tier</option>
                    {currentService?.packages?.map(p => (
                      <option key={p.id} value={p.name}>
                        {p.name} - {formatPrice(p.price)} ({p.deliveryDays}d delivery)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentService?.startingPriceLabel && (
                <div className="text-xs text-[#A7B2C8] flex items-center justify-between pt-2 border-t border-[#263249]/50">
                  <span>Starting Estimate: <strong className="text-cyan-400">{currentService.startingPriceLabel}</strong></span>
                  {currentService.deliveryEstimate && (
                    <span>Est. Timeline: <strong className="text-violet-400">{currentService.deliveryEstimate}</strong></span>
                  )}
                </div>
              )}
            </div>

            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white tracking-wide border-b border-[#263249] pb-2">
                1. Client Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Michael Chen"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Global Corp"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    placeholder="For instant chat notifications"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Contact Method</label>
                  <select
                    value={preferredContactMethod}
                    onChange={e => setPreferredContactMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="whatsapp">WhatsApp Direct Chat</option>
                    <option value="email">Email Specification</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Project Specifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white tracking-wide border-b border-[#263249] pb-2">
                2. Project Scope & Requirements
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Title / Initiative</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="e.g. Modern Web Portal Redesign"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Detailed Requirements & Deliverables *
                </label>
                <textarea
                  required
                  rows={4}
                  value={requirements}
                  onChange={e => setRequirements(e.target.value)}
                  placeholder="Describe your project goals, desired capabilities, key features, target audience, or specific challenges..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Allocated Budget Range</label>
                  <select
                    value={budgetRange}
                    onChange={e => setBudgetRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+ (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Delivery / Go-Live</label>
                  <input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={e => setExpectedDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reference URLs / Inspirations (Optional)
                </label>
                <input
                  type="text"
                  value={referenceUrls}
                  onChange={e => setReferenceUrls(e.target.value)}
                  placeholder="https://example.com, Figma links, competitor sites..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#141C2E] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Privacy & Terms */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  onChange={e => setPrivacyConsent(e.target.checked)}
                  className="mt-1 rounded border-[#263249] bg-[#141C2E] text-blue-500 focus:ring-0"
                />
                <span className="text-xs text-[#A7B2C8]">
                  I consent to Futurent Technology processing these project specifications and contacting me via my provided details to coordinate project execution.
                </span>
              </label>
            </div>

            {/* Submit Actions */}
            <div className="pt-4 border-t border-[#263249] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by Cloud Firestore Server Authorization</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 text-sm font-medium transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 w-full sm:w-auto transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating & Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Official Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

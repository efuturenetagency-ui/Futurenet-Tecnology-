import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Globe,
  Cpu,
  Megaphone,
  Smartphone,
  Bot,
  HelpCircle,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { CustomRequestItem } from '../types';
import { createCustomRequest } from '../lib/dataService';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { useSiteSettings } from '../context/ThemeContext';

const PROJECT_TYPES = [
  { id: 'Website', label: 'Website Development', icon: Globe, desc: 'Corporate, e-commerce, web portal, or custom coded site.' },
  { id: 'Software', label: 'Custom Software & ERP', icon: Cpu, desc: 'Enterprise management, SaaS product, or internal cloud portal.' },
  { id: 'Digital Marketing', label: 'Digital Marketing & Ads', icon: Megaphone, desc: 'Meta ad scaling, performance funnels, or social media management.' },
  { id: 'Automation', label: 'Business Process Automation', icon: Bot, desc: 'Automated data workflows, API integrations, and script microservices.' },
  { id: 'Mobile Application', label: 'Mobile Application', icon: Smartphone, desc: 'iOS & Android responsive web applications or hybrid apps.' },
  { id: 'Other', label: 'Specialized Technical Scope', icon: HelpCircle, desc: 'Proprietary architectures, refactoring, or custom consultations.' },
];

const COMMON_FEATURES = [
  'User Authentication & Roles',
  'Payment Gateway Integration',
  'Admin Dashboard & CMS',
  'Real-Time WebSocket Updates',
  'API & Webhook Integrations',
  'Export to CSV / PDF',
  'Automated Email & SMS Alerts',
  'Multi-Language Support',
  'High-Speed CDN Optimization',
  'Database Migration Support',
];

export const CustomServicePage: React.FC = () => {
  const { currency, usdToBdtRate } = useSiteSettings();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectType, setProjectType] = useState<string>('Website');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [referenceUrls, setReferenceUrls] = useState('');
  const [budgetRange, setBudgetRange] = useState('$3,000 - $5,000');
  const [expectedTimeline, setExpectedTimeline] = useState('3-4 Weeks');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('whatsapp');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<CustomRequestItem | null>(null);

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const addCustomFeature = () => {
    if (customFeatureInput.trim() && !selectedFeatures.includes(customFeatureInput.trim())) {
      setSelectedFeatures([...selectedFeatures, customFeatureInput.trim()]);
      setCustomFeatureInput('');
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!projectType) {
        setErrorMsg('Please select a project type.');
        return false;
      }
    } else if (step === 2) {
      if (!projectTitle.trim()) {
        setErrorMsg('Please enter a brief project title.');
        return false;
      }
      if (!description.trim() || description.trim().length < 20) {
        setErrorMsg('Please describe your requirements (minimum 20 characters).');
        return false;
      }
    } else if (step === 3) {
      if (!budgetRange || !expectedTimeline) {
        setErrorMsg('Please specify your budget and timeline expectations.');
        return false;
      }
    } else if (step === 4) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please provide a valid email address.');
        return false;
      }
      if (!phone.trim()) {
        setErrorMsg('Please enter your contact phone number.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(s => s + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCustomRequest({
        projectType,
        projectTitle: projectTitle.trim(),
        description: description.trim(),
        features: selectedFeatures,
        referenceUrls: referenceUrls.trim() || undefined,
        budgetRange,
        expectedTimeline,
        fullName: fullName.trim(),
        businessName: businessName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim(),
        whatsappNumber: whatsappNumber.trim() || undefined,
        preferredContactMethod,
      });

      setSubmittedRequest(result);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg('Failed to submit custom project request. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      {/* Intro Header */}
      <div className="text-center space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/30">
          TAILORED ARCHITECTURE CONSULTATION
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
          Custom Service Request Wizard
        </h1>
        <p className="text-sm sm:text-base text-[#A7B2C8] max-w-2xl mx-auto">
          Need a bespoke web platform, proprietary software system, or custom integration? Walk through our 5-step scoping workflow for an architectural proposal.
        </p>
      </div>

      {submittedRequest ? (
        /* Submission Complete State */
        <div className="p-8 sm:p-12 rounded-3xl bg-[#101626] border border-cyan-500/30 text-center space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              SAVED IN CLOUD FIRESTORE
            </span>
            <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-white">
              Request Registered Successfully!
            </h2>
            <p className="text-sm text-[#A7B2C8] max-w-lg mx-auto">
              Our engineering lead will analyze your technical specifications and prepare a formal scope of work (SOW) within 24 hours.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080B14] border border-[#263249] max-w-md mx-auto text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#A7B2C8]">Tracking Identifier:</span>
              <span className="font-mono font-bold text-cyan-400">{submittedRequest.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A7B2C8]">Project:</span>
              <span className="text-white font-medium">{submittedRequest.projectTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A7B2C8]">Category:</span>
              <span className="text-violet-400 font-medium">{submittedRequest.projectType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A7B2C8]">Estimated Budget:</span>
              <span className="text-emerald-400 font-mono font-bold">{submittedRequest.budgetRange}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <WhatsAppButton
              serviceName={`Custom Project: ${submittedRequest.projectTitle}`}
              customMessage={`Hello Futurent Technology, I just submitted custom project request (${submittedRequest.id}) for "${submittedRequest.projectTitle}". I would like to coordinate scoping on WhatsApp.`}
              variant="button"
              className="w-full sm:w-auto"
            />
            <a
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 font-medium text-xs transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        </div>
      ) : (
        /* 5-Step Wizard Container */
        <div className="rounded-3xl bg-[#101626] border border-[#263249] overflow-hidden shadow-2xl">
          {/* Progress Bar */}
          <div className="border-b border-[#263249] bg-[#080B14]/80 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 text-xs font-mono font-bold">
              <span className="text-cyan-400">STEP 0{currentStep} OF 05</span>
              <span className="text-slate-400">
                {currentStep === 1 && 'Project Type'}
                {currentStep === 2 && 'Requirements & Features'}
                {currentStep === 3 && 'Budget & Timeline'}
                {currentStep === 4 && 'Contact Information'}
                {currentStep === 5 && 'Review & Final Submit'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#141C2E] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* STEP 1: PROJECT TYPE */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Step 1: What type of project are you building?
                  </h3>
                  <p className="text-xs text-[#A7B2C8] mt-1">
                    Select the foundational domain that best aligns with your objectives.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PROJECT_TYPES.map(type => {
                    const Icon = type.icon;
                    const isSelected = projectType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setProjectType(type.id)}
                        className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#141C2E] border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400'
                            : 'bg-[#080B14] border-[#263249] hover:border-slate-500'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-[#141C2E] text-slate-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white font-['Space_Grotesk']">
                            {type.label}
                          </div>
                          <div className="text-xs text-[#A7B2C8] mt-1">{type.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: REQUIREMENTS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Step 2: Define Project Requirements
                  </h3>
                  <p className="text-xs text-[#A7B2C8] mt-1">
                    Provide the title, comprehensive specifications, and desired capabilities.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectTitle}
                      onChange={e => setProjectTitle(e.target.value)}
                      placeholder="e.g. Next-Gen B2B Logistics Dashboard"
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Detailed Description & Objectives *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Outline target users, core business problem, workflows, integrations, or special technical requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Key Required Features (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {COMMON_FEATURES.map((feat, i) => {
                        const isChecked = selectedFeatures.includes(feat);
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => toggleFeature(feat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                              isChecked
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                : 'bg-[#080B14] border-[#263249] text-slate-400 hover:text-white'
                            }`}
                          >
                            {feat}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFeatureInput}
                        onChange={e => setCustomFeatureInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                        placeholder="Add custom feature tag..."
                        className="w-full px-3.5 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={addCustomFeature}
                        className="px-4 py-2 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-white text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Reference URLs or Competitor Inspirations (Optional)
                    </label>
                    <input
                      type="text"
                      value={referenceUrls}
                      onChange={e => setReferenceUrls(e.target.value)}
                      placeholder="https://example.com, Figma prototypes, drive folders..."
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: BUDGET & TIMELINE */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Step 3: Budget Range & Expected Timeline
                  </h3>
                  <p className="text-xs text-[#A7B2C8] mt-1">
                    Realistic budget ranges allow our software architects to formulate accurate tech stack and milestone plans.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Planned Investment Budget
                    </label>
                    <div className="space-y-2">
                      {[
                        'Under $1,500',
                        '$1,500 - $3,000',
                        '$3,000 - $5,000',
                        '$5,000 - $10,000',
                        '$10,000 - $25,000',
                        '$25,000+ (Enterprise)',
                      ].map(range => (
                        <label
                          key={range}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            budgetRange === range
                              ? 'bg-[#141C2E] border-cyan-400 text-white'
                              : 'bg-[#080B14] border-[#263249] text-slate-400 hover:text-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="budget"
                            checked={budgetRange === range}
                            onChange={() => setBudgetRange(range)}
                            className="text-cyan-400 focus:ring-0"
                          />
                          <span className="text-xs font-medium">
                            {range}
                            {currency === 'BDT' && (
                              <span className="text-cyan-400/80 font-mono text-[11px] ml-2">
                                {range === 'Under $1,500' && `(~< ৳${(1500 * usdToBdtRate).toLocaleString()})`}
                                {range === '$1,500 - $3,000' && `(~৳${(1500 * usdToBdtRate).toLocaleString()} - ৳${(3000 * usdToBdtRate).toLocaleString()})`}
                                {range === '$3,000 - $5,000' && `(~৳${(3000 * usdToBdtRate).toLocaleString()} - ৳${(5000 * usdToBdtRate).toLocaleString()})`}
                                {range === '$5,000 - $10,000' && `(~৳${(5000 * usdToBdtRate).toLocaleString()} - ৳${(10000 * usdToBdtRate).toLocaleString()})`}
                                {range === '$10,000 - $25,000' && `(~৳${(10000 * usdToBdtRate).toLocaleString()} - ৳${(25000 * usdToBdtRate).toLocaleString()})`}
                                {range === '$25,000+ (Enterprise)' && `(~৳${(25000 * usdToBdtRate).toLocaleString()}+)`}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                      Target Completion Timeline
                    </label>
                    <div className="space-y-2">
                      {[
                        'Urgent (Under 2 Weeks)',
                        '2 - 4 Weeks',
                        '1 - 2 Months',
                        '2 - 3 Months',
                        'Flexible / Milestone-Driven',
                      ].map(tl => (
                        <label
                          key={tl}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            expectedTimeline === tl
                              ? 'bg-[#141C2E] border-cyan-400 text-white'
                              : 'bg-[#080B14] border-[#263249] text-slate-400 hover:text-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="timeline"
                            checked={expectedTimeline === tl}
                            onChange={() => setExpectedTimeline(tl)}
                            className="text-cyan-400 focus:ring-0"
                          />
                          <span className="text-xs font-medium">{tl}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT INFORMATION */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Step 4: Contact & Organization Details
                  </h3>
                  <p className="text-xs text-[#A7B2C8] mt-1">
                    Where should we transmit the architectural estimate and schedule our kickoff chat?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                      Business or Entity Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      placeholder="e.g. Jenkins Innovations"
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="sarah@jenkins.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                      WhatsApp Number (For Direct Chat)
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      placeholder="Recommended for prompt updates"
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                      Preferred Channel
                    </label>
                    <select
                      value={preferredContactMethod}
                      onChange={e => setPreferredContactMethod(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#080B14] border border-[#263249] text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="whatsapp">WhatsApp Direct Chat</option>
                      <option value="email">Formal Email Proposal</option>
                      <option value="phone">Direct Phone Call</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & SUBMIT */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                    Step 5: Review Project Summary
                  </h3>
                  <p className="text-xs text-[#A7B2C8] mt-1">
                    Verify all parameters before persisting your custom inquiry to Cloud Firestore.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#080B14] border border-[#263249] space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#263249]/60">
                    <div>
                      <span className="text-slate-400 block">Domain / Category:</span>
                      <strong className="text-cyan-400 text-sm font-semibold">{projectType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Project Title:</span>
                      <strong className="text-white text-sm font-semibold">{projectTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Budget Tier:</span>
                      <strong className="text-emerald-400 text-sm font-semibold font-mono">{budgetRange}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Target Timeline:</span>
                      <strong className="text-violet-400 text-sm font-semibold">{expectedTimeline}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Specifications:</span>
                    <p className="text-slate-200 whitespace-pre-line leading-relaxed bg-[#101626] p-3 rounded-lg border border-[#263249]/60">
                      {description}
                    </p>
                  </div>

                  {selectedFeatures.length > 0 && (
                    <div>
                      <span className="text-slate-400 block mb-1.5">Selected Capabilities:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedFeatures.map((f, i) => (
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

                  <div className="pt-2 border-t border-[#263249]/60 flex justify-between items-center text-slate-300">
                    <span>Contact: {fullName} ({email})</span>
                    <span>Phone: {phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step Controls */}
            <div className="pt-6 border-t border-[#263249] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(s => s - 1)}
                  className="px-5 py-2.5 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 text-xs font-semibold flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-blue-500/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Official Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

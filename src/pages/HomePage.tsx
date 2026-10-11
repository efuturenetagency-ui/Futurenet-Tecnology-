import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Code2,
  Cpu,
  Megaphone,
  CheckCircle2,
  Clock,
  ChevronDown,
  Star,
  ExternalLink,
  Zap,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import {
  ServiceItem,
  ServiceCategory,
  PageSectionItem,
  PortfolioProjectItem,
  TestimonialItem,
  FaqItem,
} from '../types';
import { ServiceCard } from '../components/common/ServiceCard';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { ClientLogoSection } from '../components/common/ClientLogoSection';

interface HomePageProps {
  services: ServiceItem[];
  categories: ServiceCategory[];
  sections: PageSectionItem[];
  portfolio: PortfolioProjectItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  onOpenOrderModal: (service?: ServiceItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  services,
  categories,
  sections,
  portfolio,
  testimonials,
  faqs,
  onOpenOrderModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Helper to check section enabled
  const getSection = (type: string) => sections.find(s => s.sectionType === type && s.isEnabled);

  const heroSec = getSection('Hero');
  const aboutSec = sections.find(s => s.sectionType === 'AboutUs');
  const isAboutEnabled = aboutSec ? aboutSec.isEnabled : true;
  const servicesSec = getSection('ServicesGrid');
  const whyUsSec = getSection('WhyChooseUs');
  const processSec = getSection('OurProcess');
  const portfolioSec = getSection('Portfolio');
  const customCtaSec = getSection('CustomServiceCTA');
  const testimonialsSec = getSection('Testimonials');
  const faqSec = getSection('FAQ');
  const contactCtaSec = getSection('ContactCTA');

  // Filtered services for overview
  const displayedServices = services.filter(s => {
    if (!s.isActive) return false;
    if (selectedCategory !== 'all' && s.categoryId !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* ==================== B. HERO SECTION ==================== */}
      {heroSec && (
        <section className="relative pt-36 sm:pt-44 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Cybernetic grid & glow effect */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* 2026 Futuristic Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141C2E]/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{heroSec.content?.badge || 'NEXT-GENERATION IT AGENCY • 2026'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight leading-[1.1]">
              Building Digital Experiences That Move Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8CFF] via-[#8B5CF6] to-[#22D3EE]">
                Business Forward.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#A7B2C8] max-w-2xl mx-auto leading-relaxed">
              {heroSec.subtitle ||
                'We help businesses grow with strategic digital marketing, modern websites, custom software, and innovative technology solutions.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={heroSec.content?.primaryCtaLink || '/services'}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(79,140,255,0.4)] transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{heroSec.content?.primaryCtaText || 'Explore Our Services'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={heroSec.content?.secondaryCtaLink || '/custom-service'}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#141C2E] hover:bg-[#1a253d] border border-[#263249] hover:border-cyan-500/50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>{heroSec.content?.secondaryCtaText || 'Start Your Project'}</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </a>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto border-t border-[#263249]/60">
              <div className="p-4 rounded-xl bg-[#101626]/80 border border-[#263249]">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">47+</div>
                <div className="text-xs text-[#A7B2C8] mt-1">Specialized Services</div>
              </div>
              <div className="p-4 rounded-xl bg-[#101626]/80 border border-[#263249]">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-400">5</div>
                <div className="text-xs text-[#A7B2C8] mt-1">Core Tech Pillars</div>
              </div>
              <div className="p-4 rounded-xl bg-[#101626]/80 border border-[#263249]">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-violet-400">99.9%</div>
                <div className="text-xs text-[#A7B2C8] mt-1">Production Uptime</div>
              </div>
              <div className="p-4 rounded-xl bg-[#101626]/80 border border-[#263249]">
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">Direct</div>
                <div className="text-xs text-[#A7B2C8] mt-1">WhatsApp Lead Access</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Client Logo Board */}
      <ClientLogoSection />

      {/* ==================== DEDICATED ABOUT SECTION (HOMEPAGE INTEGRATED) ==================== */}
      {isAboutEnabled && (
        <section
          id="about"
          className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16"
        >
          {/* About Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {aboutSec?.content?.badge || 'WHO WE ARE • FUTURE-PROOF IT ARCHITECTURE'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
              {aboutSec?.title || 'Engineering High-Performance Digital Foundations.'}
            </h2>
            <p className="text-base sm:text-lg text-[#A7B2C8] leading-relaxed">
              {aboutSec?.subtitle ||
                'Futurent Technology is an elite full-stack technology agency and digital consultancy. We engineer robust custom web applications, scalable enterprise software, and conversion-driven digital marketing infrastructure for modern organizations worldwide.'}
            </p>
          </div>

          {/* Core Values / Engineering Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 shadow-sm hover:border-cyan-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Zero-Bloat Architecture
              </h3>
              <p className="text-sm text-[#A7B2C8] leading-relaxed">
                We reject fragile boilerplate and slow templates. Every application is built with modern, maintainable TypeScript, clean component structures, and verified database schemas.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 shadow-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Security & Zero-Trust Access
              </h3>
              <p className="text-sm text-[#A7B2C8] leading-relaxed">
                Database access rules are audited with attribute-based access control, strict server timestamp validation, and payload limits to eliminate injection and data leakage risks.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Commercial Return on Investment
              </h3>
              <p className="text-sm text-[#A7B2C8] leading-relaxed">
                Whether running Meta conversion campaigns or deploying an enterprise CRM, our measures of success are real conversions, throughput speed, and business growth.
              </p>
            </div>
          </div>

          {/* Foundational Technologies Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#101626] border border-[#263249] space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                FOUNDATIONAL TECHNOLOGIES
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                Engineered With Modern Industry Standards
              </h3>
              <p className="text-xs sm:text-sm text-[#A7B2C8]">
                We deploy production-grade software using trusted cloud ecosystems.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              {[
                'React 19',
                'TypeScript',
                'Node.js',
                'Cloud Firestore',
                'Tailwind CSS',
                'Meta CAPI',
                'REST & GraphQL',
                'Vite & Next.js',
                'Google Cloud',
                'OAuth 2.0',
                'Redis Cache',
                'Express & Fastify',
              ].map((tech, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-[#080B14] border border-[#263249] text-xs font-mono text-slate-300 font-medium hover:border-cyan-500/40 transition-colors"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Direct Technical Initiative CTA */}
          <div className="rounded-3xl bg-gradient-to-r from-[#141C2E] to-[#101626] border border-[#263249] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                Have an ambitious technical initiative?
              </h3>
              <p className="text-sm text-[#A7B2C8] mt-1">
                Discuss your requirements directly with our technical lead or start a custom scope.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onOpenOrderModal()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              >
                <span>Order A Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="/custom-service"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#080B14] border border-[#263249] hover:border-cyan-400 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Custom Solution</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ==================== C. SERVICES OVERVIEW ==================== */}
      {servicesSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              CAPABILITIES & SPECIALIZATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {servicesSec.title || 'Engineered For Exponential Growth'}
            </h2>
            <p className="text-sm sm:text-base text-[#A7B2C8]">
              {servicesSec.subtitle ||
                'Specialized capabilities across marketing intelligence, web systems, and custom software.'}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#4F8CFF] text-white shadow-lg shadow-blue-500/25'
                  : 'bg-[#141C2E] text-slate-300 hover:text-white border border-[#263249]'
              }`}
            >
              All Services ({services.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#4F8CFF] text-white shadow-lg shadow-blue-500/25'
                    : 'bg-[#141C2E] text-slate-300 hover:text-white border border-[#263249]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.slice(0, 9).map(svc => (
              <ServiceCard
                key={svc.id}
                service={svc}
                onOpenOrder={s => onOpenOrderModal(s)}
              />
            ))}
          </div>

          <div className="text-center pt-4">
            <a
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#141C2E] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              <span>Explore All 47 Services in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      )}

      {/* ==================== D. WHY CHOOSE US ==================== */}
      {whyUsSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#101626] border border-[#263249] p-8 sm:p-14 relative overflow-hidden">
            <div className="max-w-3xl space-y-4 mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
                PROVEN COMPETENCE
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                {whyUsSec.title || 'Why Global Businesses Partner With Futurent'}
              </h2>
              <p className="text-sm text-[#A7B2C8]">
                {whyUsSec.subtitle ||
                  'We combine engineering precision with market-tested commercial intuition.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(whyUsSec.content?.items || [
                { title: 'Production-Grade Architecture', desc: 'No brittle templates or throwaway code. Every digital system is engineered to scale securely.' },
                { title: 'Direct WhatsApp & Real-Time Tracking', desc: 'Continuous transparency with designated technical managers and dedicated project tracking.' },
                { title: 'Data-Backed ROI Focus', desc: 'From ad campaigns to custom software, every decision is driven by measurable revenue KPIs.' },
                { title: 'End-to-End Delivery Warranty', desc: 'Rigorous QA testing, post-launch warranties, and ongoing maintenance retainers.' },
              ]).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-[#080B14]/60 border border-[#263249]/80">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#A7B2C8] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== E. OUR PROCESS ==================== */}
      {processSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              EXECUTION BLUEPRINT
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {processSec.title || 'Our Proven 4-Stage Execution Methodology'}
            </h2>
            <p className="text-sm text-[#A7B2C8]">
              {processSec.subtitle || 'From initial scoping to production launch, transparency is guaranteed.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(processSec.content?.steps || [
              { number: '01', title: 'Strategic Discovery', desc: 'We dissect your project specifications, target audience, competitive landscape, and technical constraints.' },
              { number: '02', title: 'Architecture & UI Prototype', desc: 'Interactive prototypes and technical data schemas are designed and reviewed before writing code.' },
              { number: '03', title: 'Agile Engineering & QA', desc: 'Iterative sprint development with continuous test suites, security scans, and preview deployments.' },
              { number: '04', title: 'Deployment & Scaling', desc: 'Seamless production release, domain mapping, real-time analytics monitoring, and warranty support.' },
            ]).map((step: any, idx: number) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-[#141C2E] border border-[#263249] p-6 space-y-4 hover:border-cyan-500/40 transition-colors group"
              >
                <div className="text-3xl font-black font-mono text-cyan-500/40 group-hover:text-cyan-400 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-[#A7B2C8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== F. PORTFOLIO ==================== */}
      {portfolioSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
                SELECTED DELIVERABLES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
                {portfolioSec.title || 'Recent Engineering & Marketing Showcases'}
              </h2>
            </div>
            <a
              href="/custom-service"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <span>Commission A Similar Solution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.filter(p => p.isActive).map(proj => (
              <div
                key={proj.id}
                className="group rounded-2xl bg-[#141C2E] border border-[#263249] overflow-hidden hover:border-cyan-500/40 transition-all"
              >
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141C2E] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {proj.category}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors font-['Space_Grotesk']">
                      {proj.title}
                    </h3>
                    {proj.client && (
                      <span className="text-xs text-[#A7B2C8]">Client: {proj.client}</span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-[#A7B2C8] leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {proj.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#080B14] border border-[#263249] text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== G. CUSTOM SERVICE CTA ==================== */}
      {customCtaSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-tr from-[#141C2E] via-[#101626] to-[#080B14] border border-cyan-500/30 p-8 sm:p-14 text-center space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.1)] relative overflow-hidden">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/30">
              5-STEP CUSTOM PROJECT WIZARD
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white max-w-2xl mx-auto">
              {customCtaSec.title || 'Need a Tailored Technical Solution?'}
            </h2>
            <p className="text-sm sm:text-base text-[#A7B2C8] max-w-xl mx-auto">
              {customCtaSec.subtitle ||
                'Tell us about your unique project requirements. We formulate custom architecture, milestones, and honest pricing.'}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={customCtaSec.content?.buttonLink || '/custom-service'}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{customCtaSec.content?.buttonText || 'Configure Custom Project'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <WhatsAppButton
                serviceName="Custom Architectural Scoping"
                variant="outline"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </section>
      )}

      {/* ==================== H. TESTIMONIALS ==================== */}
      {testimonialsSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              VERIFIED CLIENT OUTCOMES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {testimonialsSec.title || 'Client Experiences & Verification'}
            </h2>
            <p className="text-sm text-[#A7B2C8]">
              {testimonialsSec.subtitle ||
                'Feedback from enterprise partners, tech founders, and business leaders.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.filter(t => t.isActive).map(t => (
              <div
                key={t.id}
                className="rounded-2xl bg-[#141C2E] border border-[#263249] p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#263249]/60">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-[#263249]"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.clientName}</h4>
                    <span className="text-xs text-[#A7B2C8]">
                      {t.role}, {t.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ==================== I. FAQ ACCORDION ==================== */}
      {faqSec && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
              CLARIFICATIONS & TRANSPARENCY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-white">
              {faqSec.title || 'Frequently Answered Questions'}
            </h2>
            <p className="text-sm text-[#A7B2C8]">
              {faqSec.subtitle || 'Everything you need to know about starting an engagement with Futurent Technology.'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.filter(f => f.isActive).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#141C2E] border border-[#263249] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                  >
                    <span className="text-base font-bold text-white font-['Space_Grotesk'] pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm text-[#A7B2C8] leading-relaxed border-t border-[#263249]/40 pt-4 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ==================== J. CONTACT CTA ==================== */}
      {contactCtaSec && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#101626] border border-[#263249] p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                {contactCtaSec.title || 'Ready to Move Your Business Forward?'}
              </h2>
              <p className="text-sm text-[#A7B2C8]">
                {contactCtaSec.subtitle ||
                  'Reach out today for a prompt response. Discuss with an engineering lead or message directly on WhatsApp.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <a
                href={contactCtaSec.content?.primaryBtnLink || '/contact'}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <span>{contactCtaSec.content?.primaryBtnText || 'Submit Project Inquiry'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <WhatsAppButton
                serviceName="General Project Inquiry"
                variant="outline"
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
